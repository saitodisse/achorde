# AGENTS.md - @achorde/tab-editor

## Purpose

Publishable React library for reusable chord chart editing. It owns text editing
UI, parser diagnostics, save/export payload derivation, lazy Monaco loading,
textarea fallback, and preview composition through `@achorde/tab-renderer`.

## Public Surfaces

- English package docs: https://achorde-musical-domain.vercel.app/en/packages/tab-editor
- Storybook: package-local `pnpm build-storybook` until a public deployment exists.

## Boundaries

| In scope                                            | Out of scope                         |
| --------------------------------------------------- | ------------------------------------ |
| `analyzeChordChartText` and diagnostics summary     | Markdown frontmatter parsing         |
| `createTextChangeProposal` for before/after payload | Git, pull requests, repository write |
| `ChordChartEditor` React component                  | Dexie, local persistence, sync       |
| Monaco lazy loading and textarea fallback           | AC15 product flows or routes         |
| Preview through `@achorde/tab-renderer/react`       | Catalog publication                  |

## Commands

Use **pnpm** only.

| Script                  | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `pnpm test`             | Vitest unit and React component tests        |
| `pnpm build`            | Vite package build and declaration emit      |
| `pnpm build-storybook`  | Static Storybook build                       |
| `pnpm lint`             | ESLint                                       |
| `pnpm storybook`        | Local Storybook on port 6012                 |

## Conventions

- Public docs, changelog entries, comments, and commits: **English**.
- Keep this package independent from Markdown, Astro, Next, Vercel, AC15,
  IndexedDB, and GitHub APIs.
- Consumers must import `@achorde/tab-editor/style.css` explicitly when they
  render the React editor.
- After npm publish, bump external consumers from the registry version. Do not
  use `file:` or `link:` in `artist-portal-base` or AC15.
