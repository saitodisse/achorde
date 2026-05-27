import type { SectionText } from "../types";
import { pairLines } from "./pairLines";

export function getBarLinesFromSectionTexts(
  sectionTexts: SectionText[],
): SectionText[] {
  return sectionTexts.map((section) => {
    const lines = pairLines(section.content || "");
    return { ...section, lines };
  });
}

export { pairLines } from "./pairLines";
