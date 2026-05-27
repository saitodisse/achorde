import type { ParsedChordSymbol } from "./chord-symbol.js";

export type MusicTheoryAdapter = {
  transposePitchClass(note: string, semitones: number): string;
  parseChordSymbol(symbol: string): ParsedChordSymbol | null;
  getChordNotes(symbol: string): string[];
  detectChord(notes: string[]): string[];
};
