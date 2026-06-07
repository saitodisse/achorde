import { describe, expect, it } from "vitest";
import { fretboardArgTypes, fretboardDefaultArgs } from "../stories/fretboardStoryHelpers.js";

const APPEARANCE_NUMERIC_KEYS = [
	"dotRadius",
	"dotHoverPadding",
	"dotHoverRadius",
	"dotLabelFontSize",
	"fretLabelFontSize",
	"tuningLabelFontSize",
	"inlayRadius",
	"tuningLabelGap",
	"nutStrokeWidth",
] as const;

const COLOR_KEYS = [
	"colors.background",
	"colors.fret",
	"colors.string",
	"colors.dot",
	"colors.dotMuted",
	"colors.hover",
	"colors.inlay",
	"colors.label",
	"colors.nut",
	"colors.dotLabel",
] as const;

describe("fretboardStoryArgs", () => {
	it("exposes appearance numeric props in default args and argTypes", () => {
		for (const key of APPEARANCE_NUMERIC_KEYS) {
			expect(fretboardArgTypes).toHaveProperty(key);
			if (key !== "dotHoverRadius") {
				expect(fretboardDefaultArgs).toHaveProperty(key);
			}
		}
	});

	it("exposes every theme color in argTypes and default colors object", () => {
		expect(fretboardDefaultArgs.colors).toBeDefined();

		for (const key of COLOR_KEYS) {
			expect(fretboardArgTypes).toHaveProperty(key);
		}

		for (const colorKey of COLOR_KEYS.map((key) => key.replace("colors.", ""))) {
			expect(fretboardDefaultArgs.colors).toHaveProperty(colorKey);
		}
	});
});
