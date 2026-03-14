import { readMemory } from "./memory.js";
import getMonsterData from "../database/mh3u.js";
import { Server } from "socket.io";
import http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }, // URL do seu Next.js
});

let isProcessing = false;
const cacheDano = {};

export async function updateHP(config) {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const { maxSlots, minHPForSmallMonsters } = config.limits;
    const {
      showSmallMonsters,
      showHPPercent,
      showMaxHP,
      showAddress,
      showDamage,
    } = config.display;

    const POINTER_BASE = 0x8119dd8;
    const tamanhoBloco = 0x220;

    const p0Buf = await readMemory(POINTER_BASE, 4);
    const p0 = p0Buf.readUInt32LE(0);
    if (p0 < 0x100000) return;

    const p1 = p0 + 0xd90;

    const p1Buf = await readMemory(p1, 4);
    const p2 = p1Buf.readUInt32LE(0) + 0x410;

    // 🔥 Lê apenas uma vez (otimização)
    const p2Buf = await readMemory(p2, 4);
    const p2Value = p2Buf.readUInt32LE(0);

    console.clear();
    console.log(`⚖️ WYVERN EYE | Scan: ${new Date().toLocaleTimeString()}`);
    console.log("--------------------------------------------------");

    const trackedAddresses = new Set();

    for (let i = 0; i < maxSlots; i++) {
      const offsetAtual = 0x4 + tamanhoBloco * i;
      const p3 = p2Value + offsetAtual;

      const p3Buf = await readMemory(p3, 4);
      const p4 = p3Buf.readUInt32LE(0) + 0x7f8;

      if (p4 <= 0x965 || trackedAddresses.has(p4)) continue;

      const monster = await getMonsterData(p4, readMemory);
      if (!monster) continue;

      const visibilityBuf = await readMemory(p4 + 0x14a, 2);
      if (visibilityBuf.readUInt16LE(0) !== 0x3e8) continue;

      if (
        !monster.isLarge &&
        (!showSmallMonsters || monster.hp < minHPForSmallMonsters)
      ) {
        continue;
      }

      trackedAddresses.add(p4);

      // =============================
      // 🔥 SISTEMA DE CACHE DE DANO
      // =============================

      const addr = p4.toString(16);

      if (!cacheDano[addr]) {
        cacheDano[addr] = {
          ultimoHP: monster.isLarge ? monster.maxHp : monster.hp,
          ultimoDano: 0,
          recorde: 0,
        };
      }

      const dados = cacheDano[addr];

      if (monster.hp < dados.ultimoHP && monster.hp > 0) {
        const dano = dados.ultimoHP - monster.hp;

        if (dano <= monster.maxHp) {
          dados.ultimoDano = dano;
          if (dano > dados.recorde) dados.recorde = dano;
        }
      }

      dados.ultimoHP = monster.hp;

      // =============================
      // 🖥️ RENDERIZAÇÃO
      // =============================

      console.log(
        `${monster.isLarge ? "⭐ BOSS" : "🐾 MINION"}: ${monster.name}`,
      );

      let hpDisplay = `❤️ HP: ${monster.hp}`;
      if (showMaxHP) hpDisplay += ` / ${monster.maxHp}`;

      if (showHPPercent && monster.maxHp > 0) {
        const percent = ((monster.hp / monster.maxHp) * 100).toFixed(1);
        hpDisplay += ` (${percent}%)`;
      }

      console.log(hpDisplay);

      if (monster.isLarge && showDamage) {
        console.log(
          `💥 ÚLTIMO DANO: ${dados.ultimoDano} | 🏆 RECORDE: ${dados.recorde}`,
        );
      }

      // STATUS EFFECTS
      if (config.display.showStatusEffects && monster.status) {
        const s = monster.status;
        const statusLines = [];

        const mapping = [
          { label: "🤢 Poison ", data: s.poison },
          { label: "😴 Sleep  ", data: s.sleep },
          { label: "⚡ Para   ", data: s.para },
          { label: "💫 Dizzy  ", data: s.dizzy },
          { label: "😩 Exhaust", data: s.exhaust },
          { label: "💥 Slime  ", data: s.slime },
        ];

        mapping.forEach((item) => {
          if (item.data && item.data.threshold > 0) {
            const { current, threshold } = item.data;
            const pct = ((current / threshold) * 100).toFixed(0);

            statusLines.push(
              `${item.label}: ${current}/${threshold} [${pct}%]`,
            );
          }
        });

        if (statusLines.length > 0 || s.rage > 0) {
          console.log("✨ MONITOR DE STATUS:");

          if (s.rage > 0) {
            console.log(`   🔥 FÚRIA: Ativa por ${s.rage}s`);
          } else {
            console.log(`   ❄️ Estado: Calmo`);
          }

          statusLines.forEach((line) => {
            console.log(`   ${line}`);
          });
        }
      }

      if (showAddress)
        console.log(`📍 ADDR: 0x${p4.toString(16).toUpperCase()}`);

      console.log("--------------------------------------------------");

      // =============================
      // 🖥️ Manda os dados para serem renderizados no Navegador
      // =============================

      const monsterData = {
        address: `0x${p4.toString(16)}`, // ID ÚNICO
        code: monster.id, // O ID que você baixou a imagem
        name: monster.name,
        hp: monster.hp,
        maxHp: monster.maxHp,
        isLarge: monster.isLarge,
        status: monster.status,
        damage: {
          lastHit: dados.ultimoDano,
          record: dados.recorde,
        },
        // ... resto dos dados
      };

      io.emit("monster_update", monsterData); // Envia para o Next.js
    }
  } catch (err) {
    console.log("🔥 ERRO NO SCANNER:", err);
  } finally {
    isProcessing = false;
  }
}

server.listen(4000, () => console.log("Socket Server on port 4000"));
