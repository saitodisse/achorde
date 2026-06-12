# Monorepo Rules - achorde

## Scope

This repository is the public monorepo root for the shared music ecosystem.

## Layout

- `packages/musical-domain` — **`@achorde/musical-domain`**: shared contracts and headless helpers.
- `packages/tab-renderer` — **`@achorde/tab-renderer`**: parse, transpose, React chord-sheet rendering.
- `packages/svguitar-react` — **`@achorde/svguitar-react`**: SVG chord diagram renderer.
- `packages/interactive-fretboard` — **`@achorde/interactive-fretboard`**: pointer-based interactive neck editor.
- `packages/storybook-config` — **`@achorde/storybook-config`** (private): shared Storybook tooling.

## Public Surfaces

| Package | Demo | Storybook |
| ------- | ---- | --------- |
| `@achorde/musical-domain` | docs only | none |
| `@achorde/tab-renderer` | https://tab-renderer-react.vercel.app/ | https://storybook-tab-renderer.vercel.app/ |
| `@achorde/svguitar-react` | https://svguitar-react.vercel.app/ | https://storybook-svguitar-react.vercel.app/?path=/docs/components-chorddiagram--docs |
| `@achorde/interactive-fretboard` | https://interactive-fretboard.vercel.app/ | https://storybook-interactive-fretboard.vercel.app/ |

The private product app [`ac15`](../ac15) consumes these packages from npm; coordinate breaking changes with bumps there (`@ac15/contracts`, `@ac15/ui`, `apps/web`).

## Rules

- Use `pnpm` for all workspace installs, scripts, and releases.
- Keep public package documentation and changelog text in English.
- Treat this monorepo as the single source of truth for published packages.
- Prefer workspace links (`workspace:*`) for local package references inside this monorepo.

## Validation

- Run the narrowest relevant package command first.
- Validate root workspace commands before claiming the monorepo is usable.
