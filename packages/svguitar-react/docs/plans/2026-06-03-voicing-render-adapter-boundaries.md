# Voicing render adapter boundaries (SVGuitar)

**Status:** planning  
**Date:** 2026-06-03  
**Contracts plan:** [`musical-domain/docs/plans/2026-06-03-chord-lookup-normalization-and-voicing-selection.md`](../../musical-domain/docs/plans/2026-06-03-chord-lookup-normalization-and-voicing-selection.md)  
**Ecosystem plan (AC15):** [`ac15/docs/plans/2026-06-03-ecossistema-divisao-contratos-acorde.md`](../../../../ac15/docs/plans/2026-06-03-ecossistema-divisao-contratos-acorde.md)

## Goal

Confirm `svguitar-react` stays a **pure renderer**: `FrettedInstrumentVoicing` (or derived `Chord` props) in, SVG out. No chord identity, alias resolution, or catalog logic in this package.

---

## In scope

| Area                      | Responsibility                                                                    |
| ------------------------- | --------------------------------------------------------------------------------- |
| `ChordDiagram` component  | Layout, SVG, styling props                                                        |
| `voicingToChord` / utils  | Deterministic voicing → fingers, barres, `firstFret`                              |
| `autoBarreEnabled` policy | Wrapper defaults (AC12 lesson: do not pass raw `fretNotation` with auto-barre on) |
| Types                     | Import `FrettedInstrumentVoicing` from `achorde-musical-domain`                   |

---

## Out of scope

| Area                              | Owner                    |
| --------------------------------- | ------------------------ |
| `ChordIdentity`, `ChordAlias`     | `ac15` domain            |
| `normalizeChordSymbolLabel`       | `achorde-musical-domain` |
| `parseChordSymbol`, `chordsFound` | `tab-renderer`           |
| Registry / diagram panel state    | `ac15` apps/web          |
| Persistence, i18n, routes         | `ac15` apps/web          |

Application adapters (e.g. `@ac15/ui/chord-diagram.tsx`) own product defaults: sizing, colors, `autoBarreEnabled: false`, tuning order for standard guitar.

---

## AC15 integration checklist

The private app must continue to:

1. Import **`ChordDiagram` only from `@ac15/ui`**, never from `svguitar-react` in `apps/web`.
2. Pass **`FrettedInstrumentVoicing`** selected by `selectPreferredFrettedVoicing` (after migration: from `achorde-musical-domain` via contracts).
3. Use the same voicing instance on viewer panel cards and `/chords/:chordId` detail page.

No `svguitar-react` release required for chord identity work unless voicing type shape changes in `musical-domain`.

---

## Optional improvements (this package)

### Task 1 — Document voicing prop contract

**Files:**

- `specs/001-guitar-svg/contracts/chord-diagram-api.md`
- `README.md`

- [ ] State that `voicing` is the preferred input; string `fretNotation` is legacy/discouraged when `autoBarreEnabled` is true.
- [ ] Reference `FrettedInstrumentVoicing` fields: `strings`, `barres`, `baseFret`, `chordSymbol`.

### Task 2 — Regression tests for multi-finger voicings

Align with AC12 `ClientChordDiagram` bug class (barre wiping fingers).

**Files:**

- `src/components/ChordDiagram/ChordDiagram.test.tsx`

- [ ] Voicing with 5+ fretted strings + explicit barres renders all fingers.
- [ ] Document expected `autoBarreEnabled` default in tests.

### Task 3 — Version alignment

When `achorde-musical-domain` publishes spelling/selection helpers:

- [ ] Bump `achorde-musical-domain` dependency (patch/minor).
- [ ] `pnpm test` + `pnpm build`.
- [ ] Release note: no API break expected for voicing render path.

---

## Multi-diagram surfaces (viewer + chord detail)

| Surface           | Voicing source                    | Renderer path                 |
| ----------------- | --------------------------------- | ----------------------------- |
| Viewer side panel | Registry → preferred voicing      | `@ac15/ui` → `svguitar-react` |
| Chord detail hero | Selected `?voicing=` or preferred | Same                          |
| Variation grid    | Each `entry.voicings[]`           | Same                          |

**Performance note:** mini-diagrams in variation grid may need smaller `width`/`height` via adapter props — stays in `@ac15/ui`, not here.

---

## Acceptance criteria

- [ ] No imports of AC15-specific packages in `svguitar-react`.
- [ ] Contract docs state renderer does not resolve chord names or aliases.
- [ ] Tests cover voicing-first path used by AC15.
- [ ] Changelog entry if docs/tests-only release ships.

---

## Validation

```bash
cd packages/svguitar-react
pnpm test
pnpm build
```
