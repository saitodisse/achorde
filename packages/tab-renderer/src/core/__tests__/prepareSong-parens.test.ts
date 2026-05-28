import { describe, expect, it } from "vitest";
import { parseTab } from "../parseTab";
import { prepareSongFromParsedTab } from "../prepareSongFromParsedTab";

describe("prepareSongFromParsedTab parenthesized chord rows", () => {
  it("interleaves decoration markers with chord offsets", () => {
    const body = [
      "                  (C7        B7)       Em7",
      "Mas hoje eu quero o simples toque da tua mão",
    ].join("\n");

    const song = prepareSongFromParsedTab(parseTab(body));
    const barList = song.sections[0]?.barList ?? [];
    const decorations = barList.filter((item) => item.isChordLineDecoration);

    expect(decorations).toEqual([
      expect.objectContaining({ decorationText: "(" }),
      expect.objectContaining({ decorationText: ")" }),
    ]);
    expect(
      barList.some((item) => item.chordItem?.simpleChord?.original === "C7"),
    ).toBe(true);
    expect(
      barList.some((item) => item.chordItem?.simpleChord?.original === "B7"),
    ).toBe(true);
  });
});
