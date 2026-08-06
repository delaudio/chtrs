# 🚀 chtrs

**chtrs** (Cheat Sheets TUI) è una velocissima ed elegante applicazione da terminale in **Rust** (costruita con **Ratatui** e **Crossterm**) per consultare rapidamente i tuoi cheat sheet di comandi e scorciatoie da tastiera.

![Rust](https://img.shields.io/badge/Language-Rust-orange.svg)
![Ratatui](https://img.shields.io/badge/UI-Ratatui-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

- ⚡ **Velocissimo & Leggero**: Scritto in Rust per un avvio istantaneo.
- 🎨 **TUI Elegante**: Interfaccia grafica da terminale con Ratatui.
- 🔍 **Ricerca Istantanea**: Trova scorciatoie e comandi in tempo reale.
- 📂 **Caricamento Globale & Locale**: Carica automaticante i cheat sheet da `~/.config/chtrs/cheat-sheets/` oppure dalla cartella locale `./cheat-sheets/`.
- ⚙️ **Formato YAML Semplice**: Aggiungi facilmente nuovi cheat sheet definendo un semplice file `.yaml` o `.yml`.

---

## 📦 Cheat Sheets Inclusi

- **Neovim**: Navigazione, Buffer, Telescope, LSP e tasti personalizzati.
- **Yazi**: Operazioni sui file, Navigazione, integrazioni con Git (`g c`, `g g`, `g d`).
- **Lazygit**: Comandi di staging, commit, branch, rebase e patch.

---

## 🛠️ Installazione

Installa il binario globalmente con Cargo:

```bash
#Clona la repository
git clone https://github.com/delaudio/chtrs.git
cd chtrs

# Copia i cheat sheet predefiniti nella tua home config
mkdir -p ~/.config/chtrs/cheat-sheets
cp -r cheat-sheets/* ~/.config/chtrs/cheat-sheets/

# Installa il binario eseguibile in ~/.cargo/bin
cargo install --path .
```

Ora puoi digitare **`chtrs`** in **qualsiasi cartella** del tuo terminale!

---

## 🕹️ Comandi e Tastiera

| Tasto / Comando | Azione |
| :--- | :--- |
| `j` / `Down` | Muovi verso il basso |
| `k` / `Up` | Muovi verso l'alto |
| `Tab` / `Shift+Tab` | Cambia la scheda del Cheat Sheet attivo |
| `q` / `Esc` | Esci da `chtrs` |

---

## 📝 Aggiungere un Cheat Sheet Personalizzato

Puoi creare un nuovo file YAML (es: `docker.yaml`) in `~/.config/chtrs/cheat-sheets/`:

```yaml
name: Docker
description: Comandi principali per Docker e Docker Compose
sections:
  - title: Container Operations
    items:
      - { key: "docker ps", desc: "Elenca i container in esecuzione" }
      - { key: "docker exec -it <id> bash", desc: "Apri una shell nel container" }
  - title: Docker Compose
    items:
      - { key: "docker compose up -d", desc: "Avvia i servizi in background" }
      - { key: "docker compose down", desc: "Arresta e rimuovi i servizi" }
```

---

## 📄 Licenza

Rilasciato sotto licenza [MIT](LICENSE).
