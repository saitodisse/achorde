# AGENTS.md - svguitar-react

Central instructions for AI agents and IDE assistants working in this repository.

## Overview

`svguitar-react` is an open-source React and TypeScript library for rendering fretted-instrument chord diagrams as SVG. It uses Vite, Storybook, Vitest, ESLint, and Prettier.

## Public Surfaces

- English package docs: https://achorde-musical-domain.vercel.app/en/packages/svguitar-react
- Demo site: https://svguitar-react.vercel.app/
- Storybook: https://storybook-svguitar-react.vercel.app/?path=/docs/components-chorddiagram--docs

**Package manager:** always use **pnpm**. Do not use npm or yarn for repository tasks.

Before behavior changes, read the public types, tests, README, and changelog.

## Stack

| Area        | Technology               |
| ----------- | ------------------------ |
| UI          | React 19, TypeScript 5.8 |
| Build       | Vite 7                   |
| Visual docs | Storybook 9              |
| Tests       | Vitest, test-storybook   |
| Quality     | ESLint 9, Prettier 3     |

## Structure

```text
src/
├── components/ChordDiagram/   # Main library component
├── components/ui/             # Demo application UI
├── stories/                   # Storybook stories
├── App.tsx, main.tsx          # Demo application
└── index.ts                   # Library entrypoint
```

## Commands

| Script           | Command                      | Purpose                      |
| ---------------- | ---------------------------- | ---------------------------- |
| Dev              | `pnpm dev`                   | Vite demo app                |
| Build library    | `pnpm build`                 | npm package build            |
| Lint             | `pnpm lint`                  | ESLint                       |
| Format           | `pnpm format`                | Prettier write               |
| Format check     | `pnpm format:check`          | Prettier check               |
| Storybook        | `pnpm storybook`             | Local Storybook on port 6006 |
| Build Storybook  | `pnpm build-storybook`       | Static Storybook build       |
| Unit tests       | `pnpm test:run`              | Vitest once                  |
| Watch tests      | `pnpm test:watch`            | Vitest watch                 |
| Storybook tests  | `pnpm test-storybook`        | Storybook integration tests  |
| Coverage         | `pnpm test:coverage`         | Test coverage                |
| Deploy Storybook | `pnpm deploy-storybook:prod` | Production Storybook deploy  |

## Code Conventions

- Prettier uses tabs, double quotes, `printWidth` 110, semicolons, trailing commas where valid in ES5, and LF line endings.
- Use explicit TypeScript types for public APIs.
- Add or update Storybook stories for new component behavior.
- Keep imports grouped with external imports before internal imports.
- Before committing, run formatting and keep lint clean.

## Shared Domain

`@achorde/musical-domain` owns the shared fretted voicing contracts used by this package. Keep those contracts outside React-specific code. `@achorde/svguitar-react` owns SVG rendering, layout, and React integration only.

## Downstream Consumers

Published npm releases are consumed by external applications. After publishing a new version:

1. Update the dependency version in each consumer project's `package.json`.
2. Run the consumer's install command to refresh the lockfile.
3. Run tests and build in each consumer to confirm compatibility.
4. Commit and push the consumer update.

## MCP Tools

- **Storybook visual checks:** prefer `pnpm test-storybook`. Use Playwright MCP against `http://localhost:6006/` only when Storybook is running.
- **External libraries:** use Context7 for current documentation before integrating new APIs.

## Communication

- Repository documentation, changelog entries, code comments, and commit messages must be written in English.
- User-facing chat can follow the user's language unless repository artifacts are being edited.

## Do Not

1. Use npm or yarn instead of pnpm.
2. Commit unformatted code.
3. Ignore ESLint warnings.
4. Add components without corresponding stories.
5. Use spaces for indentation in formatted source files.
6. Add undocumented features.
7. Integrate external libraries without checking current documentation.

## Configuration

Key configuration files: `.prettierrc`, `eslint.config.js`, `vite.config.ts`, `tsconfig.json`, `.storybook/`.
