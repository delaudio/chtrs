import { createRoot, flushSync } from "@opentui/react";
import type { CliRenderer, ScrollBoxRenderable, BoxRenderable } from "@opentui/core";
import type { App } from "./app";
import { CheatSheetUI } from "./components/CheatSheetUI";

export function mountApp(renderer: CliRenderer, app: App, warnings: string[] = [], quit = () => renderer.destroy()) {
  const reactRoot = createRoot(renderer);
  flushSync(() => reactRoot.render(<CheatSheetUI app={app} warnings={warnings} quit={quit} />));
  return {
    get root() { return renderer.root.findDescendantById("chtrs") as BoxRenderable; },
    get scroll() { return renderer.root.findDescendantById("sheet-scroll") as ScrollBoxRenderable; },
    unmount: () => flushSync(() => reactRoot.unmount()),
  };
}
