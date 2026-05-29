import { describe, expect, it } from "vitest";
import { parseTab } from "../parseTab";
import { tuaFlorBody } from "../../test/stubs/tua-flor";

describe("parseTab", () => {
  it("parses the tua flor body into an explicit AST with chordsFound", () => {
    const result = parseTab(tuaFlorBody);

    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.sections.some((section) => section.lines.length > 0)).toBe(
      true,
    );
    expect(
      result.sections.some((section) =>
        section.lines.some((line) =>
          line.tokens.some((token) => token.kind === "ChordToken"),
        ),
      ),
    ).toBe(true);
    expect(
      result.sections.some((section) =>
        section.lines.some((line) =>
          line.tokens.some((token) => token.kind === "LyricToken"),
        ),
      ),
    ).toBe(true);
    expect(result.chordsFound.length).toBeGreaterThan(0);
    expect(result.chordsFound[0]).toBe("Em7");
    expect(
      result.diagnostics.some(
        (diagnostic) => diagnostic.code === "chords-and-lyrics-on-same-line",
      ),
    ).toBe(false);
  });

  it("keeps section headers and line text in the parsed AST", () => {
    const result = parseTab(`[Verse]\nC\nLine`);

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]?.title).toBe("Verse");
    expect(result.sections[0]?.lines[0]).toMatchObject({
      text: "[Verse]",
      kind: "section-header",
    });
    expect(result.sections[0]?.lines[1]?.text).toBe("C");
    expect(result.sections[0]?.lines[2]?.text).toBe("Line");
    expect(result.chordsFound).toEqual(["C"]);
  });

  it("does not list lyric words such as Eu in chordsFound (tua-flor opening)", () => {
    const result = parseTab("       Em7\nEu sei");

    expect(result.chordsFound).toEqual(["Em7"]);
    expect(result.sections[0]?.lines[1]).toMatchObject({
      kind: "lyrics",
      text: "Eu sei",
    });
    expect(
      result.sections[0]?.lines[1]?.tokens.every(
        (token) => token.kind !== "ChordToken",
      ),
    ).toBe(true);
  });
});
