# AGENTS.md - @achorde/interactive-fretboard

## Purpose

Publishable React library for **pointer-based fretboard editing**. Owns SVG layout, view modes (orientation × handedness), hit-testing in viewBox space, and editor UX—not chord identity, persistence, routing, or compact chord diagrams.

## Boundaries

| In scope                                                | Out of scope                      |
| ------------------------------------------------------- | --------------------------------- |
| `InteractiveFretboard` component                        | `ChordDiagram` / `@achorde/svguitar-react` |
| `screenToSvgPoint`, `hitTestFretCell`, `FretboardFrame` | Dexie, sync, `ChordIdentity`      |
| Adapters: voicing ↔ editor state, fretNotation helpers  | Tab parse, `parseChordSymbol`     |
| Storybook demos for OSS embeds                          | AC15 product copy / i18n          |

**Contracts:** `@achorde/musical-domain@^0.5.1` for `FrettedInstrumentVoicing` and headless parse/barre pipeline.

## Commands

Use **pnpm** only. Read `specs/001-interactive-fretboard/` before behavior changes.

| Script           | Purpose                      |
| ---------------- | ---------------------------- |
| `pnpm test:run`  | Vitest unit tests            |
| `pnpm build`     | Library build (Vite + `tsc`) |
| `pnpm lint`      | ESLint                       |
| `pnpm storybook` | Demos on port **6010**       |

## Conventions

- Public docs, changelog, comments, and commits: **English**.
- Hit-testing must use **viewBox logical coordinates**, never `getBoundingClientRect` on rendered lines as the source of truth.
- Canonical string indices: **1 = high E, 6 = low E** (`@achorde/musical-domain`); view modes only change **visual axis order**.

## Downstream

After npm publish, bump consumers (`ac15` `@ac15/ui`, then `apps/web`) per skill `checar-npm-publish` in the private repo.
