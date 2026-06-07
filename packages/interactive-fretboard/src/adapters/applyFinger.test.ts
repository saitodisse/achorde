import { describe, expect, it } from "vitest";
import { applyFingerCycle, applyFingerStick, cycleFingerIndex } from "./applyFinger.js";
import type { FretboardEditorState } from "./voicingEditorState.js";

function frettedState(
	cells: Array<{ stringIndex: number; fret: number; finger?: number }>,
	stickyFinger = 1,
): FretboardEditorState {
	const map = new Map(
		cells.map(({ stringIndex, fret, finger }) => [
			stringIndex,
			{ stringIndex, fret, state: "fretted" as const, ...(finger === undefined ? {} : { finger }) },
		]),
	);
	return { cells: map, stickyFinger };
}

describe("cycleFingerIndex", () => {
	it("cycles 1 through 4 and wraps", () => {
		expect(cycleFingerIndex(undefined)).toBe(1);
		expect(cycleFingerIndex(1)).toBe(2);
		expect(cycleFingerIndex(4)).toBe(1);
	});
});

describe("applyFingerCycle", () => {
	it("assigns finger 1 then cycles on the same fretted cell", () => {
		let state = frettedState([{ stringIndex: 3, fret: 2 }]);

		state = applyFingerCycle(state, { stringIndex: 3, fret: 2 })!;
		expect(state.cells.get(3)?.finger).toBe(1);
		expect(state.stickyFinger).toBe(1);

		state = applyFingerCycle(state, { stringIndex: 3, fret: 2 })!;
		expect(state.cells.get(3)?.finger).toBe(2);
		expect(state.stickyFinger).toBe(2);
	});

	it("ignores non-fretted targets", () => {
		const state = frettedState([{ stringIndex: 3, fret: 2 }]);
		expect(applyFingerCycle(state, { stringIndex: 3, fret: 3 })).toBeNull();
		expect(applyFingerCycle(state, { stringIndex: 4, fret: 2 })).toBeNull();
	});
});

describe("applyFingerStick", () => {
	it("copies stickyFinger onto another fretted string", () => {
		const state = frettedState(
			[
				{ stringIndex: 2, fret: 3, finger: 3 },
				{ stringIndex: 4, fret: 2 },
			],
			3,
		);

		const next = applyFingerStick(state, { stringIndex: 4, fret: 2 });
		expect(next?.cells.get(4)?.finger).toBe(3);
		expect(next?.stickyFinger).toBe(3);
	});

	it("is a no-op when the finger already matches stickyFinger", () => {
		const state = frettedState([{ stringIndex: 2, fret: 3, finger: 2 }], 2);
		expect(applyFingerStick(state, { stringIndex: 2, fret: 3 })).toBeNull();
	});
});
