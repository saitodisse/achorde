import { describe, expect, it } from "vitest";
import {
	DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE,
	DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
	interactiveFretboardThemeStyle,
	resolveInteractiveFretboardAppearance,
} from "./resolveAppearance.js";

describe("resolveInteractiveFretboardAppearance", () => {
	it("uses package defaults when no overrides are provided", () => {
		expect(resolveInteractiveFretboardAppearance()).toEqual(
			DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE,
		);
	});

	it("derives hover radius and tuning inset from dot radius", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			dotRadius: 28,
			dotHoverPadding: 4,
			tuningLabelGap: 12,
		});

		expect(appearance.dotHoverRadius).toBe(32);
		expect(appearance.tuningNutInset).toBe(58);
	});

	it("accepts explicit dotHoverRadius override", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			dotRadius: 21,
			dotHoverRadius: 40,
		});

		expect(appearance.dotHoverRadius).toBe(40);
	});

	it("merges nested appearance group with top-level props (top-level wins)", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			appearance: {
				dotRadius: 10,
				dotLabelFontSize: 12,
				colors: { dot: "#111111" },
			},
			dotRadius: 25,
			colors: { dot: "#222222", background: "#333333" },
		});

		expect(appearance.dotRadius).toBe(25);
		expect(appearance.dotLabelFontSize).toBe(12);
		expect(appearance.colors.dot).toBe("#222222");
		expect(appearance.colors.background).toBe("#333333");
	});

	it("resolves every numeric appearance property", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			dotRadius: 30,
			dotHoverPadding: 5,
			dotLabelFontSize: 22,
			fretLabelFontSize: 14,
			tuningLabelFontSize: 13,
			inlayRadius: 8,
			tuningLabelGap: 14,
			nutStrokeWidth: 5,
		});

		expect(appearance).toMatchObject({
			dotRadius: 30,
			dotHoverRadius: 35,
			dotLabelFontSize: 22,
			fretLabelFontSize: 14,
			tuningLabelFontSize: 13,
			inlayRadius: 8,
			tuningLabelGap: 14,
			nutStrokeWidth: 5,
			tuningNutInset: 62,
		});
	});

	it("merges partial color overrides with defaults", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			colors: { dot: "#ff0000", inlay: "#00ff00" },
		});

		expect(appearance.colors).toEqual({
			...DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
			dot: "#ff0000",
			inlay: "#00ff00",
		});
	});
});

describe("interactiveFretboardThemeStyle", () => {
	it("maps all colors and font sizes to CSS variables on the wrapper", () => {
		const appearance = resolveInteractiveFretboardAppearance({
			dotLabelFontSize: 20,
			fretLabelFontSize: 11,
			tuningLabelFontSize: 12,
			colors: { dot: "#ff0000", background: "#000000" },
		});

		expect(interactiveFretboardThemeStyle(appearance)).toEqual({
			"--ifret-bg": "#000000",
			"--ifret-fret-color": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.fret,
			"--ifret-string-color": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.string,
			"--ifret-dot-fill": "#ff0000",
			"--ifret-dot-muted": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.dotMuted,
			"--ifret-hover-fill": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.hover,
			"--ifret-inlay-fill": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.inlay,
			"--ifret-label-color": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.label,
			"--ifret-nut-stroke": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.nut,
			"--ifret-dot-label-color": DEFAULT_INTERACTIVE_FRETBOARD_COLORS.dotLabel,
			"--ifret-dot-label-size": "20px",
			"--ifret-fret-label-size": "11px",
			"--ifret-tuning-label-size": "12px",
		});
	});
});
