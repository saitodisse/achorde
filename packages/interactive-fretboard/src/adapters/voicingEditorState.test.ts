import { describe, expect, it } from "vitest";
import { parseFretNotationToVoicing } from "achorde-musical-domain";
import { editorStateToVoicing, voicingToEditorState } from "./voicingEditorState.js";

describe("voicing round-trip", () => {
	const openNotes = new Map<number, string>([
		[1, "E"],
		[2, "B"],
		[3, "G"],
		[4, "D"],
		[5, "A"],
		[6, "E"],
	]);

	it("preserves x32010 shape", () => {
		const voicing =
			parseFretNotationToVoicing({
				fretNotation: "x32010",
				chordSymbol: "C",
				id: "test",
			}) ?? null;

		expect(voicing).not.toBeNull();

		const state = voicingToEditorState(voicing!);
		const roundTrip = editorStateToVoicing(state, voicing!, openNotes);

		expect(roundTrip.strings.find((s) => s.stringIndex === 6)?.state).toBe("muted");
		expect(roundTrip.strings.find((s) => s.stringIndex === 1)?.state).toBe("open");
		expect(roundTrip.strings.find((s) => s.stringIndex === 2)?.fret).toBe(1);
	});
});
