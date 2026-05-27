import { addChordsToSections } from "./parser/extractor";
import { getBarLinesFromSectionTexts } from "./parser/pairer";
import { splitSections } from "./parser/splitSections";
import type { PreparedSong, PrepareSongOptions } from "./preparedTypes";
import { generateBarList } from "./renderer/generateBarList";
import { transposeSection } from "./transposer/transposeSection";

export function prepareSong({
  body,
  transposeNumber = 0,
  viewMode = "e",
  beat = 4,
}: PrepareSongOptions): PreparedSong {
  const sectionTexts = splitSections(body);
  const sectionLines = getBarLinesFromSectionTexts(sectionTexts);
  const sections = addChordsToSections(sectionLines, beat);
  const transposed = sections.map((section) =>
    transposeSection({ sectionChords: section, transposeNumber }),
  );
  const barSuffix = viewMode === "o" ? "\n" : ". . ";
  const sectionsBarList = generateBarList({
    sectionTexts: transposed,
    barSuffix,
  });

  return {
    body,
    sections: sectionsBarList.map((section) => ({
      title: section.title,
      barList: section.barList,
    })),
  };
}
