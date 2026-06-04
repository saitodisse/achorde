import type { StorybookConfig } from "@storybook/react-vite";
import { createStorybookMain } from "@achorde/storybook-config/vite";

const config: StorybookConfig = createStorybookMain({
  stories: ["../src/react/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  /** Lib vite.config.ts is for package build, not Storybook preview. */
  viteConfigPath: undefined,
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      include: [
        "../src/**/*.tsx",
        "../../musical-domain/src/**/*.ts",
        "../../storybook-config/src/**/*.tsx",
      ],
    },
  },
});

export default config;
