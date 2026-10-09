import { dirname, resolve } from "node:path";
import { createCliRenderer } from "@opentui/core";
import { App } from "./app";
import { discoveryDirectories, loadSheets, type CheatSheet } from "./cheatsheet";
import { mountApp } from "./ui";
import { theme } from "./theme";

declare const CHTRS_BUNDLED_SHEETS: CheatSheet[];

if (process.argv.includes("--help")) {
  console.log("chtrs OpenTUI\n\n↑/↓ or j/k: navigate · Tab: switch pane · PgUp/PgDn: scroll\n/: search (or start typing) · Enter: finish search · Esc: clear\nq: quit outside search · Ctrl+C: quit\n\nReads ./cheat-sheets, ./cheat_sheets, ~/.config/chtrs/cheat-sheets,\n~/.config/chtrs, cheat-sheets next to the executable, and bundled defaults.");
} else {
  const { sheets, warnings } = loadSheets(discoveryDirectories({
    sourceRoot: resolve(dirname(import.meta.path), ".."),
  }), typeof CHTRS_BUNDLED_SHEETS === "undefined" ? [] : CHTRS_BUNDLED_SHEETS);
  const renderer = await createCliRenderer({
    exitOnCtrlC: true, backgroundColor: theme.background,
    screenMode: "alternate-screen", useMouse: true,
  });
  try {
    mountApp(renderer, new App(sheets), warnings);
  } catch (error) {
    renderer.destroy();
    throw error;
  }
}
