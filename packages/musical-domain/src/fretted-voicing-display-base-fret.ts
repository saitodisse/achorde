import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";

const DEFAULT_VISIBLE_FRET_COUNT = 5;

function collectPressedFrets(
  voicing: Pick<FrettedInstrumentVoicing, "strings" | "barres">,
): number[] {
  const pressedFrets: number[] = [];

  for (const string of voicing.strings) {
    if (string.state === "fretted" && string.fret != null && string.fret > 0) {
      pressedFrets.push(string.fret);
    }
  }

  for (const barre of voicing.barres ?? []) {
    if (barre.fret > 0) {
      pressedFrets.push(barre.fret);
    }
  }

  return pressedFrets;
}

export function resolveVoicingDisplayBaseFret(
  voicing: Pick<FrettedInstrumentVoicing, "strings" | "barres">,
  visibleFretCount = DEFAULT_VISIBLE_FRET_COUNT,
): number | undefined {
  const pressedFrets = collectPressedFrets(voicing);

  if (pressedFrets.length === 0) {
    return undefined;
  }

  const maxFret = Math.max(...pressedFrets);
  if (maxFret <= visibleFretCount) {
    return undefined;
  }

  return Math.min(...pressedFrets);
}

export function normalizeVoicingDisplayBaseFret(
  voicing: FrettedInstrumentVoicing,
  visibleFretCount = DEFAULT_VISIBLE_FRET_COUNT,
): FrettedInstrumentVoicing {
  const baseFret = resolveVoicingDisplayBaseFret(voicing, visibleFretCount);

  if (baseFret === undefined) {
    const { baseFret: _ignored, ...rest } = voicing;
    return rest;
  }

  return {
    ...voicing,
    baseFret,
  };
}
