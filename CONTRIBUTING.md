# Contributing to achorde

Thank you for helping improve achorde. Keep each change small, testable, and in the package that owns the behavior.

## Before you start

- Open an issue before a breaking change or a new public contract.
- Do not add copyrighted chord-chart bodies, private rights documents, credentials, or personal data.
- Use English for public documentation and changelogs.
- Read the target package README and its nearest `AGENTS.md` before editing.

## Local workflow

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

During development, run the smallest package command first:

```bash
pnpm --filter @achorde/source-catalog test
```

Include tests when behavior changes. Update the package README for a public API or workflow change, and update its changelog only when preparing a release.

## Pull requests

Explain the problem, the chosen boundary, and how reviewers can verify the result. A pull request should not publish packages, change consumer applications, or perform a release unless that work is explicitly in scope.

By contributing, you agree that your contribution is licensed under this repository's [MIT License](./LICENSE) and that you will follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
