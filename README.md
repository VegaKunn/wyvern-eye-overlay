# ⚖️ Wyvern Eye Overlay

[**English Version**](#english) | [**Versão em Português**](#portugues)

![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)
![Node Version](https://img.shields.io/badge/node-16-green)

---

<a name="english"></a>

## 🇬🇧 English Version

**Wyvern Eye** is a real-time tactical overlay for 3DS emulators (Citra), providing monster vitals for the Monster Hunter franchise, currently optimized for **MH3U**. It monitors HP, Rage, and abnormal status buildups directly from the emulator's memory.

> **Inspired by:** [MH-HP-Overlay-For-3DS-Emulator](https://github.com/Alexander-Lancellott/MH-HP-Overlay-For-3DS-Emulator) by Alexander Lancellott.

### ✨ Features

- ❤️ **Real-time HP:** Precise visualization of current and maximum HP.
- 🤢 **Status Monitor:** Track buildup for Poison, Sleep, Paralysis, Dizzy, Exhaust, and Slime.
- 🔥 **Rage Tracker:** Countdown timer for the monster's enrage state.
- 🐾 **Minion Support:** Option to show or hide small monsters.
- ⚙️ **Simple Config:** Control everything via a configuration file.

### 🚀 Installation Guide

1.  **Install Node.js 16:** This project **strictly requires Node.js v16**.
    - Download it from the [Node.js Archive](https://nodejs.org/download/release/latest-v16.x/).
2.  **Download Project:** Click on **Code > Download ZIP** and extract it.
3.  **Install Dependencies:** Open the project folder, type `cmd` in the address bar, and run:
    ```bash
    npm install
    ```

### 🎮 How to Use

1.  Open Citra and start Monster Hunter 3 Ultimate.
2.  Once in-game, run the following command in your terminal:
    ```bash
    npm start
    ```

---

<a name="portugues"></a>

## 🇧🇷 Versão em Português

**Wyvern Eye** é um overlay tático em tempo real para emuladores de 3DS (Citra), focado em fornecer informações vitais de monstros para a franquia Monster Hunter, com foco atual no **MH3U**. Ele monitora HP, Fúria (Rage) e acúmulos de status anormais diretamente da memória do emulador.

> **Inspirado por:** [MH-HP-Overlay-For-3DS-Emulator](https://github.com/Alexander-Lancellott/MH-HP-Overlay-For-3DS-Emulator) por Alexander Lancellott.

### ✨ Funcionalidades

- ❤️ **HP em Tempo Real:** Visualização precisa do HP atual e máximo.
- 🤢 **Monitor de Status:** Acompanhe o acúmulo de Poison, Sleep, Paralysis, Dizzy, Exhaust e Slime.
- 🔥 **Rage Tracker:** Cronômetro regressivo para o estado de fúria (Rage) do monstro.
- 🐾 **Suporte a Minions:** Opção para exibir ou ocultar monstros pequenos.
- ⚙️ **Configuração Simples:** Controle tudo através de um arquivo de configuração.

### 🚀 Guia de Instalação

1.  **Instale o Node.js 16:** O Wyvern Eye requer obrigatoriamente o **Node.js 16**.
    - Baixe a versão v16.x no [Arquivo do Node.js](https://nodejs.org/download/release/latest-v16.x/).
2.  **Baixe o Projeto:** Clique no botão verde **Code** e selecione **Download ZIP**. Extraia os arquivos.
3.  **Instale as Dependências:** Abra a pasta do projeto, digite `cmd` na barra de endereços e aperte Enter. No terminal, digite:
    ```bash
    npm install
    ```

### 🎮 Como Usar

1.  Abra o Citra e inicie o Monster Hunter 3 Ultimate.
2.  Já dentro do jogo, volte à pasta do projeto e execute:
    ```bash
    npm start
    ```

---

## ⚙️ Configurações / Settings (config.ini)

| Option / Opção      | Description (EN)            | Descrição (PT)                    |
| :------------------ | :-------------------------- | :-------------------------------- |
| `showMaxHP`         | Displays total HP value.    | Exibe o valor de HP total.        |
| `showHPPercent`     | Displays HP percentage.     | Mostra a porcentagem de vida.     |
| `showSmallMonsters` | Toggle minions display.     | Ativa/Desativa monstros pequenos. |
| `showStatusEffects` | Toggle Status/Rage monitor. | Ativa monitor de Status e Fúria.  |

## 🛠️ Tecnologias / Tech Stack

- **Node.js 16** & **MemoryJS** (Leitura de memória)
- **Chalk** (Cores no terminal)
- **Ps-list** (Detecção de processos)

---

**Developed by Wender Augusto Vega**
_Good hunting! / Boa caçada!_
