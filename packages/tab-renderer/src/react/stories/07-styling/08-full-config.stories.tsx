import type { StoryObj } from "@storybook/react-vite";
import { Tab } from "../../Tab";
import { StoryPanel } from "../story-ui";
import { tuaFlorBody } from "../../../test/stubs/tua-flor";
import { stylingMetaBase, type StylingMeta } from "./styling-meta";
import { stylingArgsToTabProps } from "./styling-argtypes";

const meta = {
  ...stylingMetaBase,
  title: "tab-renderer/07 Styling",
} satisfies StylingMeta;

export default meta;
type Story = StoryObj<StylingMeta>;

export const FullConfig: Story = {
  name: "1. All style controls (tua-flor)",
  args: {
    body: tuaFlorBody,
    fontSize: 21,
    lineHeight: 0.184,
    chordHeight: 0.07,
    blockMarginRight: 0.6,
    transposeNumber: 0,
    viewMode: "e",
    displayMode: "both",
    chordColor: "#5884fe",
    lyricColor: "#d1dff5",
    backgroundColor: "#000000",
    contentMarginRightPx: 0,
  },
  render: (args) => (
    <StoryPanel caption="Full TabStyleConfig on the real tua-flor fixture — interleaved pipeline + CSS chord offsets + all viewer prefs.">
      <Tab {...stylingArgsToTabProps(args)} />
    </StoryPanel>
  ),
};
