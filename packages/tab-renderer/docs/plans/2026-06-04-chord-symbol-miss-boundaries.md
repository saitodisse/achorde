# Chord symbol miss boundaries (viewer diagram panel)

**Status:** planning — **no package code changes expected**  
**Date:** 2026-06-04  
**Ecosystem plan (AC15):** [`ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md`](../../../../ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md)  
**PRD (AC15):** [`ac15/docs/prd/0016-fallback-acorde-ausente-no-viewer.md`](../../../../ac15/docs/prd/0016-fallback-acorde-ausente-no-viewer.md)

## Goal

Document how **`tab-renderer`** participates in the “missing chord diagram” flow **without new API surface** in this delivery.

---

## Responsibilities (unchanged)

| API                                  | Role in miss flow                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `parseTab` → `ParsedTab.chordsFound` | **Source of symbols** shown in viewer diagram panel (including misses like `Dm7/C`)         |
| `parseChordSymbol`                   | Optional future: suggest canonical spelling in `/chords/new` — **not required for phase 1** |
| Transpose helpers                    | Do not affect registry lookup labels in this feature                                        |

The miss state is **not** a parser diagnostic: `Dm7/C` is a valid chord token even when the product registry has no voicing.

---

## Explicit non-goals

- No new export for “diagrammability” or registry hints in `tab-renderer/core`.
- No coupling to Dexie, `ChordAlias`, or Google search URLs.
- No changes to `TAB_RENDERER_*` versions for this feature alone.

---

## AC15 integration checklist

- [ ] Viewer continues to extract symbols **only** from `chordsFound` (PRD 0015).
- [ ] Miss actions use **exact string** from `chordsFound` for alias `label` and Google query.
- [ ] If `/chords/new` later uses `parseChordSymbol` for spelling hints, keep it in apps/web adapter — do not move product rules into tab-renderer.

---

## Optional future work (separate plan)

- Structured spelling suggestion type for editor (`root`, `quality`, `bass`) — coordinate with `achorde-musical-domain` `ChordSpellingMetadata` plan.

---

## Validation

No tab-renderer code changes → existing CI suffices:

```bash
pnpm --filter tab-renderer test
```

---

## Tasks

- [x] **Task 1:** Publish this boundary doc (planning complete).
- [ ] **Task 2:** If AC15 adds spelling hints on `/chords/new`, open new tab-renderer/musical-domain plan — out of scope here.
