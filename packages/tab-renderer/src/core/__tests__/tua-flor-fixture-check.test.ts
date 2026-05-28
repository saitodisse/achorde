import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseTab } from "../parseTab";

const body = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    "../../test/stubs/tua-flor.txt",
  ),
  "utf8",
);

describe("tua-flor fixture lines for stories", () => {
  it("finds lines used by story-tua-flor.ts", () => {
    const song = parseTab(body);
    const section = song.sections[0];
    expect(section).toBeDefined();

    const preds = {
      chordOnly: (line: (typeof section.lines)[number]) =>
        line.tokens.some((t) => t.kind === "ChordToken") &&
        !line.tokens.some((t) => t.kind === "LyricToken") &&
        !line.tokens.some((t) => t.kind === "DecorationToken"),
      lyricOnly: (line: (typeof section.lines)[number]) =>
        line.tokens.every(
          (t) => t.kind === "LyricToken" || t.kind === "SpaceToken",
        ) && line.tokens.some((t) => t.kind === "LyricToken"),
      chordDense: (line: (typeof section.lines)[number]) =>
        line.text.includes("A7") && line.text.includes("Em7"),
      lyricDense: (line: (typeof section.lines)[number]) =>
        line.text.includes("maré mansa"),
      withParens: (line: (typeof section.lines)[number]) =>
        line.text.includes("C7") && line.text.includes("B7"),
    };

    for (const [name, predicate] of Object.entries(preds)) {
      expect(section.lines.find(predicate), name).toBeDefined();
    }
  });
});
