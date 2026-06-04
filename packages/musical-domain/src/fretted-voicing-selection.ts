import type {
  FrettedInstrumentVoicing,
  VoicingQuality,
  VoicingSource,
} from "./fretted-voicing.js";

function voicingQualityRank(quality: VoicingQuality): number {
  switch (quality) {
    case "exact":
      return 0;
    case "recommended":
      return 1;
    case "easy":
      return 2;
    case "fallback":
      return 3;
    case "unknown":
      return 4;
    default:
      return 5;
  }
}

function voicingSourceRank(source: VoicingSource): number {
  switch (source) {
    case "exact-recording":
      return 0;
    case "manual":
      return 1;
    case "community":
      return 2;
    case "imported":
      return 3;
    case "auto-generated":
      return 4;
    default:
      return 5;
  }
}

export function compareFrettedVoicings(
  left: FrettedInstrumentVoicing,
  right: FrettedInstrumentVoicing,
): number {
  return (
    voicingQualityRank(left.quality) - voicingQualityRank(right.quality) ||
    voicingSourceRank(left.source) - voicingSourceRank(right.source) ||
    (left.baseFret ?? 1) - (right.baseFret ?? 1) ||
    left.id.localeCompare(right.id)
  );
}

export function selectPreferredFrettedVoicing(
  voicings: ReadonlyArray<FrettedInstrumentVoicing>,
): FrettedInstrumentVoicing | null {
  if (voicings.length === 0) {
    return null;
  }

  return [...voicings].sort(compareFrettedVoicings)[0] ?? null;
}
