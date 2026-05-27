import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabSection } from "../TabSection";
import { withTabStoryFrame } from "./story-decorators";
import { RawBodyPreview, StoryPanel, StoryStepLabel } from "./story-ui";
import {
  tuaFlorBody,
  tuaFlorSong,
  tuaFlorTitledBody,
  tuaFlorTitledSong,
} from "./story-tua-flor";

const meta = {
  title: "tab-renderer/04 Section",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const UntitledSection: Story = {
  name: "1. Section without title",
  render: () => (
    <StoryPanel caption="Full tua-flor as one implicit section — title is null, so TabSection omits the &lt;h2&gt;.">
      <StoryStepLabel>
        {tuaFlorSong.sections.length} section · title: null ·{" "}
        {tuaFlorSong.sections[0].lines.length} lines
      </StoryStepLabel>
      <RawBodyPreview body={tuaFlorBody} />
      <TabSection section={tuaFlorSong.sections[0]} index={0} />
    </StoryPanel>
  ),
};

export const TitledSection: Story = {
  name: "2. Section with [Verse]",
  render: () => (
    <StoryPanel caption="Same tua-flor lyrics with a [Verse] header prepended — TabSection renders an &lt;h2&gt;.">
      <StoryStepLabel>
        title: {JSON.stringify(tuaFlorTitledSong.sections[0].title)}
      </StoryStepLabel>
      <RawBodyPreview body={tuaFlorTitledBody} />
      <TabSection section={tuaFlorTitledSong.sections[0]} index={0} />
    </StoryPanel>
  ),
};
