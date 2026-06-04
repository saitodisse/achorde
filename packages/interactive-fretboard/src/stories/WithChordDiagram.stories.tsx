import type { Meta, StoryObj } from "@storybook/react";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";
import { ChordDiagram } from "@achorde/svguitar-react";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";

const voicing =
	parseFretNotationToVoicing({
		fretNotation: "x32010",
		chordSymbol: "C",
		id: "compare",
	}) ?? null;

const meta: Meta = {
	title: "InteractiveFretboard/Comparison",
};

export default meta;

type Story = StoryObj;

export const EditorVsDiagram: Story = {
	render: () =>
		voicing ? (
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr auto",
					gap: 24,
					alignItems: "start",
					maxWidth: 900,
				}}
			>
				<InteractiveFretboard value={voicing} />
				<ChordDiagram fretNotation="x32010" view="vertical-right" />
			</div>
		) : null,
};
