# Phase 1 — Strict `parseTab`, transposition, and legacy parser retirement

**Status:** planning  
**Date:** 2026-05-27  
**Contracts plan:** [`achorde-musical-domain/docs/plans/2026-05-27-fase1-strict-line-contracts.md`](../../../musical-domain/docs/plans/2026-05-27-fase1-strict-line-contracts.md)

## Goal

Make `tab-renderer` the **only** headless owner of chord-sheet parsing and AST transposition. Replace permissive `mixed` / `unknown` line kinds with a **strict grammar**. Preserve original line text for display while emitting **`error`** diagnostics for invalid lines.

Downstream applications should depend on published `tab-renderer` versions only — not on a separate permissive parser package.

---

## Strict line grammar (product decision)

### Valid line kinds (exactly four)

| `ParsedTabLineKind` | Rule                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| `section-header`    | Whole line is `[Title]` only (optional surrounding whitespace).            |
| `chords`            | Every non-space token parses as `ParsedChordSymbol` (`chord` or `repeat`). |
| `lyrics`            | No token is a chord/repeat.                                                |
| `blank`             | Empty line after trim.                                                     |

### Invalid (must produce `ParseDiagnostic` with `severity: "error"`)

| Input example                    | Suggested `code`                      |
| -------------------------------- | ------------------------------------- |
| `[Intro] Cm7`                    | `section-header-with-content`         |
| `C lyric text`                   | `chords-and-lyrics-on-same-line`      |
| `C/D/E`                          | `invalid-chord-token`                 |
| `# comment`                      | `invalid-line`                        |
| `E\|--0--`                       | `invalid-line`                        |
| Former `mixed` / `unknown` cases | `invalid-line` or specific code above |

**Rendering rule:** invalid lines stay in the AST with **unchanged** `line.text`; consumers show alerts from `diagnostics`.

### `chordsFound` / diagram symbols

- Export `collectDiagrammableChords(parsed: ParsedTab): string[]` (or keep `chordsFound` on result) — **only** `kind === "chord"`.
- Exclude `/` (`kind: "repeat"`).

---

## Canonical AST: tokens (keep simplicity)

Continue `parseTab` → `ParsedTab` with `ChordToken` | `LyricToken` | `SpaceToken`.

**Do not** introduce segment-based AST in this package.

---

## Versioning (single source)

- Bump `TAB_RENDERER_PARSER_VERSION` / `TAB_RENDERER_AST_VERSION` on any grammar or AST change.
- Export both from `src/core/parseTab.ts` (or `src/core/versions.ts`).
- Consumer cache keys should use **these** constants from npm — not legacy parser version aliases.

---

## Capabilities to implement

| Capability                                 | Target module                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Section scanning `[Label]` on its own line | `parseTab.ts` (rewrite `classifyLine`)                                                             |
| Chord token parsing (slash, repeat `/`)    | shared `parseChordSymbol.ts` (extract from `parseTab.ts`)                                          |
| Transpose symbol + full AST                | new `src/core/transposeParsedTab.ts`                                                               |
| Note spelling policy (enharmonics)         | align with existing transposer or port `NOTE_TO_SEMITONE` map from legacy parser                   |
| Tests from legacy permissive parser suite  | **replace** with `strict-parse.test.ts` — expect errors where old tests expected `mixed`/`unknown` |

**Do not port:** `ChordChartAst`, `buildSegments`, permissive `warnAmbiguousLine` as warning-only.

---

## Two pipelines today (explicit scope)

| Pipeline          | Phase 1                                 | Phase 2                                                         |
| ----------------- | --------------------------------------- | --------------------------------------------------------------- |
| **`parseTab`**    | Strict grammar + tests + transpose API  | Source of truth for chord-sheet parsing                         |
| **`prepareSong`** | Keep passing tests; document divergence | Refactor to consume `parseTab` output or shared line classifier |

Phase 1 **must not** break existing `npm test` for unrelated modules; `parseTab.test.ts` expectations **will** change when grammar tightens.

---

## Implementation tasks

### Task 1 — Extract shared chord token parser

**Files:**

- Create `src/core/parser/parseChordSymbol.ts` (move logic from `parseTab.ts`).
- Update `parseTab.ts` to import it.

**Tests:** unit tests for `C#m7/G#`, `/`, invalid `C/D/E`.

### Task 2 — Strict line classifier

**Files:**

- Rewrite `classifyLine` in `parseTab.ts`.
- Remove branches that return `mixed` or `unknown` (types removed in domain first).

**Behavior:**

- `[Intro]` with remainder on same line → parse line as invalid (or split: reject entire line with error).
- Chord line: if any token fails `parseChordSymbol` → `invalid-chord-token` error, still emit tokens best-effort or lyric tokens for display — document choice in RFC.

### Task 3 — Diagnostics

**Files:**

- `parseTab.ts` push errors with `severity: "error"`, `line`, `sourceRange`.

**Tests:** snapshot diagnostics for each invalid example listed above.

### Task 4 — `collectDiagrammableChords` + `chordsFound`

**Files:**

- `src/core/collectDiagrammableChords.ts`
- `parseTab` sets `chordsFound` via collector.

### Task 5 — Transposition API

**Files:**

- `src/core/transposeParsedTab.ts`
- `src/core/transposeChordSymbol.ts` (public export from `src/core/index.ts`)

**Tests:**

- `C#m7/G#` +1 → `Dm7/A`
- `/` +5 → `/`
- invalid token unchanged

### Task 6 — Test suite `strict-parse.test.ts`

Port **valid** cases from the legacy permissive parser:

- Empty labelled sections `[Intro]` then `[Verse]` with chord + lyric lines on separate lines.
- Chord line with repeat `/` on chord line only.

Add **invalid** cases that the legacy parser accepted.

### Task 7 — Docs + version bump

- Update `docs/rfc/` or add `docs/rfc/0003-strict-chord-sheet-grammar.md`.
- Bump package version (likely **minor** if only adding exports; **major** if breaking `parseTab` line kinds).
- CHANGELOG entry.

---

## Validation

```bash
pnpm test
pnpm run build
pnpm run lint
```

---

## Public API (target exports from `.`)

```ts
export { parseTab, TAB_RENDERER_PARSER_VERSION, TAB_RENDERER_AST_VERSION } from "./parseTab";
export { transposeParsedTab, transposeChordSymbol } from "./transposeParsedTab";
export { collectDiagrammableChords } from "./collectDiagrammableChords";
export type { ParsedTab, ... } from "achorde-musical-domain";
```

---

## Definition of done (phase 1)

- [ ] No `mixed` / `unknown` in classifier.
- [ ] Invalid lines emit `error` diagnostics; line text preserved.
- [ ] `chordsFound` excludes repeat `/`.
- [ ] Transposition exported and tested.
- [ ] Domain package released with new line kinds.
- [ ] Consumers can depend on the published npm version as the sole parsing source.
