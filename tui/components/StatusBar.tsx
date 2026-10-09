import { useTerminalDimensions } from "@opentui/react";
import { theme } from "../theme";
import { Text } from "./Text";

interface StatusBarProps {
  visibleCount: number;
  totalCount: number;
  warningCount: number;
}

export function StatusBar({ visibleCount, totalCount, warningCount }: StatusBarProps) {
  const { width } = useTerminalDimensions();
  return <Text id="footer" fg={theme.muted} paddingX={1} height={1} wrapMode="none">
    {width < 70 ? "↑↓ move  Tab pane  / find  q quit"
      : `↑↓ j/k navigate  Tab pane  PgUp/PgDn scroll  / search  q quit  ·  ${visibleCount}/${totalCount}${warningCount ? `  ·  ${warningCount} load warnings` : ""}`}
  </Text>;
}
