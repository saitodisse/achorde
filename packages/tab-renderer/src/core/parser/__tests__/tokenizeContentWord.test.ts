import { describe, expect, it } from "vitest";
import { tokenizeContentWord } from "../tokenizeContentWord";

describe("tokenizeContentWord", () => {
  it("emits DecorationToken for standalone parentheses", () => {
    expect(tokenizeContentWord("(", 13)).toEqual([
      expect.objectContaining({ kind: "DecorationToken", text: "(" }),
    ]);
    expect(tokenizeContentWord(")", 30)).toEqual([
      expect.objectContaining({ kind: "DecorationToken", text: ")" }),
    ]);
  });

  it("splits leading and trailing parens away from chord symbols", () => {
    expect(tokenizeContentWord("(C7", 0)).toEqual([
      expect.objectContaining({ kind: "DecorationToken", text: "(" }),
      expect.objectContaining({ kind: "ChordToken", text: "C7" }),
    ]);
    expect(tokenizeContentWord("C7)", 0)).toEqual([
      expect.objectContaining({ kind: "ChordToken", text: "C7" }),
      expect.objectContaining({ kind: "DecorationToken", text: ")" }),
    ]);
    expect(tokenizeContentWord("(C7)", 0)).toEqual([
      expect.objectContaining({ kind: "DecorationToken", text: "(" }),
      expect.objectContaining({ kind: "ChordToken", text: "C7" }),
      expect.objectContaining({ kind: "DecorationToken", text: ")" }),
    ]);
  });

  it("keeps non-chord parenthesized words as a single lyric token", () => {
    expect(tokenizeContentWord("(passing)", 0)).toEqual([
      expect.objectContaining({ kind: "LyricToken", text: "(passing)" }),
    ]);
  });

  it("keeps extension parentheses inside the chord token", () => {
    expect(tokenizeContentWord("C7(13)", 0)).toEqual([
      expect.objectContaining({ kind: "ChordToken", text: "C7(13)" }),
    ]);
    expect(tokenizeContentWord("B7(9)", 0)).toEqual([
      expect.objectContaining({ kind: "ChordToken", text: "B7(9)" }),
    ]);
    expect(tokenizeContentWord("B7(13-)", 0)).toEqual([
      expect.objectContaining({ kind: "ChordToken", text: "B7(13-)" }),
    ]);
  });
});
