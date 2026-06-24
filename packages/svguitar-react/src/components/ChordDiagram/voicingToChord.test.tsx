import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";
import { ChordDiagram } from "./ChordDiagram";
import {
	voicingStringToDiagramString,
	voicingToChord,
	voicingToDiagramTuning,
	voicingToInstrument,
} from "./utils";
import { verticalLeftEngine } from "./layouts/verticalLeft";
import { verticalRightEngine } from "./layouts/verticalRight";
import type { LayoutFrame } from "./types";
import { DEFAULT_CHORD_STYLE } from "./constants";

describe("voicingStringToDiagramString", () => {
	it("keeps domain string indices on the diagram axis", () => {
		expect(voicingStringToDiagramString(1, 6)).toBe(1);
		expect(voicingStringToDiagramString(6, 6)).toBe(6);
	});
});

describe("voicingToDiagramTuning", () => {
	it("orders tuning low E first for diagram string 1", () => {
		const voicing =
			parseFretNotationToVoicing({
				fretNotation: "x32010",
				chordSymbol: "C",
				id: "c",
			}) ?? null;
		expect(voicing).not.toBeNull();
		expect(voicingToDiagramTuning(voicing!)[0]).toMatch(/^E/i);
		expect(voicingToInstrument(voicing!).chord).toBe("x32010");
	});
});

describe("voicingToChord", () => {
	it("keeps domain barre string range on the diagram axis for partial barre shapes", () => {
		const voicing = {
			id: "c",
			instrumentId: "guitar",
			tuningId: "guitar-standard-eadgbe",
			chordSymbol: "C",
			source: "manual" as const,
			quality: "unknown" as const,
			strings: [
				{ stringIndex: 1, openNote: "E", fret: 3, state: "fretted" as const },
				{ stringIndex: 2, openNote: "B", fret: 3, state: "fretted" as const },
				{ stringIndex: 3, openNote: "G", fret: 3, state: "fretted" as const },
				{ stringIndex: 4, openNote: "D", fret: 2, state: "fretted" as const },
				{ stringIndex: 5, openNote: "A", fret: null, state: "muted" as const },
				{ stringIndex: 6, openNote: "E", fret: null, state: "muted" as const },
			],
			barres: [{ fret: 3, fromStringIndex: 1, toStringIndex: 3 }],
		};

		const chord = voicingToChord(voicing);
		expect(chord.barres).toEqual([{ fret: 3, fromString: 1, toString: 3 }]);
	});

	it("places muted low E on diagram string 1 for x32010", () => {
		const voicing =
			parseFretNotationToVoicing({
				fretNotation: "x32010",
				chordSymbol: "C",
				id: "c",
			}) ?? null;
		expect(voicing).not.toBeNull();

		const chord = voicingToChord(voicing!);
		const muted = chord.fingers.find(f => f.is_muted);
		expect(muted?.string).toBe(1);
	});

	it("uses finger for dot text and ignores fret label on strings", () => {
		const voicing = {
			id: "c",
			instrumentId: "guitar",
			tuningId: "guitar-standard-eadgbe",
			chordSymbol: "G",
			source: "manual" as const,
			quality: "unknown" as const,
			strings: [
				{
					stringIndex: 2,
					openNote: "A",
					fret: 3,
					state: "fretted" as const,
					label: "3",
					finger: 2,
				},
			],
		};

		const chord = voicingToChord(voicing);
		expect(chord.fingers[0]?.text).toBe("2");
	});
});

