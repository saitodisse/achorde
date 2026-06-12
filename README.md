# achorde

Monorepo for the shared music ecosystem (public npm packages under the [`@achorde`](https://www.npmjs.com/org/achorde) scope).

## Packages

| Package                                                     | npm                                                                                              | Role                                                                                               |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`musical-domain`](./packages/musical-domain)               | [`@achorde/musical-domain`](https://www.npmjs.com/package/@achorde/musical-domain)               | docs only                                                                                          |
| [`tab-renderer`](./packages/tab-renderer)                   | [`@achorde/tab-renderer`](https://www.npmjs.com/package/@achorde/tab-renderer)                   | [demo](https://tab-renderer-react.vercel.app/) · [storybook](https://storybook-tab-renderer.vercel.app/) |
| [`svguitar-react`](./packages/svguitar-react)               | [`@achorde/svguitar-react`](https://www.npmjs.com/package/@achorde/svguitar-react)               | [demo](https://svguitar-react.vercel.app/) · [storybook](https://storybook-svguitar-react.vercel.app/?path=/docs/components-chorddiagram--docs) |
| [`interactive-fretboard`](./packages/interactive-fretboard) | [`@achorde/interactive-fretboard`](https://www.npmjs.com/package/@achorde/interactive-fretboard) | [demo](https://interactive-fretboard.vercel.app/) · [storybook](https://storybook-interactive-fretboard.vercel.app/) |
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
| `@achorde/musical-domain`        | `0.5.3`      |
| `@achorde/tab-renderer`          | `0.8.5`      |
| `@achorde/svguitar-react`        | `2.5.3`      |
| `@achorde/interactive-fretboard` | `0.1.11`     |

## Install (consumers)

```bash
pnpm add @achorde/musical-domain @achorde/tab-renderer @achorde/svguitar-react @achorde/interactive-fretboard
```

Use the version ranges documented in each package `README.md` and `CHANGELOG.md`. After publishing, bump dependents (including `ac15`) and run their install + test + build.

Repository: [github.com/saitodisse/achorde](https://github.com/saitodisse/achorde)

## Agent docs

- Root: [AGENTS.md](./AGENTS.md)
- Per package: `packages/*/AGENTS.md` and `packages/*/docs/`
