# Contract: FretboardFrame Layout

## Purpose

Single source of truth for **drawing** and **hit-testing** in SVG user space (viewBox units).

## Inputs

```ts
type ComputeFretboardFrameInput = {
	viewMode: FretboardViewMode;
	fretCount: number;
	stringCount: number;
	viewBoxWidth?: number;
	viewBoxHeight?: number;
	padding?: number;
	minHitSize?: number;
};
```

## Output: `FretboardFrame`

See [`data-model.md`](../data-model.md).

## Invariants

1. `viewBox` width/height are positive integers used on the root `<svg viewBox="0 0 W H">`.
2. Every `cells[]` entry has a `hitRect` fully inside the grid bounds.
3. `hitRect` width and height are each ≥ `minHitSize` (expand toward fret center; clamp at grid edge).
4. Fret index `0` is the nut/open region; frets `1..fretCount` are fretted regions.
5. `visualToStringIndex` is injective: each visual string maps to exactly one canonical `stringIndex`.

## Nut region

- Fret `0` hit region is a narrow strip centered on the nut line (open/muted only).
- Open/muted toggles only apply in fret `0` regions.

## Fretted regions

- For fret `n ≥ 1`, hit region is the cell **between** fret lines `n-1` and `n`; dot and label centers sit at the midpoint of that space (not on the metal fret wire).

## CSS display vs viewBox

The frame is computed **only** from props, never from `getBoundingClientRect` of rendered elements.

Screen → frame conversion happens in `screenToSvgPoint` before `hitTestFretCell`.
