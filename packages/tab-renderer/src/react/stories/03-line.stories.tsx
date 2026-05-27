import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabChord } from "../TabChord";
import { TabLine } from "../TabLine";
import { TabLyric } from "../TabLyric";
import { withTabStoryFrame } from "./story-decorators";
import { RawBodyPreview, StoryPanel, StoryStepLabel } from "./story-ui";
import { tuaFlorBody, tuaFlorLines } from "./story-tua-flor";

const meta = {
  title: "tab-renderer/03 Line",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChordOnlyLine: Story = {
  name: "1. Chord-only line",
  render: () => (
    <StoryPanel caption="TabLine on a chord-only row from tua-flor (opening Em7).">
      <StoryStepLabel>
        Line 1 of {tuaFlorBody.split("\n").length} in fixture
      </StoryStepLabel>
      <RawBodyPreview body={tuaFlorLines.chordOnly.text} />
      <TabLine line={tuaFlorLines.chordOnly} index={0} />
    </StoryPanel>
  ),
};

export const LyricOnlyLine: Story = {
  name: "2. Lyric-only line",
  render: () => (
    <StoryPanel caption="Next line in tua-flor — mostly LyricToken and spaces.">
      <StoryStepLabel>Line 2 — paired lyric under the chord row</StoryStepLabel>
      <RawBodyPreview body={tuaFlorLines.lyricOnly.text} />
      <TabLine line={tuaFlorLines.lyricOnly} index={1} />
    </StoryPanel>
  ),
};

export const AlignedLine: Story = {
  name: "3. Chord + lyric pair (two lines)",
  render: () => (
    <StoryPanel caption="In tua-flor, alignment is a chord line followed by a lyric line — both from the same verse phrase.">
      <StoryStepLabel>
        Lines 3–4 — A7/Em7 then “Que a maré mansa…”
      </StoryStepLabel>
      <RawBodyPreview
        body={`${tuaFlorLines.chordDense.text}\n${tuaFlorLines.lyricDense.text}`}
      />
      <TabLine line={tuaFlorLines.chordDense} index={2} />
      <TabLine line={tuaFlorLines.lyricDense} index={3} />
    </StoryPanel>
  ),
};

export const CustomLine: Story = {
  name: "4. Custom TabLine (manual tokens)",
  render: () => (
    <StoryPanel caption="Manual token map on a complex tua-flor line with parenthesized chords — custom styles per kind.">
      <StoryStepLabel>
        Line with ( C7 B7 ) — {tuaFlorLines.withParens.tokens.length} tokens
      </StoryStepLabel>
      <RawBodyPreview body={tuaFlorLines.withParens.text} />
      <div style={{ whiteSpace: "pre" }}>
        {tuaFlorLines.withParens.tokens.map((token, index) => {
          switch (token.kind) {
            case "ChordToken":
              return (
                <TabChord
                  key={index}
                  token={token}
                  className="tab-story-chord"
                />
              );
            case "LyricToken":
              return (
                <TabLyric
                  key={index}
                  token={token}
                  className="tab-story-lyric"
                />
              );
            default:
              return <span key={index}>{token.text}</span>;
          }
        })}
      </div>
    </StoryPanel>
  ),
};
