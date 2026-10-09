import { expect, test } from "bun:test";
import { App } from "./app";

export const sampleSheets = ["Lazygit", "Neovim", "Yazi"].map(name => ({
  name, description: `${name} shortcuts`,
  sections: [{ title: "Navigation", items: Array.from({ length: 30 }, (_, i) => ({
    key: `key-${i}`, desc: `Action ${i} for ${name}`,
  })) }],
}));

test("filtered navigation wraps within results and resets on query changes", () => {
  const app = new App(sampleSheets);
  app.move(-1);
  expect(app.current?.name).toBe("Yazi");
  app.setQuery("LAZY");
  app.move(1);
  expect(app.current?.name).toBe("Lazygit");
  app.setQuery("missing");
  app.move(-1);
  expect(app.current).toBeUndefined();
  expect(app.selected).toBe(0);
  app.setQuery("");
  expect(app.current?.name).toBe("Lazygit");
});
