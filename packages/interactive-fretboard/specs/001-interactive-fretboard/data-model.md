# Data Model: Interactive Fretboard Editor

## Canonical value: `FrettedInstrumentVoicing`

The component’s primary controlled value is `FrettedInstrumentVoicing` from `achorde-musical-domain`.

- **`stringIndex`**: 1-based, low string = 1, high string = 6 (guitar standard).
- **Per-string `state`**: `"open" | "muted" | "fretted"`.
- **`barres`**: optional; emitted voicing should include bars inferred on change when `inferBarresOnChange` is true (default).

View modes affect **only visual placement**, not stored indices.

## Convenience value: `fretNotation`

When `valueMode: "fretNotation"`:

- Input: 6-character notation, low string → high string (e.g. `x32010`).
- Internal: parse via `parseFretNotationToVoicing`, edit, format back on change.
- Parent may still persist voicing after save in AC15.

## Editor state (internal)

```ts
type FretEditorCell = {
	stringIndex: number;
	fret: number; // 0 = nut region
	state: "empty" | "open" | "muted" | "fretted";
};

type FretboardEditorState = {
	cells: Map<number, FretEditorCell>; // keyed by stringIndex
};
```

## Change payload

```ts
type InteractiveFretboardChangeDetails = {
	voicing: FrettedInstrumentVoicing;
	fretNotation?: string;
	pressedNotes: string[];
	detectedChord?: string;
};
```

## Layout frame (headless)

```ts
type FretboardViewMode = {
	orientation: "horizontal" | "vertical";
	handedness: "right" | "left";
};

type FretboardFrame = {
	viewBox: { width: number; height: number };
	fretCount: number;
	stringCount: number;
	/** Maps visual row/column index → canonical stringIndex */
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
		hitRect: { x: number; y: number; width: number; height: number };
	}>;
};
```

## CSS variables (theming)

| Variable               | Purpose                  |
| ---------------------- | ------------------------ |
| `--ifret-bg`           | Neck background          |
| `--ifret-fret-color`   | Fret lines               |
| `--ifret-string-color` | String lines             |
| `--ifret-dot-fill`     | Active finger dot        |
| `--ifret-dot-muted`    | Muted indicator          |
| `--ifret-hover-fill`   | Hover preview            |
| `--ifret-inlay-fill`   | Fret markers             |
| `--ifret-label-color`  | Fret numbers / note text |
