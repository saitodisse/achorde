# Changelog

All notable changes to this project are documented in this file.

## [0.8.0] - 2026-06-04

### Changed

- **BREAKING:** npm package renamed from `tab-renderer` to `@achorde/tab-renderer`. Depends on `@achorde/musical-domain` instead of `achorde-musical-domain`. Update `package.json` and import paths; no functional changes from 0.7.1.

## [0.7.1] - 2026-05-28

### Fixed

- `parseChordSymbol()` rejects lyric words that start with a note letter (e.g. `Eu`, `De`) so they are not listed in `chordsFound` or tokenized as chords.
- Invalid-chord diagnostics on lyric lines use chord-shaped tokens only, not any word that begins with `A`–`G`.

## [0.7.0] - 2026-05-28

### Added

- `DecorationToken` in the strict AST for parenthesis markers that are not part of a chord spelling.
- `prepareSongFromParsedTab()` bridges `parseTab()` token positions into the interleaved styled viewer pipeline.
- `extractChordLineMarkers()` elevates each decoration and chord at its source column for `blockMarginRight` / `chordHeight` layout.
- Chord spelling support for slash alterations (`D7/9`), parenthetical extensions (`C7(13)`), and glued decoration parens (`(C7`, `B7)`).
- `TabDecoration` primitive and `CONTEXT.md` glossary for strict chord-line parsing.

### Changed

- `TAB_RENDERER_PARSER_VERSION` and `TAB_RENDERER_AST_VERSION` bumped to `2.2.0`.
- Styled `Tab` uses `parseTab` → `transposeParsedTab` → `prepareSongFromParsedTab` → `generateBarList` (restores RFC 0002 interleaved offsets).
- Chord-line classification uses a token-majority rule instead of requiring every content token to be a chord.
- Depends on `achorde-musical-domain` `0.3.1` for `DecorationToken` in `ParsedTabTokenKind`.

### Documentation

- README, RFC/plan index, `CONTEXT.md`, and [`docs/plans/2026-05-28-decoration-markers-parsed-tab-bridge.md`](./docs/plans/2026-05-28-decoration-markers-parsed-tab-bridge.md) describe the ParsedTab bridge and decoration marker rendering.
- Shared fixture `so-quero-esse-amor.txt` for extensions and parenthesized chord rows.

## [0.6.0] - 2026-05-28

### Added

- Interactive live demo on the package site: editable source, responsive wide split, and preview tabs (Rendered, Chords, Details, Sections, Complete JSON) backed by `parseTab()` inspectors.
- `ChordsFoundPanel` Storybook helper for diagrammable chord lists.

### Changed

- `TAB_RENDERER_PARSER_VERSION` and `TAB_RENDERER_AST_VERSION` bumped to `2.1.0`; chords and lyrics may appear on the same line (removed `chordsAndLyricsOnSameLine` strict error).
- DialKit style controls are hidden by default and opened from a floating top-right toggle; main content uses full width.
- Default `TabStyleConfig` demo values aligned with the DialKit panel (font size, line height, colors).

## [0.5.0] - 2026-05-28

### Added

- Strict `parseTab()` grammar: four line kinds (`section-header`, `chords`, `lyrics`, `blank`); invalid authoring emits `severity: "error"` diagnostics with original line text preserved.
- `transposeChordSymbol()` and `transposeParsedTab()` for headless AST transposition (slash chords, repeat `/` invariant).
- `collectDiagrammableChords()` and exported `STRICT_LINE_DIAGNOSTIC_CODES`.
- `parseChordSymbol()` extracted to `src/core/parser/parseChordSymbol.ts`.
- Dev-only parse observability (`summarizeParsedTab`, `[tab-renderer]` console groups) in Storybook and local dev.
- Storybook group `00 Strict parser (phase 1)` with runtime health panel and parse inspectors.
- Workspace package `achorde-storybook-config` for shared Storybook + Vite 7 setup.

### Changed

- `TAB_RENDERER_PARSER_VERSION` and `TAB_RENDERER_AST_VERSION` bumped to `2.0.0` (breaking strict grammar vs permissive lines).
- `chordsFound` excludes repeat markers (`/`).
- Section headers on their own line appear as `ParsedTabLine` with `kind: "section-header"`.
- Storybook uses Vite 7 (monorepo override) to avoid iframe `500` / `Missing field moduleType` with Vite 8.
- Removed default Storybook starter stories under `src/stories/` (library stories live under `src/react/stories/`).

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
