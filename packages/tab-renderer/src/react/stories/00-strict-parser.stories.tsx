import type { Meta, StoryObj } from "@storybook/react-vite";
import { withTabStoryFrame } from "./story-decorators";
import {
  invalidAuthoringSamples,
  parseSample,
  parserVersions,
  transposeBody,
  transposeSong,
  transposedSong,
  transposeSymbolMatrix,
  validStrictBody,
  validStrictSong,
} from "./story-strict-parse";
import { tuaFlorBody, tuaFlorSong } from "./story-tua-flor";
import {
  AstPreview,
  AstSongSummary,
  DiagnosticsList,
  InvalidSampleCard,
  ParsedTabLineTable,
  ParserVersionBadge,
  PipelineDiagram,
  RawBodyPreview,
  SideBySidePanels,
  StoryPanel,
  StoryStepLabel,
  TransposeSymbolTable,
  ParseTabInspector,
  StorybookRuntimeHealthPanel,
} from "./story-ui";

const meta = {
  title: "tab-renderer/00 Strict parser (phase 1)",
  decorators: [withTabStoryFrame],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Headless strict `parseTab`, diagnostics, `chordsFound`, `transposeChordSymbol`, and `transposeParsedTab` (phase 1). Use these stories to verify grammar and API before AC15 integration.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pipeline: Story = {
  name: "0. Pipeline & versions",
  render: () => (
    <StoryPanel caption="Layers introduced in phase 1: parse → ParsedTab → optional transpose. Versions bump when grammar or AST shape changes.">
      <StorybookRuntimeHealthPanel />
      <ParserVersionBadge
        parserVersion={parserVersions.parser}
        astVersion={parserVersions.ast}
      />
      <PipelineDiagram />
    </StoryPanel>
  ),
};

export const ValidStrictChart: Story = {
  name: "1. Valid strict chart",
  render: () => (
    <StoryPanel caption="Four line kinds only: section-header, chords, lyrics, blank. Section labels must sit alone on their line.">
      <StoryStepLabel>Input</StoryStepLabel>
      <RawBodyPreview body={validStrictBody} />
      <StoryStepLabel>ParsedTab summary</StoryStepLabel>
      <AstSongSummary song={validStrictSong} />
      <StoryStepLabel>Lines by section</StoryStepLabel>
      <ParsedTabLineTable song={validStrictSong} />
      <DiagnosticsList diagnostics={validStrictSong.diagnostics} />
      <ParseTabInspector song={validStrictSong} />
    </StoryPanel>
  ),
};

export const SectionHeaders: Story = {
  name: "2. Section header lines",
  render: () => {
    const song = parseSample("[Intro]\n[Verso]\nC");

    return (
      <StoryPanel caption="Standalone `[Title]` becomes a ParsedTabLine with kind section-header (empty tokens) and opens the section.">
        <RawBodyPreview body={"[Intro]\n[Verso]\nC"} />
        <ParsedTabLineTable song={song} />
        <AstPreview
          value={song.sections.map((section) => ({
            title: section.title,
            headerLines: section.lines.filter(
              (line) => line.kind === "section-header",
            ),
          }))}
        />
      </StoryPanel>
    );
  },
};

export const InvalidAuthoringGallery: Story = {
  name: "3. Invalid authoring gallery",
  render: () => (
    <StoryPanel caption="Each invalid pattern emits severity error; line.text stays exactly as authored.">
      <div className="tab-story-invalid-grid">
        {Object.values(invalidAuthoringSamples).map((sample) => (
          <InvalidSampleCard
            key={sample.label}
            title={sample.label}
            body={sample.body}
            song={parseSample(sample.body)}
          />
        ))}
      </div>
    </StoryPanel>
  ),
};

export const SectionHeaderWithContent: Story = {
  name: "4. [Intro] Cm7 on one line",
  render: () => {
    const body = "[Intro] Cm7\nletra abaixo";
    const song = parseSample(body);

    return (
      <StoryPanel caption="Legacy combined header line: one physical line in the AST, error section-header-with-content, kind heuristics favor chords when suffix is chord-only.">
        <RawBodyPreview body={body} />
        <ParsedTabLineTable song={song} />
        <DiagnosticsList diagnostics={song.diagnostics} />
      </StoryPanel>
    );
  },
};

export const ChordsFoundAndRepeat: Story = {
  name: "5. chordsFound excludes /",
  render: () => {
    const body = "Cm7        E7/G#        /";
    const song = parseSample(body);

    return (
      <StoryPanel caption="collectDiagrammableChords / chordsFound lists only ParsedChordSymbol.kind === chord. Repeat markers never appear.">
        <RawBodyPreview body={body} />
        <AstSongSummary song={song} />
        <AstPreview value={song.chordsFound} />
      </StoryPanel>
    );
  },
};

export const TuaFlorDiagnostics: Story = {
  name: "6. tua-flor (real fixture + errors)",
  render: () => (
    <StoryPanel caption="Production-sized body: valid strict lines coexist with legacy mixed lines flagged as errors.">
      <RawBodyPreview body={tuaFlorBody} />
      <AstSongSummary song={tuaFlorSong} />
      <DiagnosticsList diagnostics={tuaFlorSong.diagnostics} />
      <StoryStepLabel>All lines (kind per row)</StoryStepLabel>
      <ParsedTabLineTable song={tuaFlorSong} />
      <StoryStepLabel>Full AST (JSON)</StoryStepLabel>
      <AstPreview value={tuaFlorSong} />
    </StoryPanel>
  ),
};

export const TransposeChordSymbol: Story = {
  name: "7. transposeChordSymbol",
  render: () => (
    <StoryPanel caption="Public symbol transposition API (slash chords, repeat, unknown token).">
      <TransposeSymbolTable rows={transposeSymbolMatrix()} />
    </StoryPanel>
  ),
};

export const TransposeParsedTab: Story = {
  name: "8. transposeParsedTab",
  render: () => (
    <StoryPanel caption="AST transposition updates ChordToken text; line.text and diagnostics are unchanged. chordsFound is recomputed.">
      <RawBodyPreview body={transposeBody} />
      <SideBySidePanels
        leftTitle="parseTab (transpose 0)"
        rightTitle="transposeParsedTab (+1)"
        left={
          <>
            <AstSongSummary song={transposeSong} />
            <AstPreview value={transposeSong.sections[0]?.lines[1]?.tokens} />
          </>
        }
        right={
          <>
            <AstSongSummary song={transposedSong} />
            <AstPreview value={transposedSong.sections[0]?.lines[1]?.tokens} />
          </>
        }
      />
      <StoryStepLabel>line.text unchanged on chord row</StoryStepLabel>
      <pre className="tab-story-ast">
        {`original: ${JSON.stringify(transposeSong.sections[0]?.lines[1]?.text)}\ntransposed: ${JSON.stringify(transposedSong.sections[0]?.lines[1]?.text)}`}
      </pre>
    </StoryPanel>
  ),
};

export const FullAstJson: Story = {
  name: "9. Valid chart — full ParsedTab JSON",
  render: () => (
    <StoryPanel caption="Dump for diffing against AC15 cache payloads after integration.">
      <AstPreview value={validStrictSong} />
    </StoryPanel>
  ),
};
