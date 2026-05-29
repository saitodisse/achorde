# Decoration markers and ParsedTab → styled viewer bridge

**Status:** implemented
**Date:** 2026-05-28
**Packages:** `tab-renderer` 0.7.0, `achorde-musical-domain` 0.3.1

## Goal

Keep RFC 0002 interleaved rendering (`blockMarginRight`, `chordHeight`) while fixing strict-parser edge cases:

- Parentheses that are **not** part of a chord symbol (`( C7`, `B7)`)
- Parenthetical **extensions** inside a symbol (`C7(13)`, `B7(9-)`)
- Slash **alterations** vs slash **bass** (`D7/9` vs `E7/G#`)
- Column-accurate elevation of each decoration character above lyrics

## Parser decisions (`parseTab` 2.2.0)

| Input        | Tokenization                                      |
| ------------ | ------------------------------------------------- |
| `( C7`       | `DecorationToken` `(` + `ChordToken` `C7`         |
| `C7(13)`     | single `ChordToken` `C7(13)`                      |
| `D7/9`       | single `ChordToken` `D7/9` (suffix `7/9`)         |
| `E7/G#`      | single `ChordToken` with `bass`                   |
| `C letra …`  | `kind: "lyrics"` (majority rule)                  |

Glossary: [`CONTEXT.md`](../../CONTEXT.md) at package root.

## Styled viewer bridge

```
parseTab(body)
  → transposeParsedTab(parsed, n)   // optional
  → prepareSongFromParsedTab(transposed, { viewMode })
  → generateBarList({ chordLineMarkers })
  → buildTabNodes(style)            // getChordSpanStyle per chord + decoration
```

`prepareSong()` (legacy pairer + `extractChords`) remains for direct headless use; **`Tab` uses `prepareSongFromParsedTab`**.

### `extractChordLineMarkers`

Emits ordered markers at `startColumn`:

- `kind: "decoration"` — elevated like chords; `blockMarginRight` per character
- `kind: "chord"` — same as former `ChordItem` positions from `ChordToken`

`generateBarList` interleaves lyric slices and markers; decorations use `isChordLineDecoration` + `decorationText`.

## React surface

- `TabDecoration` — primitive for `DecorationToken` in composable API
- `TabLine` — renders `DecorationToken` with `tab-decoration` class

## Fixtures

| File | Role |
| ---- | ---- |
| `src/test/stubs/tua-flor.txt` | Parens, `D7/9`, extensions |
| `src/test/stubs/so-quero-esse-amor.txt` | Section headers, `F7(9)`, parenthesized intro row |

## Validation

```bash
pnpm --filter achorde-musical-domain test build
pnpm --filter tab-renderer test build
```

## Related

- [RFC 0002 — Interleaved bars](../rfc/0002-interleaved-bars-and-tab-style-config.md)
- [musical-domain 0.3.1 CHANGELOG](../../../musical-domain/CHANGELOG.md)
