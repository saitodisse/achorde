import type { CSSProperties } from "react";
import type { FrettedInstrumentVoicing } from "@achorde/musical-domain";
import type { FretboardHandedness, FretboardOrientation } from "../../layout/types.js";
import type { InteractiveFretboardChangeDetails } from "../../adapters/applyChangePipeline.js";

export type InteractiveFretboardColors = {
	background?: string;
	fret?: string;
	string?: string;
	dot?: string;
	dotMuted?: string;
	hover?: string;
	inlay?: string;
	label?: string;
	nut?: string;
	dotLabel?: string;
};

/** Nested appearance overrides (merged with top-level appearance props). */
export type InteractiveFretboardAppearance = {
	dotRadius?: number;
	dotHoverPadding?: number;
	dotHoverRadius?: number;
	dotLabelFontSize?: number;
	fretLabelFontSize?: number;
	tuningLabelFontSize?: number;
	inlayRadius?: number;
	tuningLabelGap?: number;
	nutStrokeWidth?: number;
	colors?: InteractiveFretboardColors;
};

export type InteractiveFretboardAppearanceInput = InteractiveFretboardAppearance & {
	appearance?: InteractiveFretboardAppearance;
	colors?: InteractiveFretboardColors;
};

export type InteractiveFretboardProps = InteractiveFretboardAppearanceInput & {
	value?: FrettedInstrumentVoicing;
	valueMode?: "voicing" | "fretNotation";
	fretNotation?: string;
	chordSymbol?: string;
	onChange?: (details: InteractiveFretboardChangeDetails) => void;
	orientation?: FretboardOrientation;
	handedness?: FretboardHandedness;
	fretCount?: number;
	stringCount?: number;
	tuning?: string[];
	inferBarresOnChange?: boolean;
	detectChord?: boolean;
	showFretNumbers?: boolean;
	showInlays?: boolean;
	showDotText?: boolean;
	showTuning?: boolean;
	viewBoxWidth?: number;
	viewBoxHeight?: number;
	minHitSize?: number;
	className?: string;
	style?: CSSProperties;
	disabled?: boolean;
	"aria-label"?: string;
};
