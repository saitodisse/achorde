import { describe, expect, it } from "vitest";
import { parseChordSymbol } from "../parseChordSymbol";

describe("parseChordSymbol", () => {
  it("accepts slash alterations such as D7/9 as a single chord", () => {
    expect(parseChordSymbol("D7/9")).toEqual({
      kind: "chord",
      text: "D7/9",
      root: "D",
      suffix: "7/9",
    });
  });

  it("still parses slash bass chords separately from slash alterations", () => {
    expect(parseChordSymbol("E7/G#")).toEqual({
      kind: "chord",
      text: "E7/G#",
      root: "E",
      suffix: "7",
      bass: "G#",
    });
    expect(parseChordSymbol("Am7/C")).toEqual({
      kind: "chord",
      text: "Am7/C",
      root: "A",
      suffix: "m7",
      bass: "C",
    });
  });

  it("rejects multiple slashes", () => {
    expect(parseChordSymbol("C/D/E")).toBeNull();
  });
});
