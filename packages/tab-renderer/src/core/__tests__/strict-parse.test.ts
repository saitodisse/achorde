import { describe, expect, it } from "vitest";
import { parseTab, STRICT_LINE_DIAGNOSTIC_CODES } from "../parseTab";

describe("strict parseTab grammar", () => {
  it("includes section-header lines for standalone [Intro]", () => {
    const result = parseTab("[Intro]\n[Verso]\nC\nletra");

    expect(result.sections).toHaveLength(2);
    expect(result.sections[0]?.lines).toEqual([
      expect.objectContaining({
        text: "[Intro]",
        kind: "section-header",
        tokens: [],
      }),
    ]);
    expect(result.sections[1]?.lines[0]).toMatchObject({
      text: "[Verso]",
      kind: "section-header",
    });
    expect(result.sections[1]?.lines[1]).toMatchObject({
      text: "C",
      kind: "chords",
    });
    expect(result.diagnostics).toEqual([]);
  });

  it("rejects [Intro] Cm7 on one line with section-header-with-content", () => {
    const result = parseTab("[Intro] Cm7\nletra");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      text: "[Intro] Cm7",
      kind: "chords",
    });
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: STRICT_LINE_DIAGNOSTIC_CODES.sectionHeaderWithContent,
        severity: "error",
        line: 1,
      }),
    ]);
  });

  it("rejects mixed chord and lyric tokens on the same line", () => {
    const result = parseTab("C letra misturada");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      text: "C letra misturada",
      kind: "lyrics",
    });
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: STRICT_LINE_DIAGNOSTIC_CODES.chordsAndLyricsOnSameLine,
        severity: "error",
      }),
    ]);
  });

  it("rejects invalid chord tokens such as C/D/E", () => {
    const result = parseTab("C/D/E");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      kind: "chords",
    });
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: STRICT_LINE_DIAGNOSTIC_CODES.invalidChordToken,
        severity: "error",
      }),
    ]);
  });

  it("rejects comments and tablature as invalid-line", () => {
    const result = parseTab("# comentario\nE|--0-2-3--");

    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: STRICT_LINE_DIAGNOSTIC_CODES.invalidLine,
        severity: "error",
        line: 1,
      }),
      expect.objectContaining({
        code: STRICT_LINE_DIAGNOSTIC_CODES.invalidLine,
        severity: "error",
        line: 2,
      }),
    ]);
    expect(
      result.diagnostics.every((diagnostic) => diagnostic.severity === "error"),
    ).toBe(true);
  });

  it("parses chord lines with slash chords and repeat without listing / in chordsFound", () => {
    const result = parseTab("Cm7        E7/G#        /");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      kind: "chords",
    });
    expect(result.chordsFound).toEqual(["Cm7", "E7/G#"]);
    expect(result.chordsFound).not.toContain("/");
    expect(result.diagnostics).toEqual([]);
  });

  it("preserves original line text on invalid lines", () => {
    const result = parseTab("[Intro] Cm7");

    expect(result.sections[0]?.lines[0]?.text).toBe("[Intro] Cm7");
  });
});
