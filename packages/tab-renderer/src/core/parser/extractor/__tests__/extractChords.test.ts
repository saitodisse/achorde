import { describe, expect, it } from "vitest";
import { extractChords } from "../extractChords";

describe("extractChords", () => {
  it("uses chord token columns and preserves decoration prefixes", () => {
    const chordsText = "                  (C7        B7)       Em7";
    const items = extractChords(chordsText, 4);

    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      chordPosition: 19,
      chordLinePrefix: "                  (",
      chordTextLength: 2,
    });
    expect(items[0]?.simpleChord?.original).toBe("C7");
    expect(items[1]).toMatchObject({
      chordPosition: 29,
      chordLinePrefix: "        ",
      chordTextLength: 2,
    });
    expect(items[1]?.simpleChord?.original).toBe("B7");
    expect(items[2]).toMatchObject({
      chordPosition: 39,
      chordLinePrefix: ")       ",
      chordTextLength: 3,
    });
    expect(items[2]?.simpleChord?.original).toBe("Em7");
  });
});
