import { TextAttributes } from "@opentui/core";
import type { CheatSheet } from "../cheatsheet";
import { theme } from "../theme";
import { ShortcutRow } from "./ShortcutRow";
import { Text } from "./Text";

interface SheetSectionProps {
  section: CheatSheet["sections"][number];
  sectionIndex: number;
}

export function SheetSection({ section, sectionIndex }: SheetSectionProps) {
  return <>
    <Text id={`section-${sectionIndex}`} fg={theme.primary} attributes={TextAttributes.BOLD}
      marginTop={sectionIndex ? 1 : 0} marginBottom={1}>{section.title}</Text>
    {section.items.map((item, itemIndex) => (
      <ShortcutRow key={itemIndex} item={item} sectionIndex={sectionIndex} itemIndex={itemIndex} />
    ))}
  </>;
}
