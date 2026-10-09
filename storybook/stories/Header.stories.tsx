import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/Header", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { frameId: "header" } };
