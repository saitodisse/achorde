import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContractExplorer } from "../site/ContractExplorer.js";

const meta = {
	title: "Contracts/Overview",
	component: ContractExplorer,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ContractExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
