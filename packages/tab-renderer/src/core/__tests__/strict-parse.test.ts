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

  it("ignores mixed chord and lyric tokens on the same line without a diagnostic", () => {
    const result = parseTab("C letra misturada");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      text: "C letra misturada",
      kind: "lyrics",
    });
    expect(result.diagnostics).toEqual([]);
    expect(result.chordsFound).toEqual(["C"]);
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

  it("treats lyric lines starting with Amor as lyrics", () => {
    const result = parseTab("Amor de verdade eu só senti");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      kind: "lyrics",
      text: "Amor de verdade eu só senti",
    });
    expect(result.diagnostics).toEqual([]);
    expect(
      result.sections[0]?.lines[0]?.tokens.some(
        (token) => token.kind === "ChordToken",
      ),
    ).toBe(false);
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

  it("classifies parenthesized chord rows as chords with DecorationToken", () => {
    const body = [
      "               A7          Em7",
      "É só deixar fluir este sorriso",
      "             ( C7          B7 )        Em7      E7",
      "Liberte-se com este seu vestido colorido",
    ].join("\n");
    const result = parseTab(body);

    const chordRow = result.sections[0]?.lines[2];
    expect(chordRow).toMatchObject({
      kind: "chords",
      text: "             ( C7          B7 )        Em7      E7",
    });
    expect(
      chordRow?.tokens.filter((token) => token.kind === "ChordToken"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "C7" }),
        expect.objectContaining({ text: "B7" }),
        expect.objectContaining({ text: "Em7" }),
        expect.objectContaining({ text: "E7" }),
      ]),
    );
    expect(
      chordRow?.tokens.filter((token) => token.kind === "DecorationToken"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "(" }),
        expect.objectContaining({ text: ")" }),
      ]),
    );
    expect(chordRow?.tokens.some((token) => token.kind === "LyricToken")).toBe(
      false,
    );
    expect(result.chordsFound).toEqual(
      expect.arrayContaining(["A7", "Em7", "C7", "B7", "E7"]),
    );
    expect(result.diagnostics).toEqual([]);
  });

  it("tokenizes glued parentheses around chord symbols", () => {
    const result = parseTab("(C7)    C7)    (C7");

    const line = result.sections[0]?.lines[0];
    expect(line?.kind).toBe("chords");
    expect(line?.tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "DecorationToken", text: "(" }),
        expect.objectContaining({ kind: "ChordToken", text: "C7" }),
        expect.objectContaining({ kind: "DecorationToken", text: ")" }),
      ]),
    );
  });

  it("keeps a tie between one chord and one lyric word as lyrics", () => {
    const result = parseTab("Am7 texto");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      kind: "lyrics",
    });
  });

  it("classifies a tie with only chord and decoration tokens as chords", () => {
    const result = parseTab("C7 (");

    expect(result.sections[0]?.lines[0]).toMatchObject({
      kind: "chords",
    });
  });

  it("parses slash alteration chords such as D7/9", () => {
    const result = parseTab(
      "      Am7        D7/9         Gmaj7\nLogo agora que eu já me fiz primeiro",
    );

    const chordRow = result.sections[0]?.lines[0];
    expect(chordRow?.tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "ChordToken", text: "D7/9" }),
      ]),
    );
    expect(result.chordsFound).toEqual(["Am7", "D7/9", "Gmaj7"]);
    expect(result.diagnostics).toEqual([]);
  });

  it("keeps chord extensions such as C7(13) in a single ChordToken", () => {
    const result = parseTab(
      "                  C7(13)       B7(9)       Em7\nLinha",
    );

    const chordRow = result.sections[0]?.lines[0];
    expect(chordRow?.kind).toBe("chords");
    expect(
      chordRow?.tokens.filter((token) => token.kind === "ChordToken"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: "C7(13)" }),
        expect.objectContaining({ text: "B7(9)" }),
        expect.objectContaining({ text: "Em7" }),
      ]),
    );
    expect(
      chordRow?.tokens.some((token) => token.kind === "DecorationToken"),
    ).toBe(false);
    expect(result.chordsFound).toEqual(["C7(13)", "B7(9)", "Em7"]);
  });
});
