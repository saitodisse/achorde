# Plan: @achorde/interactive-fretboard package

**Status:** approved — implementation next  
**Date:** 2026-06-04  
**Spec:** [`specs/001-interactive-fretboard/spec.md`](../specs/001-interactive-fretboard/spec.md)  
**AC15:** [`ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md`](../../../../ac15/docs/plans/2026-06-04-editor-fretboard-interativo-ac15.md)

## Goal

Ship the open-source interactive fretboard editor as the fourth published achorde package, with four view modes and viewBox-safe hit-testing, then integrate into AC15 chord routes.

## Dependencies

| Package                  | Relationship                          |
| ------------------------ | ------------------------------------- |
| `achorde-musical-domain` | Voicing types, parse, barre inference |
| `svguitar-react`         | None (diagram preview stays separate) |
| `ac15`                   | Consumer via `@ac15/ui`               |

## npm organization

1. npm org **`@achorde`** — [package settings](https://www.npmjs.com/settings/achorde/packages) (created).
2. Add maintainers and publish token to CI.
3. First publish: `@achorde/interactive-fretboard@0.1.0`.
4. Document unscoped legacy packages remain as-is (`svguitar-react`, etc.).

## Execution order

1. Complete **Phase 0–4** in [`tasks.md`](../specs/001-interactive-fretboard/tasks.md).
2. Publish package.
3. Execute AC15 plan (wrapper + routes).
4. Run `pnpm check:npm-publish` from ac15 root.

## Non-goals

- Merging into `svguitar-react`.
- Barre drag UI in v1.
- Replacing `achorde-musical-domain` chord detection (future port optional).
