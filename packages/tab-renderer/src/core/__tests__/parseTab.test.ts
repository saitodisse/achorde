import { describe, expect, it } from "vitest";
import { parseTab } from "../parseTab";
import { tuaFlorBody } from "../../test/stubs/tua-flor";

describe("parseTab", () => {
  it("parses the tua flor body into an explicit AST and flags invalid mixed lines", () => {
    const result = parseTab(tuaFlorBody);

    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.sections.some((section) => section.lines.length > 0)).toBe(true);
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
    expect(result.diagnostics.length).toBeGreaterThan(0);
    expect(result.diagnostics.some((diagnostic) => diagnostic.severity === "error")).toBe(true);
    expect(
      result.diagnostics.some(
        (diagnostic) => diagnostic.code === "chords-and-lyrics-on-same-line",
      ),
    ).toBe(true);
  });

  it("keeps section headers and line text in the parsed AST", () => {
    const result = parseTab(`[Verse]\nC\nLine`);

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0]?.title).toBe("Verse");
    expect(result.sections[0]?.lines[0]?.text).toBe("C");
    expect(result.sections[0]?.lines[1]?.text).toBe("Line");
    expect(result.chordsFound).toEqual(["C"]);
  });
});
