import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/StatusBar", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { frameId: "status" } };
export const Compact: Story = { args: { frameId: "status-compact" } };
export const Warnings: Story = { args: { frameId: "status-warnings" } };
