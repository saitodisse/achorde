# Changelog

## 0.5.2 - 2026-06-04

### Changed

- `inferBarresFromFrettedVoicing` always recomputes barres from current string states instead of preserving stale inferred barres when the pressed-string threshold is not met.

## 0.5.1 - 2026-06-04

### Changed

- Republish to fix npm registry read index after scoped rename (same API as 0.5.0).

## 0.5.0 - 2026-06-04

### Changed

- **BREAKING:** npm package renamed from `achorde-musical-domain` to `@achorde/musical-domain`. Update `package.json` and import paths; no API changes from 0.4.0.

## 0.4.0 - 2026-06-04

### Added

- `inferBarresFromFrettedVoicing` — headless barre inference aligned with svguitar `detectAutoBarre`.
- `parseFretNotationToVoicing` and `formatVoicingToFretNotation` for 6-string guitar notation (low E first, e.g. `x32100`).
- `applyVoicingEditorPipeline` convenience wrapper.
- `GUITAR_STANDARD_EADGBE_OPEN_NOTES` tuning constants.

## 0.3.3 - 2026-06-03

### Added

- `compareFrettedVoicings` and `selectPreferredFrettedVoicing` for ranking playable shapes.
- `ChordSpellingMetadata` and `spellingFromParsedChordSymbol` for catalog spelling fields (distinct from `VoicingQuality`).

## 0.3.2 - 2026-06-03

### Added

- `normalizeChordSymbolLabel` for chord label lookup equality (unicode accidentals, NFKC; case preserved).

## 0.3.1 - 2026-05-28

### Added

- `DecorationToken` in `ParsedTabTokenKind` for parenthesis markers on chord lines that are not part of a chord symbol spelling.

## 0.3.0 - 2026-05-27

### Breaking

- Narrowed `ParsedTabLineKind` to four strict values: `section-header`, `chords`, `lyrics`, `blank`.
- Removed `mixed`, `unknown`, `comment`, and `tablature` from the published line-kind union.
- Bumped `ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION` to `0.3.0`.

### Added

- Documented stable diagnostic codes for invalid strict authoring (`section-header-with-content`, `chords-and-lyrics-on-same-line`, `invalid-chord-token`, `invalid-line`).
- JSDoc on `ParsedTab` and `chordsFound` semantics (diagrammable chords only; repeat `/` excluded).

### Deprecated

- `ChordChartAst`, `ChordChartLine`, `ChordChartSegment`, and `ParsedChordChart` — use `ParsedTab` instead. Types remain exported until a future major release.

## 0.2.0 - 2026-05-27

- Added `chordsFound` to the parsed-tab contract so downstream parsers and viewers can access the discovered chord symbols directly.
- Kept the contract runtime-light while expanding the shared AST with a stable, de-duplicated chord index.

## 0.1.0 - 2026-05-24

- Initial release of `achorde-musical-domain`.
- Exported public musical contracts for textual ASTs, diagnostics, fretted voicings, and music-theory adapters.
- Prepared the package for open source consumption by parser, renderer, editor, and application packages.
