import { describe, expect, it } from "vitest";
import { inferBarresFromFrettedVoicing } from "./fretted-barre-inference.js";
import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";

function createVoicing(
  strings: FrettedInstrumentVoicing["strings"],
): FrettedInstrumentVoicing {
  return {
    id: "voicing-test",
    instrumentId: "guitar",
    tuningId: "guitar-standard-eadgbe",
    chordSymbol: "F",
    strings,
    source: "manual",
    quality: "unknown",
  };
}

describe("inferBarresFromFrettedVoicing", () => {
  it("does not add barre when four or fewer fretted strings are pressed", () => {
    const voicing = createVoicing([
      { stringIndex: 1, openNote: "E", fret: 1, state: "fretted" },
      { stringIndex: 2, openNote: "A", fret: 1, state: "fretted" },
      { stringIndex: 3, openNote: "D", fret: 2, state: "fretted" },
      { stringIndex: 4, openNote: "G", fret: 3, state: "fretted" },
      { stringIndex: 5, openNote: "B", fret: null, state: "muted" },
      { stringIndex: 6, openNote: "E", fret: null, state: "muted" },
    ]);

    const result = inferBarresFromFrettedVoicing(voicing);
    expect(result.barres).toEqual([]);
  });

  it("adds barre when more than four fretted strings share the winning fret", () => {
    const voicing = createVoicing([
      { stringIndex: 1, openNote: "E", fret: 3, state: "fretted" },
      { stringIndex: 2, openNote: "A", fret: 3, state: "fretted" },
      { stringIndex: 3, openNote: "D", fret: 3, state: "fretted" },
      { stringIndex: 4, openNote: "G", fret: 3, state: "fretted" },
      { stringIndex: 5, openNote: "B", fret: 3, state: "fretted" },
      { stringIndex: 6, openNote: "E", fret: 5, state: "fretted" },
    ]);

    const result = inferBarresFromFrettedVoicing(voicing);
    expect(result.barres).toEqual([
      { fret: 3, fromStringIndex: 1, toStringIndex: 5 },
    ]);
  });

  it("keeps existing manual barres unchanged", () => {
    const voicing = createVoicing([
      { stringIndex: 1, openNote: "E", fret: 1, state: "fretted" },
      { stringIndex: 2, openNote: "A", fret: 1, state: "fretted" },
      { stringIndex: 3, openNote: "D", fret: 1, state: "fretted" },
      { stringIndex: 4, openNote: "G", fret: 1, state: "fretted" },
      { stringIndex: 5, openNote: "B", fret: 1, state: "fretted" },
      { stringIndex: 6, openNote: "E", fret: 1, state: "fretted" },
    ]);

    const withManualBarre = {
      ...voicing,
      barres: [{ fret: 1, fromStringIndex: 1, toStringIndex: 6, finger: 1 }],
    };

    const result = inferBarresFromFrettedVoicing(withManualBarre);
    expect(result.barres).toEqual(withManualBarre.barres);
  });
});
