import type { FretboardEditorState } from "./voicingEditorState.js";
import type { TapTarget } from "./applyTap.js";

export const MIN_FINGER_INDEX = 1;
export const MAX_FINGER_INDEX = 4;

export function cycleFingerIndex(current: number | undefined): number {
	if (current === undefined || current < MIN_FINGER_INDEX || current >= MAX_FINGER_INDEX) {
		return MIN_FINGER_INDEX;
	}
	return current + 1;
}

export function isFrettedTarget(state: FretboardEditorState, target: TapTarget): boolean {
	const cell = state.cells.get(target.stringIndex);
	return cell?.state === "fretted" && cell.fret === target.fret;
}

export function applyFingerCycle(
	state: FretboardEditorState,
	target: TapTarget,
): FretboardEditorState | null {
	if (!isFrettedTarget(state, target)) {
		return null;
	}

	const cell = state.cells.get(target.stringIndex)!;
	const nextFinger = cycleFingerIndex(cell.finger);
	const nextCells = new Map(state.cells);
	nextCells.set(target.stringIndex, { ...cell, finger: nextFinger });

	return {
		cells: nextCells,
		stickyFinger: nextFinger,
	};
}

export function applyFingerStick(
	state: FretboardEditorState,
	target: TapTarget,
): FretboardEditorState | null {
	if (!isFrettedTarget(state, target)) {
		return null;
	}

	const stickyFinger = state.stickyFinger ?? MIN_FINGER_INDEX;
	const cell = state.cells.get(target.stringIndex)!;

	if (cell.finger === stickyFinger) {
		return null;
	}

	const nextCells = new Map(state.cells);
	nextCells.set(target.stringIndex, { ...cell, finger: stickyFinger });

	return {
		cells: nextCells,
		stickyFinger,
	};
}
