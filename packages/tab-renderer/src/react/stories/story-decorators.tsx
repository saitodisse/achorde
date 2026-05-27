import type { Decorator } from "@storybook/react-vite";
import "./stories.css";

export const withTabStoryFrame: Decorator = (Story) => (
  <div className="tab-story-frame">
    <Story />
  </div>
);
