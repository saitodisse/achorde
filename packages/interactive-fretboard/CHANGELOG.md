# Changelog

All notable changes to `@achorde/interactive-fretboard` are documented in this file.

## [0.1.11] - 2026-06-06

### Added

- Configurable appearance props: `dotRadius`, `dotHoverPadding`, `dotLabelFontSize`, fret/tuning label sizes, `inlayRadius`, `nutStrokeWidth`, and `colors` (CSS variables).
- `resolveInteractiveFretboardAppearance`, `interactiveFretboardThemeStyle`, `DEFAULT_INTERACTIVE_FRETBOARD_APPEARANCE`, and related exports.
- Storybook: Appearance and Colors control groups; **AppearancePlayground** story.
- Unit tests for appearance resolution, component DOM application, story arg coverage, and `boardProps` forwarding.

## [0.1.10] - 2026-06-06

### Added

- Finger assignment on fretted cells: right-click (`secondary`) cycles finger 1→4→1; middle-click (`middle`) applies the sticky finger (last value from right-click) to another fretted string.
- Editor state preserves `finger` per string through voicing round-trip and primary tap edits.
- Fret dots show finger number when assigned.

## [0.1.9] - 2026-06-06

### Added

- `pointerButton` on `InteractiveFretboardChangeDetails`: `"primary"` (left / touch / pen), `"middle"`, or `"secondary"` (right click).
- Exported `resolvePointerButton()` and `InteractiveFretboardPointerButton` for headless reuse.
- Middle and secondary mouse buttons trigger the same edit pipeline with distinct identification; context menu is suppressed while editing.

## [0.1.8] - 2026-06-04

### Changed

- Vertical default viewBox height scales with `fretCount` (`defaultVerticalViewBoxHeight`); compact default for typical 5-fret editors.
- Storybook: shared `fretboardStoryHelpers`, `partitionStoryArgs`, and `WithChordDiagram` controls refactor.

### Added

- Handedness layout tests (`viewMode.handedness.test.ts`).

## [0.1.7] - 2026-06-04

### Fixed

- Published tarball now includes `dist/index.d.ts` (Vite `emptyOutDir` no longer wipes declarations emitted by `tsc`).

## [0.1.6] - 2026-06-04

### Fixed

- `showTuning`: `nutInset` layout and label placement so open-string dots no longer overlap tuning names.

### Changed

- Storybook: full Controls panel (`argTypes` / `args`), `Playground` story, fullscreen horizontal presets.

## [0.1.5] - 2026-06-04

### Fixed

- Fret dot labels and chord detection: transpose by semitone count (`Interval.fromSemitones`) instead of `${fret}m` (Tonal v6 treats `1m` as unison, so fret 1 showed open-string names).

## [0.1.4] - 2026-06-04

### Fixed

- Fret cell geometry: fret `n ≥ 1` is the space between wires `n-1` and `n` (fixes C major `x32010` dots one fret too high and unclickable first-fret space).
- Fret `0` hit target is nut-only; open/muted no longer blocks the first fret cell.
- Fret number labels centered in each fret space (horizontal layout).

## [0.1.3] - 2026-06-04

### Fixed

- `valueMode="fretNotation"`: stop infinite `useEffect` → `setEditorState` loop when props are stable (Storybook `FretNotationMode` froze the tab).

## [0.1.2] - 2026-06-04

### Fixed

- Library build externals: published bundle now imports `@achorde/musical-domain` (not legacy `achorde-musical-domain`).

## [0.1.1] - 2026-06-04

### Changed

- Workspace dependencies use `@achorde/musical-domain` and `@achorde/svguitar-react` scoped names.

## [0.1.0] - 2026-06-04

### Added

- `InteractiveFretboard` React component with four view modes (orientation × handedness).
- Headless layout (`computeFretboardFrame`), hit-test (`screenToSvgPoint`, `hitTestFretCell`, `buildHitAreas`).
- Voicing editor adapters, AC12-compatible fret-0 tap cycle, barre inference via `achorde-musical-domain`.
- Optional chord detection (`tonal`, `@tonaljs/chord-detect`).
- Storybook on port 6010, Vitest unit tests, Vite library build.
