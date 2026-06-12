# AGENTS.md - achorde-musical-domain

## Purpose

This repository publishes shared musical contracts for chord charts, textual tab ASTs, parser diagnostics, fretted-instrument voicings, and music-theory adapter ports. It does not contain React, storage, routing, sync, SVG rendering, or product-specific application rules.

## Public Surfaces

- Docs only: no public demo site or Storybook.

## Rules

- Use `pnpm` to install dependencies, run tests, build, and publish.
- Keep the public API small, stable, and free of runtime dependencies.
- Preserve semantic compatibility for downstream parsers, renderers, editors, and applications.
- Update `README.md`, `CHANGELOG.md`, and `docs/` whenever the public contract changes.
- Prefer type-level tests and small contract examples to validate the package.
- Keep all repository documentation, changelog entries, comments, and commit messages in English.

## Structure

- `src/` contains public contracts and version constants.
- `docs/` explains package scope, architecture, and migration guidance.

## Downstream Consumers

Published npm releases are consumed by external applications. After publishing a new version:

1. Update the dependency version in each consumer project's `package.json`.
2. Run the consumer's install command to refresh the lockfile.
3. Run tests and build in each consumer to confirm compatibility.
4. Commit and push the consumer update.
