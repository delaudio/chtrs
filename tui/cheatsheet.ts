import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse } from "yaml";

export interface CheatSheet {
  name: string;
  description: string;
  sections: { title: string; items: { key: string; desc: string }[] }[];
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isCheatSheet(value: unknown): value is CheatSheet {
  return record(value) && typeof value.name === "string" &&
    typeof value.description === "string" && Array.isArray(value.sections) &&
    value.sections.every(section => record(section) && typeof section.title === "string" &&
      Array.isArray(section.items) && section.items.every(item => record(item) &&
        typeof item.key === "string" && typeof item.desc === "string"));
}

export function discoveryDirectories(options: {
  cwd?: string; home?: string; executable?: string; sourceRoot?: string;
} = {}): string[] {
  const cwd = options.cwd ?? process.cwd();
  const home = options.home ?? process.env.HOME;
  const directories = [join(cwd, "cheat-sheets"), join(cwd, "cheat_sheets")];
  if (home) directories.push(join(home, ".config/chtrs/cheat-sheets"), join(home, ".config/chtrs"));
  directories.push(join(dirname(options.executable ?? process.execPath), "cheat-sheets"));
  if (options.sourceRoot) directories.push(join(options.sourceRoot, "cheat-sheets"));
  return [...new Set(directories.map(directory => resolve(directory)))];
}

export function loadSheets(directories: string[], bundled: CheatSheet[] = []) {
  const sheets = new Map<string, CheatSheet>();
  const warnings: string[] = [];
  for (const directory of directories) {
    let files: string[];
    try {
      files = readdirSync(directory).sort();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") warnings.push(`${directory}: cannot read directory`);
      continue;
    }
    for (const file of files) {
      if (!/\.ya?ml$/.test(file)) continue;
      const path = join(directory, file);
      try {
        const sheet: unknown = parse(readFileSync(path, "utf8"));
        if (!isCheatSheet(sheet)) throw new Error("invalid cheat sheet schema");
        if (!sheets.has(sheet.name)) sheets.set(sheet.name, sheet);
      } catch {
        warnings.push(`${path}: invalid or unreadable YAML`);
      }
    }
  }
  for (const sheet of bundled) {
    if (!sheets.has(sheet.name)) sheets.set(sheet.name, sheet);
  }
  return {
    sheets: [...sheets.values()].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
    warnings,
  };
}
