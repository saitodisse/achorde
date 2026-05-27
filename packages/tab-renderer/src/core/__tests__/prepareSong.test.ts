import { describe, expect, it } from "vitest";
import { prepareSong } from "../prepareSong";
import { tuaFlorBody } from "../../test/stubs/tua-flor";

describe("prepareSong", () => {
  it("returns interleaved bar list for tua-flor fixture", () => {
    const song = prepareSong({ body: tuaFlorBody });
    expect(song.sections.length).toBeGreaterThan(0);
    const hasChord = song.sections.some((section) =>
      section.barList.some((item) => item.chordItem),
    );
    expect(hasChord).toBe(true);
  });

  it("transposes chords when transposeNumber is set", () => {
    const body = `[Verse]\nC\nLine`;
    const original = prepareSong({ body, transposeNumber: 0 });
    const transposed = prepareSong({ body, transposeNumber: 2 });
    const originalChord = original.sections[0].barList.find((i) => i.chordItem)
      ?.chordItem?.simpleChord?.rootNote;
    const transposedChord = transposed.sections[0].barList.find(
      (i) => i.chordItem,
    )?.chordItem?.simpleChord?.rootNote;
    expect(originalChord).toBe("C");
    expect(transposedChord).toBe("D");
  });
});
