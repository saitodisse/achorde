import { Interval, Note } from "tonal";

export function noteAtFret(openNote: string, fret: number): string {
	if (fret <= 0) {
		return openNote;
	}
	const interval = Interval.fromSemitones(fret);
	return Note.transpose(openNote, interval) ?? openNote;
}
