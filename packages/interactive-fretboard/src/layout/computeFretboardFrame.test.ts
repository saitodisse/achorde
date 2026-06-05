import { describe, expect, it } from "vitest";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";
import { voicingToEditorState } from "../adapters/voicingEditorState.js";
import { computeFretboardFrame } from "./computeFretboardFrame.js";

const frameDefaults = {
	viewMode: { orientation: "horizontal" as const, handedness: "right" as const },
	fretCount: 6,
	stringCount: 6,
	viewBoxWidth: 1100,
	viewBoxHeight: 250,
	padding: 24,
	minHitSize: 44,
};

describe("computeFretboardFrame", () => {
	it("places fret 1 dot in the space between nut and first fret wire (C major string 2)", () => {
		const voicing =
			parseFretNotationToVoicing({
				fretNotation: "x32010",
				chordSymbol: "C",
				id: "test",
			}) ?? null;
		expect(voicing).not.toBeNull();

		const frame = computeFretboardFrame(frameDefaults);
		const nutX = frame.frets[0]!.x1;
		const firstWireX = frame.frets[1]!.x1;
		const cell = frame.cells.find((c) => c.stringIndex === 2 && c.fret === 1);
		expect(cell).toBeDefined();
		expect(cell!.center.x).toBeGreaterThan(nutX);
		expect(cell!.center.x).toBeLessThan(firstWireX);
		expect(cell!.center.x).toBeCloseTo((nutX + firstWireX) / 2, 0);

		const state = voicingToEditorState(voicing!);
		const editorFret = state.cells.get(2)?.fret;
		expect(editorFret).toBe(1);
	});

	it("shifts the nut along the fret axis when nutInset is set", () => {
		const base = computeFretboardFrame(frameDefaults);
		const inset = computeFretboardFrame({ ...frameDefaults, nutInset: 40 });
		expect(inset.grid.x).toBe(base.grid.x + 40);
		expect(inset.frets[0]!.x1).toBe(base.frets[0]!.x1 + 40);
	});

	it("uses a compact vertical viewBox height from fret count", () => {
		const frame = computeFretboardFrame({
			viewMode: { orientation: "vertical", handedness: "right" },
			fretCount: 5,
			stringCount: 6,
			viewBoxWidth: 400,
			padding: 24,
		});
		expect(frame.viewBox.height).toBeLessThan(500);
		expect(frame.viewBox.height).toBeGreaterThan(300);
	});

	it("keeps fret 0 hit region at the nut, not over the first fret space", () => {
		const frame = computeFretboardFrame(frameDefaults);
		const nutX = frame.frets[0]!.x1;
		const firstWireX = frame.frets[1]!.x1;
		const firstFretMid = (nutX + firstWireX) / 2;

		const nutCell = frame.cells.find((c) => c.stringIndex === 2 && c.fret === 0);
		const fret1Cell = frame.cells.find((c) => c.stringIndex === 2 && c.fret === 1);
		expect(nutCell).toBeDefined();
		expect(fret1Cell).toBeDefined();

		expect(nutCell!.center.x).toBeCloseTo(nutX, 0);
		expect(fret1Cell!.center.x).toBeCloseTo(firstFretMid, 0);
		expect(fret1Cell!.hitRect.x).toBeLessThanOrEqual(nutX + 1);
		expect(fret1Cell!.hitRect.x + fret1Cell!.hitRect.width).toBeGreaterThanOrEqual(firstWireX - 1);
	});
});
