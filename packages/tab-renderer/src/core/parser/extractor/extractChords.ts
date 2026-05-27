import type { ChordItem } from "../types";
import { parseChord } from "./parseChord";

export function extractChords(chordsText: string, beat: number): ChordItem[] {
  if (!chordsText) {
    return [{ chordPosition: 0, beatType: "week", simpleChord: null }];
  }

  const results = [...Array.from(chordsText.matchAll(/(([/])|(\S+))/g))];
  return results.map((result, index) => {
    const chordObj = parseChord({ chordText: result[0] });

    return {
      simpleChord: chordObj,
      beatType: index % beat === 0 ? "strong" : "week",
      chordPosition: result.index,
    };
  });
}
