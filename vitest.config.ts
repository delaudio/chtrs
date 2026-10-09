import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

export default defineConfig({
  define: { "import.meta.env.VITEST_VISUAL": JSON.stringify(process.env.VISUAL ?? "0") },
  test: {
    projects: [{
      extends: true,
      plugins: [storybookTest({ configDir: fileURLToPath(new URL(".storybook", import.meta.url)),
        storybookUrl: `http://127.0.0.1:${process.env.STORYBOOK_PORT ?? "6007"}` })],
      test: {
        name: "storybook",
        fileParallelism: false,
        browser: {
          enabled: true, headless: true,
          provider: playwright({ contextOptions: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 } }),
          instances: [{ browser: "chromium" }],
        },
      },
    }],
  },
});
