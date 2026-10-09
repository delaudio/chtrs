import type { CheatSheet } from "../cheatsheet";
import { theme } from "../theme";
import { SheetSection } from "./SheetSection";
import { Text } from "./Text";

interface SheetContentProps {
  sheet?: CheatSheet;
  hasSheets: boolean;
  warnings: string[];
}

export function SheetContent({ sheet, hasSheets, warnings }: SheetContentProps) {
  return <>
    <Text id="sheet-description" fg={theme.muted} marginBottom={1}>
      {sheet?.description ?? (hasSheets ? "Try another search or press Esc to clear." : "Add YAML files to ./cheat-sheets or ~/.config/chtrs/cheat-sheets.")}
    </Text>
    {sheet ? sheet.sections.map((section, sectionIndex) => (
      <SheetSection key={sectionIndex} section={section} sectionIndex={sectionIndex} />
    )) : warnings.length > 0 && <Text id="warnings" fg={theme.muted}>{warnings.join("\n")}</Text>}
  </>;
}
