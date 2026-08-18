# chtrs

> A fast, elegant terminal cheat sheet and keybinding browser.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-lightgrey.svg)]()
[![Language: Rust](https://img.shields.io/badge/Language-Rust-orange.svg)]()
[![UI: Ratatui](https://img.shields.io/badge/UI-Ratatui-blue.svg)]()

`chtrs` (Cheat Sheets TUI) is a lightweight, responsive terminal application written in **Rust**, **Ratatui**, and **Crossterm**. It lets you quickly search, browse, and reference keyboard shortcuts, commands, and workflow cheat sheets directly from your terminal with instant fuzzy filtering and multi-source YAML loading.

---

## Table of Contents

- [Overview & Architecture](#overview--architecture)
- [Installation](#installation)
  - [From Source (Cargo)](#from-source-cargo)
  - [Config Directory Setup](#config-directory-setup)
- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [Bundled Cheat Sheets](#bundled-cheat-sheets)
- [TUI Commands & Keybindings](#tui-commands--keybindings)
  - [Navigation & Sheet Selection](#navigation--sheet-selection)
  - [Real-Time Search Filtering](#real-time-search-filtering)
  - [Application Lifecycle](#application-lifecycle)
- [Cheat Sheet Configuration & YAML Schema](#cheat-sheet-configuration--yaml-schema)
  - [Discovery Order & Locations](#discovery-order--locations)
  - [YAML Schema & Custom Sheet Example](#yaml-schema--custom-sheet-example)
- [Development & Testing](#development--testing)
  - [UI Snapshot Tests](#ui-snapshot-tests)
  - [End-to-End PTY Smoke Tests (`ttry`)](#end-to-end-pty-smoke-tests-ttry)
- [License](#license)

---

## Overview & Architecture

`chtrs` is designed with a clean, decoupled architecture:

```text
               ┌──────────────────────────────────────────────┐
               │              Crossterm Event Loop            │
               │   (50ms Non-blocking Polling, Mouse Capture) │
               └──────────────────────┬───────────────────────┘
                                      │
               ┌──────────────────────┴───────────────────────┐
               │               App State Engine               │
               │  (Active Selection, Search Filter, Indexing) │
               └──────────┬───────────────────────┬───────────┘
                          │                       │
         ┌────────────────┴───┐       ┌───────────┴──────────┐
         │  CheatSheet Loader │       │     Ratatui TUI      │
         │  (YAML Multi-Dir   │       │  (Split-Pane Layout, │
         │   Discovery)       │       │   Search Overlay)    │
         └────────┬───────────┘       └───────────┬──────────┘
                  │                               │
   ┌──────────────┼──────────────┐                │
   │              │              │                │
┌──┴──────────┐ ┌─┴────────────┐ ┌┴─────────────┐ │
│ Local Dir   │ │ Global XDG   │ │ Binary Dir   │ │
│ (./cheat-   │ │ (~/.config/  │ │ (<exe_dir>/  │ │
│  sheets/)   │ │  chtrs/)     │ │  cheat-      │ │
│             │ │              │ │  sheets/)    │ │
└─────────────┘ └──────────────┘ └──────────────┘ │
                                                  │
                 ┌────────────────────────────────┴───────────┐
                 │  Left (25%): Program List & Highlight     │
                 │  Right (75%): Formatted Sections & Keys    │
                 │  Overlay: Centered Active Search Bar       │
                 └────────────────────────────────────────────┘
```

Cheat sheets are loaded and deduplicated at startup from project-local, global config, or executable-adjacent directories. The user interface continuously synchronizes selection and real-time query filtering across a responsive split-pane layout.

---

## Installation

### From Source (Cargo)

Build and install `chtrs` locally using Cargo:

```bash
git clone https://github.com/delaudio/chtrs.git
cd chtrs
cargo install --path .
```

### Config Directory Setup

Copy the bundled cheat sheets into your global configuration directory so they are available from any working directory:

```bash
mkdir -p ~/.config/chtrs/cheat-sheets
cp -r cheat-sheets/* ~/.config/chtrs/cheat-sheets/
```

Now you can run `chtrs` anywhere in your terminal.

---

## Quick Start

Launch `chtrs`:

```bash
chtrs
```

Inside the TUI:
- Press **`j`** / **`k`** or **`Down`** / **`Up`** to browse through registered cheat sheets.
- Type any letters (e.g. `nav` or `git`) to **instantly filter** the sheet list.
- Press **`Esc`** to clear the search query and restore the full list.
- Press **`q`** to quit.

---

## Key Features

### ⚡ Instant Startup & Zero Overhead
- **Native Performance**: Pure Rust binary with instant start times (< 10 ms) and minimal memory footprint.
- **Offline & Self-Contained**: No external network dependencies or resident background daemons.

### 🔍 Real-Time Interactive Search
- **Fuzzy Prefix Filtering**: Simply start typing to narrow down available sheets in real-time.
- **Non-Modal Querying**: Instant search overlay appears dynamically without requiring complex search mode transitions.

### 📂 Multi-Source Discovery & Deduplication
- **Cascading Discovery**: Automatically loads sheets from project-local directories (`./cheat-sheets`), user global config (`~/.config/chtrs/cheat-sheets`), and binary-relative paths.
- **Automatic Deduplication**: Multiple sheets sharing the same name are deduplicated according to priority order.

### 🎨 Split-Pane Responsive Layout
- **Clean Layout**: 25% sidebar for program selection with visual cyan highlight and 75% main viewport for cheat sheet details.
- **Structured Rendering**: Formatted section headers, aligned key column layouts, and automatic word wrapping.

### 📝 Human-Readable YAML Format
- **Declarative Schema**: Easy to maintain and version-control custom cheat sheets in standard `.yaml` or `.yml` files.

### 🧪 Comprehensive Quality & Snapshot Testing
- **Snapshot Suite**: Automated UI render regression testing across multiple terminal dimensions (compact, default, wide).
- **PTY Smoke Testing**: End-to-end terminal emulation tests via `ttry`.

---

## Bundled Cheat Sheets

`chtrs` includes curated, high-density reference sheets for common modern CLI tools and terminal workflows:

| Cheat Sheet | Covered Topics & Workflows |
| :--- | :--- |
| **`trk`** | MIDI tracker navigation, function keys (`F1`-`F10`), transport, editing, sampling, native DSP, and parameter locks. |
| **`hum`** | Service lifecycle management (`start`, `stop`, `restart`), plan inspection, secrets sync, TUI shortcuts, and doctor checks. |
| **`neovim`** | Window navigation, buffer management, Telescope searching, LSP diagnostics, code actions, and keymap layers. |
| **`lazygit`** | Stage/unstage, commit operations, branch management, interactive rebase, stashing, and cherry-picking. |
| **`yazi`** | File operations, tab management, visual navigation, selection, and custom Git integration shortcuts (`g c`, `g g`, `g d`). |
| **`norn`** | Policy validation, credential workflows, task execution, CLI options, and health metric inspections. |

---

## TUI Commands & Keybindings

### Navigation & Sheet Selection

| Key / Shortcut | Action |
| :--- | :--- |
| `j` / `Down` | Select next cheat sheet in list |
| `k` / `Up` | Select previous cheat sheet in list |

### Real-Time Search Filtering

| Key / Shortcut | Action |
| :--- | :--- |
| `a-z` / `A-Z` | Append character to search filter and update visible list |
| `Backspace` | Delete last character from search query |
| `Esc` | Clear active search filter |

### Application Lifecycle

| Key / Shortcut | Action |
| :--- | :--- |
| `q` | Exit `chtrs` (when search query is empty) |

---

## Cheat Sheet Configuration & YAML Schema

### Discovery Order & Locations

When `chtrs` starts, it scans and merges cheat sheet files (`*.yaml` / `*.yml`) in the following search order:

1. **Project-Local Directory**: `./cheat-sheets/` or `./cheat_sheets/` (relative to current working directory).
2. **User Global Config Directory**: `~/.config/chtrs/cheat-sheets/` and `~/.config/chtrs/`.
3. **Executable Directory**: `<path_to_binary>/cheat-sheets/`.

Sheets are sorted alphabetically by `name` and deduplicated (first discovery wins).

### YAML Schema & Custom Sheet Example

Create custom cheat sheet files in `~/.config/chtrs/cheat-sheets/<name>.yaml`:

```yaml
name: Docker
description: Core container lifecycle commands and Compose workflows

sections:
  - title: Container Operations
    items:
      - key: "docker ps"
        desc: "List running containers"
      - key: "docker ps -a"
        desc: "List all containers including stopped ones"
      - key: "docker exec -it <id> bash"
        desc: "Open interactive bash shell inside container"
      - key: "docker logs -f <id>"
        desc: "Follow live container logs"

  - title: Docker Compose
    items:
      - key: "docker compose up -d"
        desc: "Start stack services in detached background mode"
      - key: "docker compose down"
        desc: "Stop and remove containers, networks, and internal links"
      - key: "docker compose down -v"
        desc: "Stop stack and delete named persistent volumes"
      - key: "docker compose restart <svc>"
        desc: "Restart specific service container"
```

---

## Development & Testing

### Code Quality & Build

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo build --release
```

### UI Snapshot Tests

`chtrs` uses a built-in snapshot test suite to verify terminal frame rendering across different window sizes and state transitions:

```bash
cargo test
```

Snapshots are stored in `tests/snapshots/` and validate:
- Empty state rendering
- Default split-pane view
- Selection navigation
- Active search overlay filtering
- Responsive compact (50x15) and wide (120x30) terminal dimensions

### End-to-End PTY Smoke Tests (`ttry`)

The repository includes a [`ttry.toml`](ttry.toml) test suite that executes `chtrs` in an emulated pseudoterminal, verifies text rendering, sends input keys, and asserts clean zero-code exits:

```bash
brew install delaudio/tap/ttry
ttry test
```

---

## License

This project is licensed under the [MIT License](LICENSE).

