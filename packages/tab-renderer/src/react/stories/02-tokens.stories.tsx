import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabChord } from "../TabChord";
import { TabLyric } from "../TabLyric";
import { withTabStoryFrame } from "./story-decorators";
import { StoryPanel, StoryStepLabel } from "./story-ui";
import { tuaFlorLines } from "./story-tua-flor";

const chordToken = tuaFlorLines.chordDense.tokens.find(
  (t) => t.kind === "ChordToken",
)!;
const lyricToken = tuaFlorLines.lyricDense.tokens.find(
  (t) => t.kind === "LyricToken",
)!;
const spaceToken = tuaFlorLines.chordDense.tokens.find(
  (t) => t.kind === "SpaceToken",
)!;

const meta = {
  title: "tab-renderer/02 Tokens",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChordToken: Story = {
  name: "1. TabChord",
  render: () => (
    <StoryPanel caption="Renders one ChordToken from tua-flor (dense chord row with A7 / Em7).">
      <StoryStepLabel>
        From line: {tuaFlorLines.chordDense.text.trim()}
      </StoryStepLabel>
      <TabChord token={chordToken} className="tab-story-chord" />
    </StoryPanel>
  ),
};

export const LyricToken: Story = {
  name: "2. TabLyric",
  render: () => (
    <StoryPanel caption="Renders one LyricToken — words that do not match the chord pattern.">
      <StoryStepLabel>
        Token text: {JSON.stringify(lyricToken.text)}
      </StoryStepLabel>
      <TabLyric token={lyricToken} className="tab-story-lyric" />
    </StoryPanel>
  ),
};

export const SpaceToken: Story = {
  name: "3. Spaces (SpaceToken)",
  render: () => (
    <StoryPanel caption="Whitespace becomes SpaceToken and keeps column alignment — shown here before a chord on the same line.">
      <StoryStepLabel>
        Space run ({spaceToken.text.length} chars) + chord
      </StoryStepLabel>
      <div style={{ whiteSpace: "pre" }}>
        <span
          className="tab-story-ast"
          style={{ display: "inline", padding: "0 0.25rem" }}
        >
          [{spaceToken.text.replace(/ /g, "·")}]
        </span>
        <TabChord token={chordToken} className="tab-story-chord" />
      </div>
    </StoryPanel>
  ),
};
