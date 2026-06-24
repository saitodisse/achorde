import { describe, expect, it } from "vitest";
import { createVisualToStringIndex, resolveViewMode } from "./viewMode.js";

describe("resolveViewMode", () => {
	it("resolves four mode ids", () => {
		expect(resolveViewMode("horizontal", "right").id).toBe("horizontal-right");
		expect(resolveViewMode("horizontal", "left").id).toBe("horizontal-left");
		expect(resolveViewMode("vertical", "right").id).toBe("vertical-right");
		expect(resolveViewMode("vertical", "left").id).toBe("vertical-left");
	});
});

describe("createVisualToStringIndex", () => {
	const stringCount = 6;

	it("horizontal-right maps visual 0 to stringIndex 6 (high E on top)", () => {
		const map = createVisualToStringIndex(
			{ orientation: "horizontal", handedness: "right" },
			stringCount,
		);
		expect(map(0)).toBe(6);
		expect(map(5)).toBe(1);
	});

	it("horizontal-left mirrors strings", () => {
		const map = createVisualToStringIndex(
			{ orientation: "horizontal", handedness: "left" },
			stringCount,
		);
		expect(map(0)).toBe(1);
		expect(map(5)).toBe(6);
	});

	it("vertical-right places stringIndex 1 low string on the left", () => {
		const map = createVisualToStringIndex(
			{ orientation: "vertical", handedness: "right" },
			stringCount,
		);
		expect(map(0)).toBe(1);
		expect(map(5)).toBe(6);
	});

	it("vertical-left mirrors along X", () => {
		const map = createVisualToStringIndex(
			{ orientation: "vertical", handedness: "left" },
			stringCount,
		);
		expect(map(0)).toBe(6);
		expect(map(5)).toBe(1);
	});
});
