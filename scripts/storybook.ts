import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const mode = process.argv[2] ?? "dev";
if (!["dev", "test"].includes(mode)) throw new Error(`Unknown mode: ${mode}`);
const port = process.env.STORYBOOK_PORT ?? "6007";
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) throw new Error("Invalid STORYBOOK_PORT");
const env: Record<string, string | undefined> = { ...process.env, STORYBOOK_DISABLE_TELEMETRY: "1", CI: "1" };
const children: ReturnType<typeof Bun.spawn>[] = [];
function spawn(command: string[], childEnv = env) {
  const child = Bun.spawn(command, { env: childEnv, stdin: "ignore", stdout: "inherit", stderr: "inherit" });
  children.push(child);
  return child;
}
async function stop() {
  for (const child of children) if (child.exitCode === null) child.kill();
  const timeout = setTimeout(() => {
    for (const child of children) if (child.exitCode === null) child.kill("SIGKILL");
  }, 3000);
  await Promise.all(children.map(child => child.exited));
  clearTimeout(timeout);
}
process.on("SIGINT", async () => { await stop(); process.exit(130); });
process.on("SIGTERM", async () => { await stop(); process.exit(143); });

try {
  const generated = await spawn([process.execPath, "scripts/render-stories.tsx"]).exited;
  if (generated) throw new Error("Native frame generation failed");
  const indexUrl = `http://127.0.0.1:${port}/index.json`;
  async function isReady() {
    let response: Response;
    try { response = await fetch(indexUrl, { signal: AbortSignal.timeout(1500) }); }
    catch { return false; }
    if (!response.ok) return false;
    const index = await response.json() as { entries?: Record<string, { title?: string }> };
    if (!Object.values(index.entries ?? {}).some(entry => entry.title === "Chtrs/CheatSheetUI")) {
      throw new Error(`Port ${port} belongs to another Storybook. Set STORYBOOK_PORT to a free port.`);
    }
    return true;
  }
  let server: ReturnType<typeof Bun.spawn> | undefined;
  if (!await isReady()) {
    server = spawn(["node", "node_modules/storybook/dist/bin/dispatcher.js", "dev", "--host", "127.0.0.1", "-p", port, "--exact-port", "--ci", "--no-open"]);
    const deadline = Date.now() + 120000;
    while (!await isReady()) {
      if (server.exitCode !== null) throw new Error(`Storybook exited with ${server.exitCode}`);
      if (Date.now() > deadline) throw new Error("Storybook readiness timeout");
      await Bun.sleep(500);
    }
  }
  console.log(`Storybook ready: http://127.0.0.1:${port}`);
  if (mode === "dev") {
    // Bun follows native component imports; writing frames.json triggers Vite HMR.
    const watcher = spawn([process.execPath, "--watch", "scripts/render-stories.tsx"]);
    process.exitCode = await (server ? Promise.race([server.exited, watcher.exited]) : watcher.exited);
  } else {
    const visual = process.argv.includes("--visual");
    const update = process.argv.includes("--update");
    if (update && !visual) throw new Error("--update requires --visual");
    const filters = process.argv.slice(3).filter(arg => arg !== "--visual" && arg !== "--update");
    process.exitCode = await spawn(["node", resolve("node_modules/vitest/vitest.mjs"), "--project=storybook", "--run",
      ...(update ? ["--update=all"] : ["--update=none"]), ...filters], { ...env, VISUAL: visual ? "1" : "0" }).exited;
  }
} finally {
  await stop();
}
