# Changelog

All notable changes to this project are documented in this file.

## [0.4.0] - 2026-05-27

### Added

- `parseTab()` now exposes `chordsFound`, a stable de-duplicated list of chord symbols found in the parsed tab body.
- The core AST keeps the chord discovery result alongside the existing section/line/token tree so downstream consumers can resolve chord panels without re-scanning the text.

### Changed

- `tab-renderer` now depends on `achorde-musical-domain` `^0.2.0` to share the expanded parsed-tab contract.

## [0.3.0] - 2026-05-24

### Changed

- Replaced the legacy `transform()` pipeline with the explicit `parseTab()` headless core API and a richer parsed tab AST.
- Removed the old public `Song`, `Section`, `Line`, and `Token` aliases in favor of the new parser and AST types.
- Updated the React adapter, stories, README, and tests to consume the new parsed tab format directly.
- Shared parser symbols and diagnostics now come from `achorde-musical-domain` instead of being duplicated locally.

## [0.2.0] - 2026-05-24

### Added

- Headless `prepareSong()` pipeline (split sections, pair lines, extract chords, transpose, interleaved `barList`) ported from Achordex.
- Public `TabStyleConfig`, `DEFAULT_TAB_STYLE`, `PreparedSong`, and related types on core and `./react` entrypoints.
- `@tonaljs/tonal` dependency for semitone transposition in core.
- Styled React viewer: `Tab` uses `prepareSong` + CSS chord-over-lyric layout (`pre-wrap`, relative offset spans).
- Storybook groups `01 Core`–`07 Styling` using the full `tua-flor` fixture; `07 Styling` is a single story with all `TabStyleConfig` controls.
- Storybook **Theme** toolbar (light/dark) with readable inset previews (`tab-story-raw` / `tab-story-ast`).
- Core and React tests for `prepareSong`, `generateBarList`, and styled `Tab` behavior.

### Changed

- `Tab` is only the interleaved styled viewer (`prepareSong`); token AST layout uses composable primitives (`Tab.Root`, `Tab.Section`, …), not a separate `Tab.Legacy` export.
- Teaching stories `01`–`06` use `story-tua-flor.ts` helpers; captions highlight differences per step.
- README and docs index updated for v0.2; PRD/RFC/plan marked implemented.

## [0.1.0] - 2026-05-23

### Added

- Bootstrapped a new open-source `tab-renderer` package from scratch with Vite.
- Added a headless core entrypoint that normalizes raw chord sheet `body` text into a minimal AST.
- Added a public React adapter entrypoint with `Tab`, `Tab.Root`, `Tab.Section`, `Tab.Line`, `Tab.Chord`, and `Tab.Lyric`.
- Added Storybook for isolated UI development and Storybook stories driven by the shared `tua-flor.txt` fixture.
- Added Vitest and Testing Library with TDD coverage for the core transformation path and the public React adapter.
- Added package exports for `.` and `./react` to support npm and git-based consumption.
- Added documentation artifacts in `docs/prd/`, `docs/rfc/`, and `docs/plans/`.
- Added a shared real-world fixture at `src/test/stubs/tua-flor.txt` and wired it into tests, stories, and the demo app.
- Added repository guidance files (`AGENTS.md`) for the root, docs, `src/`, `src/core/`, `src/react/`, and `src/test/`.

### Changed

- Replaced the default Vite starter app with a demo that renders the public React adapter.
- Reworked the generated Storybook scaffold to focus on the library surface instead of the starter template.
- Adjusted build and lint configuration so the repository behaves like a publishable package rather than a throwaway app.
