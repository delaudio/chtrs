import { fileURLToPath } from "node:url";
import { loadSheets } from "../tui/cheatsheet";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const { sheets, warnings } = loadSheets(["cheat-sheets"]);
if (warnings.length) throw new Error(`Cannot bundle invalid cheat sheets:\n${warnings.join("\n")}`);
if (!sheets.length) throw new Error("No bundled cheat sheets found");
// Pass JSON directly as an argument, never through shell interpolation.
const build = Bun.spawn([process.execPath, "build", "--compile", "tui/main.ts", "--outfile", "dist/chtrs",
  "--define", `CHTRS_BUNDLED_SHEETS=${JSON.stringify(sheets)}`], {
  stdout: "inherit", stderr: "inherit",
});
process.exitCode = await build.exited;
