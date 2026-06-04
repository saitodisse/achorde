import { createVisualToStringIndex, resolveViewMode } from "./viewMode.js";
import type { ComputeFretboardFrameInput, FretboardFrame } from "./types.js";

function expandRect(
	rect: { x: number; y: number; width: number; height: number },
	minSize: number,
	bounds: { x: number; y: number; width: number; height: number },
): { x: number; y: number; width: number; height: number } {
	let { x, y, width, height } = rect;

	if (width < minSize) {
		const delta = (minSize - width) / 2;
		x -= delta;
		width = minSize;
	}
	if (height < minSize) {
		const delta = (minSize - height) / 2;
		y -= delta;
		height = minSize;
	}

	const maxX = bounds.x + bounds.width;
	const maxY = bounds.y + bounds.height;
	if (x < bounds.x) {
		width -= bounds.x - x;
		x = bounds.x;
	}
	if (y < bounds.y) {
		height -= bounds.y - y;
		y = bounds.y;
	}
	if (x + width > maxX) {
		width = maxX - x;
	}
	if (y + height > maxY) {
		height = maxY - y;
	}

	return { x, y, width: Math.max(0, width), height: Math.max(0, height) };
}

export function computeFretboardFrame(input: ComputeFretboardFrameInput): FretboardFrame {
	const resolved = resolveViewMode(input.viewMode.orientation, input.viewMode.handedness);
	const padding = input.padding ?? 24;
	const minHitSize = input.minHitSize ?? 44;
	const fretCount = input.fretCount;
	const stringCount = input.stringCount;
	const viewBoxWidth = input.viewBoxWidth ?? resolved.defaultViewBox.width;
	const viewBoxHeight = input.viewBoxHeight ?? resolved.defaultViewBox.height;
	const visualToStringIndex = createVisualToStringIndex(resolved, stringCount);

	const grid = {
		x: padding,
		y: padding,
		width: viewBoxWidth - padding * 2,
		height: viewBoxHeight - padding * 2,
	};

	const isHorizontal = resolved.orientation === "horizontal";
	const fretAxisLength = isHorizontal ? grid.width : grid.height;
	const stringAxisLength = isHorizontal ? grid.height : grid.width;

	const fretPositions = Array.from({ length: fretCount + 1 }, (_, index) => {
		const ratio = index / fretCount;
		return isHorizontal ? grid.x + ratio * fretAxisLength : grid.y + ratio * fretAxisLength;
	});

	const stringPositions = Array.from({ length: stringCount }, (_, visualIndex) => {
		const ratio = stringCount === 1 ? 0.5 : visualIndex / (stringCount - 1);
		return isHorizontal ? grid.y + ratio * stringAxisLength : grid.x + ratio * stringAxisLength;
	});

	const frets = fretPositions.map((position, index) => {
		if (isHorizontal) {
			return {
				index,
				x1: position,
				y1: grid.y,
				x2: position,
				y2: grid.y + grid.height,
			};
		}
		return {
			index,
			x1: grid.x,
			y1: position,
			x2: grid.x + grid.width,
			y2: position,
		};
	});

	const strings = stringPositions.map((position, visualIndex) => {
		const stringIndex = visualToStringIndex(visualIndex);
		if (isHorizontal) {
			return {
				stringIndex,
				x1: grid.x,
				y1: position,
				x2: grid.x + grid.width,
				y2: position,
			};
		}
		return {
			stringIndex,
			x1: position,
			y1: grid.y,
			x2: position,
			y2: grid.y + grid.height,
		};
	});

	const cells: FretboardFrame["cells"] = [];

	for (let visualIndex = 0; visualIndex < stringCount; visualIndex += 1) {
		const stringIndex = visualToStringIndex(visualIndex);
		const stringPos = stringPositions[visualIndex] ?? 0;
		const stringHalf =
			stringCount === 1 ? stringAxisLength / 2 : stringAxisLength / (stringCount - 1) / 2;

		const nutPosition = fretPositions[0] ?? 0;

		for (let fret = 0; fret <= fretCount; fret += 1) {
			let hitRect: { x: number; y: number; width: number; height: number };
			let center: { x: number; y: number };

			if (fret === 0) {
				// Nut only — open/muted; must not cover the first playable fret space.
				if (isHorizontal) {
					hitRect = {
						x: nutPosition - minHitSize / 2,
						y: stringPos - stringHalf,
						width: minHitSize,
						height: stringHalf * 2,
					};
					center = { x: nutPosition, y: stringPos };
				} else {
					hitRect = {
						x: stringPos - stringHalf,
						y: nutPosition - minHitSize / 2,
						width: stringHalf * 2,
						height: minHitSize,
					};
					center = { x: stringPos, y: nutPosition };
				}
			} else {
				const start = fretPositions[fret - 1] ?? nutPosition;
				const end = fretPositions[fret] ?? start;
				const centerAlongFret = start + (end - start) / 2;

				if (isHorizontal) {
					hitRect = {
						x: start,
						y: stringPos - stringHalf,
						width: end - start,
						height: stringHalf * 2,
					};
					center = { x: centerAlongFret, y: stringPos };
				} else {
					hitRect = {
						x: stringPos - stringHalf,
						y: start,
						width: stringHalf * 2,
						height: end - start,
					};
					center = { x: stringPos, y: centerAlongFret };
				}
			}

			hitRect = expandRect(hitRect, minHitSize, grid);

			cells.push({
				stringIndex,
				fret,
				center,
				hitRect,
			});
		}
	}

	return {
		viewBox: { width: viewBoxWidth, height: viewBoxHeight },
		fretCount,
		stringCount,
		viewMode: resolved,
		visualToStringIndex,
		frets,
		strings,
		cells,
		grid,
	};
}
