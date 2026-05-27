import type { BarLine, ChordItem } from "../parser/types";
import { chordToText } from "./chordToText";

export function replaceChordText({
  barLine,
  chordItemsTransposed,
}: {
  barLine: BarLine;
  chordItemsTransposed: ChordItem[];
}): BarLine {
  const result: BarLine = chordItemsTransposed.reduce((prev, curr) => {
    const from = curr?.simpleChord?.original || "";
    const to = chordToText(curr?.simpleChord);

    prev.chordsTextBar = prev?.chordsTextBar?.replace(from, to);

    const sizeDiff = to.length - from.length;
    if (sizeDiff < 0) {
      const splited = prev?.chordsTextBar?.split("");
      if (curr?.chordPosition && splited) {
        splited.splice(
          curr.chordPosition + from.length - 1,
          0,
          " ".repeat(-sizeDiff),
        );
        prev.chordsTextBar = splited.join("");
      }
    } else if (sizeDiff > 0) {
      if (prev.chordsTextBar && curr?.chordPosition) {
        const splited = prev.chordsTextBar.split("");
        splited.splice(curr.chordPosition + to.length, sizeDiff, "");
        prev.chordsTextBar = splited.join("");
      }
    }

    if ((prev.chordsTextBar?.length || 0) > prev.liricsTextBar?.length) {
      prev.sufixBar = " ".repeat(
        (prev?.chordsTextBar?.length || 0) - prev.liricsTextBar.length,
      );
    }

    prev.chordsList = chordItemsTransposed;
    return prev;
  }, structuredClone(barLine));

  return result;
}
