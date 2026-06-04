import { Note } from "tonal";

export function noteAtFret(openNote: string, fret: number): string {
	if (fret <= 0) {
		return openNote;
	}
	return Note.transpose(openNote, `${fret}m`) ?? openNote;
}
