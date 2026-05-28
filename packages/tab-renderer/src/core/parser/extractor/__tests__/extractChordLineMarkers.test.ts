import { describe, expect, it } from "vitest";
import { parseTab } from "../../../parseTab";
import { extractChordLineMarkers } from "../extractChordLineMarkers";

describe("extractChordLineMarkers", () => {
  it("emits decoration markers at their column positions", () => {
    const body = [
      "                  (C7        B7)       Em7",
      "Mas hoje eu quero o simples toque da tua mão",
    ].join("\n");
    const chordLine = parseTab(body).sections[0]?.lines[0];
    expect(chordLine?.kind).toBe("chords");

    const markers = extractChordLineMarkers(chordLine!, 4);
    expect(markers).toEqual([
      { kind: "decoration", position: 18, text: "(" },
      {
        kind: "chord",
        position: 19,
        textLength: 2,
        beatType: "strong",
        simpleChord: expect.objectContaining({ original: "C7" }),
      },
      {
        kind: "chord",
        position: 29,
        textLength: 2,
        beatType: "week",
        simpleChord: expect.objectContaining({ original: "B7" }),
      },
      { kind: "decoration", position: 31, text: ")" },
      {
        kind: "chord",
        position: 39,
        textLength: 3,
        beatType: "week",
        simpleChord: expect.objectContaining({ original: "Em7" }),
      },
    ]);
  });
});
