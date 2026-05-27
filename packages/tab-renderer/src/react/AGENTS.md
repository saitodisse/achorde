# React Adapter

The React layer renders the normalized AST exposed by the core.

## Responsibilities

- Expose the public `Tab` convenience wrapper.
- Expose composable primitives:
  - `Tab.Root`
  - `Tab.Section`
  - `Tab.Line`
  - `Tab.Chord`
  - `Tab.Lyric`
- `Tab` is the styled viewer (`prepareSong` + `TabStyleConfig`). Primitives remain headless and consume `ParsedTab` for custom composition.

## Rules

- Import parsing and shared AST types from `src/core/`, never duplicate parsing.
- Keep the wrapper and the primitives aligned with the exported public API.
- Do not add app-specific styling assumptions or Vite template leftovers.
- If a module intentionally mixes component exports and wrapper composition, keep the exception narrowly scoped.

## Storybook

- `src/react/stories/` is the canonical Storybook surface for the package.
- Stories are ordered `01 Core` → `07 Styling`, from raw `body` text through `TabStyleConfig` (single full-config story with all controls).
- Use `tua-flor.txt` via `story-tua-flor.ts` helpers across teaching stories `01`–`07`.

## Testing

- Put adapter tests in `src/react/__tests__/`.
- Verify the adapter can render the real shared fixture.
- Cover the public behavior, not just the internal JSX shape.
