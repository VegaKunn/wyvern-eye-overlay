# ⚖️ Wyvern Eye Overlay

![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)
![Node Version](https://img.shields.io/badge/node-16%2B-green)

**Wyvern Eye** é um overlay tático em tempo real para emuladores de 3DS (Citra), focado em fornecer informações vitais de monstros para a franquia Monster Hunter, com foco atual no **MH3U**. Ele monitora HP, Fúria (Rage) e acúmulos de status anormais diretamente da memória do emulador.

> **Inspirado por:** [MH-HP-Overlay-For-3DS-Emulator](https://github.com/Alexander-Lancellott/MH-HP-Overlay-For-3DS-Emulator) por Alexander Lancellott.

---

## ✨ Funcionalidades

- ❤️ **HP em Tempo Real:** Visualização precisa do HP atual e máximo.
- 🤢 **Monitor de Status:** Acompanhe o acúmulo de Poison, Sleep, Paralysis, Dizzy, Exhaust e Slime.
- 🔥 **Rage Tracker:** Cronômetro regressivo para o estado de fúria (Rage) do monstro.
- 🐾 **Suporte a Minions:** Opção para exibir ou ocultar monstros pequenos.
- ⚙️ **Configuração Simples:** Controle tudo através de um arquivo de configuração.

---

## 🚀 Guia de Instalação (Para usuários)

Se você não é desenvolvedor, siga estes passos:

### 1. Instale o Node.js

O Wyvern Eye precisa do Node.js 16 para funcionar.

1. Acesse [nodejs.org](https://nodejs.org/).
2. Baixe a versão 16 **LTS** (a versão 16 é a mais estavel para esse projeto).
3. Instale normalmente no seu Windows.

### 2. Baixe o Projeto

1. Clique no botão verde **Code** acima e selecione **Download ZIP**.
2. Extraia os arquivos em uma pasta.

### 3. Instale as Dependências

1. Abra a pasta do projeto.
2. Na barra de endereços da pasta, digite `cmd` e aperte **Enter**.
3. No terminal preto que abrir, digite:
   ```bash
   npm install
   🎮 Como Usar
   Abra o Citra e inicie o Monster Hunter 3 Ultimate.
   ```

Já dentro do jogo (em uma missão ou na vila), volte à pasta do projeto.

Execute o comando abaixo no terminal ou crie um arquivo .bat:

Bash
npm start
⚙️ Configurações (config.ini)
Você pode editar o comportamento do overlay alterando os valores:

showMaxHP: true para ver o HP total.

showHPPercent: true para ver a % de vida.

showSmallMonsters: false para esconder monstros pequenos.

showStatusEffects: true para ver o monitor de veneno/paralisia/etc.

🛠️ Tecnologias
Node.js & MemoryJS (Leitura de memória)

Chalk (Cores no terminal)

Ps-list (Detecção do processo do Citra)

Desenvolvido por Wender Augusto Vega
Boa caçada!
