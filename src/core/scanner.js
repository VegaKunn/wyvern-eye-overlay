import { readMemory } from "./memory.js";
import getMonsterData from "../database/mh3u.js";

let isProcessing = false;

export async function updateHP(config) {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const { maxSlots, minHPForSmallMonsters } = config.limits;
    const { showSmallMonsters, showHPPercent, showMaxHP, showAddress } =
      config.display;

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
      // 1. Navegação de Ponteiros
      const offsetAtual = 0x4 + tamanhoBloco * i;
      const p2ValueBuf = await readMemory(p2, 4);
      const p3 = p2ValueBuf.readUInt32LE(0) + offsetAtual;

      const p3ValueBuf = await readMemory(p3, 4);
      const p4 = p3ValueBuf.readUInt32LE(0) + 0x7f8;

      // 2. Validação de Endereço e Duplicatas
      if (p4 <= 0x965 || trackedAddresses.has(p4)) continue;

      // 3. Busca de Dados (Crucial: Chamar antes de usar o objeto 'monster')
      const monster = await getMonsterData(p4, readMemory);

      // Se não retornou nada ou falhou na assinatura, pula
      if (!monster) continue;

      // 4. Verificação de Visibilidade
      const visibilityBuf = await readMemory(p4 + 0x14a, 2);
      if (visibilityBuf.readUInt16LE(0) !== 0x3e8) continue;

      // 5. Filtros de Exibição
      if (
        !monster.isLarge &&
        (!showSmallMonsters || monster.hp < minHPForSmallMonsters)
      ) {
        continue;
      }

      trackedAddresses.add(p4);

      // --- RENDERIZAÇÃO ---

      // Primeiro: Nome e Tipo
      console.log(
        `${monster.isLarge ? "⭐ BOSS" : "🐾 MINION"}: ${monster.name}`,
      );

      // Segundo: HP
      let hpDisplay = `❤️  HP: ${monster.hp}`;
      if (showMaxHP) hpDisplay += ` / ${monster.maxHp}`;
      if (showHPPercent && monster.maxHp > 0) {
        const percent = ((monster.hp / monster.maxHp) * 100).toFixed(1);
        hpDisplay += ` (${percent}%)`;
      }
      console.log(hpDisplay);

      // --- EXIBIÇÃO DE STATUS E RAGE ---
      if (config.display.showStatusEffects && monster.status) {
        const s = monster.status;
        const statusLines = [];

        const mapping = [
          { label: "🤢 Poison ", data: s.poison },
          { label: "😴 Sleep  ", data: s.sleep },
          { label: "⚡ Para   ", data: s.para },
          { label: "💫 Dizzy  ", data: s.dizzy },
          { label: "🤢 Exhaust", data: s.exhaust },
          { label: "💥 Slime  ", data: s.slime },
        ];

        mapping.forEach((item) => {
          if (item.data && item.data.threshold > 0) {
            const { current, threshold } = item.data;
            const pct = ((current / threshold) * 100).toFixed(0);

            // Se houver progresso, mostramos com destaque.
            // Se for 0, mostramos apenas para monitorar (ou você pode voltar para current > 0)
            if (current >= 0) {
              statusLines.push(
                `${item.label}: ${current}/${threshold} [${pct}%]`,
              );
            }
          }
        });

        // Só imprime o cabeçalho se houver dados ou Rage
        if (statusLines.length > 0 || s.rage > 0) {
          console.log("✨ MONITOR DE STATUS:");

          if (s.rage > 0) {
            console.log(`   🔥 FÚRIA: Ativa por ${s.rage}s`);
          } else {
            console.log(`   ❄️  Estado: Calmo`);
          }

          statusLines.forEach((line) => {
            console.log(`   ${line}`);
          });
        }
      }

      if (showAddress)
        console.log(`📍 ADDR: 0x${p4.toString(16).toUpperCase()}`);
      console.log("--------------------------------------------------");
    }
  } catch (err) {
    // Erros de leitura
  } finally {
    isProcessing = false;
  }
}
