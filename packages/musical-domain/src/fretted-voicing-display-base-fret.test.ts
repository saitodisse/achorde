import { describe, expect, it } from "vitest";
import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";
import {
  normalizeVoicingDisplayBaseFret,
  resolveVoicingDisplayBaseFret,
} from "./fretted-voicing-display-base-fret.js";

function voicing(
  strings: FrettedInstrumentVoicing["strings"],
  barres?: FrettedInstrumentVoicing["barres"],
  baseFret?: number,
): FrettedInstrumentVoicing {
  return {
    id: "test",
    instrumentId: "guitar",
    tuningId: "guitar-standard",
    chordSymbol: "X",
    strings,
    ...(barres ? { barres } : {}),
    ...(baseFret !== undefined ? { baseFret } : {}),
    source: "imported",
    quality: "recommended",
  };
}

describe("resolveVoicingDisplayBaseFret", () => {
  it("keeps diagrams at fret 1 when the shape fits within five visible frets", () => {
    const gMaj7OpenShape = voicing(
      [
        { stringIndex: 1, openNote: "E2", fret: 3, state: "fretted" },
        { stringIndex: 2, openNote: "A2", fret: 2, state: "fretted" },
        { stringIndex: 3, openNote: "D3", fret: 0, state: "open" },
        { stringIndex: 4, openNote: "G3", fret: 0, state: "open" },
        { stringIndex: 5, openNote: "B3", fret: 0, state: "open" },
        { stringIndex: 6, openNote: "E4", fret: 2, state: "fretted" },
      ],
      undefined,
      2,
    );

    expect(resolveVoicingDisplayBaseFret(gMaj7OpenShape)).toBeUndefined();
    expect(
      normalizeVoicingDisplayBaseFret(gMaj7OpenShape).baseFret,
    ).toBeUndefined();
  });

  it("keeps diagrams at fret 1 for muted-open shapes like Cmaj7 x32000", () => {
    const cMaj7 = voicing(
      [
        { stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
        { stringIndex: 2, openNote: "A2", fret: 3, state: "fretted" },
        { stringIndex: 3, openNote: "D3", fret: 2, state: "fretted" },
        { stringIndex: 4, openNote: "G3", fret: 0, state: "open" },
        { stringIndex: 5, openNote: "B3", fret: 0, state: "open" },
        { stringIndex: 6, openNote: "E4", fret: 0, state: "open" },
      ],
      undefined,
      2,
    );

    expect(resolveVoicingDisplayBaseFret(cMaj7)).toBeUndefined();
  });

  it("starts at the minimum fret when the shape exceeds five visible frets", () => {
    const highShape = voicing(
      [
        { stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
        { stringIndex: 2, openNote: "A2", fret: null, state: "muted" },
        { stringIndex: 3, openNote: "D3", fret: 5, state: "fretted" },
        { stringIndex: 4, openNote: "G3", fret: 5, state: "fretted" },
        { stringIndex: 5, openNote: "B3", fret: 5, state: "fretted" },
        { stringIndex: 6, openNote: "E4", fret: 7, state: "fretted" },
      ],
      [{ fret: 5, fromStringIndex: 3, toStringIndex: 5 }],
      5,
    );

    expect(resolveVoicingDisplayBaseFret(highShape)).toBe(5);
    expect(normalizeVoicingDisplayBaseFret(highShape).baseFret).toBe(5);
  });
});
