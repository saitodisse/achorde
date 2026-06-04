import { detect } from "@tonaljs/chord-detect";
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";
import { noteAtFret } from "../utils/noteAtFret.js";

export function pressedNotesFromVoicing(
	voicing: FrettedInstrumentVoicing,
	openNotesByString: Map<number, string>,
): string[] {
	const notes: string[] = [];

	for (const string of voicing.strings) {
		if (string.state === "muted") {
			continue;
		}

		const openNote = openNotesByString.get(string.stringIndex) ?? string.openNote;
		const fret = string.state === "open" ? 0 : (string.fret ?? 0);
		notes.push(noteAtFret(openNote, fret));
	}

	return notes;
}

export function detectChordFromVoicing(
	voicing: FrettedInstrumentVoicing,
	openNotesByString: Map<number, string>,
): string | undefined {
	const notes = pressedNotesFromVoicing(voicing, openNotesByString);
	if (notes.length < 3) {
		return undefined;
	}

	const detected = detect(notes);
	return detected[0] ?? undefined;
}
