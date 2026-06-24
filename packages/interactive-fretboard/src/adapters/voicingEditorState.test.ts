import { describe, expect, it } from "vitest";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";
import { editorStateToVoicing, voicingToEditorState } from "./voicingEditorState.js";

describe("voicing round-trip", () => {
	const openNotes = new Map<number, string>([
		[1, "E"],
		[2, "A"],
		[3, "D"],
		[4, "G"],
		[5, "B"],
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

		expect(roundTrip.strings.find((s) => s.stringIndex === 1)?.state).toBe("muted");
		expect(roundTrip.strings.find((s) => s.stringIndex === 6)?.state).toBe("open");
		expect(roundTrip.strings.find((s) => s.stringIndex === 5)?.fret).toBe(1);
	});

	it("preserves finger assignments on round-trip", () => {
		const voicing =
			parseFretNotationToVoicing({
				fretNotation: "320003",
				chordSymbol: "G",
				id: "test",
			}) ?? null;

		expect(voicing).not.toBeNull();

		const frettedStringIndex =
			voicing!.strings.find((string) => string.state === "fretted")?.stringIndex ?? 0;
		expect(frettedStringIndex).toBeGreaterThan(0);

		const withFingers = {
			...voicing!,
			strings: voicing!.strings.map((string) =>
				string.stringIndex === frettedStringIndex ? { ...string, finger: 2 } : string,
			),
		};

		const state = voicingToEditorState(withFingers);
		const roundTrip = editorStateToVoicing(state, withFingers, openNotes);

		expect(roundTrip.strings.find((s) => s.stringIndex === frettedStringIndex)?.finger).toBe(2);
		expect(state.stickyFinger).toBe(2);
	});
});