describe("ChordDiagram voicing handedness", () => {
	const voicing =
		parseFretNotationToVoicing({
			fretNotation: "x32010",
			chordSymbol: "C",
			id: "c",
		}) ?? null;

	const frameStub = {
		gridOriginX: 0,
		gridOriginY: 0,
		gridWidth: 100,
		gridHeight: 200,
		stringCount: 6,
		fretCount: 4,
		firstFret: 1,
		style: {
			fretHeight: 40,
			fretWidth: 20,
			dotSize: 10,
			barreHeight: 8,
			barresWidth: 8,
			...DEFAULT_CHORD_STYLE,
		},
	} satisfies Partial<LayoutFrame> as LayoutFrame;

	it("vertical-right: low E (domain 1) is on the left", () => {
		expect(voicing).not.toBeNull();
		const chord = voicingToChord(voicing!);
		const muted = chord.fingers.find(f => f.is_muted)!;
		const x = verticalRightEngine.mapStringAxis(muted.string, frameStub);
		const highOpen = chord.fingers.find(f => !f.is_muted && f.fret === 0 && f.string === 6)!;
		const highX = verticalRightEngine.mapStringAxis(highOpen.string, frameStub);
		expect(x).toBeLessThan(highX);
	});

	it("vertical-left: low E (domain 1) is on the right", () => {
		expect(voicing).not.toBeNull();
		const chord = voicingToChord(voicing!);
		const muted = chord.fingers.find(f => f.is_muted)!;
		const lowX = verticalLeftEngine.mapStringAxis(muted.string, frameStub);
		const highOpen = chord.fingers.find(f => !f.is_muted && f.fret === 0 && f.string === 6)!;
		const highX = verticalLeftEngine.mapStringAxis(highOpen.string, frameStub);
		expect(lowX).toBeGreaterThan(highX);
	});

	it("renders x32010 voicing with muted low E on the left (vertical-right)", () => {
		expect(voicing).not.toBeNull();
		const { container } = render(
			<ChordDiagram voicing={voicing!} view="vertical-right" width={220} height={280} />
		);
		const svg = container.querySelector("svg");
		expect(svg).not.toBeNull();

		const circles = Array.from(svg!.querySelectorAll("circle")).map(c => ({
			cx: Number(c.getAttribute("cx")),
			cy: Number(c.getAttribute("cy")),
		}));
		const mutedLines = Array.from(svg!.querySelectorAll("line")).filter(
			line => line.getAttribute("stroke-width") === "4"
		);
		const openAtNut = Array.from(svg!.querySelectorAll("circle")).filter(
			c => c.getAttribute("fill") === "white"
		);

		expect(openAtNut.length).toBeGreaterThan(0);
		expect(mutedLines.length).toBeGreaterThanOrEqual(2);

		const mutedX =
			mutedLines.reduce((sum, line) => sum + Number(line.getAttribute("x1") ?? 0), 0) /
			mutedLines.length;
		const rightmostOpen = Math.max(
			...openAtNut.map(c => Number(c.getAttribute("cx") ?? 0)),
			...circles.map(c => c.cx)
		);

		expect(mutedX).toBeLessThan(rightmostOpen);
	});

	it("renders Gb5 = 244xxx with pressed low strings on the left (vertical-right)", () => {
		const gb5 =
			parseFretNotationToVoicing({
				fretNotation: "244xxx",
				chordSymbol: "Gb5",
				id: "gb5",
			}) ?? null;
		expect(gb5).not.toBeNull();

		const chord = voicingToChord(gb5!);
		expect(chord.fingers.filter(f => !f.is_muted).map(f => [f.string, f.fret])).toEqual([
			[1, 2],
			[2, 4],
			[3, 4],
		]);

		const { container } = render(
			<ChordDiagram voicing={gb5!} view="vertical-right" width={220} height={280} />
		);
		const svg = container.querySelector("svg");
		expect(svg).not.toBeNull();

		const frettedDots = Array.from(svg!.querySelectorAll("circle"))
			.map(c => ({
				cx: Number(c.getAttribute("cx")),
				fill: c.getAttribute("fill"),
			}))
			.filter(circle => circle.fill !== "white");
		const mutedLines = Array.from(svg!.querySelectorAll("line")).filter(
			line => line.getAttribute("stroke-width") === "4"
		);

		expect(frettedDots).toHaveLength(3);
		expect(mutedLines.length).toBeGreaterThanOrEqual(6);
		expect(Math.max(...frettedDots.map(dot => dot.cx))).toBeLessThan(
			Math.max(...mutedLines.map(line => Number(line.getAttribute("x1") ?? 0)))
		);
	});
});
