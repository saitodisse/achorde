import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const svguitarReactEntry = path.resolve(storybookDir, "../../svguitar-react/src/index.ts");
const musicalDomainEntry = path.resolve(storybookDir, "../../musical-domain/src/index.ts");

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
	framework: {
		name: "@storybook/react-vite",
		options: {},
	},
	async viteFinal(config) {
		return mergeConfig(config, {
			resolve: {
				alias: {
					"@achorde/svguitar-react": svguitarReactEntry,
					"@achorde/musical-domain": musicalDomainEntry,
				},
			},
		});
	},
};

export default config;
