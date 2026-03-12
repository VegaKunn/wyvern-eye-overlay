// 1. O mapeamento (pode colocar em um arquivo separado monsters.js)
const MONSTERS_DB = {
  257: "Rathian",
  258: "Rathalos",
  259: "Qurupeco",
  260: "Gigginox",
  261: "Barioth",
  262: "Diablos",
  263: "Deviljho",
  264: "Barroth",
  265: "Uragaan",
  268: "Great Jaggi",
  270: "Great Baggi",
  271: "Lagiacrus",
  272: "Royal Ludroth",
  274: "Gobul",
  275: "Agnaktor",
  276: "Ceadeus",
  280: "Alatreon",
  281: "Jhen Mohran",
  297: "Zinogre",
  298: "Arzuros",
  299: "Lagombi",
  300: "Volvidon",
  301: "Great Wroggi",
  302: "Duramboros",
  303: "Nibelsnarf",
  307: "Crimson Qurupeco",
  308: "Baleful Gigginox",
  309: "Sand Barioth",
  310: "Jade Barroth",
  311: "Steel Uragaan",
  312: "Purple Ludroth",
  313: "Glacial Agnaktor",
  314: "Black Diablos",
  315: "Nargacuga",
  316: "Green Nargacuga",
  317: "Lucent Nargacuga",
  318: "Pink Rathian",
  319: "Gold Rathian",
  320: "Azure Rathalos",
  321: "Silver Rathalos",
  322: "Plesioth",
  323: "Green Plesioth",
  324: "Ivory Lagiacrus",
  325: "Abyssal Lagiacrus",
  326: "Goldbeard Ceadeus",
  327: "Savage Deviljho",
  328: "Stygian Zinogre",
  329: "Rust Duramboros",
  330: "Brachydios",
  331: "Dire Miralis",
  341: "Hallowed Jhen Mohran",
};

const SMALL_MONSTERS_DB = {
  266: "Jaggi",
  267: "Jaggia",
  269: "Baggi",
  273: "Ludroth",
  277: "Uroktor",
  278: "Delex",
  279: "Epioth",
  282: "Giggi",
  283: "Aptonoth",
  284: "Popo",
  285: "Rhenoplos",
  286: "Felyne",
  287: "Melynx",
  288: "Fish",
  289: "Altaroth",
  290: "Kelbi",
  291: "Giggi Sac",
  292: "Bnahabra",
  293: "Bnahabra",
  294: "Bnahabra",
  295: "Bnahabra",
  296: "Rock",
  304: "Wroggi",
  305: "Slagtoth",
  306: "Gargwa",
  332: "Bullfango",
  333: "Anteka",
  334: "Slagtoth",
  335: "Rock",
  336: "Rock",
  337: "Rock",
  338: "Rock",
  339: "Rock",
  340: "Rock",
};

// Recebemos readMemory como segundo parâmetro
export default async function getMonsterData(p4, readMemory) {
  const idAddress = p4 - 0x7f5;
  const idBuf = await readMemory(idAddress, 2);
  const monsterId = idBuf.readUInt16LE(0);

  // Busca nos dois bancos
  const largeName = MONSTERS_DB[monsterId];
  const smallName = SMALL_MONSTERS_DB[monsterId];

  const monsterName = largeName || smallName || `Unknown (${monsterId})`;
  const isLarge = !!largeName;

  // Leitura de HP
  const hpData = await readMemory(p4, 8);
  const currentHP = hpData.readUInt32LE(0);
  const maxHP = hpData.readUInt32LE(4);

  return {
    id: monsterId,
    name: monsterName,
    hp: currentHP,
    maxHp: maxHP,
    isLarge: isLarge, // Guardamos se ele é grande ou pequeno
  };
}
