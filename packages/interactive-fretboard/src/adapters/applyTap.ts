import type { FretboardEditorState, FretEditorCell } from "./voicingEditorState.js";

export type TapTarget = {
	stringIndex: number;
	fret: number;
};

function getCell(state: FretboardEditorState, stringIndex: number): FretEditorCell | undefined {
	return state.cells.get(stringIndex);
}

/**
 * AC12 parity at fret 0: open → muted → remove (empty).
 * Fret ≥ 1: set fretted; same cell again clears string.
 */
export function applyTapToEditorState(
	state: FretboardEditorState,
	target: TapTarget,
): FretboardEditorState {
	const { stringIndex, fret } = target;
	const nextCells = new Map(state.cells);
	const existing = getCell(state, stringIndex);

	if (fret === 0) {
		if (!existing || existing.state === "empty") {
			nextCells.set(stringIndex, { stringIndex, fret: 0, state: "open" });
			return { cells: nextCells };
		}

		if (existing.state === "open" && existing.fret === 0) {
			nextCells.set(stringIndex, { stringIndex, fret: 0, state: "muted" });
			return { cells: nextCells };
		}

		if (existing.state === "muted" && existing.fret === 0) {
			nextCells.delete(stringIndex);
			return { cells: nextCells };
		}

		nextCells.set(stringIndex, { stringIndex, fret: 0, state: "open" });
		return { cells: nextCells };
	}

	if (existing && existing.state === "fretted" && existing.fret === fret) {
		nextCells.delete(stringIndex);
		return { cells: nextCells };
	}

	nextCells.set(stringIndex, { stringIndex, fret, state: "fretted" });
	return { cells: nextCells };
}
