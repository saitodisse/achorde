# AGENTS.md - @achorde/storybook-config

## Purpose

Shared Storybook and Vite configuration for packages in the `achorde` monorepo. It is private workspace tooling, not a public runtime package.

## Rules

- Use `pnpm` for install, validation, and workspace scripts.
- Keep changes focused on shared Storybook configuration used by the package demos.
- Keep documentation, comments, and commit messages in English.
- Do not add runtime application behavior here; package demos own their own UI stories.
