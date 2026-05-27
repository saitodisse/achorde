import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab } from "../Tab";
import { withTabStoryFrame } from "./story-decorators";
import { StoryPanel, StoryStepLabel } from "./story-ui";
import { tuaFlorBody } from "./story-tua-flor";

const meta = {
  title: "tab-renderer/06 Tab",
  component: Tab,
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
  args: {
    body: tuaFlorBody,
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StyledViewer: Story = {
  name: "1. Tab (body → render)",
  render: (args) => (
    <StoryPanel caption="Tab calls prepareSong(body) and renders the interleaved stream with CSS chord offsets. For the ParsedTab path, compose Tab.Root + Tab.Section (see 05 Composition).">
      <StoryStepLabel>Production viewer · full tua-flor fixture</StoryStepLabel>
      <Tab {...args} />
    </StoryPanel>
  ),
};
