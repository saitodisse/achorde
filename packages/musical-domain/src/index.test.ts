import { describe, expect, it } from "vitest";
import { ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION } from "./versions.js";
import type {
  FrettedInstrumentVoicing,
  ParsedTab,
  ParsedTabLineKind,
} from "./index.js";

const STRICT_LINE_KINDS = [
  "section-header",
  "chords",
  "lyrics",
  "blank",
] as const satisfies readonly ParsedTabLineKind[];

describe("achorde-musical-domain", () => {
  it("exports the contract version", () => {
    expect(ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION).toBe("0.3.3");
  });

  it("accepts only strict ParsedTabLineKind values", () => {
    const kinds: ParsedTabLineKind[] = [...STRICT_LINE_KINDS];
    expect(kinds).toHaveLength(4);
  });

  it("accepts a parsed tab contract", () => {
    const tab = {
      body: "[Verse]\nC\nLine",
      sections: [],
      diagnostics: [],
      parserVersion: "1.0.0",
      astVersion: "1.0.0",
      chordsFound: ["C"],
    } satisfies ParsedTab;

    expect(tab.body).toContain("[Verse]");
  });

  it("accepts ParsedTab with invalid line and error diagnostic", () => {
    const tab = {
      body: "# comment line",
      sections: [
        {
          id: "section-0",
          order: 0,
          title: null,
          originalTitle: null,
          lines: [
            {
              id: "line-0",
              order: 0,
              text: "# comment line",
              kind: "chords",
              tokens: [],
            },
          ],
        },
      ],
      diagnostics: [
        {
          code: "invalid-line",
          message: "Comments are not allowed in strict chord charts.",
          severity: "error",
          line: 1,
        },
      ],
      parserVersion: "1.0.0",
      astVersion: "1.0.0",
      chordsFound: [],
    } satisfies ParsedTab;

    expect(tab.diagnostics[0]?.severity).toBe("error");
    expect(tab.diagnostics[0]?.code).toBe("invalid-line");
  });

  it("accepts a fretted voicing contract", () => {
    const voicing = {
      id: "voicing-c-major",
      instrumentId: "guitar",
      tuningId: "standard",
      chordSymbol: "C",
      strings: [
        { stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
        {
          stringIndex: 2,
          openNote: "A2",
          fret: 3,
          state: "fretted",
          finger: 3,
        },
        {
          stringIndex: 3,
          openNote: "D3",
          fret: 2,
          state: "fretted",
          finger: 2,
        },
        { stringIndex: 4, openNote: "G3", fret: 0, state: "open" },
        {
          stringIndex: 5,
          openNote: "B3",
          fret: 1,
          state: "fretted",
          finger: 1,
        },
        { stringIndex: 6, openNote: "E4", fret: 0, state: "open" },
      ],
      source: "manual",
      quality: "exact",
    } satisfies FrettedInstrumentVoicing;

    expect(voicing.chordSymbol).toBe("C");
  });
});
