import { describe, expect, it } from "vitest";
import type { ChordItem, SectionText } from "../parser/types";
import { generateBarList } from "../renderer/generateBarList";

function makeChordItem(root: string, position: number): ChordItem {
  return {
    simpleChord: {
      original: root,
      rootNote: root,
      quality: null,
      bassNote: null,
    },
    chordPosition: position,
    beatType: "strong",
  };
}

describe("generateBarList", () => {
  it("interleaves lyric and chord segments", () => {
    const sections: SectionText[] = [
      {
        title: "Verse",
        content: "C   G",
        lines: [
          {
            liricsTextBar: "Letra aqui   ",
            chordsTextBar: "C   G        ",
            chordsList: [makeChordItem("C", 0), makeChordItem("G", 4)],
          },
        ],
      },
    ];
    const result = generateBarList({ sectionTexts: sections });
    expect(result[0].barList.length).toBeGreaterThanOrEqual(4);
    expect(result[0].barList.some((item) => item.chordItem)).toBe(true);
  });

  it("uses newline suffix for original view mode", () => {
    const sections: SectionText[] = [
      {
        title: "Verse",
        content: "C",
        lines: [
          {
            liricsTextBar: "Line",
            chordsTextBar: "C ",
            chordsList: [makeChordItem("C", 0)],
          },
        ],
      },
    ];
    const original = generateBarList({
      sectionTexts: sections,
      barSuffix: "\n",
    });
    const extended = generateBarList({
      sectionTexts: sections,
      barSuffix: ". . ",
    });
    const originalSuffix = original[0].barList.find(
      (i) => i.isSpace,
    )?.liricPart;
    const extendedSuffix = extended[0].barList.find(
      (i) => i.isSpace,
    )?.liricPart;
    expect(originalSuffix).toBe("\n");
    expect(extendedSuffix).toBe(". . ");
  });
});
