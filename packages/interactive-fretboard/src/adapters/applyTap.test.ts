import { describe, expect, it } from "vitest";
import { applyTapToEditorState } from "./applyTap.js";

describe("applyTapToEditorState", () => {
	it("cycles fret 0: empty → open → muted → empty", () => {
		let state = { cells: new Map() };

		state = applyTapToEditorState(state, { stringIndex: 2, fret: 0 });
		expect(state.cells.get(2)?.state).toBe("open");

		state = applyTapToEditorState(state, { stringIndex: 2, fret: 0 });
		expect(state.cells.get(2)?.state).toBe("muted");

		state = applyTapToEditorState(state, { stringIndex: 2, fret: 0 });
		expect(state.cells.has(2)).toBe(false);
	});

	it("toggles fretted note off when tapping same fret", () => {
		let state = applyTapToEditorState({ cells: new Map() }, { stringIndex: 3, fret: 5 });
		expect(state.cells.get(3)?.fret).toBe(5);

		state = applyTapToEditorState(state, { stringIndex: 3, fret: 5 });
		expect(state.cells.has(3)).toBe(false);
	});
});
