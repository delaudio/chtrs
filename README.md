# 🚀 chtrs

**chtrs** (Cheat Sheets TUI) is a blazing-fast, elegant terminal application written in **Rust** (powered by **Ratatui** and **Crossterm**) for quickly looking up keyboard shortcuts and command cheatsheets directly from your command line.

![Rust](https://img.shields.io/badge/Language-Rust-orange.svg)
![Ratatui](https://img.shields.io/badge/UI-Ratatui-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Features

- ⚡ **Blazing Fast & Lightweight**: Written in Rust for instant startup times.
- 🎨 **Elegant TUI**: Beautiful terminal user interface built with Ratatui.
- 🔍 **Instant Search**: Find keybindings and commands in real-time.
- 📂 **Global & Local Loading**: Automatically loads cheat sheets from `~/.config/chtrs/cheat-sheets/` or project-local `./cheat-sheets/`.
- ⚙️ **Simple YAML Format**: Easily add custom cheat sheets using plain `.yaml` or `.yml` files.

---

## 📦 Included Cheat Sheets

- **Neovim**: Window Navigation, Buffer management, Telescope searching, LSP diagnostics, and custom bindings.
- **Yazi**: File operations, Navigation, custom Git integration shortcuts (`g c`, `g g`, `g d`).
- **Lazygit**: Staging, Commit operations, Branch management, Rebase shortcuts, and Patching.

---

## 🛠️ Installation

Install the executable binary globally using Cargo:

```bash
# Clone the repository
git clone https://github.com/delaudio/chtrs.git
cd chtrs

# Copy default cheat sheets to your user config directory
mkdir -p ~/.config/chtrs/cheat-sheets
cp -r cheat-sheets/* ~/.config/chtrs/cheat-sheets/

# Install the binary into ~/.cargo/bin
cargo install --path .
```

Now you can run **`chtrs`** from **any directory** in your terminal!

## 🧪 End-to-end smoke test

The repository includes a [`ttry.toml`](ttry.toml) smoke test that starts the
application in a real pseudo-terminal, sends `q`, and verifies its clean exit.
Install a released `ttry` binary, then run the test from this checkout:

```bash
brew install delaudio/tap/ttry
ttry test
```

---

## 🕹️ Keybindings & Usage

| Key / Command | Action |
| :--- | :--- |
| `j` / `Down` | Move selection down |
| `k` / `Up` | Move selection up |
| `Tab` / `Shift+Tab` | Switch active Cheat Sheet tab |
| `q` / `Esc` | Quit `chtrs` |

---

## 📝 Adding Custom Cheat Sheets

Create a new YAML file (e.g. `docker.yaml`) in `~/.config/chtrs/cheat-sheets/`:

```yaml
name: Docker
description: Core commands for Docker and Docker Compose
sections:
  - title: Container Operations
    items:
      - { key: "docker ps", desc: "List running containers" }
      - { key: "docker exec -it <id> bash", desc: "Open an interactive shell in a container" }
  - title: Docker Compose
    items:
      - { key: "docker compose up -d", desc: "Start services in detached mode" }
      - { key: "docker compose down", desc: "Stop and remove containers, networks" }
```

---

## 📄 License

Released under the [MIT License](LICENSE).
