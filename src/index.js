import fs from "fs";
import path from "path";
import { updateHP } from "./core/scanner.js";

// Carrega Configuração
const configPath = path.resolve("config", "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

console.log("🚀 Wyvern Eye Iniciado...");
console.log(
  `📡 Escaneando via UDP (Porta ${config.connection.port || 45987})...`,
);

// Inicia o Loop
setInterval(() => updateHP(config), config.connection.scanInterval || 1000);
