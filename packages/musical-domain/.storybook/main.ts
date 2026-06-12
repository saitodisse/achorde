import type { StorybookConfig } from "@storybook/react-vite";
import { createStorybookMain } from "@achorde/storybook-config/vite";

const config: StorybookConfig = createStorybookMain({
	stories: ["../storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs"],
	viteConfigPath: undefined,
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			include: ["../site/**/*.tsx", "../src/**/*.ts"],
		},
	},
});

export default config;
