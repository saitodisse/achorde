import { Chord } from "@tonaljs/tonal";
import type { ChordItem } from "../parser/types";

export function transposeDown(chordItem: ChordItem): ChordItem {
  if (!chordItem.simpleChord || chordItem.simpleChord.rootNote === "/") {
    return chordItem;
  }

  let transposedMainChord: string;
  let transposedBassNote: string | null = null;

  if (
    (chordItem?.simpleChord?.rootNote?.indexOf("b") || -1) > 0 ||
    (chordItem?.simpleChord?.rootNote?.indexOf("♭") || -1) > 0 ||
    chordItem.simpleChord?.rootNote === "F" ||
    chordItem.simpleChord?.rootNote === "C"
  ) {
    transposedMainChord = Chord.transpose(
      chordItem?.simpleChord?.rootNote || "",
      "-2m",
    );
  } else {
    transposedMainChord = Chord.transpose(
      chordItem?.simpleChord?.rootNote || "",
      "1d",
    );
  }

  if ((chordItem?.simpleChord?.bassNote?.length || 0) > 0) {
    if (
      (chordItem?.simpleChord?.bassNote?.indexOf("b") || -1) > 0 ||
      (chordItem?.simpleChord?.bassNote?.indexOf("♭") || -1) > 0 ||
      chordItem.simpleChord.bassNote === "F" ||
      chordItem.simpleChord.bassNote === "C"
    ) {
      transposedBassNote = Chord.transpose(
        chordItem?.simpleChord?.bassNote || "",
        "-2m",
      );
    } else {
      transposedBassNote = Chord.transpose(
        chordItem?.simpleChord?.bassNote || "",
        "1d",
      );
    }
  }

  return {
    ...chordItem,
    simpleChord: {
      ...chordItem.simpleChord,
      rootNote: transposedMainChord,
      bassNote: transposedBassNote,
    },
  };
}
