import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabRoot } from "../TabRoot";
import { TabSection } from "../TabSection";
import { withTabStoryFrame } from "./story-decorators";
import { RawBodyPreview, StoryPanel, StoryStepLabel } from "./story-ui";
import { tuaFlorBody, tuaFlorSong } from "./story-tua-flor";

const meta = {
  title: "tab-renderer/05 Composition",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TabRootManual: Story = {
  name: "1. TabRoot + TabSection (composition)",
  render: () => (
    <StoryPanel caption="TabRoot wraps the full tua-flor ParsedTab from parseTab(); you map every section to TabSection manually — the composable alternative to the styled Tab viewer.">
      <StoryStepLabel>
        TabRoot → {tuaFlorSong.sections.length} × TabSection ·{" "}
        {tuaFlorSong.sections[0].lines.length} lines rendered
      </StoryStepLabel>
      <RawBodyPreview body={tuaFlorBody} />
      <TabRoot song={tuaFlorSong}>
        {tuaFlorSong.sections.map((section, index) => (
          <TabSection key={index} section={section} index={index} />
        ))}
      </TabRoot>
    </StoryPanel>
  ),
};
