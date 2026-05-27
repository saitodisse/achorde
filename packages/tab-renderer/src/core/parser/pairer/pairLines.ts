import type { BarLine } from "../types";
import { isChordLine } from "./chordLineDetector";
import { alignLines } from "./lineAligner";
import { removeAllThings } from "./removeThings";

export function pairLines(originalText: string): BarLine[] {
  const cleanedText = removeAllThings(originalText);

  const chordsLiricLines: BarLine[] = [];
  const lines = cleanedText.split("\n");

  for (let i = 0; i < lines?.length || 0; ) {
    if (lines?.[i]?.length > 0) {
      const isLine1Chords = isChordLine(lines?.[i] || "");
      const isLine2Chords = isChordLine(lines?.[i + 1] || "");

      if (!isLine1Chords) {
        chordsLiricLines.push(
          alignLines({
            chordsText: "",
            liricsText: lines?.[i] || "",
          }),
        );
        i += 1;
        continue;
      }

      if (isLine1Chords && isLine2Chords) {
        chordsLiricLines.push(
          alignLines({
            chordsText: lines?.[i] || "",
            liricsText: "",
          }),
        );
        i += 1;
        continue;
      }

      if (isLine1Chords && !isLine2Chords) {
        chordsLiricLines.push(
          alignLines({
            chordsText: lines?.[i] || "",
            liricsText: lines?.[i + 1] || "",
          }),
        );
        i += 2;
        continue;
      }
    }
    i += 1;
  }

  return chordsLiricLines;
}
