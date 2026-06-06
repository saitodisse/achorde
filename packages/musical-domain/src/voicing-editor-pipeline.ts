import { inferBarresFromFrettedVoicing } from "./fretted-barre-inference.js";
import { normalizeVoicingDisplayBaseFret } from "./fretted-voicing-display-base-fret.js";
import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";

export function applyVoicingEditorPipeline(
  voicing: FrettedInstrumentVoicing,
): FrettedInstrumentVoicing {
  return normalizeVoicingDisplayBaseFret(
    inferBarresFromFrettedVoicing(voicing),
  );
}
