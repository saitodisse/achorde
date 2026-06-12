# Core Pipeline

The core is the framework-agnostic heart of the library.

## Responsibilities

- **`parseTab()`** — primary headless parser: multiline body → `ParsedTab` (AST 2.2.2; chord-line majority rule; `DecorationToken` for non-chord parens).
- **`prepareSongFromParsedTab()`** — styled `Tab` pipeline: align chord/lyric lines → `extractChordLineMarkers` → `generateBarList` → interleaved segments.
- **`prepareSong()`** — legacy pairer pipeline: split sections → pair lines → `extractChords` → transpose → `barList`.
- Export shared types: `ParsedTab`, `ParsedTabSection`, `ParsedTabLine`, `ParsedTabToken`, `PreparedSong`, `TabStyleConfig`, `DEFAULT_TAB_STYLE`, parser/transposer types.
- Shared parser symbols and diagnostics come from `achorde-musical-domain`.
- `ParsedTab.chordsFound` must stay in sync with the AST and is built from real `ChordToken` values only.

## Parser Order

When changing chord detection, keep this order in mind:

1. `parseChordSymbol()` decides whether a token is a valid chord symbol.
2. `tokenizeContentWord()` turns one whitespace-delimited word into chord, lyric, or decoration tokens.
3. `tokenizeRawLine()` scans the original line while preserving columns.
4. `parseTab()` groups lines into sections and finalizes the AST.
5. `collectDiagrammableChords()` walks the AST and fills `ParsedTab.chordsFound`.
6. `transposeParsedTab()` must recalculate the same list after transposition.

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
- Any change to chord detection should add or update a test that proves the exact `chordsFound` output.
