import fs from "fs";
import path from "path";

function mapProject(baseDir, ignoreDirs = ["node_modules"]) {
  const result = [];

  function walk(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      if (ignoreDirs.includes(item.name)) continue;

      const fullPath = path.join(currentDir, item.name);

      // converte para caminho relativo à raiz do projeto
      const relativePath = path.relative(baseDir, fullPath);

      result.push(relativePath);

      if (item.isDirectory()) {
        walk(fullPath);
      }
    }
  }

  walk(baseDir);

  return result;
}

// raiz do projeto
const root = process.cwd();

const projectMap = mapProject(root, ["node_modules", ".git"]);

console.log("📂 Estrutura do projeto:\n");

projectMap.forEach((item) => {
  console.log(item);
});
