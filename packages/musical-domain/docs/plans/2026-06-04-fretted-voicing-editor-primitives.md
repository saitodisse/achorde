# Fretted voicing editor primitives (parse + barre inference)

**Status:** implemented  
**Date:** 2026-06-04  
**Ecosystem plan (AC15):** [`ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md`](../../../../ac15/docs/plans/2026-06-04-fallback-acorde-ausente-viewer.md)  
**PRD (AC15):** [`ac15/docs/prd/0016-fallback-acorde-ausente-no-viewer.md`](../../../../ac15/docs/prd/0016-fallback-acorde-ausente-no-viewer.md)  
**Related svguitar plan:** [`svguitar-react/docs/plans/2026-06-04-headless-barre-delegation.md`](../../svguitar-react/docs/plans/2026-06-04-headless-barre-delegation.md)

## Goal

Publish **runtime-free** helpers so AC15 (and other consumers) can:

1. Parse guitar **`fretNotation`** strings into `FrettedInstrumentVoicing` (standard 6-string EADGBE).
2. **Infer barres** from fretted string data at **save time** (same algorithm as svguitar `detectAutoBarre`, but headless).
3. Keep rendering concerns out of this package — output is canonical voicing data for persistence and sync.

**Out of scope:** `ChordIdentity`, `ChordAlias`, Dexie, routes, SVG, `autoBarreEnabled` render flag.

---

## Why this package

| Concern                            | Owner                                                      |
| ---------------------------------- | ---------------------------------------------------------- |
| Drawable voicing shape             | `achorde-musical-domain`                                   |
| Persist explicit `barres` for sync | `achorde-musical-domain` (`inferBarresFromFrettedVoicing`) |
| Render-time auto barre (legacy)    | `svguitar-react` — should delegate to shared helper        |
| Product identity + local storage   | `ac15`                                                     |

Today `detectAutoBarre` lives only inside `svguitar-react` and runs at render time. Persisted voicings in AC15 use `@ac15/ui` with `autoBarreEnabled: false`, so barres must be computed **before** save.

---

## Deliverables

### 1. `inferBarresFromFrettedVoicing(voicing): FrettedInstrumentVoicing`

**Behavior (port from svguitar `detectAutoBarre`):**

- Consider strings with `state: "fretted"` and `fret > 0`.
- If more than 4 pressed strings, find fret with most fingers (tie: lowest fret).
- Build `barres[]` with `fromStringIndex` / `toStringIndex` (1-based, low→high string).
- Return new voicing with `barres` set; do not mutate input.
- If threshold not met, return voicing unchanged (empty `barres`).

**Files:**

- Create `src/fretted-barre-inference.ts`
- Create `src/fretted-barre-inference.test.ts`
- Export from `src/index.ts`

**Tests:** cases from svguitar stories (5 fingers on fret 3 → barre; ≤4 fingers → no barre).

---

### 2. `parseFretNotationToVoicing(input): FrettedInstrumentVoicing | null`

**Input:**

```ts
type ParseFretNotationInput = {
  fretNotation: string;
  chordSymbol: string;
  instrumentId: "guitar";
  tuningId: "guitar-standard-eadgbe";
  id: string;
};
```

**Behavior (MVP — 6 strings, low→high):**

- Accept digits `0-9`, `x`/`X` muted, `o`/`O` open (if present in notation convention).
- One character per string **or** documented delimiter pattern matching AC12/svguitar common forms (`x32010`, `320003`).
- Map to `FrettedInstrumentVoicing.strings[]` with `stringIndex` 1..6 (`1` = low E, `6` = high E).
- Set `baseFret` / absolute frets per existing domain conventions.
- Return `null` on invalid length or character.

**Files:**

- Create `src/fret-notation-parse.ts`
- Create `src/fret-notation-parse.test.ts`

**Follow-up:** parentheses form `(10)` for high positions — phase 1.1 if needed.

---

### 3. `applyVoicingEditorPipeline(voicing): FrettedInstrumentVoicing`

Convenience: `inferBarresFromFrettedVoicing` after parse or manual string grid edit.

---

## Migration / AC15 consumption

1. Publish semver **minor** bump of `achorde-musical-domain`.
2. AC15 `@ac15/contracts` bumps dependency.
3. `create-local-chord-with-voicing` and `/chords/new` call pipeline before Dexie save.
4. Optional: `/chords/new` fretNotation field (PRD 0016 phase 2).

---

## Tasks

- [x] **Task 1:** Implement `inferBarresFromFrettedVoicing` + tests (parity with svguitar unit cases).
- [x] **Task 2:** Implement `parseFretNotationToVoicing` + tests for common chords.
- [x] **Task 3:** Export from package index; update `docs/architecture.md`.
- [x] **Task 4:** `pnpm test:run` + changelog entry (English).
- [x] **Task 5:** AC15 bumps dependency (tracked in AC15 plan Task 13).

---

## Validation

```bash
pnpm --filter achorde-musical-domain test
pnpm --filter achorde-musical-domain build
```

---

## Non-goals

- Voicing quality / source enums (already in domain types).
- Chord symbol harmonic parsing (`parseChordSymbol` stays in `tab-renderer`).
- Fretboard pointer UI.
