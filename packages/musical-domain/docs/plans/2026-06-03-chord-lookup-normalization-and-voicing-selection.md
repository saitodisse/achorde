# Chord lookup normalization, voicing selection, and spelling metadata

**Status:** planning  
**Date:** 2026-06-03  
**Ecosystem plan (AC15):** [`ac15/docs/plans/2026-06-03-ecossistema-divisao-contratos-acorde.md`](../../../../ac15/docs/plans/2026-06-03-ecossistema-divisao-contratos-acorde.md)  
**Related tab-renderer plan:** [`tab-renderer/docs/plans/2026-06-03-chord-symbols-and-diagrammable-boundaries.md`](../../../tab-renderer/docs/plans/2026-06-03-chord-symbols-and-diagrammable-boundaries.md)

## Goal

Publish **runtime-free** utilities and optional types so every consumer agrees on:

1. How chord **labels** are normalized for lookup (`Cm6` ≠ `CM6`).
2. How to pick a **preferred** `FrettedInstrumentVoicing` among candidates.
3. How to attach **spelling metadata** (root, chord quality, bass) without conflating `VoicingQuality`.

**Out of scope for this package:** `ChordIdentity`, `ChordAlias`, product `EntityId`, registry builders, storage, routing, SVG.

---

## Why this package

| Concern                          | Owner                                                 |
| -------------------------------- | ----------------------------------------------------- |
| Parse chord tokens in chart text | `tab-renderer` (`parseChordSymbol`)                   |
| Drawable voicing shape           | `achorde-musical-domain` (`FrettedInstrumentVoicing`) |
| Product identity + alias graph   | `ac15` `@ac15/domain`                                 |
| Render voicing → SVG             | `svguitar-react` via app adapter                      |

Today `normalizeChordLookupLabel` and `selectPreferredVoicing` live only in `ac15/packages/domain`. They are **portable** and belong here.

---

## Deliverables

### 1. `normalizeChordSymbolLabel(label: string): string`

**Behavior (must match AC15 today):**

- Trim and collapse whitespace.
- `normalize("NFKC")`.
- Replace `♯` → `#`, `♭` → `b`.
- **Do not** lowercase (case distinguishes quality: `Cm6` vs `CM6`).

**Files:**

- Create `src/chord-label.ts`
- Export from `src/index.ts`
- Tests in `src/chord-label.test.ts`

**Migration:** AC15 removes duplicate from `@ac15/domain`; re-exports via `@ac15/contracts` import from `achorde-musical-domain`.

---

### 2. Voicing selection helpers

**API:**

```ts
export function compareFrettedVoicings(
  left: FrettedInstrumentVoicing,
  right: FrettedInstrumentVoicing,
): number;

export function selectPreferredFrettedVoicing(
  voicings: ReadonlyArray<FrettedInstrumentVoicing>,
): FrettedInstrumentVoicing | null;
```

**Ranking (unchanged from AC15):**

1. `VoicingQuality`: `exact` < `recommended` < `easy` < `fallback` < `unknown`
2. `VoicingSource`: `exact-recording` < `manual` < `community` < `imported` < `auto-generated`
3. `baseFret` ascending
4. `id` lexicographic tie-break

**Files:**

- Create `src/fretted-voicing-selection.ts`
- Tests in `src/fretted-voicing-selection.test.ts`

---

### 3. `ChordSpellingMetadata` (optional type)

**Purpose:** interchange spelling fields from legacy catalogs (AC12) without overloading `VoicingQuality`.

```ts
export type ChordSpellingMetadata = {
  rootNote?: string;
  /** Musical quality suffix (e.g. maj7, m6, aug9) — NOT VoicingQuality */
  chordQuality?: string;
  bassNote?: string | null;
  popularity?: number;
};
```

**Optional helper:**

```ts
export function spellingFromParsedChordSymbol(
  chord: Extract<ParsedChordSymbol, { kind: "chord" }>,
): ChordSpellingMetadata;
```

Maps `root` + `suffix` + optional `bass` → metadata. `popularity` stays app-specific.

**Files:**

- Create `src/chord-spelling.ts`
- Tests with fixtures `C#aug9`, `Am/G`, `C7#11`

---

### 4. Documentation and versioning

- Update `docs/architecture.md` — new “Chord label lookup” section.
- Update `docs/migration.md` — import table from `@ac15/domain` helpers.
- `CHANGELOG.md` — **minor** bump (new exports, no breaking changes).
- Bump `ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION` if contract constants file tracks surface area.

---

## Explicit non-goals (defer to AC15)

| Item                            | Reason                                            |
| ------------------------------- | ------------------------------------------------- |
| `ChordIdentity` / `ChordAlias`  | Product aggregates with persistence               |
| `ChordDiagramRegistryEntry`     | Derived app index                                 |
| `resolveChordIdentityByName`    | Depends on product entry shape                    |
| `ChordLibraryEntry` public type | Only if a second npm consumer needs it; not in v1 |

Future **optional** minor release could add:

```ts
export type ChordLibraryEntry = {
  canonicalSymbol: string;
  normalizedCanonicalSymbol: string;
  aliases: ReadonlyArray<{ label: string; normalizedLabel: string }>;
  voicings: ReadonlyArray<FrettedInstrumentVoicing>;
};
```

…and pure resolvers on `ReadonlyArray<ChordLibraryEntry>`. **Not part of this plan.**

---

## Implementation tasks

### Task 1 — Chord label normalization

- [x] **Step 1:** Red tests in `src/chord-label.test.ts` (`Cm6` ≠ `CM6`, unicode sharps/flats).
- [x] **Step 2:** Implement `normalizeChordSymbolLabel`.
- [x] **Step 3:** `pnpm test` in `musical-domain`.

### Task 2 — Voicing selection

- [x] **Step 1:** Port ranking tests from `@ac15/domain`.
- [x] **Step 2:** Implement `compareFrettedVoicings` / `selectPreferredFrettedVoicing`.
- [x] **Step 3:** `pnpm test`.

### Task 3 — Spelling metadata

- [x] **Step 1:** Type + `spellingFromParsedChordSymbol` tests.
- [x] **Step 2:** Implement helper.
- [x] **Step 3:** `pnpm test` + `pnpm build`.

### Task 4 — Publish and downstream bump

- [ ] **Step 1:** Release `achorde-musical-domain` (minor `0.3.3`).
- [ ] **Step 2:** Bump `tab-renderer` / `svguitar-react` if they re-export types (usually transitive).
- [x] **Step 3:** AC15 — update `@ac15/contracts`, remove duplicates in `@ac15/domain`, run monorepo `typecheck` + tests.

---

## Acceptance criteria

- [x] `normalizeChordSymbolLabel` is the single published normalization for chord **lookup labels**.
- [x] `selectPreferredFrettedVoicing` behavior matches pre-migration AC15 tests.
- [x] `ChordSpellingMetadata.chordQuality` is documented as distinct from `VoicingQuality`.
- [ ] No React, Dexie, or registry imports in this package.
- [ ] AC15 `chord-diagram-registry` and chord detail page use imports from `@ac15/contracts` only for these helpers.

---

## Validation commands

```bash
cd packages/musical-domain
pnpm test
pnpm build
```

After AC15 consumption:

```bash
cd /home/saito/_git/ac/ac15
pnpm --filter @ac15/domain test
pnpm --filter @ac15/web typecheck
```
