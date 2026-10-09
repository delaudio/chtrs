import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/ProgramSidebar", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Selected: Story = { args: { frameId: "sidebar" } };
export const Empty: Story = { args: { frameId: "sidebar-empty" } };
