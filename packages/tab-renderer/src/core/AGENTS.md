# Core Pipeline

The core is the framework-agnostic heart of the library.

## Responsibilities

- **`parseTab()`** — primary headless parser: multiline body → `ParsedTab` (AST 2.2.0; chord-line majority rule; `DecorationToken` for non-chord parens).
- **`prepareSongFromParsedTab()`** — styled `Tab` pipeline: align chord/lyric lines → `extractChordLineMarkers` → `generateBarList` → interleaved segments.
- **`prepareSong()`** — legacy pairer pipeline: split sections → pair lines → `extractChords` → transpose → `barList`.
- Export shared types: `ParsedTab`, `ParsedTabSection`, `ParsedTabLine`, `ParsedTabToken`, `PreparedSong`, `TabStyleConfig`, `DEFAULT_TAB_STYLE`, parser/transposer types.
- Shared parser symbols and diagnostics come from `achorde-musical-domain`.

## Layout

- `src/core/parser/` — `tokenizeContentWord`, `tokenizeRawLine`, `parseChordSymbol`, pairer, `extractChordLineMarkers`
- `src/core/transposer/` — `transposeParsedTab`, `transposeChordSymbol`, `chordToText`
- `src/core/renderer/` — `generateBarList` (markers + legacy chord list)
- `src/core/prepareSongFromParsedTab.ts` — orchestrator for `Tab`
- `src/core/prepareSong.ts` — legacy orchestrator
## Constraints

- No React imports.
- No DOM assumptions.
- Prefer pure functions and small transformation steps.

## Testing

- Tests in `src/core/__tests__/`.
- Use `src/test/stubs/tua-flor.txt` for integration-style coverage.
- Cover `parseTab`, `prepareSongFromParsedTab`, `prepareSong`, and `generateBarList` behavior.
- Fixtures: `tua-flor.txt`, `so-quero-esse-amor.txt` (parens, extensions, `D7/9`).
