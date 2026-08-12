# Interleaved bars and style configuration

## Status

Accepted and implemented since `0.2.0`. The strict `ParsedTab` bridge became the default viewer path in `0.7.0`.

## Context

Chord charts need chords to stay aligned with lyric fragments while still supporting transposition, chord-only lines, lyrics-only lines, and compact display modes. A two-line text model is easy to author but awkward to render responsively.

## Decision

The package keeps parsing and rendering in separate stages:

```text
parseTab
  -> transposeParsedTab (optional)
  -> prepareSongFromParsedTab
  -> generateBarList
  -> React Tab
```

The prepared output interleaves chord, decoration, lyric, and spacing segments. React raises chord and decoration segments above the lyric line with relative positioning while the container preserves whitespace.

The headless package root exports the parser and preparation pipeline. `@achorde/tab-renderer/react` exports `Tab`, composable primitives, `DEFAULT_TAB_STYLE`, and the style types.

`TabStyleConfig` owns chart presentation such as typography, colors, chord offsets, display mode, view mode, transposition, and content margin. Scrolling and fullscreen behavior remain application concerns.

## Consequences

- Headless consumers can parse, transpose, and prepare data without React.
- React consumers get a convenient viewer without losing access to composable primitives.
- `ParsedTab.chordsFound` remains the only supported chord-discovery result.
- Decoration markers preserve their source columns but are never transposed or added to `chordsFound`.
- The older `prepareSong()` pairer remains for compatibility, so maintainers must avoid mixing its heuristics with strict parser rules.

## Alternatives considered

A fixed CSS grid was rejected because it made source-column spacing and chord-only lines harder to preserve. A React-only pipeline was rejected because non-React consumers also need parsing and transposition.

## Related documentation

- [Package structure](./0001-package-structure-and-public-api.md)
- [Usage guide](../../README.md)
- [Parsing vocabulary](../../CONTEXT.md)
