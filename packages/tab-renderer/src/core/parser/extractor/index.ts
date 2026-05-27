import type { SectionText } from "../types";
import { extractChords } from "./extractChords";

export function addChordsToSections(
  sectionTexts: SectionText[],
  beat: number,
): SectionText[] {
  const cloned = structuredClone(sectionTexts);
  return cloned.map((sec) => {
    if (sec?.lines) {
      sec.lines = sec.lines.map((barLine) => {
        barLine.chordsList = extractChords(barLine.chordsTextBar ?? "", beat);
        return barLine;
      });
    }
    return sec;
  });
}

export { extractChords } from "./extractChords";
export { parseChord, REGEX_IS_REAL_CHORD } from "./parseChord";
