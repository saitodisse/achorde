import type { FretboardFrame } from "../layout/types.js";

function pointInRect(
	x: number,
	y: number,
	rect: { x: number; y: number; width: number; height: number },
): boolean {
	return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

export function hitTestFretCell(
	frame: FretboardFrame,
	point: { x: number; y: number },
): { stringIndex: number; fret: number } | null {
	const { x, y } = point;
	const { grid } = frame;

	if (x < grid.x || x > grid.x + grid.width || y < grid.y || y > grid.y + grid.height) {
		return null;
	}

	let best: { stringIndex: number; fret: number; distance: number } | null = null;

	for (const cell of frame.cells) {
		if (!pointInRect(x, y, cell.hitRect)) {
			continue;
		}

		const dx = x - cell.center.x;
		const dy = y - cell.center.y;
		const distance = dx * dx + dy * dy;

		if (!best || distance < best.distance) {
			best = { stringIndex: cell.stringIndex, fret: cell.fret, distance };
		}
	}

	if (!best) {
		return null;
	}

	return { stringIndex: best.stringIndex, fret: best.fret };
}
