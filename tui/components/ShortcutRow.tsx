import type { CheatSheet } from "../cheatsheet";
import { theme } from "../theme";
import { Text } from "./Text";

interface ShortcutRowProps {
  item: CheatSheet["sections"][number]["items"][number];
  sectionIndex: number;
  itemIndex: number;
}

export function ShortcutRow({ item, sectionIndex, itemIndex }: ShortcutRowProps) {
  return <box id={`row-${sectionIndex}-${itemIndex}`} flexDirection="row" flexShrink={0} marginBottom={1} gap={2}>
    <Text id={`key-${sectionIndex}-${itemIndex}`} fg={theme.secondary} width="36%" minWidth={0}>{item.key}</Text>
    <Text id={`desc-${sectionIndex}-${itemIndex}`} flexGrow={1} flexShrink={1} minWidth={0}>{item.desc}</Text>
  </box>;
}
