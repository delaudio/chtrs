import type { Meta, StoryObj } from "@storybook/react-vite";
import { TerminalPreview } from "../TerminalPreview";

const meta = { title: "Chtrs/CheatSheetUI", component: TerminalPreview } satisfies Meta<typeof TerminalPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { frameId: "app-default" } };
export const Compact: Story = { args: { frameId: "app-compact" } };
export const Wide: Story = { args: { frameId: "app-wide" } };
export const Search: Story = { args: { frameId: "app-search" } };
export const NoResults: Story = { args: { frameId: "app-no-results" } };
export const Empty: Story = { args: { frameId: "app-empty" } };
export const InvalidFiles: Story = { args: { frameId: "app-invalid" } };
export const Scrolled: Story = { args: { frameId: "app-scrolled" } };
