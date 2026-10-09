import type { CheatSheet } from "../cheatsheet";
import { theme } from "../theme";
import { Text } from "./Text";

interface ProgramSidebarProps {
  sheets: CheatSheet[];
  selected: number;
  active: boolean;
}

export function ProgramSidebar({ sheets, selected, active }: ProgramSidebarProps) {
  return <box id="sidebar" width="25%" flexShrink={0} minWidth={0} paddingX={1} paddingTop={1}
    backgroundColor={theme.panel} border={["right"]} borderColor={theme.border}>
    <Text id="programs-label" fg={active ? theme.primary : theme.muted}>PROGRAMS</Text>
    <select id="programs" flexGrow={1} minHeight={0} marginTop={1}
      options={sheets.map(entry => ({ name: entry.name, description: "" }))} selectedIndex={selected}
      showDescription={false} showSelectionIndicator backgroundColor={theme.panel} textColor={theme.text}
      selectedBackgroundColor={theme.element} selectedTextColor={theme.primary} wrapSelection />
  </box>;
}
