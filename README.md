# achorde

Monorepo for the shared music ecosystem (public npm packages under the [`@achorde`](https://www.npmjs.com/org/achorde) scope).

## Packages

| Package                                                     | npm                                                                                              | Role                                                                                               |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`musical-domain`](./packages/musical-domain)               | [`@achorde/musical-domain`](https://www.npmjs.com/package/@achorde/musical-domain)               | Shared contracts: `ParsedTab`, voicings, diagnostics, chord label normalization, voicing selection |
| [`tab-renderer`](./packages/tab-renderer)                   | [`@achorde/tab-renderer`](https://www.npmjs.com/package/@achorde/tab-renderer)                   | Headless parse/transpose (`./core`) and React rendering (`./react`)                                |
| [`svguitar-react`](./packages/svguitar-react)               | [`@achorde/svguitar-react`](https://www.npmjs.com/package/@achorde/svguitar-react)               | SVG chord diagrams for fretted instruments                                                         |
| [`interactive-fretboard`](./packages/interactive-fretboard) | [`@achorde/interactive-fretboard`](https://www.npmjs.com/package/@achorde/interactive-fretboard) | Interactive SVG fretboard editor                                                                   |
| [`storybook-config`](./packages/storybook-config)           | _(private, workspace only)_                                                                      | Shared Storybook + Vite setup for `tab-renderer`                                                   |

Legacy unscoped names (`achorde-musical-domain`, `tab-renderer`, `svguitar-react`) remain on npm for existing consumers; new releases use `@achorde/*`.

Private app integration and product flows live in the sibling repo [`ac15`](../ac15) (not published).

## Root commands

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

## Published versions (latest)

| Package                          | npm `latest` |
| -------------------------------- | ------------ |
| `@achorde/musical-domain`        | `0.5.1`      |
| `@achorde/tab-renderer`          | `0.8.1`      |
| `@achorde/svguitar-react`        | `2.5.1`      |
| `@achorde/interactive-fretboard` | `0.1.6`      |

## Install (consumers)

```bash
pnpm add @achorde/musical-domain @achorde/tab-renderer @achorde/svguitar-react @achorde/interactive-fretboard
```

Use the version ranges documented in each package `README.md` and `CHANGELOG.md`. After publishing, bump dependents (including `ac15`) and run their install + test + build.

Repository: [github.com/achorde/achorde](https://github.com/achorde/achorde)

## Agent docs

- Root: [AGENTS.md](./AGENTS.md)
- Per package: `packages/*/AGENTS.md` and `packages/*/docs/`
