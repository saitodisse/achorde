import { describe, expect, it } from "vitest";
import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";
import {
  compareFrettedVoicings,
  selectPreferredFrettedVoicing,
} from "./fretted-voicing-selection.js";

function voicing(
  partial: Partial<FrettedInstrumentVoicing> &
    Pick<FrettedInstrumentVoicing, "id" | "quality" | "source">,
): FrettedInstrumentVoicing {
  return {
    instrumentId: "guitar",
    tuningId: "standard",
    chordSymbol: "C",
    strings: [],
    ...partial,
  };
}

describe("compareFrettedVoicings", () => {
  it("ranks VoicingQuality before source, baseFret, and id", () => {
    const exact = voicing({
      id: "z",
      quality: "exact",
      source: "auto-generated",
      baseFret: 9,
    });
    const recommended = voicing({
      id: "a",
      quality: "recommended",
      source: "exact-recording",
      baseFret: 1,
    });

    expect(compareFrettedVoicings(exact, recommended)).toBeLessThan(0);
  });

  it("ranks VoicingSource when quality matches", () => {
    const manual = voicing({
      id: "b",
      quality: "recommended",
      source: "manual",
    });
    const imported = voicing({
      id: "a",
      quality: "recommended",
      source: "imported",
    });

    expect(compareFrettedVoicings(manual, imported)).toBeLessThan(0);
  });

  it("uses baseFret ascending when quality and source match", () => {
    const low = voicing({
      id: "b",
      quality: "easy",
      source: "community",
      baseFret: 1,
    });
    const high = voicing({
      id: "a",
      quality: "easy",
      source: "community",
      baseFret: 5,
    });

    expect(compareFrettedVoicings(low, high)).toBeLessThan(0);
  });

  it("defaults missing baseFret to 1", () => {
    const implicit = voicing({
      id: "b",
      quality: "fallback",
      source: "imported",
    });
    const explicit = voicing({
      id: "a",
      quality: "fallback",
      source: "imported",
      baseFret: 2,
    });

    expect(compareFrettedVoicings(implicit, explicit)).toBeLessThan(0);
  });

  it("breaks ties by id lexicographically", () => {
    const left = voicing({
      id: "a-voicing",
      quality: "unknown",
      source: "auto-generated",
      baseFret: 3,
    });
    const right = voicing({
      id: "b-voicing",
      quality: "unknown",
      source: "auto-generated",
      baseFret: 3,
    });

    expect(compareFrettedVoicings(left, right)).toBeLessThan(0);
  });
});

describe("selectPreferredFrettedVoicing", () => {
  it("returns null for an empty list", () => {
    expect(selectPreferredFrettedVoicing([])).toBeNull();
  });

  it("returns the best-ranked voicing", () => {
    const candidates = [
      voicing({ id: "c", quality: "unknown", source: "imported" }),
      voicing({ id: "a", quality: "exact", source: "imported" }),
      voicing({ id: "b", quality: "recommended", source: "manual" }),
    ];

    expect(selectPreferredFrettedVoicing(candidates)?.id).toBe("a");
  });
});
