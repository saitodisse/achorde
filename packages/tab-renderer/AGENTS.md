# Global Repo Rules

This repository publishes `tab-renderer`, an open-source library for chord sheet parsing and rendering.

## Architecture

- The public npm package is a single artifact with subpath exports.
- `.` is the headless core entrypoint.
- `./react` is the React adapter entrypoint.
- The core owns parsing, normalization, and AST construction.
- The React layer owns composition and rendering, but not domain parsing.

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

## Publishing

- Keep `private` false in `package.json`.
- Preserve `exports` for `.` and `./react`.
- Do not add app-only dependencies to the public entrypoints.

## Downstream Consumers

Published npm releases are consumed by external applications. After publishing a new version:

1. Update the dependency version in each consumer project's `package.json`.
2. Run the consumer's install command to refresh the lockfile.
3. Run tests and build in each consumer to confirm compatibility.
4. Commit and push the consumer update.
