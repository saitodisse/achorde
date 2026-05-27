import { parseTab } from "../../core";
import type { ParsedTab, ParsedTabLine } from "../../core";
import { tuaFlorBody } from "../../test/stubs/tua-flor";

export { tuaFlorBody };

export const tuaFlorSong = parseTab(tuaFlorBody);

export const tuaFlorSection = tuaFlorSong.sections[0];

/** Body with a section header so TabSection renders an &lt;h2&gt;. */
export const tuaFlorTitledBody = `[Verse]\n${tuaFlorBody}`;

export const tuaFlorTitledSong = parseTab(tuaFlorTitledBody);

export function countTokens(song: ParsedTab): number {
  return song.sections.reduce(
    (n, section) =>
      n + section.lines.reduce((m, line) => m + line.tokens.length, 0),
    0,
  );
}

export function findLine(
  predicate: (line: ParsedTabLine, index: number) => boolean,
): ParsedTabLine {
  const line = tuaFlorSection.lines.find(predicate);
  if (!line) {
    throw new Error("Expected line not found in tua-flor fixture");
  }
  return line;
}

export const tuaFlorLines = {
  chordOnly: findLine(
    (line) =>
      line.tokens.some((t) => t.kind === "ChordToken") &&
      !line.tokens.some((t) => t.kind === "LyricToken"),
  ),
  lyricOnly: findLine(
    (line) =>
      line.tokens.every(
        (t) => t.kind === "LyricToken" || t.kind === "SpaceToken",
      ) && line.tokens.some((t) => t.kind === "LyricToken"),
  ),
  chordDense: findLine(
    (line) => line.text.includes("A7") && line.text.includes("Em7"),
  ),
  lyricDense: findLine((line) => line.text.includes("maré mansa")),
  withParens: findLine(
    (line) => line.text.includes("C7") && line.text.includes("B7"),
  ),
};
