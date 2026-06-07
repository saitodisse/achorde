import type { Meta, StoryObj } from "@storybook/react-vite";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";
import {
	fretboardArgTypes,
	fretboardDefaultArgs,
	InteractiveFretboardStory,
	type StoryArgs,
} from "./fretboardStoryHelpers.js";

const meta = {
	title: "InteractiveFretboard",
	component: InteractiveFretboard,
	render: (args: StoryArgs) => <InteractiveFretboardStory {...args} />,
	parameters: {
		controls: { expanded: true },
	},
	argTypes: fretboardArgTypes,
	args: fretboardDefaultArgs,
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HorizontalRight: Story = {
	parameters: {
		layout: "fullscreen",
	},
	args: {
		orientation: "horizontal",
		handedness: "right",
		fullWidth: true,
	},
};

export const HorizontalLeft: Story = {
	parameters: {
		layout: "fullscreen",
	},
	args: {
		orientation: "horizontal",
		handedness: "left",
		fullWidth: true,
	},
};

export const VerticalRight: Story = {
	args: {
		orientation: "vertical",
		handedness: "right",
	},
};

export const VerticalLeft: Story = {
	args: {
		orientation: "vertical",
		handedness: "left",
	},
};

export const FretNotationMode: Story = {
	args: {
		valueMode: "fretNotation",
		fretNotation: "x32010",
		chordSymbol: "C",
		fullWidth: true,
	},
	parameters: {
		layout: "fullscreen",
	},
};

/** All appearance controls exposed — tweak dots, labels, inlays, and colors in the panel. */
export const AppearancePlayground: Story = {
	args: {
		fullWidth: true,
		showTuning: true,
		fretCount: 12,
		viewBoxWidth: 480,
		viewBoxHeight: 640,
	},
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				story:
					"Use the Appearance and Colors groups in Controls to preview dot size, label sizes, inlays, nut stroke, and theme colors.",
			},
		},
	},
};
