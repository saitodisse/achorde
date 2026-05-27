# Source Tree Overview

`src/` contains the implementation and the demo app for the package.

## Responsibilities

- `src/core/` owns the headless AST and transformation pipeline.
- `src/react/` owns the public React adapter and its composable primitives.
- `src/test/` owns shared fixtures and test setup.
- `src/App.tsx` and `src/App.css` provide a demo surface that exercises the public React API.
- `src/index.ts` and `src/react.ts` are public entrypoints for package exports.

## Rules

- Keep core logic framework-agnostic.
- Keep React adapter code free of domain parsing that belongs in `src/core/`.
- Prefer small modules with one responsibility.
- Use shared fixtures from `src/test/stubs/` for tests and Storybook stories when possible.

## Validation

- Core changes should be covered by `src/core/__tests__/`.
- React adapter changes should be covered by `src/react/__tests__/`.
- If the demo app changes, verify the visual output still reflects the public API.

