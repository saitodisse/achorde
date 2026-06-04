# Documentation Index

- `docs/prd/` contains product requirements.
- `docs/rfc/` contains architecture decisions.
- `docs/plans/` contains executable implementation plans.

## Shipped: styled viewer (v0.2.0)

| Document                                                                                        | Description                                                              |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [PRD 0002 — Styled viewer pipeline](./prd/0002-styled-viewer-pipeline.md)                       | Product goals, `TabStyleConfig`, view/display modes, acceptance criteria |
| [RFC 0002 — Interleaved bars](./rfc/0002-interleaved-bars-and-tab-style-config.md)              | Pipeline phases, AST, CSS trick, public API                              |
| [Plan — Styled viewer implementation](./plans/2026-05-23-styled-viewer-pipeline-and-stories.md) | Phased tasks from core port to Storybook `07 Styling`                    |

Bootstrap docs (v0.1):

- [PRD 0001](./prd/0001-tab-renderer-library.md)
- [RFC 0001](./rfc/0001-package-structure-and-public-api.md)
- [Plan — Bootstrap](./plans/2026-05-23-bootstrap-and-core-slice.md)

## Phase 1: strict parser

| Document                                                                                                      | Description                                                   |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Plan — Strict parse and transpose](./plans/2026-05-27-fase1-strict-parse-and-transpose.md)                   | `parseTab` rewrite, tests, transposition API                  |
| [achorde-musical-domain contracts](../../musical-domain/docs/plans/2026-05-27-fase1-strict-line-contracts.md) | Four line kinds, error diagnostics, deprecate `ChordChartAst` |

## Decoration markers and ParsedTab bridge (v0.7.0)

| Document                                                                                | Description                                                                 |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Plan — Decoration markers](./plans/2026-05-28-decoration-markers-parsed-tab-bridge.md) | `DecorationToken`, `prepareSongFromParsedTab`, interleaved marker rendering |
| [CONTEXT.md](../CONTEXT.md)                                                             | Domain glossary (chord line, slash alteration, decoration vs extension)     |

## Chord symbols and diagram miss (AC15 integration)

| Document                                                                                                            | Description                                                           |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Plan — Chord symbols and diagrammable boundaries](./plans/2026-06-03-chord-symbols-and-diagrammable-boundaries.md) | `parseChordSymbol`, `chordsFound` contract                            |
| [Plan — Chord symbol miss boundaries](./plans/2026-06-04-chord-symbol-miss-boundaries.md)                           | No API changes; `chordsFound` feeds viewer miss state (AC15 PRD 0016) |
