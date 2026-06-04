# achorde

Monorepo for the shared music ecosystem (public npm packages).

## Packages

| Package                                       | npm                                                                              | Role                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`musical-domain`](./packages/musical-domain) | [`achorde-musical-domain`](https://www.npmjs.com/package/achorde-musical-domain) | Shared contracts: `ParsedTab`, voicings, diagnostics, chord label normalization, voicing selection |
| [`tab-renderer`](./packages/tab-renderer)     | [`tab-renderer`](https://www.npmjs.com/package/tab-renderer)                     | Headless parse/transpose (`./core`) and React rendering (`./react`)                                |
| [`svguitar-react`](./packages/svguitar-react) | [`svguitar-react`](https://www.npmjs.com/package/svguitar-react)                 | SVG chord diagrams for fretted instruments                                                         |

Private app integration and product flows live in the sibling repo [`ac15`](../ac15) (not published).

## Root commands

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

## Install (consumers)

```bash
pnpm add achorde-musical-domain tab-renderer svguitar-react
```

Use the version ranges documented in each package `README.md` and `CHANGELOG.md`. After publishing, bump dependents (including `ac15`) and run their install + test + build.

Repository: [github.com/achorde/achorde](https://github.com/achorde/achorde)

## Agent docs

- Root: [AGENTS.md](./AGENTS.md)
- Per package: `packages/*/AGENTS.md` and `packages/*/docs/`
