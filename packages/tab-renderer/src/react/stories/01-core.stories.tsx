import type { Meta, StoryObj } from "@storybook/react-vite";
import { withTabStoryFrame } from "./story-decorators";
import {
  AstPreview,
  AstSongSummary,
  RawBodyPreview,
  StoryPanel,
  StoryStepLabel,
} from "./story-ui";
import { tuaFlorBody, tuaFlorLines, tuaFlorSong } from "./story-tua-flor";

const meta = {
  title: "tab-renderer/01 Core",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RawBody: Story = {
  name: "1. Raw body text",
  render: () => (
    <StoryPanel caption="Everything starts as a multiline string — the full tua-flor chord sheet, before any parsing.">
      <StoryStepLabel>Input only — no parseTab()</StoryStepLabel>
      <RawBodyPreview body={tuaFlorBody} />
    </StoryPanel>
  ),
};

export const Transform: Story = {
  name: "2. parseTab(body) → ParsedTab",
  render: () => (
    <StoryPanel caption="The headless core turns the same body into an AST: ParsedTab → ParsedTabSection[] → ParsedTabLine[] → ParsedTabToken[].">
      <StoryStepLabel>Summary counts, then full JSON</StoryStepLabel>
      <RawBodyPreview body={tuaFlorBody} />
      <AstSongSummary song={tuaFlorSong} />
      <AstPreview value={tuaFlorSong} />
    </StoryPanel>
  ),
};

export const ExplicitTokens: Story = {
  name: "3. Explicit tokens",
  render: () => {
    const line = tuaFlorLines.withParens;

    return (
      <StoryPanel caption="Zoom into one physical line from tua-flor — each segment becomes ChordToken, LyricToken, or SpaceToken.">
        <StoryStepLabel>
          Line: {JSON.stringify(line.text.trim())}
        </StoryStepLabel>
        <RawBodyPreview body={line.text} />
        <AstPreview value={line.tokens} />
      </StoryPanel>
    );
  },
};
