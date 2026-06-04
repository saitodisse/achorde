# @achorde/tab-renderer

**Live demo:** [tab-renderer-react.vercel.app](https://tab-renderer-react.vercel.app/)

Open-source chord sheet rendering library with:

- a headless core for parsing, transposition, and interleaved bar preparation
- a React adapter with a styled `Tab` viewer and composable primitives for custom layouts
- Vite as the build tool
- Storybook for isolated UI development
- Vitest for TDD

## Architecture

The package exposes two public entrypoints:

| Entrypoint                    | Role          |
| ----------------------------- | ------------- |
| `@achorde/tab-renderer`       | Headless core |
| `@achorde/tab-renderer/react` | React adapter |

### Rendering model

**`Tab` (public viewer)** — interleaved chord-over-lyric layout (RFC 0002 CSS trick):

- `parseTab()` → optional `transposeParsedTab()` → `prepareSongFromParsedTab()` → `generateBarList()` → React nodes
- Chord and **decoration** markers (`DecorationToken`) sit above lyrics via `position: relative`, `bottom`, and negative `marginRight` (`chordHeight`, `blockMarginRight`) inside `white-space: pre-wrap`
- `Tab` accepts `style?: Partial<TabStyleConfig>` (typography, colors, `displayMode`, `viewMode`, transpose, margins)

**Legacy styled pipeline** — `prepareSong()` still runs the Achordex pairer (`splitSections` → `pairLines` → `extractChords` → transpose). Prefer the ParsedTab bridge above for strict grammar and column positions.

**Headless AST** — for custom UI or inspection:

- `parseTab()` → `ParsedTab` → `ParsedTabSection` → `ParsedTabLine` → `ParsedTabToken` (`ChordToken`, `LyricToken`, `DecorationToken`, `SpaceToken`)
- Compose with `Tab.Root`, `Tab.Section`, `Tab.Line`, `Tab.Chord`, `Tab.Lyric`, `TabDecoration`

See [PRD 0002](./docs/prd/0002-styled-viewer-pipeline.md) and [RFC 0002](./docs/rfc/0002-interleaved-bars-and-tab-style-config.md).

Repository guidance: [`AGENTS.md`](./AGENTS.md), [`docs/AGENTS.md`](./docs/AGENTS.md), [`src/AGENTS.md`](./src/AGENTS.md).

## Install

**npm (recommended):**

```bash
pnpm add @achorde/tab-renderer @achorde/musical-domain
```

Current release: **`@achorde/tab-renderer@0.8.1`** (depends on `@achorde/musical-domain@^0.5.1`). Legacy unscoped `tab-renderer` remains on npm for older consumers.

**Monorepo / git:**

```bash
git clone https://github.com/achorde/achorde.git
cd achorde && pnpm install
```

Peer dependencies: `react` and `react-dom` (^18 or ^19) for the `./react` entrypoint.

## Core usage

### Styled pipeline (used by `Tab`)

```ts
import {
  parseTab,
  prepareSongFromParsedTab,
  transposeParsedTab,
} from "@achorde/tab-renderer";

const parsed = parseTab(body);
const transposed = transposeParsedTab(parsed, 0);
const prepared = prepareSongFromParsedTab(transposed, {
  viewMode: "e", // "o" = compact newline suffix, "e" = ". . "
});
// prepared.sections[].barList — lyric fragments, chords, decoration markers
```

### Legacy styled pipeline (pairer-based)

```ts
import { prepareSong } from "@achorde/tab-renderer";

const prepared = prepareSong({
  body,
  transposeNumber: 0,
  viewMode: "e",
  beat: 4,
});
```

### Headless AST (per-line tokens)

```ts
import { parseTab } from "@achorde/tab-renderer";

const song = parseTab(body);
// song.sections[].lines[].tokens — ChordToken | LyricToken | DecorationToken | SpaceToken
```

Exported: `ParsedTab`, `PreparedSong`, `TabStyleConfig`, `ChordLineMarker`, `BarsListItem`, `prepareSongFromParsedTab`, `transposeParsedTab`. Contracts from `@achorde/musical-domain` `^0.5.1` (`DecorationToken` and later APIs). See [`CONTEXT.md`](./CONTEXT.md).

## React usage

### Styled `Tab` (default)

```tsx
import { Tab, DEFAULT_TAB_STYLE } from "@achorde/tab-renderer/react";

export function Example() {
  return (
    <Tab
      body={body}
      style={{
        ...DEFAULT_TAB_STYLE,
        fontSize: 21,
        displayMode: "both",
        viewMode: "e",
        transposeNumber: 0,
      }}
    />
  );
}
```

### Composable primitives (headless AST)

```tsx
import { parseTab } from "@achorde/tab-renderer";
import { Tab } from "@achorde/tab-renderer/react";

const song = parseTab(body);

<Tab.Root song={song}>
  {song.sections.map((section, i) => (
    <Tab.Section key={i} section={section} index={i} />
  ))}
</Tab.Root>;
```

Also exported: `Tab.Line`, `Tab.Chord`, `Tab.Lyric`, `TabDecoration`.

### `TabStyleConfig`

| Field                                         | Purpose                                      |
| --------------------------------------------- | -------------------------------------------- |
| `transposeNumber`                             | Semitone shift (core transposer)             |
| `fontSize`, `lineHeight`                      | Container typography                         |
| `chordHeight`, `blockMarginRight`             | Chord and decoration offset above lyrics     |
| `contentMarginRightPx`                        | Container `margin-right` (200–1000 when set) |
| `viewMode`                                    | `"o"` original \| `"e"` extended bar spacing |
| `displayMode`                                 | `"chords"` \| `"lyrics"` \| `"both"`         |
| `chordColor`, `lyricColor`, `backgroundColor` | Colors                                       |

`scrollSpeed` is intentionally **not** part of this package (app-level fullscreen viewer).

## Storybook

```bash
npm run storybook
```

Teaching trail (sidebar):

| Group                | Content                                                                               |
| -------------------- | ------------------------------------------------------------------------------------- |
| `01 Core` … `06 Tab` | `tua-flor` fixture — raw body → AST → tokens → lines → sections → composition → `Tab` |
| `07 Styling`         | Full `TabStyleConfig` controls on `tua-flor`                                          |

Use the **Theme** toolbar (Light / Dark) for readable preview frames.

## Local development

```bash
npm install
npm run dev
npm run storybook
npm test
npm run lint
npm run build
npm run build-storybook
npm run build:site
npm run preview:site
```

The demo site is published at [tab-renderer-react.vercel.app](https://tab-renderer-react.vercel.app/).

## Documentation

- [docs/README.md](./docs/README.md) — index

**v0.1 bootstrap:**

- [PRD 0001](./docs/prd/0001-tab-renderer-library.md)
- [RFC 0001](./docs/rfc/0001-package-structure-and-public-api.md)
- [Plan — Bootstrap](./docs/plans/2026-05-23-bootstrap-and-core-slice.md)

**v0.2 styled viewer (shipped):**

- [PRD 0002](./docs/prd/0002-styled-viewer-pipeline.md)
- [RFC 0002](./docs/rfc/0002-interleaved-bars-and-tab-style-config.md)
- [Plan — Styled viewer](./docs/plans/2026-05-23-styled-viewer-pipeline-and-stories.md)

## Repository layout

- `src/core/` — headless parser, transposer, `prepareSong`
- `src/react/` — styled `Tab`, primitives, Storybook stories
- `src/test/stubs/tua-flor.txt` — shared fixture for tests and stories
- `src/stories/` — stock Vite Storybook template (not library API)
