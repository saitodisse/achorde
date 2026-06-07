import {
	formatVoicingToFretNotation,
	inferBarresFromFrettedVoicing,
	type FrettedInstrumentVoicing,
} from "@achorde/musical-domain";
import { applyTapToEditorState } from "./applyTap.js";
import { applyFingerCycle, applyFingerStick } from "./applyFinger.js";
import { detectChordFromVoicing, pressedNotesFromVoicing } from "./detectChord.js";
import {
	editorStateToVoicing,
	voicingToEditorState,
	type FretboardEditorState,
} from "./voicingEditorState.js";
import type { TapTarget } from "./applyTap.js";
import type { InteractiveFretboardPointerButton } from "../interaction/resolvePointerButton.js";

export type InteractiveFretboardChangeDetails = {
	voicing: FrettedInstrumentVoicing;
	fretNotation?: string;
	pressedNotes: string[];
	detectedChord?: string;
	/** Which pointer button triggered the edit (`primary` = left / touch / pen). */
	pointerButton: InteractiveFretboardPointerButton;
};

export function applyChangePipeline(input: {
	state: FretboardEditorState;
	baseVoicing: FrettedInstrumentVoicing;
	openNotesByString: Map<number, string>;
	target: TapTarget;
	pointerButton: InteractiveFretboardPointerButton;
	inferBarresOnChange: boolean;
	detectChord: boolean;
	includeFretNotation: boolean;
}): {
	state: FretboardEditorState;
	details: InteractiveFretboardChangeDetails;
} | null {
	let nextState: FretboardEditorState;

	if (input.pointerButton === "secondary") {
		const cycled = applyFingerCycle(input.state, input.target);
		if (!cycled) {
			return null;
		}
		nextState = cycled;
	} else if (input.pointerButton === "middle") {
		const stuck = applyFingerStick(input.state, input.target);
		if (!stuck) {
			return null;
		}
		nextState = stuck;
	} else {
		const tapped = applyTapToEditorState(input.state, input.target);
		nextState = {
			cells: tapped.cells,
			stickyFinger: input.state.stickyFinger ?? 1,
		};
	}

	let voicing = editorStateToVoicing(nextState, input.baseVoicing, input.openNotesByString);

	if (input.inferBarresOnChange) {
		voicing = inferBarresFromFrettedVoicing(voicing);
	}

	const pressedNotes = pressedNotesFromVoicing(voicing, input.openNotesByString);
	const detectedChord = input.detectChord
		? detectChordFromVoicing(voicing, input.openNotesByString)
		: undefined;

	return {
		state: nextState,
		details: {
			voicing,
			fretNotation: input.includeFretNotation ? formatVoicingToFretNotation(voicing) : undefined,
			pressedNotes,
			detectedChord,
			pointerButton: input.pointerButton,
		},
	};
}

export { voicingToEditorState };
