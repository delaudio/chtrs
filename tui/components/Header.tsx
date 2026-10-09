import { theme } from "../theme";
import { Text } from "./Text";

export function Header() {
  return <box height={3} flexShrink={0} paddingX={2} justifyContent="center" backgroundColor={theme.panel}>
    <Text id="brand" fg={theme.primary}>chtrs  /  cheat sheets</Text>
  </box>;
}
