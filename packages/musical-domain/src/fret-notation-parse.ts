import {
  GUITAR_STANDARD_EADGBE_OPEN_NOTES,
  GUITAR_STANDARD_INSTRUMENT_ID,
  GUITAR_STANDARD_TUNING_ID,
} from "./guitar-standard-tuning.js";
import type {
  FrettedInstrumentString,
  FrettedInstrumentVoicing,
} from "./fretted-voicing.js";

export type ParseFretNotationInput = {
  fretNotation: string;
  chordSymbol: string;
  instrumentId?: string;
  tuningId?: string;
  id: string;
};

function parseFretCharacter(
  character: string,
  stringIndex: number,
  openNote: string,
): FrettedInstrumentString | null {
  const normalized = character.trim();

  if (normalized === "x" || normalized === "X") {
    return {
      stringIndex,
      openNote,
      fret: null,
      state: "muted",
    };
  }

  if (normalized === "o" || normalized === "O" || normalized === "0") {
    return {
      stringIndex,
      openNote,
      fret: 0,
      state: "open",
      label: "0",
    };
  }

  const fret = Number.parseInt(normalized, 10);
  if (!Number.isFinite(fret) || fret < 0 || fret > 9) {
    return null;
  }

  if (fret === 0) {
    return {
      stringIndex,
      openNote,
      fret: 0,
      state: "open",
      label: "0",
    };
  }

  return {
    stringIndex,
    openNote,
    fret,
    state: "fretted",
    label: String(fret),
  };
}

/**
 * Parses guitar fret notation with one character per string, low E (string 6) first.
 * Example: `x32010` → standard C major shape.
 */
export function parseFretNotationToVoicing(
  input: ParseFretNotationInput,
): FrettedInstrumentVoicing | null {
  const compact = input.fretNotation.trim();
  if (compact.length !== 6) {
    return null;
  }

  const strings: FrettedInstrumentString[] = [];

  for (let index = 0; index < 6; index += 1) {
    const stringIndex = 6 - index;
    const openNote =
      GUITAR_STANDARD_EADGBE_OPEN_NOTES[stringIndex - 1] ?? "E";
    const ch = compact[index] ?? "";
    const parsed = parseFretCharacter(ch, stringIndex, openNote);

    if (!parsed) {
      return null;
    }

    strings.push(parsed);
  }

  strings.sort((left, right) => left.stringIndex - right.stringIndex);

  return {
    id: input.id,
    instrumentId: input.instrumentId ?? GUITAR_STANDARD_INSTRUMENT_ID,
    tuningId: input.tuningId ?? GUITAR_STANDARD_TUNING_ID,
    chordSymbol: input.chordSymbol,
    strings,
    source: "manual",
    quality: "unknown",
  };
}

export function formatVoicingToFretNotation(
  voicing: Pick<FrettedInstrumentVoicing, "strings">,
): string {
  const byStringIndex = new Map(
    voicing.strings.map((string) => [string.stringIndex, string]),
  );

  let notation = "";

  for (let index = 0; index < 6; index += 1) {
    const stringIndex = 6 - index;
    const string = byStringIndex.get(stringIndex);

    if (!string || string.state === "muted") {
      notation += "x";
      continue;
    }

    if (string.state === "open" || string.fret === 0) {
      notation += "0";
      continue;
    }

    notation += String(string.fret ?? "x");
  }

  return notation;
}
