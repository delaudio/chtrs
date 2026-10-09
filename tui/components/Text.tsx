import type { TextProps } from "@opentui/react";
import { theme } from "../theme";

export function Text(props: TextProps) {
  return <text fg={theme.text} wrapMode="word" flexShrink={0} {...props} />;
}
