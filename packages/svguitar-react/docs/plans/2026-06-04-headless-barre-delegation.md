# Headless barre inference delegation

**Status:** planning  
**Date:** 2026-06-04  
**Musical-domain plan:** [`musical-domain/docs/plans/2026-06-04-fretted-voicing-editor-primitives.md`](../../musical-domain/docs/plans/2026-06-04-fretted-voicing-editor-primitives.md)  
**Ecosystem plan (AC15):** [`ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md`](../../../../ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md)

## Goal

Eliminate **algorithm drift** between:

- Render-time `detectAutoBarre` inside `svguitar-react`, and
- Save-time `inferBarresFromFrettedVoicing` in `achorde-musical-domain`.

After this plan, both paths should use the **same headless implementation** from `achorde-musical-domain` (svguitar imports and adapts types at the boundary).

---

## In scope

| Area                 | Action                                                                                                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `utils/autoBarre.ts` | Reimplement `detectAutoBarre` as thin wrapper over musical-domain helper **or** re-export adapted result |
| `ChordDiagram.tsx`   | Keep `autoBarreEnabled` behavior for legacy `fretNotation` / fingers props                               |
| Tests                | Ensure existing `ChordDiagram.test.tsx` + auto-barre stories still pass                                  |
| Specs                | Document that **persisted** voicings should carry explicit `barres`; auto-barre is preview-only          |

---

## Out of scope

- Chord identity, alias, registry (AC15).
- Changing public prop defaults for `@ac15/ui` (`autoBarreEnabled: false` remains).

---

## Tasks

- [ ] **Task 1:** Add `achorde-musical-domain` dependency (semver aligned with AC15 ecosystem).
- [ ] **Task 2:** Map `Finger[]` ↔ `FrettedInstrumentVoicing.strings` in adapter inside svguitar.
- [ ] **Task 3:** Replace body of `detectAutoBarre` with call to musical-domain (keep function signature for compat).
- [ ] **Task 4:** Run `pnpm test:run` + `pnpm test-storybook` (or CI equivalent).
- [ ] **Task 5:** Update `specs/001-guitar-svg/contracts/chord-diagram-api.md` — persisted voicings vs render-time auto barre.
- [ ] **Task 6:** Release note: consumers persisting voicings must use `inferBarresFromFrettedVoicing` before save.

---

## Dependency order

1. Publish `achorde-musical-domain` with inference + parse helpers.
2. Publish `svguitar-react` minor bump importing helper.
3. AC15 `@ac15/ui` may stay unchanged if it already passes explicit `barres` from voicing.

---

## Validation

```bash
pnpm test:run
pnpm build
```

Optional: `pnpm test-storybook` when Storybook server available.

---

## Non-goals

- Remove `fretNotation` prop (legacy remains).
- Move voicing type definitions (stay in musical-domain).
