# Implementation Plan: Interactive Fretboard Editor

**Branch:** `001-interactive-fretboard`  
**Spec:** [`spec.md`](./spec.md)  
**AC15 plan:** [`ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md`](../../../../ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md)

## Summary

Create `@achorde/interactive-fretboard` in the achorde monorepo: a Vite-built React library with Storybook, headless layout/hit-test modules, and `InteractiveFretboard`. Integrate into AC15 at `/chords/new` and `/chords/:chordId`, replacing the six-string grid editor, keeping `ChordDiagram` preview via `@ac15/ui`.

## Technical Context

| Area              | Decision                                                |
| ----------------- | ------------------------------------------------------- |
| Package name      | `@achorde/interactive-fretboard` (npm scope `@achorde`) |
| Language          | TypeScript                                              |
| UI                | React 18+ peer                                          |
| Pointer           | `PointerEvent` on root `<svg>`                          |
| Coordinates       | Fixed `viewBox`; `screenToSvgPoint` via CTM             |
| Hit-test          | Pure geometry + generated invisible hit `<rect>`s       |
| Music contracts   | `achorde-musical-domain`                                |
| Chord detect (v1) | `tonal` + `@tonaljs/chord-detect` (optional flag)       |
| Styling           | CSS variables, no required Tailwind in lib              |
| Diagram preview   | Consumer uses `svguitar-react` / `@ac15/ui` separately  |

## Architecture

```text
src/
  layout/
    computeFretboardFrame.ts    # viewBox, grid, string axis mapping
    resolveViewMode.ts            # 4 modes → axis inversion
  interaction/
    screenToSvgPoint.ts
    hitTestFretCell.ts
    buildHitAreas.ts
  adapters/
    voicingEditorState.ts         # voicing ↔ per-string editor cells
    fretNotationMode.ts           # wrap musical-domain parse/format
  components/
    InteractiveFretboard.tsx
    FretboardSvg.tsx              # presentational SVG layers
  index.ts
```

**Data flow:** pointer → svg point → hit cell → update editor state → `FrettedInstrumentVoicing` → optional `inferBarresFromFrettedVoicing` → `onChange`.

## View Modes (four combinations)

| `orientation` | `handedness` | Visual string axis                       |
| ------------- | ------------ | ---------------------------------------- |
| `horizontal`  | `right`      | Default neck (reference: AC12 edit page) |
| `horizontal`  | `left`       | Mirrored string order on cross axis      |
| `vertical`    | `right`      | Neck rotated: frets along vertical axis  |
| `vertical`    | `left`       | Vertical + mirrored strings              |

Canonical **`stringIndex` (1–6)** never flips in persisted voicing; only layout maps visual position ↔ index.

## Delivery Phases

### Phase 0 — Scaffold (achorde)

- Vite lib config, ESLint, Prettier, Vitest, Storybook (mirror `svguitar-react` toolchain).
- `specs/`, `AGENTS.md`, `README.md`, `CHANGELOG.md`.
- Register npm scope `@achorde` (org creation) before first publish.

### Phase 1 — Headless core

- `FretboardFrame`, `computeFretboardFrame`, `resolveViewMode`.
- `screenToSvgPoint`, `hitTestFretCell`, `buildHitAreas`.
- Unit tests with fixed viewBox coordinates (no DOM).

### Phase 2 — React component

- `InteractiveFretboard` controlled voicing API.
- Pointer handlers, open/muted/fretted tap cycle.
- CSS variable theming.

### Phase 3 — Adapters & optional features

- `fretNotation` value mode.
- `detectChord` + `pressedNotes` in change payload.
- `inferBarresOnChange` default true.

### Phase 4 — Storybook & docs

- Stories for 4 view modes, responsive wrapper, embed snippet.
- `quickstart.md`, contract files, npm `files: ["dist"]`.

### Phase 5 — Publish

- `pnpm test:run`, `pnpm build`, version `0.1.0`.
- `pnpm check:npm-publish` from ac15 (consumer tree update).

### Phase 6 — AC15 integration

- `@ac15/ui` wrapper: theme tokens, re-export.
- Replace `chord-string-editor` on `chord-new-page` and editable `chord-detail`.
- Keep `ChordDiagram` preview; wire `persist-local-chord` pipeline unchanged.

## Quality Gates

- `pnpm --filter @achorde/interactive-fretboard test:run`
- `pnpm --filter @achorde/interactive-fretboard build`
- `pnpm --filter @achorde/interactive-fretboard lint`
- Storybook builds for all four view modes
- AC15: `pnpm --filter @ac15/web vitest` chords features + typecheck

## Risks & Mitigations

| Risk                     | Mitigation                                             |
| ------------------------ | ------------------------------------------------------ |
| CTM null in hidden SSR   | Guard `getScreenCTM`; document client-only requirement |
| Left-hand mapping bugs   | Table-driven tests per view mode                       |
| Duplicating parse logic  | Only `achorde-musical-domain` for notation parse       |
| Scope creep (barre drag) | Explicit v2 milestone in spec out-of-scope             |
