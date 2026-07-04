# AGENTS.md - achorde-source-catalog

## Purpose

This package publishes runtime-light contracts and validators for static, read-only source catalogs consumed by achorde-compatible apps and artist portals.

## Rules

- Use `pnpm` for install, tests, build, and publish.
- Keep the package free of React, browser UI, storage, routing, and product-specific application rules.
- Keep documentation, changelog entries, comments, and commit messages in English.
- Preserve deterministic output helpers because catalog checksums are part of the public import contract.
- Update `README.md`, `CHANGELOG.md`, and `docs/` when the public contract changes.

## Commands

| Script | Purpose |
| ------ | ------- |
| `pnpm test` | Contract and validator tests |
| `pnpm build` | TypeScript declaration and JS build |
| `pnpm typecheck` | Type-only validation |
