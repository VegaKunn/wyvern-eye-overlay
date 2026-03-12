import { readMemory } from "./memory.js";
import getMonsterData from "../database/mh3u.js";

// --- INSTANCIAÇÃO FORA DA FUNÇÃO (PERSISTENTE) ---
let isProcessing = false;
const cacheDano = {}; // <--- O "caderno" de memória fica aqui fora!

export async function updateHP(config) {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const { maxSlots, minHPForSmallMonsters } = config.limits;
    const { showSmallMonsters, showHPPercent, showMaxHP, showDamage } =
      config.display;

    // ... (Seu código de ponteiros POINTER_BASE, p0, p1, p2...)
    const POINTER_BASE = 0x8119dd8;
    const tamanhoBloco = 0x220;
    const p0Buf = await readMemory(POINTER_BASE, 4);
    const p0 = p0Buf.readUInt32LE(0);
    if (p0 < 0x100000) return;
    const p1 = p0 + 0xd90;
    const p1ValueBuf = await readMemory(p1, 4);
    const p2 = p1ValueBuf.readUInt32LE(0) + 0x410;

    console.clear();
    console.log(`⚖️  WYVERN EYE | Scan: ${new Date().toLocaleTimeString()}`);
    console.log("--------------------------------------------------");

    const trackedAddresses = new Set();

    for (let i = 0; i < maxSlots; i++) {
      // ... (Sua lógica de navegação p2, p3, p4...)
      const offsetAtual = 0x4 + tamanhoBloco * i;
      const p2ValueBuf = await readMemory(p2, 4);
      const p3 = p2ValueBuf.readUInt32LE(0) + offsetAtual;
      const p3ValueBuf = await readMemory(p3, 4);
      const p4 = p3ValueBuf.readUInt32LE(0) + 0x7f8;

      if (p4 <= 0x965 || trackedAddresses.has(p4)) continue;

      const monster = await getMonsterData(p4, readMemory);
      if (!monster) continue;

      const visibilityBuf = await readMemory(p4 + 0x14a, 2);
      if (visibilityBuf.readUInt16LE(0) !== 0x3e8) continue;

      if (
        !monster.isLarge &&
        (!showSmallMonsters || monster.hp < minHPForSmallMonsters)
      )
        continue;

      trackedAddresses.add(p4);

      // --- LÓGICA DE CÁLCULO DE DANO (USANDO O CACHE EXTERNO) ---

      const addr = p4.toString(16);

      if (!cacheDano[addr]) {
        cacheDano[addr] = {
          // Se for Boss, assume que começou full HP para evitar o "dano fantasma" na primeira leitura
          ultimoHP: monster.isLarge ? monster.maxHp : monster.hp,
          ultimoDano: 0,
          recorde: 0,
        };
      }

      const dados = cacheDano[addr];

      if (monster.hp < dados.ultimoHP && monster.hp > 0) {
        let danoDesteGolpe = dados.ultimoHP - monster.hp;

        // Segurança: só aceita dano que não seja maior que a vida máxima
        if (danoDesteGolpe <= monster.maxHp) {
          dados.ultimoDano = danoDesteGolpe;
          if (dados.ultimoDano > dados.recorde) {
            dados.recorde = dados.ultimoDano;
          }
        }
      }
      // Atualiza a memória do monstro para o próximo ciclo
      dados.ultimoHP = monster.hp;

      // --- RENDERIZAÇÃO ---
      console.log(
        `${monster.isLarge ? "⭐ BOSS" : "🐾 MINION"}: ${monster.name}`,
      );

      let hpDisplay = `❤️  HP: ${monster.hp}`;
      if (showMaxHP) hpDisplay += ` / ${monster.maxHp}`;
      if (showHPPercent && monster.maxHp > 0) {
        const percent = ((monster.hp / monster.maxHp) * 100).toFixed(1);
        hpDisplay += ` (${percent}%)`;
      }
      console.log(hpDisplay);

      // Exibe os danos
      if (monster.isLarge && showDamage) {
        console.log(
          `💥 ÚLTIMO DANO: ${dados.ultimoDano} | 🏆 RECORDE: ${dados.recorde}`,
        );
      }

      // ... (Resto do seu código de Status, Rage, etc...)
      console.log("--------------------------------------------------");
    }
  } catch (err) {
    // console.error(err); // Ative para debug se necessário
  } finally {
    isProcessing = false;
  }
}
