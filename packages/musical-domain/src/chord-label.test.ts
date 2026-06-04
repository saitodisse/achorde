import { describe, expect, it } from "vitest";
import { normalizeChordSymbolLabel } from "./chord-label.js";

describe("normalizeChordSymbolLabel", () => {
  it("trims and collapses internal whitespace", () => {
    expect(normalizeChordSymbolLabel("  C   maj7  ")).toBe("C maj7");
  });

  it("applies NFKC normalization", () => {
    expect(normalizeChordSymbolLabel("C\uFB01")).toBe("Cfi");
  });

  it("replaces unicode sharps and flats", () => {
    expect(normalizeChordSymbolLabel("C♯maj7")).toBe("C#maj7");
    expect(normalizeChordSymbolLabel("B♭m7")).toBe("Bbm7");
  });

  it("preserves case so Cm6 and CM6 stay distinct", () => {
    expect(normalizeChordSymbolLabel("Cm6")).toBe("Cm6");
    expect(normalizeChordSymbolLabel("CM6")).toBe("CM6");
    expect(normalizeChordSymbolLabel("Cm6")).not.toBe(
      normalizeChordSymbolLabel("CM6"),
    );
  });

  it("leaves ASCII accidentals unchanged", () => {
    expect(normalizeChordSymbolLabel("C#aug9")).toBe("C#aug9");
    expect(normalizeChordSymbolLabel("Am/G")).toBe("Am/G");
    expect(normalizeChordSymbolLabel("C7#11")).toBe("C7#11");
  });
});
