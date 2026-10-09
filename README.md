# chtrs

A terminal cheat sheet and keybinding browser built with **TypeScript, React and
OpenTUI**. It keeps a 25% program list / 75% detail layout with an OpenCode-inspired
dark palette, searchable program names and scrollable shortcuts.

## Installation

Use a recent Bun release (1.3.14 or newer recommended) to build the executable:

```bash
bun install --registry https://registry.npmjs.org
bun run install:local
chtrs
```

`install:local` builds `dist/chtrs` and installs it atomically. It replaces an existing
`chtrs` executable on your PATH when that executable is inside your home directory;
otherwise it installs to `~/.local/bin`. Keep the chosen directory on PATH. To choose
an explicit installation directory:

```bash
CHTRS_BIN_DIR="$HOME/.local/bin" bun run install:local
```

If another `chtrs` appears earlier on PATH, put your chosen directory first.
The installer reports the exact path and refuses to replace symlinks or directories.
Run `bun run install:local` again after updating the project.

The compiled executable includes the Bun runtime, OpenTUI's native library and all
bundled cheat sheets. It works offline from any working directory without the source
checkout or a separate Bun installation. Build separately for each target platform.
Existing user YAML files remain external and take precedence over bundled defaults.

## Keyboard controls

| Key | Action |
| --- | --- |
| `↑` / `↓`, `j` / `k` | Navigate programs; scroll when the detail pane is active |
| `Tab` | Switch between programs and details |
| `PageUp` / `PageDown` | Scroll the cheat sheet from either pane |
| `/` or typing | Search program names (case-insensitive substring matching) |
| `Enter` | Finish editing the query, keeping the filtered results |
| `Esc` | Clear search and restore all programs |
| `Backspace` | Remove the last query character |
| `q` | Quit outside search editing |
| `Ctrl+C` | Quit at any time |

While editing search, `j`, `k`, and `q` are ordinary characters; use the arrow
keys to navigate matches. Start with `/` to search for a name beginning with one
of those letters. Pasting a query and mouse-wheel scrolling are supported.
Use `chtrs --help` for a quick reminder.

## Cheat sheets

Files with `.yaml` or `.yml` extensions are loaded in this priority order:

1. `./cheat-sheets/`, then `./cheat_sheets/` in the current working directory.
2. `~/.config/chtrs/cheat-sheets/`, then `~/.config/chtrs/`.
3. `cheat-sheets/` next to the executable.
4. The source checkout's `cheat-sheets/` directory when running from source.
5. Bundled defaults embedded at build time when running the compiled executable.

First name wins; files within each directory are sorted for deterministic loading.
The final program list is sorted by name. Invalid files are skipped and counted in
the status bar on wide terminals; if no sheets load, diagnostic paths appear in the
detail pane. Builds fail if a bundled YAML file is invalid.

The bundled collection covers Lazygit, Neovim, Yazi, hum, norn, trk and Git worktrees.
Add custom sheets to `~/.config/chtrs/cheat-sheets/` using the same schema:

```yaml
name: Docker
description: Container lifecycle commands
sections:
  - title: Containers
    items:
      - key: "docker ps"
        desc: "List running containers"
      - key: "docker ps -a"
        desc: "List all containers"
```

## Development

```bash
bun start
bun test
bun run typecheck
bun run build
./dist/chtrs
```

- `tui/components/`: one React component per file, composed by `CheatSheetUI`.
- `tui/hooks/useAppInput.ts`: keyboard and paste handling.
- `tui/ui.tsx`: mounting and unmounting the React root.
- `tui/app.ts`: application store connected through `useSyncExternalStore`.
- `tui/cheatsheet.ts`: YAML validation, directory discovery and loading.
- `scripts/build.ts`: compile the executable with bundled defaults.
- `scripts/install.ts`: install the compiled executable.

Tests cover directory precedence, schema validation, bundled fallbacks,
search/navigation, paste, scrolling, lifecycle, resize and rendering at 50×15,
80×24 and 120×30 terminal sizes. The optional `ttry.toml` smoke test runs the built
executable: run `bun run build` followed by `ttry test` if ttry is installed.

The palette reference is [OpenCode's default theme](https://github.com/anomalyco/opencode/blob/dev/packages/tui/src/theme/assets/opencode.json).

## Storybook and visual screenshots

```bash
# First setup (Node.js 22.12+ or 24+, plus Bun)
bun install --registry https://registry.npmjs.org
bunx playwright install chromium

# Browse the component catalogue at http://127.0.0.1:6007
bun run storybook

# Render the stories; compare or explicitly update PNG baselines
bun run test:storybook
bun run test:storybook:visual
bun run test:storybook:visual:update

# Optional: run only stories matching a file-name filter
bun run test:storybook:visual:update Header

# Static catalogue and type checks
bun run build-storybook
bun run typecheck:storybook
```

This follows the Compri Storybook workflow: Storybook + Vitest Browser + Playwright,
explicit baseline-update commands, and a server wrapper that waits for `/index.json`
before testing and shuts down only processes it started. The default port is **6007**
to coexist with Compri on 6006; override it with `STORYBOOK_PORT=6010`.

OpenTUI uses native Bun/FFI APIs, so the browser cannot mount its components directly.
`scripts/render-stories.tsx` renders the actual React/OpenTUI components headlessly,
then exports terminal cells, colors and text attributes to `storybook/generated/frames.json`.
`TerminalPreview` displays those cells with the bundled JetBrains Mono font. These are
**static native-rendered previews**, not an interactive terminal or duplicate HTML
implementations of the components. Keyboard, paste, scrolling and lifecycle behavior
remain covered by `bun test` against the native renderer. A user's terminal font can
look different from the fixed screenshot font.

There are 23 stories across all 10 components, including compact/default/wide layouts,
active search, no matches, no data, invalid files and scrolled content. Fixtures are
synthetic and never read the user's configuration or working-directory YAML files.
`bun run storybook` watches the native component imports and regenerates frames on edits.
Test/build commands regenerate frames first, so stale previews are not accepted as a test.

PNG baselines live in `storybook/stories/__screenshots__/`, grouped by story file.
Keep these in version control and inspect changes before accepting an update. Filenames
include browser and OS: the supplied baselines target **Chromium on macOS**; another OS
needs its own baselines. Verification uses `--update=none` and fails on missing or changed
images. `--update` deliberately writes new expected images. The generated frame JSON and
`storybook-static/` build are disposable and ignored by Git.

To add a scenario, add its native component/props in `scripts/render-stories.tsx`, then
reference that frame ID in a `storybook/stories/*.stories.tsx` file and regenerate the
baselines. Native JSX uses `@opentui/react`; browser JSX has a separate TypeScript config
using `react`. TypeScript is pinned to 5.9 because the Storybook docgen tooling uses its
compiler API, which is unavailable in the previously installed TypeScript 7 package.

