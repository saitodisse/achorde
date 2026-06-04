# Documentation

This directory describes the public package scope and migration path for downstream consumers.

- [Architecture](./architecture.md)
- [Migration](./migration.md)
- [Phase 1 — Strict line contracts (parser migration)](./plans/2026-05-27-fase1-strict-line-contracts.md) — four line kinds, error diagnostics, `ParsedTab` canonical, deprecate `ChordChartAst`
- [Chord lookup normalization and voicing selection](./plans/2026-06-03-chord-lookup-normalization-and-voicing-selection.md) — `normalizeChordSymbolLabel`, `selectPreferredFrettedVoicing` (shipped in 0.3.2 / 0.3.3)
- [Fretted voicing editor primitives](./plans/2026-06-04-fretted-voicing-editor-primitives.md) — `parseFretNotationToVoicing`, `inferBarresFromFrettedVoicing` (AC15 fallback viewer, fase 2)
- [tab-renderer implementation plan](../../tab-renderer/docs/plans/2026-05-27-fase1-strict-parse-and-transpose.md)
