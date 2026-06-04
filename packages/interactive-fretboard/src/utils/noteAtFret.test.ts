import { describe, expect, it } from "vitest";
import { noteAtFret } from "./noteAtFret.js";

const pitchClass = (note: string) => note.replace(/\d/g, "");

describe("noteAtFret", () => {
	it("returns open note at fret 0", () => {
		expect(noteAtFret("E4", 0)).toBe("E4");
		expect(noteAtFret("B", 0)).toBe("B");
	});

	it("transposes standard tuning up by one semitone at fret 1", () => {
		const openHighToLow = ["E", "B", "G", "D", "A", "E"];
		const atFret1 = openHighToLow.map((n) => pitchClass(noteAtFret(n, 1)));

		expect(atFret1).toEqual(["F", "C", "Ab", "Eb", "Bb", "F"]);
	});

	it("transposes up two semitones at fret 2", () => {
		expect(pitchClass(noteAtFret("E", 2))).toBe("F#");
		expect(pitchClass(noteAtFret("G", 2))).toBe("A");
	});
});
