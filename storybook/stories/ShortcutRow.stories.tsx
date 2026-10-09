import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/ShortcutRow", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { frameId: "shortcut" } };
export const LongCommand: Story = { args: { frameId: "shortcut-long" } };
