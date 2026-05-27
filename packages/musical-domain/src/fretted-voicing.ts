export type FrettedStringState = "fretted" | "open" | "muted";

export type VoicingSource = "manual" | "exact-recording" | "auto-generated" | "imported" | "community";

export type VoicingQuality = "exact" | "recommended" | "easy" | "fallback" | "unknown";

export type FrettedInstrumentString = {
  stringIndex: number;
  openNote: string;
  fret: number | null;
  state: FrettedStringState;
  finger?: number;
  label?: string;
};

export type FrettedInstrumentBarre = {
  fret: number;
  fromStringIndex: number;
  toStringIndex: number;
  finger?: number;
};

export type FrettedInstrumentVoicing = {
  id: string;
  instrumentId: string;
  tuningId: string;
  chordSymbol: string;
  strings: ReadonlyArray<FrettedInstrumentString>;
  barres?: ReadonlyArray<FrettedInstrumentBarre>;
  baseFret?: number;
  source: VoicingSource;
  quality: VoicingQuality;
};

