import { describe, expect, it } from "vitest";
import { computeFretboardFrame } from "../layout/computeFretboardFrame.js";
import { hitTestFretCell } from "./hitTestFretCell.js";

describe("hitTestFretCell", () => {
	const frame = computeFretboardFrame({
		viewMode: { orientation: "horizontal", handedness: "right" },
		fretCount: 12,
		stringCount: 6,
		viewBoxWidth: 1100,
		viewBoxHeight: 250,
		padding: 24,
		minHitSize: 44,
	});

	it("hits a fretted cell for string 3 fret 5", () => {
		const cell = frame.cells.find((c) => c.stringIndex === 3 && c.fret === 5);
		expect(cell).toBeDefined();
		const hit = hitTestFretCell(frame, {
			x: cell!.center.x,
			y: cell!.center.y,
		});
		expect(hit).toEqual({ stringIndex: 3, fret: 5 });
	});

	it("returns null outside the grid", () => {
		expect(hitTestFretCell(frame, { x: 0, y: 0 })).toBeNull();
	});

	it("horizontal-left keeps canonical stringIndex for same physical string row", () => {
		const leftFrame = computeFretboardFrame({
			viewMode: { orientation: "horizontal", handedness: "left" },
			fretCount: 12,
			stringCount: 6,
			viewBoxWidth: 1100,
			viewBoxHeight: 250,
			padding: 24,
		});
		const rightCell = frame.cells.find((c) => c.stringIndex === 4 && c.fret === 2);
		const leftCell = leftFrame.cells.find((c) => c.stringIndex === 4 && c.fret === 2);
		expect(rightCell).toBeDefined();
		expect(leftCell).toBeDefined();

		const rightHit = hitTestFretCell(frame, rightCell!.center);
		const leftHit = hitTestFretCell(leftFrame, leftCell!.center);
		expect(rightHit).toEqual({ stringIndex: 4, fret: 2 });
		expect(leftHit).toEqual({ stringIndex: 4, fret: 2 });
	});
});
