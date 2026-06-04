import type { ParsedChordSymbol } from "./chord-symbol.js";
import type { VoicingQuality } from "./fretted-voicing.js";

/**
 * Spelling fields for a chord symbol (catalog / theory), distinct from {@link VoicingQuality}.
 */
export type ChordSpellingMetadata = {
  rootNote?: string;
  /** Musical quality suffix (e.g. maj7, m6, aug9) — not {@link VoicingQuality}. */
  chordQuality?: string;
  bassNote?: string | null;
  popularity?: number;
};

export function spellingFromParsedChordSymbol(
  chord: Extract<ParsedChordSymbol, { kind: "chord" }>,
): ChordSpellingMetadata {
  const metadata: ChordSpellingMetadata = {
    rootNote: chord.root,
  };

  if (chord.suffix) {
    metadata.chordQuality = chord.suffix;
  }

  if (chord.bass !== undefined) {
    metadata.bassNote = chord.bass;
  }

  return metadata;
}
