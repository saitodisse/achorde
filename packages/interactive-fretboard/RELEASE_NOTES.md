# Release Notes

## Version 0.1.11

**Release date:** June 6, 2026

### Configurable appearance

Dot size, label font sizes, inlay radius, nut stroke width, and theme colors are now **props** on `InteractiveFretboard` (or nested under `appearance`). Defaults match the previous hard-coded values (`dotRadius: 21`, `dotLabelFontSize: 17`, etc.).

New exports for headless reuse:

- `resolveInteractiveFretboardAppearance()`
- `interactiveFretboardThemeStyle()`
- `DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE`, `DEFAULT_INTERACTIVE_FRETBOARD_COLORS`
- `DEFAULT_*` constants for individual sizes

Storybook exposes every appearance and color control; see the **AppearancePlayground** story.

```tsx
<InteractiveFretboard
	value={voicing}
	onChange={setVoicing}
	dotRadius={28}
	dotLabelFontSize={20}
	colors={{ dot: "#f59e0b", background: "#111" }}
/>
```

```bash
pnpm add @achorde/interactive-fretboard@0.1.11
```

## Version 0.1.10

**Release date:** June 6, 2026

### Finger assignment

On **already fretted** cells:

- **Right click** (`pointerButton: "secondary"`): cycle finger index 1 → 2 → 3 → 4 → 1 and update sticky finger.
- **Middle click** (`pointerButton: "middle"`): assign the current sticky finger to the cell.
- Dots show the finger number when assigned; fingers round-trip through `FrettedInstrumentVoicing`.

Exports: `applyFingerCycle`, `applyFingerStick`, `cycleFingerIndex`.

```bash
pnpm add @achorde/interactive-fretboard@0.1.10
```

## Version 0.1.9

**Release date:** June 6, 2026

### Pointer button identification

`onChange` now includes **`pointerButton`**: `"primary"` (left click, touch, or pen), `"middle"`, or `"secondary"` (right click). Consumers can branch on the button without re-implementing hit-testing.

Right-click opens no browser context menu while the fretboard is editable (`onChange` set). Auxiliary mouse buttons (back / forward) are ignored.

```tsx
<InteractiveFretboard
	value={voicing}
	onChange={(details) => {
		if (details.pointerButton === "secondary") {
			// e.g. cycle finger on fretted string
		} else {
			setVoicing(details.voicing);
		}
	}}
/>
```

```bash
pnpm add @achorde/interactive-fretboard@0.1.9
```

## Version 0.1.6

**Release date:** June 4, 2026

### Fret labels and chord detection (0.1.5)

Fret dot labels and chord detection now transpose by semitone count (`Interval.fromSemitones`). Previously, Tonal v6 treated `1m` as unison, so the first fret showed open-string note names.

### Tuning labels (0.1.6)

When `showTuning` is enabled, the layout reserves space before the nut (`nutInset`) and places tuning labels to the left of open-string dots, avoiding overlap with fret-0 markers.

### Storybook

Stories expose all component props in the Controls panel, including a `Playground` story and fullscreen horizontal layouts for easier visual QA.

```bash
pnpm add @achorde/interactive-fretboard
```
