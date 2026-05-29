# Test Fixtures and Setup

This folder contains shared test infrastructure.

## Responsibilities

- `src/test/setup.ts` configures the DOM test environment and matchers.
- `src/test/stubs/` stores shared fixture bodies and helper exports.

## Rules

- Prefer a shared real-world fixture over synthetic test strings.
- Keep fixtures versioned with the package behavior.
- Use `tua-flor.txt` for core tests, React tests, and Storybook stories unless a new case requires a distinct fixture.
- Use `so-quero-esse-amor.txt` for parenthesized chord rows, `F7(9)` / `D7/9`-style symbols, and section headers (`import` from `so-quero-esse-amor.ts`).
- Avoid adding production code here.

