import { chmod, copyFile, lstat, mkdir, rename, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, isAbsolute } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const home = homedir();
const existing = Bun.which("chtrs");
const relativeToHome = existing ? relative(home, existing) : "..";
const existingIsLocal = !isAbsolute(relativeToHome) && relativeToHome !== ".." && !relativeToHome.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`);
const directory = resolve(process.env.CHTRS_BIN_DIR ?? (existingIsLocal && existing ? dirname(existing) : join(home, ".local/bin")));
const destination = join(directory, "chtrs");
const source = fileURLToPath(new URL("../dist/chtrs", import.meta.url));
const check = Bun.spawn([source, "--help"], { stdout: "pipe", stderr: "inherit" });
const help = await new Response(check.stdout).text();
if (await check.exited !== 0 || !help.startsWith("chtrs OpenTUI")) throw new Error("Built executable failed validation");
let current;
try { current = await lstat(destination); }
catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
if (current && !current.isFile()) throw new Error(`Refusing to replace a symlink or directory: ${destination}. Choose CHTRS_BIN_DIR explicitly.`);
await mkdir(directory, { recursive: true });
const temporary = join(directory, `.chtrs-${process.pid}.tmp`);
try {
  await copyFile(source, temporary);
  await chmod(temporary, 0o755);
  await rename(temporary, destination);
} finally {
  await rm(temporary, { force: true });
}
console.log(`Installed ${destination}`);
if (Bun.which("chtrs") !== destination) {
  console.log(`To select this installation, put ${directory} first in your PATH.`);
}
