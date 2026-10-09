import { useRef, useSyncExternalStore } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import type { App } from "../app";
import { useAppInput } from "../hooks/useAppInput";
import { theme } from "../theme";
import { Header } from "./Header";
import { ProgramSidebar } from "./ProgramSidebar";
import { SearchBar } from "./SearchBar";
import { SheetPanel } from "./SheetPanel";
import { StatusBar } from "./StatusBar";

interface CheatSheetUIProps {
  app: App;
  warnings?: string[];
  quit: () => void;
}

export function CheatSheetUI({ app, warnings = [], quit }: CheatSheetUIProps) {
  const state = useSyncExternalStore(app.subscribe, app.getSnapshot);
  const scroll = useRef<ScrollBoxRenderable | null>(null);
  const sheets = app.filtered;
  useAppInput(app, scroll, quit);

  return <box id="chtrs" width="100%" height="100%" flexDirection="column" backgroundColor={theme.background}>
    <Header />
    <box flexGrow={1} minHeight={0} flexDirection="row">
      <ProgramSidebar sheets={sheets} selected={state.selected} active={state.panel === "programs"} />
      <SheetPanel sheet={app.current} hasSheets={app.sheets.length > 0} warnings={warnings}
        active={state.panel === "sheet"} scrollRef={scroll} />
    </box>
    <SearchBar query={state.query} searching={state.searching} />
    <StatusBar visibleCount={sheets.length} totalCount={app.sheets.length} warningCount={warnings.length} />
  </box>;
}
