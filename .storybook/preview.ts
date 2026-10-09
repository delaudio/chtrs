import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: { layout: "centered", controls: { disable: true } },
  async afterEach({ canvasElement }) {
    await document.fonts.ready;
    const target = canvasElement.querySelector<HTMLElement>("[data-visual-snapshot-root]");
    if (!target) throw new Error("Story did not render a native terminal frame");
    if (import.meta.env.VITEST_VISUAL !== "1") return;
    const [{ expect }, { page }] = await Promise.all([import("vitest"), import("vitest/browser")]);
    await page.viewport(1440, 900);
    await expect(page.elementLocator(target)).toMatchScreenshot({ timeout: 10000 });
  },
};
export default preview;
