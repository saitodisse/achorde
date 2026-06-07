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
| `dotRadius`           | `number`                                               | `21`                                | Fret/open/muted marker radius (viewBox units)   |
| `dotHoverPadding`     | `number`                                               | `3`                                 | Extra radius for hover ring                     |
| `dotHoverRadius`      | `number`                                               | `dotRadius + padding`               | Override hover ring radius                      |
| `dotLabelFontSize`    | `number` (px)                                          | `17`                                | Text inside markers                             |
| `fretLabelFontSize`   | `number` (px)                                          | `10`                                | Fret number labels                              |
| `tuningLabelFontSize` | `number` (px)                                          | `10`                                | Open-string tuning labels                       |
| `inlayRadius`         | `number`                                               | `6`                                 | Fret inlay dots                                 |
| `tuningLabelGap`      | `number`                                               | `10`                                | Gap between tuning label and nut dot            |
| `nutStrokeWidth`      | `number`                                               | `3`                                 | Nut line stroke width                           |
| `appearance`          | `InteractiveFretboardAppearance`                       | —                                   | Nested appearance overrides                     |
| `colors`              | `InteractiveFretboardColors`                           | dark theme defaults                 | CSS variable overrides on wrapper               |
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

## Finger assignment (mouse)

On an **already fretted** cell (matching string and fret):

| Button     | `pointerButton` | Behavior                                                             |
| ---------- | --------------- | -------------------------------------------------------------------- |
| Right      | `secondary`     | Cycle finger index on that string: 1 → 2 → 3 → 4 → 1; updates sticky |
| Middle     | `middle`        | Assign the current **sticky** finger (last value from right-click)   |
| Left/touch | `primary`       | Normal tap cycle (fingers preserved on unchanged strings)            |

Auxiliary mouse buttons are ignored. Context menu is suppressed while editing.

## Exported utilities (public)

```ts
export { screenToSvgPoint } from "../interaction/screenToSvgPoint";
export { hitTestFretCell } from "../interaction/hitTestFretCell";
export { resolvePointerButton } from "../interaction/resolvePointerButton";
export { computeFretboardFrame } from "../layout/computeFretboardFrame";
export type { FretboardFrame, FretboardViewMode } from "../layout/types";
export { voicingToEditorState, editorStateToVoicing } from "../adapters/voicingEditorState";
export { applyFingerCycle, applyFingerStick, cycleFingerIndex } from "../adapters/applyFinger";
export {
	resolveInteractiveFretboardAppearance,
	interactiveFretboardThemeStyle,
	DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE,
	DEFAULT_INTERACTIVE_FRETBOARD_COLORS,
} from "../components/InteractiveFretboard/resolveAppearance";
```

## Peer dependencies

- `react` >= 18
- `react-dom` >= 18

## Dependencies

- `achorde-musical-domain` (workspace / semver range when published)
