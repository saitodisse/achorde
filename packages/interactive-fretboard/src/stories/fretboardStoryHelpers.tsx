import { useEffect, useMemo, useState } from "react";
import {
	formatVoicingToFretNotation,
	parseFretNotationToVoicing,
	type FrettedInstrumentVoicing,
} from "@achorde/musical-domain";
import type { ViewId } from "@achorde/svguitar-react";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";
import { DEFAULT_GUITAR_TUNING } from "../components/InteractiveFretboard/constants.js";
import {
	DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE,
	DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
} from "../components/InteractiveFretboard/resolveAppearance.js";
import type { InteractiveFretboardProps } from "../components/InteractiveFretboard/types.js";
import type { InteractiveFretboardChangeDetails } from "../adapters/applyChangePipeline.js";
import { partitionStoryArgs } from "../utils/partitionStoryArgs.js";

/** Story-only: widen the preview wrapper (not a component prop). */
export type StoryArgs = InteractiveFretboardProps & {
	fullWidth?: boolean;
};

export function parseVoicingFromNotation(
	fretNotation: string | undefined,
	chordSymbol: string | undefined,
): FrettedInstrumentVoicing | null {
	if (!fretNotation) {
		return null;
	}
	return (
		parseFretNotationToVoicing({
			fretNotation,
			chordSymbol: chordSymbol ?? "",
			id: "storybook-voicing",
		}) ?? null
	);
}

export function chordDiagramView(
	orientation: InteractiveFretboardProps["orientation"],
	handedness: InteractiveFretboardProps["handedness"],
): ViewId {
	// svguitar-react inverts the string axis on vertical layouts relative to this package
	if (orientation === "vertical") {
		const mirroredHandedness = handedness === "right" ? "left" : "right";
		return `${orientation}-${mirroredHandedness}` as ViewId;
	}

	return `${orientation}-${handedness}` as ViewId;
}

export const fretboardArgTypes = {
	fullWidth: {
		control: "boolean",
		description: "Preview wrapper uses full canvas width (no max-width 720px).",
		table: { category: "Story" },
	},
	onChange: {
		action: "changed",
		table: { category: "Events" },
	},
	value: {
		control: false,
		description: "Controlled voicing object; use fretNotation or interact on the board.",
		table: { category: "Data" },
	},
	valueMode: {
		control: "radio",
		options: ["voicing", "fretNotation"],
		table: { category: "Data" },
	},
	fretNotation: {
		control: "text",
		description: "ASCII fret notation (e.g. x32010). Resets voicing mode when changed.",
		table: { category: "Data" },
	},
	chordSymbol: {
		control: "text",
		table: { category: "Data" },
	},
	orientation: {
		control: "radio",
		options: ["horizontal", "vertical"],
		table: { category: "Layout" },
	},
	handedness: {
		control: "radio",
		options: ["right", "left"],
		table: { category: "Layout" },
	},
	fretCount: {
		control: { type: "range", min: 4, max: 24, step: 1 },
		table: { category: "Layout" },
	},
	stringCount: {
		control: { type: "range", min: 4, max: 8, step: 1 },
		table: { category: "Layout" },
	},
	viewBoxWidth: {
		control: { type: "number", min: 400, max: 2000, step: 50 },
		table: { category: "Layout" },
	},
	viewBoxHeight: {
		control: { type: "number", min: 150, max: 800, step: 25 },
		table: { category: "Layout" },
	},
	minHitSize: {
		control: { type: "range", min: 24, max: 64, step: 2 },
		table: { category: "Layout" },
	},
	tuning: {
		control: "object",
		description: "Open-string notes, low string first (stringIndex 1 … n).",
		table: { category: "Instrument" },
	},
	inferBarresOnChange: {
		control: "boolean",
		table: { category: "Behavior" },
	},
	detectChord: {
		control: "boolean",
		table: { category: "Behavior" },
	},
	showFretNumbers: {
		control: "boolean",
		table: { category: "Display" },
	},
	showInlays: {
		control: "boolean",
		table: { category: "Display" },
	},
	showDotText: {
		control: "boolean",
		table: { category: "Display" },
	},
	showTuning: {
		control: "boolean",
		table: { category: "Display" },
	},
	disabled: {
		control: "boolean",
		table: { category: "Display" },
	},
	dotRadius: {
		control: { type: "range", min: 8, max: 40, step: 1 },
		table: { category: "Appearance" },
	},
	dotHoverPadding: {
		control: { type: "range", min: 0, max: 12, step: 1 },
		table: { category: "Appearance" },
	},
	dotHoverRadius: {
		control: { type: "range", min: 8, max: 48, step: 1 },
		description: "Optional override; defaults to dotRadius + dotHoverPadding.",
		table: { category: "Appearance" },
	},
	dotLabelFontSize: {
		control: { type: "range", min: 8, max: 32, step: 1 },
		table: { category: "Appearance" },
	},
	fretLabelFontSize: {
		control: { type: "range", min: 6, max: 24, step: 1 },
		table: { category: "Appearance" },
	},
	tuningLabelFontSize: {
		control: { type: "range", min: 6, max: 24, step: 1 },
		table: { category: "Appearance" },
	},
	inlayRadius: {
		control: { type: "range", min: 2, max: 16, step: 1 },
		table: { category: "Appearance" },
	},
	tuningLabelGap: {
		control: { type: "range", min: 4, max: 24, step: 1 },
		table: { category: "Appearance" },
	},
	nutStrokeWidth: {
		control: { type: "range", min: 1, max: 8, step: 1 },
		table: { category: "Appearance" },
	},
	"colors.background": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.fret": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.string": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.dot": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.dotMuted": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.hover": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.inlay": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.label": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.nut": {
		control: "color",
		table: { category: "Colors" },
	},
	"colors.dotLabel": {
		control: "color",
		table: { category: "Colors" },
	},
	className: {
		control: "text",
		table: { category: "Display" },
	},
	style: {
		control: "object",
		table: { category: "Display" },
	},
	"aria-label": {
		control: "text",
		name: "aria-label",
		table: { category: "A11y" },
	},
} as const;

