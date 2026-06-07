import type { CSSProperties } from "react";
import {
	DEFAULT_DOT_HOVER_PADDING,
	DEFAULT_DOT_LABEL_FONT_SIZE,
	DEFAULT_DOT_RADIUS,
	DEFAULT_FRET_LABEL_FONT_SIZE,
	DEFAULT_INLAY_RADIUS,
	DEFAULT_TUNING_LABEL_FONT_SIZE,
	DEFAULT_TUNING_LABEL_GAP,
} from "./constants.js";
import type { InteractiveFretboardAppearanceInput, InteractiveFretboardColors } from "./types.js";

export type ResolvedInteractiveFretboardAppearance = {
	dotRadius: number;
	dotHoverRadius: number;
	dotLabelFontSize: number;
	fretLabelFontSize: number;
	tuningLabelFontSize: number;
	inlayRadius: number;
	tuningLabelGap: number;
	nutStrokeWidth: number;
	tuningNutInset: number;
	colors: Required<InteractiveFretboardColors>;
};

export const DEFAULT_INTERACTIVE_FRETBOARD_COLORS: Required<InteractiveFretboardColors> = {
	background: "#1a1a1a",
	fret: "rgba(255, 255, 255, 0.35)",
	string: "rgba(255, 255, 255, 0.7)",
	dot: "#3b82f6",
	dotMuted: "#ef4444",
	hover: "rgba(59, 130, 246, 0.35)",
	inlay: "rgba(255, 255, 255, 0.15)",
	label: "rgba(255, 255, 255, 0.55)",
	nut: "rgba(255, 255, 255, 0.9)",
	dotLabel: "#ffffff",
};

export const DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE: ResolvedInteractiveFretboardAppearance = {
	dotRadius: DEFAULT_DOT_RADIUS,
	dotHoverRadius: DEFAULT_DOT_RADIUS + DEFAULT_DOT_HOVER_PADDING,
	dotLabelFontSize: DEFAULT_DOT_LABEL_FONT_SIZE,
	fretLabelFontSize: DEFAULT_FRET_LABEL_FONT_SIZE,
	tuningLabelFontSize: DEFAULT_TUNING_LABEL_FONT_SIZE,
	inlayRadius: DEFAULT_INLAY_RADIUS,
	tuningLabelGap: DEFAULT_TUNING_LABEL_GAP,
	nutStrokeWidth: 3,
	tuningNutInset: DEFAULT_DOT_RADIUS + DEFAULT_TUNING_LABEL_GAP + 18,
	colors: DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
};

export function resolveInteractiveFretboardAppearance(
	input: InteractiveFretboardAppearanceInput = {},
): ResolvedInteractiveFretboardAppearance {
	const { appearance, colors, ...flat } = input;
	const dotRadius = flat.dotRadius ?? appearance?.dotRadius ?? DEFAULT_DOT_RADIUS;
	const dotHoverPadding =
		flat.dotHoverPadding ?? appearance?.dotHoverPadding ?? DEFAULT_DOT_HOVER_PADDING;
	const tuningLabelGap =
		flat.tuningLabelGap ?? appearance?.tuningLabelGap ?? DEFAULT_TUNING_LABEL_GAP;

	return {
		dotRadius,
		dotHoverRadius:
			flat.dotHoverRadius ?? appearance?.dotHoverRadius ?? dotRadius + dotHoverPadding,
		dotLabelFontSize:
			flat.dotLabelFontSize ?? appearance?.dotLabelFontSize ?? DEFAULT_DOT_LABEL_FONT_SIZE,
		fretLabelFontSize:
			flat.fretLabelFontSize ?? appearance?.fretLabelFontSize ?? DEFAULT_FRET_LABEL_FONT_SIZE,
		tuningLabelFontSize:
			flat.tuningLabelFontSize ?? appearance?.tuningLabelFontSize ?? DEFAULT_TUNING_LABEL_FONT_SIZE,
		inlayRadius: flat.inlayRadius ?? appearance?.inlayRadius ?? DEFAULT_INLAY_RADIUS,
		tuningLabelGap,
		nutStrokeWidth: flat.nutStrokeWidth ?? appearance?.nutStrokeWidth ?? 3,
		tuningNutInset: dotRadius + tuningLabelGap + 18,
		colors: {
			...DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
			...appearance?.colors,
			...colors,
		},
	};
}

export function interactiveFretboardThemeStyle(
	appearance: ResolvedInteractiveFretboardAppearance,
): CSSProperties {
	const { colors } = appearance;

	return {
		"--ifret-bg": colors.background,
		"--ifret-fret-color": colors.fret,
		"--ifret-string-color": colors.string,
		"--ifret-dot-fill": colors.dot,
		"--ifret-dot-muted": colors.dotMuted,
		"--ifret-hover-fill": colors.hover,
		"--ifret-inlay-fill": colors.inlay,
		"--ifret-label-color": colors.label,
		"--ifret-nut-stroke": colors.nut,
		"--ifret-dot-label-color": colors.dotLabel,
		"--ifret-dot-label-size": `${appearance.dotLabelFontSize}px`,
		"--ifret-fret-label-size": `${appearance.fretLabelFontSize}px`,
		"--ifret-tuning-label-size": `${appearance.tuningLabelFontSize}px`,
	} as CSSProperties;
}
