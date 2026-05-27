# Monorepo Rules - achorde

## Scope

This repository is the public monorepo root for the shared music ecosystem.

## Layout

- `packages/` contains the public libraries.

## Rules

- Use `pnpm` for all workspace installs, scripts, and releases.
- Keep public package documentation and changelog text in English.
- Treat this monorepo as the single source of truth for published packages.
- Prefer workspace links (`workspace:*`) for local package references inside this monorepo.

## Validation

- Run the narrowest relevant package command first.
- Validate root workspace commands before claiming the monorepo is usable.
