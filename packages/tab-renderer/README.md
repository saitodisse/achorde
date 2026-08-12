# @achorde/tab-renderer

A chord-chart parser, transposer, and React renderer. The root entrypoint is headless; the `/react` entrypoint provides visual components.

Workspace version: `0.8.5` · [npm](https://www.npmjs.com/package/@achorde/tab-renderer) · [Docs Hub](https://achorde-musical-domain.vercel.app/en/packages/tab-renderer) · [demo](https://tab-renderer-react.vercel.app/) · [Storybook](https://storybook-tab-renderer.vercel.app/)

## Install

```bash
pnpm add @achorde/tab-renderer @achorde/musical-domain
```

React 18 or 19 is required only for `@achorde/tab-renderer/react`.

## Parse and transpose

```ts
import { parseTab, transposeParsedTab } from "@achorde/tab-renderer";

const parsed = parseTab("[Verse]\nC   G\nA line of lyrics");
const transposed = transposeParsedTab(parsed, 2);

parsed.sections;    // strict line and token tree
parsed.diagnostics; // authoring problems
transposed.chordsFound; // ["D", "A"]
```

`ParsedTab` has four line kinds: `section-header`, `chords`, `lyrics`, and `blank`. Spacing is preserved through tokens. Parentheses used as stage markers become `DecorationToken`; parentheses inside `C7(13)` remain part of the chord.

Use `ParsedTab.chordsFound` for diagram lookup. It contains unique real chord symbols in appearance order and excludes repeat markers such as `/`.

## Render with React

```tsx
import { Tab, DEFAULT_TAB_STYLE } from "@achorde/tab-renderer/react";

<Tab
  body={body}
  style={{
    ...DEFAULT_TAB_STYLE,
    fontSize: 21,
    displayMode: "both",
    viewMode: "e",
    transposeNumber: 0,
  }}
/>;
```

`Tab` uses the strict parser, optional transposition, and the interleaved chord-over-lyric layout. `displayMode` can show chords, lyrics, or both. `viewMode` controls compact or extended bar spacing.

For a custom UI, compose `Tab.Root`, `Tab.Section`, `Tab.Line`, `Tab.Chord`, `Tab.Lyric`, and `TabDecoration` around a parsed song.

## Headless prepared output

```ts
import {
  parseTab,
  prepareSongFromParsedTab,
} from "@achorde/tab-renderer";

const song = parseTab(body);
const prepared = prepareSongFromParsedTab(song, {
  viewMode: "e",
  beat: 4,
});
```

`prepareSong()` remains available for older pairer-based consumers. New integrations should prefer `parseTab()` and `prepareSongFromParsedTab()`.

## Package boundary

This package parses and renders chart text. It does not store drafts, resolve product-specific chord aliases, choose voicings, or manage routes. Shared musical types come from `@achorde/musical-domain`.

## Documentation

- [`CONTEXT.md`](./CONTEXT.md): parsing vocabulary
- [Package structure decision](./docs/rfc/0001-package-structure-and-public-api.md)
- [Interleaved rendering decision](./docs/rfc/0002-interleaved-bars-and-tab-style-config.md)
- [`CHANGELOG.md`](./CHANGELOG.md): version history

## Development

```bash
pnpm test
pnpm lint
pnpm build
pnpm storybook
pnpm build-storybook
```
