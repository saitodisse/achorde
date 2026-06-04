# Migration

## Chord lookup helpers (0.3.2+)

| Former local helper (e.g. AC15 `@ac15/domain`) | Import from `achorde-musical-domain` |
| ---------------------------------------------- | ------------------------------------ |
| `normalizeChordLookupLabel`                    | `normalizeChordSymbolLabel`          |
| `selectPreferredVoicing`                       | `selectPreferredFrettedVoicing`      |
| `compareVoicings` (internal)                   | `compareFrettedVoicings`             |

`ChordSpellingMetadata.chordQuality` is the musical suffix (e.g. `maj7`, `aug9`), not `VoicingQuality` on `FrettedInstrumentVoicing`.

## Recommended Order

1. Add `achorde-musical-domain` as a dependency.
2. Replace locally duplicated parser diagnostic and chord-symbol types with imports from this package.
3. Replace fretted-instrument voicing types with `FrettedInstrumentVoicing`.
4. Keep parser, renderer, persistence, routing, and application workflows in the consuming package.
5. Run type checks and package builds before publishing downstream releases.

## Cutover Criteria

- Public packages should not depend on private or machine-local contract packages.
- Downstream packages should compile with this package as their only shared musical contract source.
- Migration should not change runtime parser or renderer behavior unless the downstream package explicitly intends that change.
- Published packages should reference a registry version of `achorde-musical-domain`, not a local `file:` dependency.

## Strict line grammar (0.3.0+)

`ParsedTab` is the **canonical chart AST**. Parsers must classify every line as one of four kinds:

| `ParsedTabLineKind` | Meaning                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `section-header`    | Line contains only `[Title]` markup                               |
| `chords`            | Chord-line majority; may include `DecorationToken` (stage parens) |
| `lyrics`            | Lyric tokens only                                                 |
| `blank`             | Empty or whitespace-only line                                     |

### Token kinds (`ParsedTabTokenKind`, 0.3.1+)

| Kind              | Role                                                        |
| ----------------- | ----------------------------------------------------------- |
| `ChordToken`      | Parsed chord or repeat `/`                                  |
| `LyricToken`      | Lyric word                                                  |
| `DecorationToken` | Parenthesis not part of chord spelling (e.g. before `( C7`) |
| `SpaceToken`      | Whitespace preserved for column layout                      |

Extensions inside the symbol (`C7(13)`, `D7/9`) stay inside a single `ChordToken`; see `tab-renderer` `CONTEXT.md`.

Removed kinds (no longer in the contract): `mixed`, `unknown`, `comment`, `tablature`.

Invalid authoring must emit diagnostics with **`severity: "error"`** (not `warning`). Prefer stable `code` values for i18n in applications:

| `code`                           | When                                                    |
| -------------------------------- | ------------------------------------------------------- |
| `section-header-with-content`    | `[Intro] Cm7` on one line                               |
| `chords-and-lyrics-on-same-line` | Chord token and lyric token on the same line            |
| `invalid-chord-token`            | Token looks like a chord but fails parse (e.g. `C/D/E`) |
| `invalid-line`                   | Comment, tablature, or other disallowed content         |

### Valid examples

```text
[Verse]
C    G    Am
Line one of lyrics
```

- `[Verse]` → `kind: "section-header"` (included in `section.lines` with empty chord tokens).
- `C    G    Am` → `kind: "chords"`.
- `Line one of lyrics` → `kind: "lyrics"`.

### Invalid examples

```text
[Intro] Cm7
```

→ `section-header-with-content` (`severity: "error"`).

```text
C    Hello world
```

→ `chords-and-lyrics-on-same-line` (`severity: "error"`).

```text
# comment
```

→ `invalid-line` (`severity: "error"`).

### `chordsFound`

Lists diagrammable chord symbols only (`ParsedChordSymbol.kind === "chord"`). Repeat markers (`/`) are never listed.

## Legacy segment model (`ChordChartAst`)

Types in `chord-chart-ast.ts` are **deprecated** but remain exported until a future major release. New code should use `ParsedTab`.

| Legacy                    | Canonical                                            |
| ------------------------- | ---------------------------------------------------- |
| `ChordChartSection.label` | `ParsedTabSection.title`                             |
| `ChordChartLine.raw`      | `ParsedTabLine.text`                                 |
| `ChordChartLine.segments` | `ParsedTabLine.tokens`                               |
| `segment.chord`           | `ChordToken.chord.text` (via `ParsedTabToken.chord`) |
