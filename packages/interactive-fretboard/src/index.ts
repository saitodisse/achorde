export { InteractiveFretboard } from "./components/InteractiveFretboard/InteractiveFretboard.js";
export type { InteractiveFretboardProps } from "./components/InteractiveFretboard/types.js";
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
