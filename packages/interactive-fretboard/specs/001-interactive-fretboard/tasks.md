# Tasks: Interactive Fretboard Editor

**Spec:** [`spec.md`](./spec.md) · **Plan:** [`plan.md`](./plan.md)

## Phase 0 — Scaffold

- [x] **T0.1** Copy toolchain baseline from `svguitar-react` (Vite lib, `tsconfig.lib.json`, ESLint, Prettier, Vitest, Storybook port **6010**).
- [x] **T0.2** Replace placeholder `package.json` scripts; add `tonal` + `@tonaljs/chord-detect` dependencies.
- [x] **T0.3** Create `src/index.ts` exporting public API stubs.
- [x] **T0.4** Document npm scope setup: create `@achorde` org, add publish CI token (README section **Publishing**).

## Phase 1 — Headless layout & hit-test

- [x] **T1.1** Implement `FretboardViewMode` + `resolveViewMode` (4 combinations).
- [x] **T1.2** Implement `computeFretboardFrame` (viewBox, fret/string lines, cell bounds).
- [x] **T1.3** Implement `screenToSvgPoint(svg, pointerEvent)`.
- [x] **T1.4** Implement `hitTestFretCell(frame, point) → { stringIndex, fret } | null`.
- [x] **T1.5** Implement `buildHitAreas(frame)` for invisible rects (min touch size in viewBox units).
- [x] **T1.6** Unit tests: fixed points per view mode; regression for “scaled SVG” via mocked CTM.

## Phase 2 — Editor state & adapters

- [x] **T2.1** `voicingToEditorState` / `editorStateToVoicing` (canonical stringIndex 1–6).
- [x] **T2.2** Wire `parseFretNotationToVoicing` / format helper (musical-domain; no duplicate parser).
- [x] **T2.3** `applyChangePipeline`: tap cycle + `inferBarresFromFrettedVoicing`.
- [x] **T2.4** Tests: AC12 parity chords (`x32010`, muted, frets > 9 with parentheses phase 1.1 if needed).

## Phase 3 — React component

- [x] **T3.1** `InteractiveFretboard` props per `contracts/component-api.md`.
- [x] **T3.2** Render layers: grid, inlays (optional), dots, hover preview.
- [x] **T3.3** `PointerEvent` handlers (`pointerdown` primary; prevent ghost clicks).
- [x] **T3.4** CSS variables + `className` / `style` on wrapper.
- [x] **T3.5** `forwardRef` to root SVG (embed focus/accessibility).

## Phase 4 — Storybook & docs

- [x] **T4.1** Stories: 4 view modes, responsive container, dark theme variables.
- [x] **T4.2** Story: side-by-side with `ChordDiagram` (devDependency on `svguitar-react` in Storybook only).
- [ ] **T4.3** Complete `quickstart.md`, `research.md`, `data-model.md`.
- [x] **T4.4** CHANGELOG + README publish section.

## Phase 5 — Release

- [x] **T5.1** `pnpm test:run` + `pnpm build` green.
- [ ] **T5.2** Version `0.1.0`, tag, publish `@achorde/interactive-fretboard`.
- [ ] **T5.3** AC15 `pnpm check:npm-publish`; bump `@ac15/contracts` / `@ac15/ui` / `apps/web` per skill.

## Phase 6 — AC15 (tracked in AC15 plan)

See [`ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md`](../../../../ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md).
