import type { FretboardHandedness, FretboardOrientation, FretboardViewMode } from "./types.js";

export type ResolvedViewMode = FretboardViewMode & {
	id: "horizontal-right" | "horizontal-left" | "vertical-right" | "vertical-left";
	defaultViewBox: { width: number; height: number };
};

export function resolveViewMode(
	orientation: FretboardOrientation = "horizontal",
	handedness: FretboardHandedness = "right",
): ResolvedViewMode {
	const viewMode: FretboardViewMode = { orientation, handedness };
	const id =
		orientation === "horizontal"
			? handedness === "right"
				? "horizontal-right"
				: "horizontal-left"
			: handedness === "right"
				? "vertical-right"
				: "vertical-left";

	const defaultViewBox =
		orientation === "horizontal" ? { width: 1100, height: 250 } : { width: 400, height: 420 };

	return { ...viewMode, id, defaultViewBox };
}

/**
 * Canonical stringIndex: 1 = high E, 6 = low E (achorde-musical-domain).
 * visualStringIndex 0 is top (horizontal) or left (vertical).
 */
export function createVisualToStringIndex(
	viewMode: FretboardViewMode,
	stringCount: number,
): (visualStringIndex: number) => number {
	const { orientation, handedness } = viewMode;

	if (orientation === "horizontal") {
		if (handedness === "right") {
			return (visual) => visual + 1;
		}
		return (visual) => stringCount - visual;
	}

	if (handedness === "right") {
		return (visual) => stringCount - visual;
	}
	return (visual) => visual + 1;
}

/** Vertical viewBox height scaled to fret count (fits ~5 frets within a typical viewport). */
export function defaultVerticalViewBoxHeight(fretCount: number, nutInset = 0): number {
	return Math.round(72 + fretCount * 62 + nutInset);
}
