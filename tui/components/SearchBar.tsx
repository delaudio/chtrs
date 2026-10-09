import { theme } from "../theme";
import { Text } from "./Text";

interface SearchBarProps {
  query: string;
  searching: boolean;
}

export function SearchBar({ query, searching }: SearchBarProps) {
  return <Text id="search" fg={searching ? theme.primary : theme.muted} bg={theme.element}
    paddingX={1} height={1} wrapMode="none">
    {searching ? `/ ${query}▏` : query ? `/ ${query}  ·  Esc clear` : "/ Search programs"}
  </Text>;
}
