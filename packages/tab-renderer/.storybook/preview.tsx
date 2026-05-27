import type { Preview } from "@storybook/react-vite";
import { StoryTheme } from "./StoryTheme";
import "../src/index.css";

const preview: Preview = {
  globalTypes: {
    storyTheme: {
      description: "Preview color scheme for story frames",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    storyTheme:
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  },
  decorators: [
    (Story, { globals }) => (
      <StoryTheme theme={globals.storyTheme ?? "light"}>
        <Story />
      </StoryTheme>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "var(--bg)" },
        { name: "dark", value: "#16110f" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
