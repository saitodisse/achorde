import { describe, expect, it } from "vitest";
import { computeFretboardFrame } from "./computeFretboardFrame.js";

function nutCellX(
	orientation: "horizontal" | "vertical",
	handedness: "right" | "left",
	stringIndex: number,
): number {
	const frame = computeFretboardFrame({
		viewMode: { orientation, handedness },
		fretCount: 12,
		stringCount: 6,
		viewBoxWidth: orientation === "horizontal" ? 1100 : 400,
		viewBoxHeight: orientation === "horizontal" ? 250 : 900,
		padding: 24,
	});
	const cell = frame.cells.find((c) => c.stringIndex === stringIndex && c.fret === 0);
	expect(cell).toBeDefined();
	return cell!.center.x;
}

function nutCellY(
	orientation: "horizontal" | "vertical",
	handedness: "right" | "left",
	stringIndex: number,
): number {
	const frame = computeFretboardFrame({
		viewMode: { orientation, handedness },
		fretCount: 12,
		stringCount: 6,
		viewBoxWidth: orientation === "horizontal" ? 1100 : 400,
		viewBoxHeight: orientation === "horizontal" ? 250 : 900,
		padding: 24,
	});
	const cell = frame.cells.find((c) => c.stringIndex === stringIndex && c.fret === 0);
	expect(cell).toBeDefined();
	return cell!.center.y;
}

describe("handedness layout (domain: 1 = low E, 6 = high E)", () => {
	it("vertical-right: low E (1) on the left, high E (6) on the right", () => {
		expect(nutCellX("vertical", "right", 1)).toBeLessThan(nutCellX("vertical", "right", 6));
	});

	it("vertical-left: low E (1) on the right, high E (6) on the left", () => {
		expect(nutCellX("vertical", "left", 1)).toBeGreaterThan(nutCellX("vertical", "left", 6));
	});

	it("horizontal-right: high E (6) on top, low E (1) on bottom", () => {
		expect(nutCellY("horizontal", "right", 6)).toBeLessThan(nutCellY("horizontal", "right", 1));
	});

	it("horizontal-left: low E (1) on top, high E (6) on bottom", () => {
		expect(nutCellY("horizontal", "left", 1)).toBeLessThan(nutCellY("horizontal", "left", 6));
	});
});
