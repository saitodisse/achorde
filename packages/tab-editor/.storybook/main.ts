import type { StorybookConfig } from "@storybook/react-vite";
import { createStorybookMain } from "@achorde/storybook-config/vite";

const config: StorybookConfig = createStorybookMain({
  stories: ["../src/react/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  viteConfigPath: undefined,
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      include: ["../src/**/*.tsx"],
    },
  },
});

export default config;
