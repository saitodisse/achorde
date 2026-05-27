# Phase 1 — Strict line kinds and `ParsedTab` as canonical chart AST

**Status:** done  
**Date:** 2026-05-27  
**Implementation plan:** [`tab-renderer/docs/plans/2026-05-27-fase1-strict-parse-and-transpose.md`](../../../tab-renderer/docs/plans/2026-05-27-fase1-strict-parse-and-transpose.md)

## Goal

Publish contract changes so `tab-renderer` and downstream consumers share one vocabulary: **tokenized `ParsedTab`**, **four line kinds**, **error-level diagnostics** for invalid authoring. Deprecate segment-based `ChordChartAst` for new code.

---

## Line kind contract (breaking change)

### Replace `ParsedTabLineKind` union

**Remove:** `mixed`, `unknown`, `comment`, `tablature` (if present in consumers).

**Keep / add:**

```ts
export type ParsedTabLineKind =
  | "section-header"
  | "chords"
  | "lyrics"
  | "blank";
```

### Section headers

- A line with `kind: "section-header"` contains only `[Title]` markup.
- Parser opens a new `ParsedTabSection` with `title` / `originalTitle`; the header line may appear in `section.lines` for traceability **or** only advance section state — **pick one** in RFC and test (recommend: include line with `kind: "section-header"` and empty chord tokens).

---

## Diagnostics contract

### Severity

Invalid authoring uses **`severity: "error"`** (not `warning`).

### Suggested stable codes

| `code`                           | When                                                |
| -------------------------------- | --------------------------------------------------- |
| `section-header-with-content`    | `[Intro] Cm7` on one line                           |
| `chords-and-lyrics-on-same-line` | chord token + lyric token on same line              |
| `invalid-chord-token`            | token looks chordish but fails parse (e.g. `C/D/E`) |
| `invalid-line`                   | comment, tablature, or other disallowed content     |

Extend `ParseDiagnostic` only if needed; prefer stable `code` strings over free-form messages so consuming applications can localize messages.

---

## `ParsedTab` as canonical chart AST

### Already in `tab-ast.ts`

- `body`, `sections`, `diagnostics`, `parserVersion`, `astVersion`, `chordsFound`.

### Clarify in docs / types

- **`chordsFound`:** diagrammable chord symbols only (`ParsedChordSymbol.kind === "chord"`). Document that repeat `/` is never listed.
- Optional future field: `repeatMarkers: string[]` — **out of scope** unless product asks for repeat UI.

### `ParsedChordSymbol`

No change required; already distinguishes `chord` vs `repeat`.

---

## Deprecate `ChordChartAst` (segment model)

**Files:** `src/chord-chart-ast.ts`, `src/index.ts`

**Actions:**

1. Mark `ChordChartAst`, `ChordChartLine`, `ChordChartSegment`, `ParsedChordChart` as **`@deprecated`** in JSDoc — point to `ParsedTab`.
2. Update `docs/architecture.md` and `docs/migration.md` with migration table:

| Legacy                    | Canonical                |
| ------------------------- | ------------------------ |
| `ChordChartSection.label` | `ParsedTabSection.title` |
| `ChordChartLine.raw`      | `ParsedTabLine.text`     |
| `ChordChartLine.segments` | `ParsedTabLine.tokens`   |
| `segment.chord`           | `ChordToken.chord.text`  |

3. **Do not remove** types in phase 1 (avoid breaking unpublished consumers); remove in a future **major** `achorde-musical-domain` release once migration is complete.

---

## Versioning

- Bump `ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION` when line kinds or diagnostic contract changes.
- Document that `tab-renderer` must declare compatible domain range in README.

---

## Implementation tasks

### Task 1 — Update `tab-ast.ts`

- Narrow `ParsedTabLineKind` to four values.
- JSDoc on `chordsFound` semantics.

### Task 2 — Deprecation annotations

- `chord-chart-ast.ts` — `@deprecated` on segment types.

### Task 3 — Type tests

- `src/index.test.ts` — assert assignability of strict line kinds; fixture `ParsedTab` with invalid line + error diagnostic.

### Task 4 — Documentation

- `docs/migration.md` — strict grammar section + examples (valid vs invalid).
- `CHANGELOG.md` — breaking change notice.

### Task 5 — Release

- Publish npm version consumed by `tab-renderer` and other npm consumers.

---

## Validation

```bash
pnpm test
pnpm build
```

---

## Definition of done

- [x] Four line kinds in published types.
- [x] Diagnostic codes documented.
- [x] `ChordChartAst` deprecated, not removed.
- [x] CHANGELOG + migration guide updated.
- [ ] Version bump published; `tab-renderer` depends on new range.
