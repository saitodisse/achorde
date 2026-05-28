import {
  parseTab,
  TAB_RENDERER_AST_VERSION,
  TAB_RENDERER_PARSER_VERSION,
  transposeChordSymbol,
  transposeParsedTab,
  type ParsedTab,
} from "../../core";

/** Valid strict chart: section headers on their own lines, chords, lyrics, blank. */
export const validStrictBody = `[Intro]

[Verse]
Cm7        E7/G#        /
Quando eu digo que deixei de te amar

`;

export const validStrictSong = parseTab(validStrictBody);

export const invalidAuthoringSamples = {
  sectionHeaderWithContent: {
    label: "section-header-with-content",
    body: "[Intro] Cm7",
  },
  invalidChordToken: {
    label: "invalid-chord-token",
    body: "C/D/E",
  },
  invalidLineComment: {
    label: "invalid-line (comment)",
    body: "# comentário",
  },
  invalidLineTablature: {
    label: "invalid-line (tablature)",
    body: "E|--0-2-3--",
  },
} as const;

export function parseSample(body: string): ParsedTab {
  return parseTab(body);
}

export const transposeSymbolCases = [
  { input: "C#m7/G#", semitones: 1, label: "+1 semitone" },
  { input: "Bbmaj7", semitones: 2, label: "+2 semitones" },
  { input: "/", semitones: 5, label: "repeat invariant" },
  { input: "not-a-chord", semitones: 2, label: "unknown unchanged" },
] as const;

export const transposeBody = `[Verse]
C#m7/G#        not-a-chord
`;

export const transposeSong = parseTab(transposeBody);
export const transposedSong = transposeParsedTab(transposeSong, 1);

export const parserVersions = {
  parser: TAB_RENDERER_PARSER_VERSION,
  ast: TAB_RENDERER_AST_VERSION,
} as const;

export function transposeSymbolMatrix(): ReadonlyArray<{
  input: string;
  semitones: number;
  output: string;
  label: string;
}> {
  return transposeSymbolCases.map((row) => ({
    ...row,
    output: transposeChordSymbol(row.input, row.semitones),
  }));
}
