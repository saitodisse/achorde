import type { Meta, StoryObj } from "@storybook/react-vite";
import { inferBarresFromFrettedVoicing } from "@achorde/musical-domain";
import { ChordDiagram } from "@achorde/svguitar-react";
import {
	chordDiagramView,
	fretboardArgTypes,
	fretboardDefaultArgs,
	useInteractiveFretboardStoryState,
	type StoryArgs,
} from "./fretboardStoryHelpers.js";
import { InteractiveFretboard } from "../components/InteractiveFretboard/InteractiveFretboard.js";

function EditorVsDiagramStory(args: StoryArgs) {
	const {
		boardProps,
		valueMode,
		fretNotation,
		chordSymbol,
		voicing,
		orientation,
		handedness,
		wrapperStyle,
		handleChange,
	} = useInteractiveFretboardStoryState(args);

	const diagramView = chordDiagramView(orientation, handedness);
	const fretCount = boardProps.fretCount ?? 5;

	/** Re-sync barres every render (clears stale barres when ≤4 fingers are pressed). */
	const diagramVoicing = voicing ? inferBarresFromFrettedVoicing(voicing) : null;

	const board =
		valueMode === "fretNotation" ? (
			<InteractiveFretboard
				{...boardProps}
				orientation={orientation}
				handedness={handedness}
				valueMode="fretNotation"
				fretNotation={fretNotation}
				chordSymbol={chordSymbol}
				onChange={handleChange}
			/>
		) : (
			<InteractiveFretboard
				{...boardProps}
				orientation={orientation}
				handedness={handedness}
				valueMode="voicing"
				value={voicing ?? undefined}
				fretNotation={fretNotation}
				chordSymbol={chordSymbol}
				onChange={handleChange}
			/>
		);

	const viewportBoardStyle =
		orientation === "vertical"
			? { maxHeight: "100dvh", overflow: "hidden" as const, width: "100%" }
			: undefined;

	return (
		<div style={{ ...wrapperStyle, maxHeight: "100dvh" }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: orientation === "vertical" ? "minmax(0, 1fr) auto" : "1fr auto",
					gap: 24,
					alignItems: "start",
					width: "100%",
					maxHeight: "100dvh",
				}}
			>
				<div style={viewportBoardStyle}>{board}</div>
				{diagramVoicing ? (
					<ChordDiagram
						voicing={diagramVoicing}
						view={diagramView}
						fretCount={fretCount}
						stringCount={boardProps.stringCount ?? 6}
						autoBarreEnabled={false}
						zoom={1.8}
						height={300}
						width={200}
						canvasOffsetY={10}
						tuningLabelOffsetY={0.5}
						stringIndicatorOffsetY={0.3}
					/>
				) : null}
			</div>
			{diagramVoicing ? (
				<p style={{ color: "#aaa", fontFamily: "monospace", fontSize: 12, marginTop: 8 }}>
					strings:{" "}
					{diagramVoicing.strings
						.map((s) => `${s.stringIndex}:${s.state}${s.fret ?? ""}`)
						.join(" ")}{" "}
					| barres: {(diagramVoicing.barres ?? []).length}
				</p>
			) : null}
		</div>
	);
}

const meta = {
	title: "InteractiveFretboard/Comparison",
	component: InteractiveFretboard,
	render: (args: StoryArgs) => <EditorVsDiagramStory {...args} />,
	parameters: {
		controls: { expanded: true },
		layout: "fullscreen",
	},
	argTypes: fretboardArgTypes,
	args: {
		...fretboardDefaultArgs,
		fullWidth: true,
		orientation: "vertical",
		handedness: "right",
		fretCount: 5,
	},
} satisfies Meta<StoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EditorVsDiagram: Story = {
	args: {
		viewBoxWidth: 400,
		viewBoxHeight: 550,
	},
};
