import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import { parseFretNotationToVoicing, type FrettedInstrumentVoicing } from "@achorde/musical-domain";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";
import { DEFAULT_GUITAR_TUNING } from "../components/InteractiveFretboard/constants.js";
import type { InteractiveFretboardProps } from "../components/InteractiveFretboard/types.js";
import type { InteractiveFretboardChangeDetails } from "../adapters/applyChangePipeline.js";

/** Story-only: widen the preview wrapper (not a component prop). */
type StoryArgs = InteractiveFretboardProps & {
	fullWidth?: boolean;
};

function parseVoicingFromNotation(
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

function InteractiveFretboardStory(args: StoryArgs) {
	const {
		fullWidth = false,
		onChange,
		value: valueArg,
		valueMode = "voicing",
		fretNotation,
		chordSymbol,
		...boardProps
	} = args;

	const seedVoicing = useMemo(() => {
		if (valueMode === "fretNotation") {
			return null;
		}
		return valueArg ?? parseVoicingFromNotation(fretNotation, chordSymbol);
	}, [valueMode, valueArg, fretNotation, chordSymbol]);

	const [voicing, setVoicing] = useState<FrettedInstrumentVoicing | null>(seedVoicing);

	useEffect(() => {
		if (valueMode === "voicing") {
			setVoicing(seedVoicing);
		}
	}, [valueMode, seedVoicing]);

	const wrapperStyle = {
		width: "100%",
		...(fullWidth ? { boxSizing: "border-box" as const } : { maxWidth: 720 }),
	};

	if (valueMode === "fretNotation") {
		return (
			<div style={wrapperStyle}>
				<InteractiveFretboard
					{...boardProps}
					valueMode="fretNotation"
					fretNotation={fretNotation}
					chordSymbol={chordSymbol}
					onChange={onChange}
				/>
			</div>
		);
	}

	return (
		<div style={wrapperStyle}>
			<InteractiveFretboard
				{...boardProps}
				valueMode="voicing"
				value={voicing ?? undefined}
				fretNotation={fretNotation}
				chordSymbol={chordSymbol}
				onChange={(details: InteractiveFretboardChangeDetails) => {
					setVoicing(details.voicing);
					onChange?.(details);
				}}
			/>
			{voicing ? (
				<p style={{ color: "#aaa", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>
					strings:{" "}
					{voicing.strings.map((s) => `${s.stringIndex}:${s.state}${s.fret ?? ""}`).join(" ")}
				</p>
			) : null}
		</div>
	);
}

const meta = {
	title: "InteractiveFretboard",
	component: InteractiveFretboard,
	render: (args: StoryArgs) => <InteractiveFretboardStory {...args} />,
	parameters: {
		controls: { expanded: true },
	},
	argTypes: {
		// —— Story layout ——
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
			description: "Open-string notes, high string first (stringIndex 1 … n).",
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
	},
	args: {
		fullWidth: false,
		valueMode: "voicing",
		fretNotation: "x32010",
		chordSymbol: "C",
		orientation: "horizontal",
		handedness: "right",
		fretCount: 16,
		stringCount: 6,
		tuning: [...DEFAULT_GUITAR_TUNING],
		inferBarresOnChange: true,
		detectChord: true,
		showFretNumbers: true,
		showInlays: true,
		showDotText: true,
		showTuning: false,
		disabled: false,
		"aria-label": "Interactive fretboard",
	},
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
	parameters: {
		layout: "fullscreen",
	},
	args: {
		fullWidth: true,
	},
};

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

export const ResponsiveContainer: Story = {
	args: {
		fullWidth: false,
	},
	render: (args: StoryArgs) => (
		<div style={{ width: 280, border: "1px solid #444", padding: 8 }}>
			<InteractiveFretboardStory {...args} />
		</div>
	),
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
