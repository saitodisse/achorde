import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { parseFretNotationToVoicing, type FrettedInstrumentVoicing } from "@achorde/musical-domain";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";
import type { InteractiveFretboardChangeDetails } from "../adapters/applyChangePipeline.js";

const cMajor =
	parseFretNotationToVoicing({
		fretNotation: "x32010",
		chordSymbol: "C",
		id: "story-c",
	}) ?? undefined;

function ControlledBoard(props: {
	initial: FrettedInstrumentVoicing;
	orientation?: "horizontal" | "vertical";
	handedness?: "right" | "left";
}) {
	const [voicing, setVoicing] = useState(props.initial);

	return (
		<div style={{ width: "100%", maxWidth: 720 }}>
			<InteractiveFretboard
				value={voicing}
				orientation={props.orientation}
				handedness={props.handedness}
				onChange={(details: InteractiveFretboardChangeDetails) => {
					setVoicing(details.voicing);
				}}
			/>
			<p style={{ color: "#aaa", fontFamily: "monospace", fontSize: 12 }}>
				strings:{" "}
				{voicing.strings.map((s) => `${s.stringIndex}:${s.state}${s.fret ?? ""}`).join(" ")}
			</p>
		</div>
	);
}

const meta: Meta<typeof InteractiveFretboard> = {
	title: "InteractiveFretboard",
	component: InteractiveFretboard,
};

export default meta;

type Story = StoryObj<typeof InteractiveFretboard>;

export const HorizontalRight: Story = {
	render: () => (cMajor ? <ControlledBoard initial={cMajor} /> : null),
};

export const HorizontalLeft: Story = {
	render: () =>
		cMajor ? <ControlledBoard initial={cMajor} orientation="horizontal" handedness="left" /> : null,
};

export const VerticalRight: Story = {
	render: () =>
		cMajor ? <ControlledBoard initial={cMajor} orientation="vertical" handedness="right" /> : null,
};

export const VerticalLeft: Story = {
	render: () =>
		cMajor ? <ControlledBoard initial={cMajor} orientation="vertical" handedness="left" /> : null,
};

export const ResponsiveContainer: Story = {
	render: () =>
		cMajor ? (
			<div style={{ width: 280, border: "1px solid #444", padding: 8 }}>
				<ControlledBoard initial={cMajor} />
			</div>
		) : null,
};

export const FretNotationMode: Story = {
	render: () => (
		<div style={{ width: "100%", maxWidth: 720 }}>
			<InteractiveFretboard
				valueMode="fretNotation"
				fretNotation="x32010"
				chordSymbol="C"
				onChange={() => undefined}
			/>
		</div>
	),
};
