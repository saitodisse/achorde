import type { FretboardFrame } from "../layout/types.js";

export function buildHitAreas(frame: FretboardFrame): Array<{
	stringIndex: number;
	fret: number;
	hitRect: { x: number; y: number; width: number; height: number };
}> {
	return frame.cells.map((cell) => ({
		stringIndex: cell.stringIndex,
		fret: cell.fret,
		hitRect: cell.hitRect,
	}));
}
