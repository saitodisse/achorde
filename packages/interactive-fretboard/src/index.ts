export { InteractiveFretboard } from "./components/InteractiveFretboard/InteractiveFretboard.js";
export type { InteractiveFretboardProps } from "./components/InteractiveFretboard/types.js";
export type {
	InteractiveFretboardAppearance,
	InteractiveFretboardColors,
} from "./components/InteractiveFretboard/types.js";
export {
	DEFAULT_DOT_RADIUS,
	DEFAULT_DOT_HOVER_PADDING,
	DEFAULT_DOT_LABEL_FONT_SIZE,
	DEFAULT_FRET_LABEL_FONT_SIZE,
	DEFAULT_TUNING_LABEL_FONT_SIZE,
	DEFAULT_INLAY_RADIUS,
	DEFAULT_TUNING_LABEL_GAP,
	DEFAULT_TUNING_NUT_INSET,
	FRET_DOT_RADIUS,
	FRET_DOT_HOVER_RADIUS,
	TUNING_LABEL_GAP,
	TUNING_NUT_INSET,
} from "./components/InteractiveFretboard/constants.js";
export {
	resolveInteractiveFretboardAppearance,
	interactiveFretboardThemeStyle,
	DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE,
	DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
} from "./components/InteractiveFretboard/resolveAppearance.js";
export type { ResolvedInteractiveFretboardAppearance } from "./components/InteractiveFretboard/resolveAppearance.js";
export type { InteractiveFretboardChangeDetails } from "./adapters/applyChangePipeline.js";
export type { InteractiveFretboardPointerButton } from "./interaction/resolvePointerButton.js";
export { resolvePointerButton } from "./interaction/resolvePointerButton.js";
export { screenToSvgPoint } from "./interaction/screenToSvgPoint.js";
export { hitTestFretCell } from "./interaction/hitTestFretCell.js";
export { buildHitAreas } from "./interaction/buildHitAreas.js";
export { computeFretboardFrame } from "./layout/computeFretboardFrame.js";
export { resolveViewMode, createVisualToStringIndex } from "./layout/viewMode.js";
export type {
	FretboardFrame,
	FretboardViewMode,
	FretboardOrientation,
	FretboardHandedness,
	ComputeFretboardFrameInput,
} from "./layout/types.js";
export {
	voicingToEditorState,
	editorStateToVoicing,
	type FretboardEditorState,
} from "./adapters/voicingEditorState.js";
export { applyTapToEditorState } from "./adapters/applyTap.js";
export { applyFingerCycle, applyFingerStick, cycleFingerIndex } from "./adapters/applyFinger.js";
