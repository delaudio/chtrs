import { expect, test } from "bun:test";
import { createTestRenderer } from "@opentui/core/testing";
import { App } from "./app";
import { mountApp } from "./ui";

const fixtures = ["Lazygit", "Neovim", "Yazi"].map(name => ({
  name, description: `${name} shortcuts`, sections: [{ title: "Navigation",
    items: Array.from({ length: 40 }, (_, i) => ({ key: `key-${i}`, desc: `Action ${i}` })),
  }],
}));

for (const [width, height] of [[50, 15], [80, 24], [120, 30]]) {
  test(`two-pane rendering and keyboard flow at ${width}x${height}`, async () => {
    const t = await createTestRenderer({ width, height });
    let quits = 0;
    try {
      const app = new App(fixtures);
      const ui = mountApp(t.renderer, app, [], () => { quits++; });
      await t.renderOnce();
      expect(t.captureCharFrame()).toContain("Navigation");
      expect(t.captureCharFrame()).toContain("PROGRAMS");
      expect(ui.root.findDescendantById("sidebar")?.width).toBe(Math.round(width * .25));
      await t.mockInput.typeText("neo");
      await t.renderOnce();
      expect(app.query).toBe("neo");
      expect(t.captureCharFrame()).toContain("Neovim shortcuts");
      t.mockInput.pressArrow("down");
      expect(app.current?.name).toBe("Neovim");
      await t.mockInput.typeText("qjk");
      expect(quits).toBe(0);
      expect(app.query).toBe("neoqjk");
      await t.renderOnce();
      expect(t.captureCharFrame()).toContain("No matching programs");
      t.mockInput.pressEscape();
      await new Promise(resolve => setTimeout(resolve, 40));
      await t.renderOnce();
      expect(app.query).toBe("");
      t.mockInput.pressKey("j");
      await t.renderOnce();
      expect(app.current?.name).toBe("Neovim");
      t.mockInput.pressTab();
      t.mockInput.pressKey("\x1b[6~");
      await t.renderOnce();
      expect(ui.scroll.scrollTop).toBeGreaterThan(0);
      t.mockInput.pressKey("q");
      expect(quits).toBe(1);
    } finally { t.renderer.destroy(); }
  });
}

test("paste, backspace, Enter, empty state and resize", async () => {
  const t = await createTestRenderer({ width: 80, height: 24 });
  try {
    const app = new App(fixtures);
    mountApp(t.renderer, app);
    await t.mockInput.pasteBracketedText("Neovi");
    await t.mockInput.typeText("m");
    expect(app.query).toBe("Neovim");
    t.mockInput.pressBackspace();
    expect(app.query).toBe("Neovi");
    t.mockInput.pressEnter();
    expect(app.searching).toBe(false);
    t.resize(50, 15);
    await t.renderOnce();
    expect(t.captureCharFrame()).toContain("Neovim shortcuts");
  } finally { t.renderer.destroy(); }
  const empty = await createTestRenderer({ width: 80, height: 24 });
  try {
    mountApp(empty.renderer, new App([]));
    await empty.renderOnce();
    expect(empty.captureCharFrame()).toContain("No cheat sheets yet");
  } finally { empty.renderer.destroy(); }
});

test("long descriptions remain scrollable without hiding the shortcut viewport", async () => {
  const t = await createTestRenderer({ width: 50, height: 15 });
  try {
    const sheet = {
      name: "Long description", description: "Description line\n".repeat(40),
      sections: [{ title: "Shortcuts", items: [{ key: "ctrl+s", desc: "Save document" }] }],
    };
    const ui = mountApp(t.renderer, new App([sheet]));
    await t.renderOnce();
    expect(ui.scroll.height).toBeGreaterThan(0);
    expect(t.captureCharFrame()).toContain("Description line");
    for (let page = 0; page < 10; page++) {
      t.mockInput.pressKey("\x1b[6~");
      await t.renderOnce();
    }
    expect(t.captureCharFrame()).toContain("Save document");
    expect(t.captureCharFrame()).toContain("Shortcuts");
  } finally { t.renderer.destroy(); }
});

test("React preserves selection and scroll across rerenders and cleans up on unmount", async () => {
  const t = await createTestRenderer({ width: 80, height: 24 });
  try {
    const app = new App(fixtures);
    const ui = mountApp(t.renderer, app);
    await t.renderOnce();
    t.mockInput.pressKey("j");
    await t.renderOnce();
    t.mockInput.pressTab();
    await t.renderOnce();
    expect(t.captureCharFrame()).toContain("▶ Neovim");
    t.mockInput.pressKey("\x1b[6~");
    await t.renderOnce();
    const offset = ui.scroll.scrollTop;
    expect(offset).toBeGreaterThan(0);
    t.mockInput.pressTab();
    await t.renderOnce();
    expect(ui.scroll.scrollTop).toBe(offset);
    t.mockInput.pressKey("j");
    await t.renderOnce();
    expect(ui.scroll.scrollTop).toBe(0);
    ui.unmount();
    await t.renderOnce();
    expect(t.captureCharFrame()).not.toContain("PROGRAMS");
    t.mockInput.pressKey("k");
    expect(app.current?.name).toBe("Yazi");
  } finally { t.renderer.destroy(); }
});

test("uppercase shortcut letters start a search instead of navigating or quitting", async () => {
  const t = await createTestRenderer({ width: 80, height: 24 });
  let quits = 0;
  try {
    const app = new App(fixtures);
    mountApp(t.renderer, app, [], () => { quits++; });
    await t.renderOnce();
    for (const letter of ["J", "K", "Q"]) {
      app.searching = false;
      app.setQuery("");
      await t.renderOnce();
      await t.mockInput.typeText(letter);
      expect(app.query).toBe(letter);
      expect(app.searching).toBe(true);
      expect(quits).toBe(0);
    }
  } finally { t.renderer.destroy(); }
});
