import type { ParseDiagnostic } from "./diagnostics.js";
import type { ParsedChordSymbol } from "./chord-symbol.js";

export type ChordChartSectionKind =
  | "intro"
  | "verse"
  | "pre-chorus"
  | "chorus"
  | "bridge"
  | "solo"
  | "instrumental"
  | "outro"
  | "spoken"
  | "unknown";

export type ChordChartLineKind =
  | "lyrics"
  | "chords"
  | "mixed"
  | "tablature"
  | "comment"
  | "blank"
  | "unknown";

/**
 * @deprecated Use {@link ParsedTab} and `ParsedTabLine.tokens` instead.
 */
export type ChordChartSegment = {
  id: string;
  order: number;
  text: string;
  chord?: string;
  sourceRange: {
    startColumn: number;
    endColumn: number;
  };
};

/**
 * @deprecated Use {@link ParsedTabLine} instead (`text` replaces `raw`, `tokens` replace `segments`).
 */
export type ChordChartLine = {
  id: string;
  order: number;
  raw: string;
  kind: ChordChartLineKind;
  segments: ChordChartSegment[];
};

/**
 * @deprecated Use {@link ParsedTabSection} instead (`title` replaces `label`).
 */
export type ChordChartSection = {
  id: string;
  order: number;
  kind: ChordChartSectionKind;
  label: string;
  originalLabel: string;
  lines: ChordChartLine[];
};

/**
 * @deprecated Use {@link ParsedTab} as the canonical chart AST.
 */
export type ChordChartAst = {
  sections: ChordChartSection[];
};

/**
 * @deprecated Use {@link ParsedTab} instead.
 */
export type ParsedChordChart = ChordChartAst & {
  diagnostics: ParseDiagnostic[];
};

export type { ParsedChordSymbol };
