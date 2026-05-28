import { describe, expect, it } from "vitest";
import { parseTab } from "../parseTab";
import { transposeChordSymbol } from "../transposeChordSymbol";
import { transposeParsedTab } from "../transposeParsedTab";

describe("transposeChordSymbol", () => {
  it("transposes recognized chord symbols and keeps unknown symbols intact", () => {
    expect(transposeChordSymbol("C#m7/G#", 1)).toBe("Dm7/A");
    expect(transposeChordSymbol("Bbmaj7", 2)).toBe("Cmaj7");
    expect(transposeChordSymbol("/", 5)).toBe("/");
    expect(transposeChordSymbol("not-a-chord", 2)).toBe("not-a-chord");
  });
});

describe("transposeParsedTab", () => {
  it("transposes chord tokens without changing line text or diagnostics", () => {
    const parsed = parseTab("[Verse]\nC#m7/G#        not-a-chord");
    const transposed = transposeParsedTab(parsed, 1);

    const chordLine = transposed.sections[0]?.lines[1];
    expect(chordLine?.text).toBe("C#m7/G#        not-a-chord");
    expect(
      chordLine?.tokens.find((token) => token.text === "Dm7/A")?.chord?.text,
    ).toBe("Dm7/A");
    expect(
      chordLine?.tokens.find((token) => token.text === "not-a-chord")?.text,
    ).toBe("not-a-chord");
    expect(transposed.diagnostics).toEqual(parsed.diagnostics);
    expect(transposed.chordsFound).toEqual(["Dm7/A"]);
  });

  it("keeps repeat markers invariant", () => {
    const parsed = parseTab("Cm7 /");
    const transposed = transposeParsedTab(parsed, 5);

    const repeatToken = transposed.sections[0]?.lines[0]?.tokens.find(
      (token) => token.chord?.kind === "repeat",
    );
    expect(repeatToken?.text).toBe("/");
    expect(transposed.chordsFound).toEqual(["Fm7"]);
  });
});
