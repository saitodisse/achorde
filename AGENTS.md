# Monorepo Rules - achorde

## Scope

This repository is the public monorepo root for the shared music ecosystem.

## Layout

- `packages/musical-domain` — **`@achorde/musical-domain`**: shared contracts and headless helpers.
- `packages/tab-renderer` — **`@achorde/tab-renderer`**: parse, transpose, React chord-sheet rendering.
- `packages/svguitar-react` — **`@achorde/svguitar-react`**: SVG chord diagram renderer.
- `packages/interactive-fretboard` — **`@achorde/interactive-fretboard`**: pointer-based interactive neck editor.
- `packages/storybook-config` — **`@achorde/storybook-config`** (private): shared Storybook tooling.

The private product app [`ac15`](../ac15) consumes these packages from npm; coordinate breaking changes with bumps there (`@ac15/contracts`, `@ac15/ui`, `apps/web`).

## Rules

- Use `pnpm` for all workspace installs, scripts, and releases.
- Keep public package documentation and changelog text in English.
- Treat this monorepo as the single source of truth for published packages.
- Prefer workspace links (`workspace:*`) for local package references inside this monorepo.

## Validation

- Run the narrowest relevant package command first.
- Validate root workspace commands before claiming the monorepo is usable.
