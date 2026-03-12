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
      const offsetAtual = 0x4 + tamanhoBloco * i;
      const p2ValueBuf = await readMemory(p2, 4);
      const p3 = p2ValueBuf.readUInt32LE(0) + offsetAtual;

      const p3ValueBuf = await readMemory(p3, 4);
      const p4 = p3ValueBuf.readUInt32LE(0) + 0x7f8;

      if (p4 <= 0x965 || trackedAddresses.has(p4)) continue;

      const visibilityBuf = await readMemory(p4 + 0x14a, 2);
      if (visibilityBuf.readUInt16LE(0) !== 0x3e8) continue;

      const monster = await getMonsterData(p4, readMemory);

      if (
        !monster.isLarge &&
        (!showSmallMonsters || monster.hp < minHPForSmallMonsters)
      )
        continue;

      trackedAddresses.add(p4);

      let hpDisplay = `❤️  HP: ${monster.hp}`;
      if (showMaxHP) hpDisplay += ` / ${monster.maxHp}`;
      if (showHPPercent) {
        const percent =
          monster.maxHp > 0
            ? ((monster.hp / monster.maxHp) * 100).toFixed(1)
            : 0;
        hpDisplay += ` (${percent}%)`;
      }

      console.log(
        `${monster.isLarge ? "⭐ BOSS" : "🐾 MINION"}: ${monster.name}`,
      );
      console.log(hpDisplay);
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
