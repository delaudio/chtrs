import type { CheatSheet } from "./cheatsheet";

export class App {
  private state = { query: "", selected: 0, searching: false, panel: "programs" as "programs" | "sheet" };
  private listeners = new Set<() => void>();
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  getSnapshot = () => this.state;
  private update(patch: Partial<typeof this.state>) {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) listener();
  }
  get query() { return this.state.query; }
  get selected() { return this.state.selected; }
  set selected(selected: number) { this.update({ selected }); }
  get searching() { return this.state.searching; }
  set searching(searching: boolean) { this.update({ searching }); }
  get panel() { return this.state.panel; }
  set panel(panel: "programs" | "sheet") { this.update({ panel }); }
  constructor(readonly sheets: CheatSheet[]) {}
  get filtered() {
    const query = this.query.toLowerCase();
    return this.sheets.filter(sheet => sheet.name.toLowerCase().includes(query));
  }
  get current() { return this.filtered[this.selected]; }
  setQuery(query: string) {
    this.update({ query, selected: 0 });
  }
  move(delta: number) {
    const length = this.filtered.length;
    this.selected = length ? (this.selected + delta + length) % length : 0;
  }
}
