# Architecture

`achorde-musical-domain` is a public TypeScript contract package for musical software. It provides shared data shapes for parsers, renderers, editors, and applications that need to exchange chord-chart, tab, diagnostic, and fretted-voicing data.

## Included Scope

- parser diagnostic contracts
- parsed chord-symbol contracts
- textual tab AST contracts (`ParsedTab` — four strict line kinds; `ParsedTabTokenKind` includes `DecorationToken` since 0.3.1)
- legacy chord-chart AST contracts with sections, lines, and segments (`ChordChartAst`, deprecated)
- fretted-instrument voicing contracts
- chord label lookup normalization (`normalizeChordSymbolLabel`)
- fretted voicing ranking helpers (`compareFrettedVoicings`, `selectPreferredFrettedVoicing`)
- display base-fret normalization for compact diagrams (`resolveVoicingDisplayBaseFret`, `normalizeVoicingDisplayBaseFret`)
- chord spelling metadata (`ChordSpellingMetadata`, `spellingFromParsedChordSymbol`)
- an explicit port for external music-theory adapters

## Excluded Scope

- React
- local storage
- sync
- routing
- product-specific application rules
- SVG rendering
- complete text parser implementations
- bundled music-theory engines
- authored catalog metadata, contribution packages, Git workflows, or forge authorization

## Dependency Rule

Consumers should depend on this package for shared public contracts and keep implementation-specific behavior in their own packages. Parser libraries own parsing behavior. Renderer libraries own visual rendering. Applications own persistence, sync, routing, and product workflows.

## Fretted String Coordinate Rule

Fretted-instrument guitar voicings use low-to-high string coordinates. For standard EADGBE guitar, `stringIndex: 1` is low E, `2` is A, `3` is D, `4` is G, `5` is B, and `6` is high E. `fromStringIndex` and `toStringIndex` on barres use the same coordinate system.

Helpers that parse or format fret notation preserve the common low-E-first notation order. For example, `244xxx` means frets 2, 4, and 4 on low E, A, and D, followed by three muted higher strings.

## Versioning Rule

Contract changes follow semantic versioning:

- patch releases may clarify docs or fix non-breaking type details
- minor releases may add optional fields or new exported contracts
- major releases may rename, remove, or structurally change public contracts
