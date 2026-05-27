# Documentation Rules

The documentation tree is part of the public contract for the package.

## What lives here

- `docs/prd/` explains the product goal and user-facing behavior.
- `docs/rfc/` explains architectural decisions, trade-offs, and public API shape.
- `docs/plans/` stores executable implementation plans.

## Writing rules

- Keep PRDs focused on intent, scope, and acceptance criteria.
- Keep RFCs focused on the why behind an architectural choice.
- Keep plans concrete and executable, with file paths and validation steps.
- Write new docs in English unless the user explicitly asks otherwise.

## Maintenance rules

- Update docs before or alongside API changes.
- If the public package surface changes, update the PRD and RFC in the same change.
- Plans should describe the actual files in this repo, not abstract placeholders.

