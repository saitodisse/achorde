import { describe, expect, it } from "vitest";
import {
  formatVoicingToFretNotation,
  parseFretNotationToVoicing,
} from "./fret-notation-parse.js";

describe("parseFretNotationToVoicing", () => {
  it("parses x32010 as a standard C major voicing with low E as string 1", () => {
    const voicing = parseFretNotationToVoicing({
      fretNotation: "x32010",
      chordSymbol: "C",
      id: "voicing-c",
    });

    expect(voicing).not.toBeNull();
    expect(voicing?.strings).toEqual([
      { stringIndex: 1, openNote: "E", fret: null, state: "muted" },
      { stringIndex: 2, openNote: "A", fret: 3, state: "fretted", label: "3" },
      { stringIndex: 3, openNote: "D", fret: 2, state: "fretted", label: "2" },
      { stringIndex: 4, openNote: "G", fret: 0, state: "open", label: "0" },
      { stringIndex: 5, openNote: "B", fret: 1, state: "fretted", label: "1" },
      { stringIndex: 6, openNote: "E", fret: 0, state: "open", label: "0" },
    ]);
  });

  it("parses Gb5 with the pressed strings on low E, A, and D", () => {
    const voicing = parseFretNotationToVoicing({
      fretNotation: "244xxx",
      chordSymbol: "Gb5",
      id: "voicing-gb5",
    });

    expect(voicing).not.toBeNull();
    expect(voicing?.strings).toEqual([
      { stringIndex: 1, openNote: "E", fret: 2, state: "fretted", label: "2" },
      { stringIndex: 2, openNote: "A", fret: 4, state: "fretted", label: "4" },
      { stringIndex: 3, openNote: "D", fret: 4, state: "fretted", label: "4" },
      { stringIndex: 4, openNote: "G", fret: null, state: "muted" },
      { stringIndex: 5, openNote: "B", fret: null, state: "muted" },
      { stringIndex: 6, openNote: "E", fret: null, state: "muted" },
    ]);
  });

  it("returns null for invalid length", () => {
    expect(
      parseFretNotationToVoicing({
        fretNotation: "x3201",
        chordSymbol: "C",
        id: "voicing-invalid",
      }),
    ).toBeNull();
  });

  it("round-trips through formatVoicingToFretNotation", () => {
    const voicing = parseFretNotationToVoicing({
      fretNotation: "320003",
      chordSymbol: "G",
      id: "voicing-g",
    });

    expect(voicing).not.toBeNull();
    expect(formatVoicingToFretNotation(voicing!)).toBe("320003");
  });
});
