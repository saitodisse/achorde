import { describe, expect, it } from "vitest";
import { pairLines } from "../pairLines";

describe("pairLines", () => {
  it("treats a lyric line with a chord-like word as lyrics", () => {
    const lines = pairLines("Amor Em");

    expect(lines[0]).toMatchObject({
      liricsTextBar: "Amor Em",
    });
    expect(lines[0]?.chordsTextBar?.trim()).toBe("");
  });

  it("keeps a real chord line as chords", () => {
    const lines = pairLines("Cm         /             Fm        Bb");

    expect(lines[0]).toMatchObject({
      chordsTextBar: "Cm         /             Fm        Bb",
    });
    expect(lines[0]?.liricsTextBar?.trim()).toBe("");
  });
});
