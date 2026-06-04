import { inferBarresFromFrettedVoicing } from "./fretted-barre-inference.js";
import type { FrettedInstrumentVoicing } from "./fretted-voicing.js";

export function applyVoicingEditorPipeline(
  voicing: FrettedInstrumentVoicing,
): FrettedInstrumentVoicing {
  return inferBarresFromFrettedVoicing(voicing);
}
