# achorde

Achorde is a public monorepo of small TypeScript and React packages for chord charts, musical contracts, static catalogs, and fretboard interfaces.

## Start here

```bash
git clone https://github.com/saitodisse/achorde.git
cd achorde
pnpm install
pnpm test
pnpm build
```

The [ACHORDE Docs Hub](https://achorde-musical-domain.vercel.app/en) explains how the packages fit together. Each package README is the practical guide, and each package changelog is the version history.

## Packages

Versions below describe this workspace. Check npm before choosing an exact version for a consumer.

| Package | Version | Use it for |
| --- | ---: | --- |
| [`@achorde/musical-domain`](./packages/musical-domain/) | `0.6.0` | Shared musical types and pure voicing helpers |
| [`@achorde/source-catalog`](./packages/source-catalog/) | `0.3.0` | Read-only Source Catalog schemas `1.0`, `1.1`, and `1.2` |
| [`@achorde/contribution-protocol`](./packages/contribution-protocol/) | `0.2.0` | Browser-safe contribution manifest validation |
| [`@achorde/catalog-portal`](./packages/catalog-portal/) | `0.1.0` | Shared catalog search, projection, React, and browser adapters |
| [`@achorde/tab-renderer`](./packages/tab-renderer/) | `0.8.5` | Chord-chart parsing, transposition, and React rendering |
| [`@achorde/tab-editor`](./packages/tab-editor/) | `0.1.0` | Chord-chart analysis and React editing |
| [`@achorde/svguitar-react`](./packages/svguitar-react/) | `3.0.0` | Compact SVG chord diagrams |
| [`@achorde/interactive-fretboard`](./packages/interactive-fretboard/) | `0.2.0` | Pointer-based fretboard editing |
| [`@achorde/storybook-config`](./packages/storybook-config/) | `0.2.0` | Private Storybook workspace configuration |

Legacy unscoped package names remain available for existing consumers. New code should use `@achorde/*`.

## Boundaries

This repository owns reusable public libraries. Applications and portals own their routes, copy, persistence, network access, Git workflows, and publication decisions.

In particular:

- Source Catalog is pull-only. It does not become writable because a contribution gateway exists.
- Contribution Protocol validates portable data. It does not read ZIP files, authenticate users, or create pull requests.
- Catalog Portal provides building blocks. It is not a complete portal application or command-line tool.
- Private product behavior belongs in the separate AC15 repository.

## Common commands

```bash
pnpm test
pnpm build
pnpm typecheck
pnpm lint
```

Run a package in isolation with `pnpm --filter <package> <script>`.

## Documentation

- [ACHORDE Docs Hub](https://achorde-musical-domain.vercel.app/en)
- Package guides: `packages/*/README.md`
- Version history: `packages/*/CHANGELOG.md`
- Source Catalog reference: [`packages/source-catalog/docs/contract.md`](./packages/source-catalog/docs/contract.md)
- How to contribute: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Security reports: [`SECURITY.md`](./SECURITY.md)
- Community behavior: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- License: [`LICENSE`](./LICENSE)
- Repository rules: [`AGENTS.md`](./AGENTS.md)

Repository: [github.com/saitodisse/achorde](https://github.com/saitodisse/achorde)
