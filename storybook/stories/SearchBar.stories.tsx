import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/SearchBar", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = { args: { frameId: "search-idle" } };
export const Active: Story = { args: { frameId: "search-active" } };
export const Filtered: Story = { args: { frameId: "search-filtered" } };
