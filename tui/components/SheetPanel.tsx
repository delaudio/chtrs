import type { RefObject } from "react";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";
import type { CheatSheet } from "../cheatsheet";
import { theme } from "../theme";
import { SheetContent } from "./SheetContent";
import { Text } from "./Text";

interface SheetPanelProps {
  sheet?: CheatSheet;
  hasSheets: boolean;
  warnings: string[];
  active: boolean;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
}

export function SheetPanel({ sheet, hasSheets, warnings, active, scrollRef }: SheetPanelProps) {
  return <box id="detail" flexGrow={1} minWidth={0} paddingX={2} paddingTop={1}>
    <Text id="sheet-title" fg={active ? theme.secondary : theme.primary}
      attributes={TextAttributes.BOLD} height={1} wrapMode="none" truncate>
      {sheet?.name ?? (hasSheets ? "No matching programs" : "No cheat sheets yet")}
    </Text>
    <scrollbox key={sheet?.name} ref={scrollRef} id="sheet-scroll" flexGrow={1} minHeight={0}
      scrollX={false} scrollY contentOptions={{ flexDirection: "column" }}>
      <SheetContent sheet={sheet} hasSheets={hasSheets} warnings={warnings} />
    </scrollbox>
  </box>;
}
