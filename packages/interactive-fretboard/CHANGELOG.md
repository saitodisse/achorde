# Changelog

All notable changes to `@achorde/interactive-fretboard` are documented in this file.

## [0.1.0] - 2026-06-04

### Added

- `InteractiveFretboard` React component with four view modes (orientation × handedness).
- Headless layout (`computeFretboardFrame`), hit-test (`screenToSvgPoint`, `hitTestFretCell`, `buildHitAreas`).
- Voicing editor adapters, AC12-compatible fret-0 tap cycle, barre inference via `achorde-musical-domain`.
- Optional chord detection (`tonal`, `@tonaljs/chord-detect`).
- Storybook on port 6010, Vitest unit tests, Vite library build.
