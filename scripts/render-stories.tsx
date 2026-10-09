import { mkdir, writeFile } from "node:fs/promises";
import { createRef, type ReactNode } from "react";
import { createRoot, flushSync } from "@opentui/react";
import { createTestRenderer } from "@opentui/core/testing";
import { TextAttributes, type ScrollBoxRenderable, type RGBA } from "@opentui/core";
import { App } from "../tui/app";
import type { CheatSheet } from "../tui/cheatsheet";
import { theme } from "../tui/theme";
import { CheatSheetUI } from "../tui/components/CheatSheetUI";
import { Header } from "../tui/components/Header";
import { ProgramSidebar } from "../tui/components/ProgramSidebar";
import { SearchBar } from "../tui/components/SearchBar";
import { SheetContent } from "../tui/components/SheetContent";
import { SheetPanel } from "../tui/components/SheetPanel";
import { SheetSection } from "../tui/components/SheetSection";
import { ShortcutRow } from "../tui/components/ShortcutRow";
import { StatusBar } from "../tui/components/StatusBar";
import { Text } from "../tui/components/Text";
import type { TerminalFrame } from "../storybook/frame";

// Fixed fixtures: never read the user's HOME or project-local cheat sheets.
const sheets: CheatSheet[] = [
  { name: "Lazygit", description: "A simple terminal UI for git commands.", sections: [
    { title: "Navigation", items: [
      { key: "j / k", desc: "Move down / up" }, { key: "Tab", desc: "Switch panel" },
      { key: "Enter", desc: "Open the selected item" },
    ] },
    { title: "Working tree", items: [
      { key: "Space", desc: "Stage or unstage the selected file" },
      { key: "c", desc: "Commit staged changes" }, { key: "P", desc: "Push commits to the remote" },
    ] },
  ] },
  { name: "Neovim", description: "Edit code without leaving the keyboard.", sections: [
    { title: "Buffers", items: [{ key: ":bnext", desc: "Next buffer" }, { key: ":write", desc: "Save the current buffer" }] },
  ] },
  { name: "Yazi", description: "Terminal file manager", sections: [] },
];
const section = sheets[0].sections[0];
const longSheet: CheatSheet = { name: "Long content", description: "A description that wraps across the compact terminal. ".repeat(4),
  sections: [{ title: "Commands", items: Array.from({ length: 25 }, (_, i) => ({ key: `command-${i}`, desc: `Action ${i} with a longer explanation that wraps.` })) }],
};
interface Scene { id: string; cols: number; rows: number; render: () => ReactNode; scroll?: number }
const appScene = (id: string, cols: number, rows: number, setup?: (app: App) => void, data = sheets, warnings: string[] = [], scroll?: number): Scene => ({
  id, cols, rows, scroll, render: () => {
    const app = new App(data);
    setup?.(app);
    return <CheatSheetUI app={app} warnings={warnings} quit={() => {}} />;
  },
});
const scenes: Scene[] = [
  appScene("app-default", 80, 24), appScene("app-compact", 50, 15), appScene("app-wide", 120, 30),
  appScene("app-search", 80, 24, app => { app.setQuery("neo"); app.searching = true; }),
  appScene("app-no-results", 80, 24, app => { app.setQuery("missing"); app.searching = true; }),
  appScene("app-empty", 80, 24, undefined, []),
  appScene("app-invalid", 80, 24, undefined, [], ["fixtures/broken.yaml: invalid or unreadable YAML"]),
  appScene("app-scrolled", 50, 15, app => { app.panel = "sheet"; }, [longSheet], [], 1000),
  { id: "header", cols: 80, rows: 3, render: () => <Header /> },
  { id: "sidebar", cols: 80, rows: 14, render: () => <ProgramSidebar sheets={sheets} selected={1} active /> },
  { id: "sidebar-empty", cols: 80, rows: 10, render: () => <ProgramSidebar sheets={[]} selected={0} active={false} /> },
  { id: "search-idle", cols: 80, rows: 1, render: () => <SearchBar query="" searching={false} /> },
  { id: "search-active", cols: 80, rows: 1, render: () => <SearchBar query="neo" searching /> },
  { id: "search-filtered", cols: 80, rows: 1, render: () => <SearchBar query="neo" searching={false} /> },
  { id: "status", cols: 100, rows: 1, render: () => <StatusBar visibleCount={3} totalCount={3} warningCount={0} /> },
  { id: "status-compact", cols: 50, rows: 1, render: () => <StatusBar visibleCount={1} totalCount={3} warningCount={0} /> },
  { id: "status-warnings", cols: 120, rows: 1, render: () => <StatusBar visibleCount={3} totalCount={3} warningCount={2} /> },
  { id: "sheet-content", cols: 60, rows: 24, render: () => <SheetContent sheet={sheets[0]} hasSheets warnings={[]} /> },
  { id: "sheet-panel", cols: 60, rows: 20, render: () => <SheetPanel sheet={sheets[0]} hasSheets warnings={[]} active scrollRef={createRef<ScrollBoxRenderable>()} /> },
  { id: "section", cols: 60, rows: 9, render: () => <SheetSection section={section} sectionIndex={0} /> },
  { id: "shortcut", cols: 60, rows: 3, render: () => <ShortcutRow item={section.items[0]} sectionIndex={0} itemIndex={0} /> },
  { id: "shortcut-long", cols: 35, rows: 6, render: () => <ShortcutRow item={{ key: "git worktree add --track", desc: "Create a working directory for a local tracking branch" }} sectionIndex={0} itemIndex={0} /> },
  { id: "text", cols: 60, rows: 3, render: () => <Text fg={theme.primary} attributes={TextAttributes.BOLD}>Terminal text · à è → ✓</Text> },
];
const color = (value: RGBA) => {
  const [r, g, b, a] = value.toInts();
  return `rgba(${r},${g},${b},${a / 255})`;
};
const frames: Record<string, TerminalFrame> = {};
for (const scene of scenes) {
  const test = await createTestRenderer({ width: scene.cols, height: scene.rows, backgroundColor: theme.background });
  try {
    const root = createRoot(test.renderer);
    flushSync(() => root.render(<box width="100%" height="100%" backgroundColor={theme.background}>{scene.render()}</box>));
    await test.renderOnce();
    if (scene.scroll) {
      const scroll = test.renderer.root.findDescendantById("sheet-scroll") as ScrollBoxRenderable;
      scroll.scrollTo(scene.scroll);
      await test.renderOnce();
    }
    const frame = test.captureSpans();
    frames[scene.id] = { cols: frame.cols, rows: frame.rows, lines: frame.lines.map(line => ({ spans: line.spans.map(span => ({
      text: span.text, width: span.width, fg: color(span.fg), bg: color(span.bg),
      bold: !!(span.attributes & TextAttributes.BOLD), italic: !!(span.attributes & TextAttributes.ITALIC),
      underline: !!(span.attributes & TextAttributes.UNDERLINE),
    })) })) };
  } finally { test.renderer.destroy(); }
}
await mkdir(new URL("../storybook/generated/", import.meta.url), { recursive: true });
await writeFile(new URL("../storybook/generated/frames.json", import.meta.url), JSON.stringify(frames));
console.log(`Rendered ${scenes.length} native OpenTUI frames.`);
