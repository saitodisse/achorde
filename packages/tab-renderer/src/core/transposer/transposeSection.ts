import type { ChordItem, SectionText } from "../parser/types";
import { replaceChordText } from "./replaceChordText";
import { transposeDown } from "./transposeDown";
import { transposeUp } from "./transposeUp";

export function transposeSection({
  sectionChords,
  transposeNumber,
}: {
  sectionChords: SectionText;
  transposeNumber: number;
}): SectionText {
  const section = structuredClone(sectionChords);

  if (transposeNumber === 0) {
    return section;
  }

  const transposedSections = section?.lines?.map((line) => {
    const transposedChordsList = line.chordsList?.map((chordItem) => {
      let item = chordItem;
      if (transposeNumber > 0) {
        for (let i = 0; i < transposeNumber; i++) {
          item = transposeUp(item);
        }
        return item;
      }
      for (let i = transposeNumber; i < 0; i++) {
        item = transposeDown(item);
      }
      return item;
    }) as ChordItem[];

    return replaceChordText({
      barLine: line,
      chordItemsTransposed: transposedChordsList,
    });
  });

  return {
    ...section,
    lines: transposedSections,
  };
}
