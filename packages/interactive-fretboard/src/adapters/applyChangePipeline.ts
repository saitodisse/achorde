import {
	formatVoicingToFretNotation,
	inferBarresFromFrettedVoicing,
	type FrettedInstrumentVoicing,
} from "achorde-musical-domain";
import { applyTapToEditorState } from "./applyTap.js";
import { detectChordFromVoicing, pressedNotesFromVoicing } from "./detectChord.js";
import {
	editorStateToVoicing,
	voicingToEditorState,
	type FretboardEditorState,
} from "./voicingEditorState.js";
import type { TapTarget } from "./applyTap.js";

export type InteractiveFretboardChangeDetails = {
	voicing: FrettedInstrumentVoicing;
	fretNotation?: string;
	pressedNotes: string[];
	detectedChord?: string;
};

export function applyChangePipeline(input: {
	state: FretboardEditorState;
	baseVoicing: FrettedInstrumentVoicing;
	openNotesByString: Map<number, string>;
	target: TapTarget;
	inferBarresOnChange: boolean;
	detectChord: boolean;
	includeFretNotation: boolean;
}): {
	state: FretboardEditorState;
	details: InteractiveFretboardChangeDetails;
} {
	const nextState = applyTapToEditorState(input.state, input.target);
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
		},
	};
}

export { voicingToEditorState };
