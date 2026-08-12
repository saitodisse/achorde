# AGENTS.md - @achorde/interactive-fretboard

## Purpose

Publishable React library for **pointer-based fretboard editing**. Owns SVG layout, view modes (orientation × handedness), hit-testing in viewBox space, and editor UX—not chord identity, persistence, routing, or compact chord diagrams.

## Public Surfaces

- English package docs: https://achorde-musical-domain.vercel.app/en/packages/interactive-fretboard
- Demo site: https://interactive-fretboard.vercel.app/
- Storybook: https://storybook-interactive-fretboard.vercel.app/

## Boundaries

| In scope                                                | Out of scope                               |
| ------------------------------------------------------- | ------------------------------------------ |
| `InteractiveFretboard` component                        | `ChordDiagram` / `@achorde/svguitar-react` |
| `screenToSvgPoint`, `hitTestFretCell`, `FretboardFrame` | Dexie, sync, `ChordIdentity`               |
| Adapters: voicing ↔ editor state, fretNotation helpers  | Tab parse, `parseChordSymbol`              |
| Storybook demos for OSS embeds                          | AC15 product copy / i18n                   |

**Contracts:** `@achorde/musical-domain@^0.6.0` for `FrettedInstrumentVoicing` and headless parse/barre pipeline.

## Commands

Use **pnpm** only. Read the public types, tests, README, and changelog before behavior changes.

| Script             | Purpose                      |
| ------------------ | ---------------------------- |
| `pnpm dev:app`     | Demo site on port 6011       |
| `pnpm build:app`   | Demo site build              |
| `pnpm preview:app` | Preview demo site            |
| `pnpm test:run`    | Vitest unit tests            |
| `pnpm build`       | Library build (Vite + `tsc`) |
| `pnpm lint`        | ESLint                       |
| `pnpm storybook`   | Demos on port **6010**       |

## Conventions

- Public docs, changelog, comments, and commits: **English**.
- Hit-testing must use **viewBox logical coordinates**, never `getBoundingClientRect` on rendered lines as the source of truth.
- Canonical string indices: **1 = low E, 6 = high E** (`@achorde/musical-domain`); view modes only change **visual axis order**.
- **`pointerButton`** in `onChange` (`0.1.9+`); finger assignment via middle/secondary clicks on fretted cells (`0.1.10+`); appearance props and CSS variables (`0.1.11+`).
- Companion **chord diagram** in AC15 uses `@achorde/svguitar-react` **`vertical-right`** when paired with vertical-right fretboard — do not mirror handedness when mapping to `ViewId`.

## Downstream

After npm publish, bump consumers (`ac15` `@ac15/ui`, then `apps/web`) per skill `checar-npm-publish` in the private repo.
