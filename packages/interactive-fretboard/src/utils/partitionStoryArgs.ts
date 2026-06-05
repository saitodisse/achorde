import type { InteractiveFretboardProps } from "../components/InteractiveFretboard/types.js";

export type StoryArgsPartitionInput = InteractiveFretboardProps & {
	fullWidth?: boolean;
};

/** Story-only: layout props must be passed explicitly — they are not part of `boardProps`. */
export function partitionStoryArgs(args: StoryArgsPartitionInput) {
	const {
		fullWidth = false,
		onChange,
		value: valueArg,
		valueMode = "voicing",
		fretNotation,
		chordSymbol,
		orientation = "horizontal",
		handedness = "right",
		...boardProps
	} = args;

	return {
		fullWidth,
		onChange,
		valueArg,
		valueMode,
		fretNotation,
		chordSymbol,
		orientation,
		handedness,
		boardProps,
	};
}
