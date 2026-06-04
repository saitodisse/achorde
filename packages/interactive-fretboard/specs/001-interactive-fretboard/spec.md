# Feature Specification: Interactive Fretboard Editor

**Feature branch:** `001-interactive-fretboard`  
**Created:** 2026-06-04  
**Status:** Approved for implementation

## Goal

Provide a responsive React component that renders a **full interactive fretboard** (many frets, pointer editing) as SVG. Consumers build or edit `FrettedInstrumentVoicing` data without owning hit-testing, viewBox scaling, or string-order layout for handedness.

## Primary User Stories

1. As a **video or blog author**, I want to embed a fretboard that scales to any container width, so clicks still map to the correct string and fret.
2. As a **chord app developer**, I want a controlled voicing value synced with my form and a compact diagram preview from `svguitar-react`.
3. As a **left-handed player**, I want the visual string order mirrored while domain `stringIndex` stays canonical.
4. As a **mobile user**, I want touch targets large enough to toggle open/muted/fretted states reliably.

## Acceptance Scenarios

1. Given default props, when the user taps a fret cell, the voicing updates that `stringIndex` and `onChange` fires with a new `FrettedInstrumentVoicing`.
2. Given fret 0 on a string, when the user taps the same cell again, the state cycles **open → muted → removed** (or open ↔ muted per product parity with AC12).
3. Given `orientation: "horizontal"` and `handedness: "right"`, when rendered at 300px or 1200px CSS width, the same logical tap maps to the same `stringIndex` and fret.
4. Given `handedness: "left"`, when the user taps the visually lowest string, the voicing updates the correct **canonical** `stringIndex` (not a mirrored index in persisted data).
5. Given `valueMode: "fretNotation"`, when the parent passes `fretNotation="x32010"`, the board displays the matching fingering and emits notation on change.
6. Given `detectChord: true` and enough sounding notes, when `onChange` fires, `detectedChord` is populated (best-effort, not required for save).
7. Given CSS `width: 100%` on the wrapper, when the viewport or zoom changes, hit-testing remains accurate (viewBox + CTM).
8. Given all four view modes in Storybook, when switching mode, string labels and hit areas follow the documented axis mapping.

## Functional Requirements

- Render an interactive SVG fretboard with configurable `fretCount`, `stringCount`, and tuning.
- Support **four view modes** (see `contracts/view-modes.md`).
- Convert pointer events to SVG coordinates via `DOMPoint` and `getScreenCTM().inverse()`.
- Hit-test using shared `FretboardFrame` geometry and optional invisible hit-area elements.
- Controlled component: `value` + `onChange` with `FrettedInstrumentVoicing` as canonical shape.
- Optional controlled `fretNotation` mode with adapters to/from voicing via `achorde-musical-domain`.
- Run `inferBarresFromFrettedVoicing` on emitted voicings (configurable, default on).
- Expose CSS variables for colors and sizes (see `contracts/component-api.md`).
- Export headless utilities for testing and custom UIs.

## Non-Functional Requirements

- No required UI framework beyond React peer dependencies.
- Deterministic layout: same props → same `viewBox` and frame geometry.
- Unit-test hit-test and layout without a browser where possible; integration tests with jsdom + SVG CTM mocks.
- Public documentation and changelog in English.
- MIT license, publishable as `@achorde/interactive-fretboard`.

## Out of Scope (v1)

- Drag-to-draw barre on the neck (barre inferred headless only).
- Audio playback.
- Multi-instrument tunings beyond documented guitar standard (extensible later).
- Chord identity, alias, or catalog lookup.
- Replacing or merging into `svguitar-react` `ChordDiagram`.
