# Core Pipeline

The core is the framework-agnostic heart of the library.

## Responsibilities

- **`parseTab()`** — primary headless parser: multiline body → `ParsedTab` → `ParsedTabSection` → `ParsedTabLine` → `ParsedTabToken`.
- **`prepareSong()`** — internal styled-viewer pipeline: split sections → pair lines → extract chords → transpose → interleaved `barList`.
- Export shared types: `ParsedTab`, `ParsedTabSection`, `ParsedTabLine`, `ParsedTabToken`, `PreparedSong`, `TabStyleConfig`, `DEFAULT_TAB_STYLE`, parser/transposer types.
- Shared parser symbols and diagnostics come from `achorde-musical-domain`.

## Layout

- `src/core/parser/` — `splitSections`, pairer, chord extractor
- `src/core/transposer/` — semitone transpose (`@tonaljs/tonal`), `chordToText`
- `src/core/renderer/` — `generateBarList`
- `src/core/prepareSong.ts` — orchestrator
## Constraints

- No React imports.
- No DOM assumptions.
- Prefer pure functions and small transformation steps.

## Testing

- Tests in `src/core/__tests__/`.
- Use `src/test/stubs/tua-flor.txt` for integration-style coverage.
- Cover `parseTab`, `prepareSong`, and `generateBarList` behavior.
