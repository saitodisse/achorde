# Contract: InteractiveFretboard Component API

## Component

```ts
export function InteractiveFretboard(props: InteractiveFretboardProps): JSX.Element;
```

## Props

| Prop                  | Type                                                   | Default                             | Description                                     |
| --------------------- | ------------------------------------------------------ | ----------------------------------- | ----------------------------------------------- |
| `value`               | `FrettedInstrumentVoicing`                             | required when `valueMode="voicing"` | Canonical controlled value                      |
| `valueMode`           | `"voicing" \| "fretNotation"`                          | `"voicing"`                         | Input shape                                     |
| `fretNotation`        | `string`                                               | —                                   | Required when `valueMode="fretNotation"`        |
| `chordSymbol`         | `string`                                               | `""`                                | Passed into parse pipeline for notation mode    |
| `onChange`            | `(details: InteractiveFretboardChangeDetails) => void` | —                                   | After each successful edit                      |
| `orientation`         | `"horizontal" \| "vertical"`                           | `"horizontal"`                      | Neck axis                                       |
| `handedness`          | `"right" \| "left"`                                    | `"right"`                           | Mirrors visual string order                     |
| `fretCount`           | `number`                                               | `16`                                | Number of frets shown (nut = 0)                 |
| `stringCount`         | `number`                                               | `6`                                 | Strings (guitar)                                |
| `tuning`              | `string[]`                                             | standard guitar scientific          | Open-string notes for labels/detection          |
| `inferBarresOnChange` | `boolean`                                              | `true`                              | Run `inferBarresFromFrettedVoicing` before emit |
| `detectChord`         | `boolean`                                              | `true`                              | Populate `detectedChord` in `onChange`          |
| `showFretNumbers`     | `boolean`                                              | `true`                              | Fret labels below/along neck                    |
| `showInlays`          | `boolean`                                              | `true`                              | Fret markers                                    |
| `showDotText`         | `boolean`                                              | `true`                              | Pitch class inside dots                         |
| `showTuning`          | `boolean`                                              | `false`                             | Open-string labels at nut                       |
| `viewBoxWidth`        | `number`                                               | mode-dependent                      | Override logical width                          |
| `viewBoxHeight`       | `number`                                               | mode-dependent                      | Override logical height                         |
| `minHitSize`          | `number`                                               | `44`                                | Min hit rect dimension in viewBox units         |
| `className`           | `string`                                               | —                                   | Wrapper class                                   |
| `style`               | `CSSProperties`                                        | —                                   | Wrapper style                                   |
| `disabled`            | `boolean`                                              | `false`                             | Ignore pointer                                  |
| `aria-label`          | `string`                                               | `"Interactive fretboard"`           | Root SVG a11y                                   |

## Change details

```ts
export type InteractiveFretboardChangeDetails = {
	voicing: FrettedInstrumentVoicing;
	fretNotation?: string;
	pressedNotes: string[];
	detectedChord?: string;
	pointerButton: "primary" | "middle" | "secondary";
};
```

`pointerButton` reflects which button initiated the edit: `"primary"` (left / touch / pen), `"middle"`, or `"secondary"` (right). Auxiliary buttons are ignored.

## Tap cycle (fret 0)

| Current | Next tap on same string/fret 0                          |
| ------- | ------------------------------------------------------- |
| empty   | open                                                    |
| open    | muted                                                   |
| muted   | empty (or open — pick one in impl; tests lock behavior) |

Fret ≥ 1: tap toggles fretted on that fret; tap same cell again removes string from voicing.

## Exported utilities (public)

```ts
export { screenToSvgPoint } from "../interaction/screenToSvgPoint";
export { hitTestFretCell } from "../interaction/hitTestFretCell";
export { computeFretboardFrame } from "../layout/computeFretboardFrame";
export type { FretboardFrame, FretboardViewMode } from "../layout/types";
export { voicingToEditorState, editorStateToVoicing } from "../adapters/voicingEditorState";
```

## Peer dependencies

- `react` >= 18
- `react-dom` >= 18

## Dependencies

- `achorde-musical-domain` (workspace / semver range when published)