export const fretboardDefaultArgs: StoryArgs = {
	fullWidth: false,
	valueMode: "voicing",
	fretNotation: "x32010",
	chordSymbol: "C",
	orientation: "horizontal",
	handedness: "right",
	fretCount: 5,
	stringCount: 6,
	viewBoxWidth: 400,
	viewBoxHeight: 550,
	minHitSize: 44,
	tuning: [...DEFAULT_GUITAR_TUNING],
	inferBarresOnChange: true,
	detectChord: true,
	showFretNumbers: true,
	showInlays: true,
	showDotText: true,
	showTuning: false,
	disabled: false,
	dotRadius: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.dotRadius,
	dotHoverPadding:
		DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.dotHoverRadius -
		DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.dotRadius,
	dotLabelFontSize: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.dotLabelFontSize,
	fretLabelFontSize: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.fretLabelFontSize,
	tuningLabelFontSize: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.tuningLabelFontSize,
	inlayRadius: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.inlayRadius,
	tuningLabelGap: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.tuningLabelGap,
	nutStrokeWidth: DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE.nutStrokeWidth,
	colors: { ...DEFAULT_INTERACTIVE_FRETBOARD_COLORS },
	"aria-label": "Interactive fretboard",
};

export function useInteractiveFretboardStoryState(args: StoryArgs) {
	const {
		fullWidth = false,
		onChange,
		valueArg,
		valueMode = "voicing",
		fretNotation,
		chordSymbol,
		orientation,
		handedness,
		boardProps,
	} = partitionStoryArgs(args);

	const seedVoicing = useMemo(() => {
		if (valueMode === "fretNotation") {
			return parseVoicingFromNotation(fretNotation, chordSymbol);
		}
		return valueArg ?? parseVoicingFromNotation(fretNotation, chordSymbol);
	}, [valueMode, valueArg, fretNotation, chordSymbol]);

	const [voicing, setVoicing] = useState<FrettedInstrumentVoicing | null>(seedVoicing);
	const [liveFretNotation, setLiveFretNotation] = useState(fretNotation ?? "");
	const [lastPointerButton, setLastPointerButton] = useState<string | null>(null);

	useEffect(() => {
		setVoicing(seedVoicing);
		setLiveFretNotation(fretNotation ?? "");
	}, [seedVoicing, fretNotation]);

	const handleChange = (details: InteractiveFretboardChangeDetails) => {
		setVoicing(details.voicing);
		setLiveFretNotation(details.fretNotation ?? formatVoicingToFretNotation(details.voicing));
		setLastPointerButton(details.pointerButton);
		onChange?.(details);
	};

	const diagramFretNotation =
		liveFretNotation ||
		fretNotation ||
		(voicing ? formatVoicingToFretNotation(voicing) : undefined);

	const wrapperStyle = {
		width: "100%",
		...(fullWidth ? { boxSizing: "border-box" as const } : { maxWidth: 720 }),
	};

	return {
		boardProps,
		valueMode,
		fretNotation,
		chordSymbol,
		voicing,
		diagramFretNotation,
		orientation,
		handedness,
		wrapperStyle,
		handleChange,
		lastPointerButton,
	};
}

export function InteractiveFretboardStory(args: StoryArgs) {
	const {
		boardProps,
		valueMode,
		fretNotation,
		chordSymbol,
		orientation,
		handedness,
		voicing,
		wrapperStyle,
		handleChange,
		lastPointerButton,
	} = useInteractiveFretboardStoryState(args);

	const layoutProps = { orientation, handedness };

	if (valueMode === "fretNotation") {
		return (
			<div style={wrapperStyle}>
				<InteractiveFretboard
					{...boardProps}
					{...layoutProps}
					valueMode="fretNotation"
					fretNotation={fretNotation}
					chordSymbol={chordSymbol}
					onChange={handleChange}
				/>
			</div>
		);
	}

	return (
		<div style={wrapperStyle}>
			<InteractiveFretboard
				{...boardProps}
				{...layoutProps}
				valueMode="voicing"
				value={voicing ?? undefined}
				fretNotation={fretNotation}
				chordSymbol={chordSymbol}
				onChange={handleChange}
			/>
			{voicing ? (
				<p style={{ color: "#aaa", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>
					strings:{" "}
					{voicing.strings.map((s) => `${s.stringIndex}:${s.state}${s.fret ?? ""}`).join(" ")}
					{lastPointerButton ? ` · button: ${lastPointerButton}` : null}
				</p>
			) : null}
		</div>
	);
}
