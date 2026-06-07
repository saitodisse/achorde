# Release Notes

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
			// e.g. cycle voicing variation
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
