import type { RefObject } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { useKeyboard, usePaste } from "@opentui/react";
import type { App } from "../app";

export function useAppInput(app: App, scroll: RefObject<ScrollBoxRenderable | null>, quit: () => void) {
  useKeyboard(key => {
    if (key.ctrl && key.name === "c") { quit(); return; }
    if (key.ctrl || key.meta || key.super || key.option) return;
    key.preventDefault();
    if (key.name === "escape") {
      app.searching = false;
      app.setQuery("");
    } else if (key.name === "return") {
      app.searching = false;
    } else if (key.name === "tab") {
      app.searching = false;
      app.panel = app.panel === "programs" ? "sheet" : "programs";
    } else if (key.name === "pagedown" || key.name === "pageup") {
      scroll.current?.scrollBy((key.name === "pagedown" ? 1 : -1) * Math.max(1, scroll.current.height - 2));
    } else if (key.name === "down" || key.name === "up" || (!app.searching && !key.shift && (key.name === "j" || key.name === "k"))) {
      const delta = key.name === "down" || key.name === "j" ? 1 : -1;
      if (app.panel === "sheet" && !app.searching) scroll.current?.scrollBy(delta);
      else app.move(delta);
    } else if (!app.searching && !key.shift && key.name === "q") {
      quit();
    } else if (!app.searching && key.sequence === "/") {
      app.searching = true;
      app.panel = "programs";
    } else if (key.name === "backspace") {
      app.setQuery(Array.from(app.query).slice(0, -1).join(""));
    } else if (key.sequence && !/[\x00-\x1f\x7f]/.test(key.sequence) && Array.from(key.sequence).length === 1) {
      app.searching = true;
      app.panel = "programs";
      app.setQuery(app.query + key.sequence);
    }
  });
  usePaste(event => {
    const value = new TextDecoder().decode(event.bytes).replace(/[\x00-\x1f\x7f]/g, "");
    app.searching = true;
    app.panel = "programs";
    app.setQuery(app.query + value);
  });
}
