export type FretboardOrientation = "horizontal" | "vertical";
export type FretboardHandedness = "right" | "left";

export type FretboardViewMode = {
	orientation: FretboardOrientation;
	handedness: FretboardHandedness;
};

export type FretboardFrame = {
	viewBox: { width: number; height: number };
	fretCount: number;
	stringCount: number;
	viewMode: FretboardViewMode;
	/** Maps visual row/column index (0 = top or left) → canonical stringIndex */
	visualToStringIndex: (visualStringIndex: number) => number;
	frets: Array<{
		index: number;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}>;
	strings: Array<{
		stringIndex: number;
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	}>;
	cells: Array<{
		stringIndex: number;
		fret: number;
		center: { x: number; y: number };
		hitRect: { x: number; y: number; width: number; height: number };
	}>;
	grid: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
};

export type ComputeFretboardFrameInput = {
	viewMode: FretboardViewMode;
	fretCount: number;
	stringCount: number;
	viewBoxWidth?: number;
	viewBoxHeight?: number;
	padding?: number;
	minHitSize?: number;
	/** Extra space along the fret axis before the nut (e.g. tuning labels). */
	nutInset?: number;
};
