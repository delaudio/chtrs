import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../storybook/stories/*.stories.tsx"],
  framework: "@storybook/react-vite",
  addons: ["@storybook/addon-vitest"],
  core: { disableTelemetry: true },
  async viteFinal(config) {
    return {
      ...config,
      esbuild: { ...config.esbuild, jsx: "automatic", jsxImportSource: "react" },
      optimizeDeps: { ...config.optimizeDeps, include: [
        ...(config.optimizeDeps?.include ?? []),
        "react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime",
      ] },
      resolve: { ...config.resolve, dedupe: ["react", "react-dom"] },
    };
  },
};
export default config;
