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

  it("rejects lyric words that start with a note letter", () => {
    expect(parseChordSymbol("Eu")).toBeNull();
    expect(parseChordSymbol("De")).toBeNull();
    expect(parseChordSymbol("Amor")).toBeNull();
  });

  it("still accepts minor and major spellings that share a note prefix", () => {
    expect(parseChordSymbol("F#mmaj7")).toEqual({
      kind: "chord",
      text: "F#mmaj7",
      root: "F#",
      suffix: "mmaj7",
    });
    expect(parseChordSymbol("Em")).toEqual({
      kind: "chord",
      text: "Em",
      root: "E",
      suffix: "m",
    });
    expect(parseChordSymbol("E")).toEqual({
      kind: "chord",
      text: "E",
      root: "E",
      suffix: "",
    });
  });
});
