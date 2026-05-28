import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig, type UserConfig } from "vite";

/**
 * Storybook viteFinal tweaks.
 * Never pass `plugins` into mergeConfig — duplicates Storybook plugins (breaks vite-app.js).
 * Never import this module from story files — it pulls `vite` into optimizeDeps.
 */
export function applyStorybookViteFinal(config: UserConfig): UserConfig {
  if (Array.isArray(config.plugins)) {
    config.plugins = config.plugins.filter(
      (plugin) =>
        plugin &&
        typeof plugin === "object" &&
        "name" in plugin &&
        plugin.name !== "vite:storybook-inject-mocker-runtime",
    );
  }

  return mergeConfig(config, {
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      exclude: ["vite", "esbuild", "rollup"],
    },
  });
}

export function createStorybookMain(
  overrides: StorybookConfig,
): StorybookConfig {
  const { viteFinal: userViteFinal, ...rest } = overrides;

  return {
    addons: [
      "@chromatic-com/storybook",
      "@storybook/addon-a11y",
      "@storybook/addon-docs",
    ],
    framework: "@storybook/react-vite",
    ...rest,
    async viteFinal(config, options) {
      const withBase = applyStorybookViteFinal(config);
      if (!userViteFinal) {
        return withBase;
      }
      return userViteFinal(withBase, options);
    },
  };
}
