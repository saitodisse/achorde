# Global Repo Rules

This repository publishes `tab-renderer`, an open-source library for chord sheet parsing and rendering.

## Public Surfaces

- English package docs: https://achorde-musical-domain.vercel.app/en/packages/tab-renderer
- Demo site: https://tab-renderer-react.vercel.app/
- Storybook: https://storybook-tab-renderer.vercel.app/

## Architecture

- The public npm package is a single artifact with subpath exports.
- `.` is the headless core entrypoint.
- `./react` is the React adapter entrypoint.
- The core owns parsing, normalization, and AST construction.
- The React layer owns composition and rendering, but not domain parsing.
- `ParsedTab.chordsFound` is the downstream contract for chord discovery; consumers should not infer chords by scanning lyrics or React nodes.

## Chord Detection Contract

The order of responsibility inside the core is:

1. `parseChordSymbol()` validates one token.
2. `tokenizeContentWord()` decides whether the word is a chord, lyric, or decoration.
3. `tokenizeRawLine()` preserves spacing and columns.
4. `parseTab()` builds the AST and adds `chordsFound`.
5. `collectDiagrammableChords()` keeps only the real `ChordToken` values and removes duplicates.
6. `transposeParsedTab()` must refresh `chordsFound` after transposition.

## Source Layout

- `src/core/` contains the normalized AST and pure transformation code.
- `src/react/` contains the public React primitives and the convenience `Tab` wrapper.
- `src/test/` contains shared fixtures and test setup.
- `src/react/Tab.stories.tsx` is the primary Storybook entry for the library.
- `src/stories/` is the stock Vite Storybook template and should not gain library-specific behavior.

## Documentation Contract

- Keep `README.md`, `docs/prd/`, `docs/rfc/`, and `docs/plans/` aligned with public API changes.
- If the package shape changes, update the PRD and RFC before changing implementation.
- If a decision is hard to reverse, document it in RFC form, not only in code comments.

## Validation

- Prefer `npm test` for behavior.
- Use `npm run build` for package output and declaration emit.
- Use `npm run build-storybook` for Storybook coverage.
- Keep `npm run lint` clean before committing.
- When a parsing rule changes, update `src/core/__tests__/` and the docs that describe `ParsedTab.chordsFound`.

## Publishing

- Keep `private` false in `package.json`.
- Preserve `exports` for `.` and `./react`.
- Do not add app-only dependencies to the public entrypoints.

## Downstream Consumers

Primary integration app: [`ac15`](../../../ac15) (`apps/web` imports `tab-renderer/core` directly; `packages/ui` uses `tab-renderer/react`).

Published npm releases are consumed by external applications. After publishing a new version:

1. Update the dependency version in each consumer project's `package.json`.
2. Run the consumer's install command to refresh the lockfile.
3. Run tests and build in each consumer to confirm compatibility.
4. Commit and push the consumer update.
