import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoveryDirectories, loadSheets } from "./cheatsheet";

test("loads both extensions, validates YAML, deduplicates by source priority and sorts", () => {
  const root = mkdtempSync(join(tmpdir(), "chtrs-test-"));
  try {
    const local = join(root, "local");
    const global = join(root, "global");
    mkdirSync(local); mkdirSync(global);
    const sheet = (name: string, description: string) => JSON.stringify({ name, description, sections: [] });
    writeFileSync(join(local, "z.yml"), sheet("Zed", "local"));
    writeFileSync(join(global, "z.yaml"), sheet("Zed", "global"));
    writeFileSync(join(global, "a.yaml"), sheet("Alpha", "global"));
    writeFileSync(join(local, "invalid.yaml"), "name: [broken");
    writeFileSync(join(local, "wrong.yaml"), "name: 42");
    writeFileSync(join(local, "ignore.txt"), sheet("Ignored", ""));
    const loaded = loadSheets([join(root, "absent"), local, global]);
    expect(loaded.sheets.map(s => s.name)).toEqual(["Alpha", "Zed"]);
    expect(loaded.sheets[1].description).toBe("local");
    expect(loaded.warnings).toHaveLength(2);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("discovery preserves directory precedence", () => {
  expect(discoveryDirectories({ cwd: "/project", home: "/user", executable: "/bin/chtrs" })).toEqual([
    "/project/cheat-sheets", "/project/cheat_sheets", "/user/.config/chtrs/cheat-sheets",
    "/user/.config/chtrs", "/bin/cheat-sheets",
  ]);
});

test("bundled sheets remain compatible", () => {
  const loaded = loadSheets(["cheat-sheets"]);
  expect(loaded.warnings).toEqual([]);
  expect(loaded.sheets.length).toBeGreaterThanOrEqual(6);
});

test("bundled defaults work without external files and never override user sheets", () => {
  const bundled = [{ name: "Example", description: "bundled", sections: [] }];
  expect(loadSheets([], bundled).sheets).toEqual(bundled);
  const root = mkdtempSync(join(tmpdir(), "chtrs-bundled-"));
  try {
    writeFileSync(join(root, "custom.yaml"), JSON.stringify({ ...bundled[0], description: "custom" }));
    expect(loadSheets([root], bundled).sheets[0].description).toBe("custom");
  } finally { rmSync(root, { recursive: true, force: true }); }
});
