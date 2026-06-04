import { describe, expect, it } from "vitest";
import type { ParsedChordSymbol } from "./chord-symbol.js";
import {
  spellingFromParsedChordSymbol,
  type ChordSpellingMetadata,
} from "./chord-spelling.js";

function chord(
  partial: Extract<ParsedChordSymbol, { kind: "chord" }>,
): Extract<ParsedChordSymbol, { kind: "chord" }> {
  return partial;
}

describe("ChordSpellingMetadata", () => {
  it("documents chordQuality as musical suffix, not VoicingQuality", () => {
    const meta: ChordSpellingMetadata = {
      rootNote: "C#",
      chordQuality: "aug9",
    };

    expect(meta.chordQuality).toBe("aug9");
    expect(meta).not.toHaveProperty("quality");
  });
});

describe("spellingFromParsedChordSymbol", () => {
  it("maps C#aug9 spelling fields", () => {
    expect(
      spellingFromParsedChordSymbol(
        chord({
          kind: "chord",
          text: "C#aug9",
          root: "C#",
          suffix: "aug9",
        }),
      ),
    ).toEqual({
      rootNote: "C#",
      chordQuality: "aug9",
    });
  });

  it("maps Am/G with bass note", () => {
    expect(
      spellingFromParsedChordSymbol(
        chord({
          kind: "chord",
          text: "Am/G",
          root: "A",
          suffix: "m",
          bass: "G",
        }),
      ),
    ).toEqual({
      rootNote: "A",
      chordQuality: "m",
      bassNote: "G",
    });
  });

  it("maps C7#11 extension in suffix", () => {
    expect(
      spellingFromParsedChordSymbol(
        chord({
          kind: "chord",
          text: "C7#11",
          root: "C",
          suffix: "7#11",
        }),
      ),
    ).toEqual({
      rootNote: "C",
      chordQuality: "7#11",
    });
  });

  it("omits chordQuality when suffix is empty", () => {
    expect(
      spellingFromParsedChordSymbol(
        chord({
          kind: "chord",
          text: "C",
          root: "C",
          suffix: "",
        }),
      ),
    ).toEqual({
      rootNote: "C",
    });
  });
});
