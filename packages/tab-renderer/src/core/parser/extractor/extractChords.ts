import type { ParsedTabLine } from "../../types";
import type { ChordItem } from "../types";
import { tokenizeRawLine } from "../tokenizeRawLine";
import { parseChord } from "./parseChord";

function buildChordItems(
  chordsText: string,
  chordTokens: Array<{ text: string; startColumn: number; endColumn: number }>,
  beat: number,
): ChordItem[] {
  if (chordTokens.length === 0) {
    return [{ chordPosition: 0, beatType: "week", simpleChord: null }];
  }

  return chordTokens.map((token, index) => {
    const previousEnd =
      index === 0 ? 0 : (chordTokens[index - 1]?.endColumn ?? 0);

    return {
      simpleChord: parseChord({ chordText: token.text }),
      beatType: index % beat === 0 ? "strong" : "week",
      chordPosition: token.startColumn,
      chordLinePrefix: chordsText.slice(previousEnd, token.startColumn),
      chordTextLength: token.endColumn - token.startColumn,
    };
  });
}

/** Uses strict-parser ChordToken positions from a chord line. */
export function extractChordsFromLine(
  chordLine: ParsedTabLine,
  beat: number,
): ChordItem[] {
  const chordTokens = chordLine.tokens
    .filter((token) => token.kind === "ChordToken")
    .map((token) => ({
      text: token.text,
      startColumn: token.startColumn,
      endColumn: token.endColumn,
    }));

  return buildChordItems(chordLine.text, chordTokens, beat);
}

export function extractChords(chordsText: string, beat: number): ChordItem[] {
  if (!chordsText.trim()) {
    return [{ chordPosition: 0, beatType: "week", simpleChord: null }];
  }

  const chordTokens = tokenizeRawLine(chordsText)
    .filter((token) => token.kind === "ChordToken")
    .map((token) => ({
      text: token.text,
      startColumn: token.startColumn,
      endColumn: token.endColumn,
    }));

  return buildChordItems(chordsText, chordTokens, beat);
}
