import type { FrettedInstrumentString, FrettedInstrumentVoicing } from "@achorde/musical-domain";

export type FretEditorCellState = "empty" | "open" | "muted" | "fretted";

export type FretEditorCell = {
	stringIndex: number;
	fret: number;
	state: FretEditorCellState;
	finger?: number;
};

export type FretboardEditorState = {
	cells: Map<number, FretEditorCell>;
	/** Last finger index chosen via right-click; middle-click repeats this on other strings. */
	stickyFinger?: number;
};

function stringToCell(string: FrettedInstrumentString): FretEditorCell {
	if (string.state === "muted") {
		return { stringIndex: string.stringIndex, fret: 0, state: "muted" };
	}
	if (string.state === "open") {
		return { stringIndex: string.stringIndex, fret: 0, state: "open" };
	}
	const fret = string.fret ?? 0;
	return {
		stringIndex: string.stringIndex,
		fret,
		state: fret > 0 ? "fretted" : "open",
		...(string.finger !== undefined ? { finger: string.finger } : {}),
	};
}

export function voicingToEditorState(voicing: FrettedInstrumentVoicing): FretboardEditorState {
	const cells = new Map<number, FretEditorCell>();

	for (const string of voicing.strings) {
		cells.set(string.stringIndex, stringToCell(string));
	}

	const stickyFinger =
		voicing.strings.find((string) => string.finger !== undefined && string.finger >= 1)?.finger ??
		1;

	return { cells, stickyFinger };
}

export function editorStateToVoicing(
	state: FretboardEditorState,
	base: FrettedInstrumentVoicing,
	openNotesByString: Map<number, string>,
): FrettedInstrumentVoicing {
	const strings: FrettedInstrumentString[] = [];

	for (const [stringIndex, openNote] of openNotesByString) {
		const cell = state.cells.get(stringIndex);

		if (!cell || cell.state === "empty") {
			continue;
		}

		if (cell.state === "muted") {
			strings.push({
				stringIndex,
				openNote,
				fret: null,
				state: "muted",
				label: "x",
			});
			continue;
		}

		if (cell.state === "open") {
			strings.push({
				stringIndex,
				openNote,
				fret: 0,
				state: "open",
				label: "0",
			});
			continue;
		}

		strings.push({
			stringIndex,
			openNote,
			fret: cell.fret,
			state: "fretted",
			label: String(cell.fret),
			...(cell.finger !== undefined ? { finger: cell.finger } : {}),
		});
	}

	strings.sort((left, right) => left.stringIndex - right.stringIndex);

	return {
		...base,
		strings,
		// Barres are recomputed in applyChangePipeline (never carried over from base).
		barres: undefined,
	};
}
