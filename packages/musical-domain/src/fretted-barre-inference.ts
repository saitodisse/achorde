import type {
  FrettedInstrumentBarre,
  FrettedInstrumentVoicing,
} from "./fretted-voicing.js";

function detectBarreFromVoicing(
  voicing: FrettedInstrumentVoicing,
): FrettedInstrumentBarre | null {
  const pressedStrings = voicing.strings.filter(
    (string) => string.state === "fretted" && (string.fret ?? 0) > 0,
  );

  if (pressedStrings.length <= 4) {
    return null;
  }

  const stringsByFret = new Map<number, typeof pressedStrings>();
  for (const string of pressedStrings) {
    const fret = string.fret ?? 0;
    const bucket = stringsByFret.get(fret) ?? [];
    bucket.push(string);
    stringsByFret.set(fret, bucket);
  }

  let maxFret = 0;
  let maxCount = 0;

  const sortedFrets = [...stringsByFret.entries()].sort(
    (left, right) => left[0] - right[0],
  );

  for (const [fret, stringsAtFret] of sortedFrets) {
    if (stringsAtFret.length > maxCount) {
      maxFret = fret;
      maxCount = stringsAtFret.length;
    }
  }

  if (maxFret === 0) {
    return null;
  }

  const stringsAtFret = stringsByFret.get(maxFret) ?? [];
  const stringIndexes = stringsAtFret
    .map((string) => string.stringIndex)
    .sort((left, right) => left - right);

  return {
    fret: maxFret,
    fromStringIndex: stringIndexes[0] ?? 1,
    toStringIndex: stringIndexes[stringIndexes.length - 1] ?? 1,
  };
}

export function inferBarresFromFrettedVoicing(
  voicing: FrettedInstrumentVoicing,
): FrettedInstrumentVoicing {
  if (voicing.barres && voicing.barres.length > 0) {
    return voicing;
  }

  const barre = detectBarreFromVoicing(voicing);
  if (!barre) {
    return { ...voicing, barres: [] };
  }

  return {
    ...voicing,
    barres: [barre],
  };
}
