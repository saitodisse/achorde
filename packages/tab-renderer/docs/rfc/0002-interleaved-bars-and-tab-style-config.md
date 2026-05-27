# Interleaved Bars and TabStyleConfig

## Status

Accepted — implementation follows [plan](../plans/2026-05-23-styled-viewer-pipeline-and-stories.md).

## Context

[PRD 0002](../prd/0002-styled-viewer-pipeline.md) extends the library beyond per-line tokenization. Achordex proved that chord-over-lyric layout requires:

1. **Pairing** chord lines with lyric lines.
2. **Interleaving** lyric fragments and chords into a single render stream.
3. **CSS offsets** on chord spans inside a `pre-wrap` container.

RFC 0001 stated the React adapter should stay “headless by default.” This RFC **narrows** that rule:

- **Primitives** (`Tab.Root`, `Tab.Section`, …) remain style-agnostic.
- The **convenience `Tab`** component gains an optional, documented **`TabStyleConfig`** for the Achordex-equivalent viewer — the primary integration path for apps.

Custom design systems may still use `prepareSong` + primitives + their own CSS.

## Decision Summary

| Topic       | Decision                                                      |
| ----------- | ------------------------------------------------------------- |
| Pipeline    | Port Achordex phases into `src/core/` (framework-agnostic)    |
| Primary AST | Interleaved `PreparedSong` / `BarSegment[]`                   |
| Legacy AST  | Keep `transform()` token model for teaching & tests           |
| Transpose   | Core phase before `generateBarList`                           |
| Styling     | `TabStyleConfig` on `Tab`; CSS trick in `TabStyled` internals |
| displayMode | Omit chord or lyric **segments** at React build time          |
| viewMode    | `"o"` → `\n` suffix; `"e"` → `". . "` suffix                  |
| scrollSpeed | Not in public API                                             |

## Pipeline Architecture

Orchestrator: **`prepareSong(options)`** (exported from `.`)

```
body: string
    │
    ▼
splitSections()          → SectionText[]
    │
    ▼
pairLines()              → BarLine[] per section (chord row + lyric row aligned)
    │
    ▼
extractChords()          → ChordItem[] with positions (beat 4 default)
    │
    ▼
transposeSection()       → transposed sections (transposeNumber)
    │
    ▼
generateBarList()        → PreparedSection[] with interleaved BarSegment[]
```

Equivalent Achordex files (reference only):

- `splitSections.ts`
- `parser/pairer/`
- `parser/extractor/`
- `transposer/transposeSection`
- `renderer/propsGenerator.ts`

### `viewMode` and bar suffix

```ts
const barSuffix = viewMode === "o" ? "\n" : ". . ";
```

Passed into `generateBarList({ sectionTexts, barSuffix })`.

- **Original (`"o"`)** — newline between bars; compact layout.
- **Extended (`"e"`)** — spaced dot suffix; wider separation for performance reading.

### `transposeNumber`

Integer semitones, applied in **`transposeSection`** using a tonal library (e.g. `@tonaljs/tonal` — add as **core dependency**).

- `0` — no change.
- Positive / negative — chromatic shift on parsed chord roots.

## Data Model

### `BarSegment` (discriminated union)

```ts
type BarSegment =
  | { kind: "lyric"; text: string; isNoLyricsLine?: boolean }
  | { kind: "chord"; chord: ParsedChord; isNoLyricsLine?: boolean }
  | { kind: "separator"; text: string; isNoLyricsLine?: boolean }; // space / suffix
```

`ParsedChord` holds structured root, quality, bass, display text — mirror Achordex `SimpleChord` + `chordToText()`.

### `PreparedSection`

```ts
type PreparedSection = {
  title: string | null;
  barList: BarSegment[];
};
```

### `PreparedSong`

```ts
type PreparedSong = {
  body: string;
  sections: PreparedSection[];
};
```

### Legacy model (unchanged)

`Song` / `Line` / `Token` from `transform()` — **not** used by styled `Tab`. Retained for:

- Existing unit tests
- Storybook `01`–`06` pedagogy

Future: mark `transform()` as `@deprecated` in a minor release after `prepareSong` ships.

## React Rendering

### Component split

| Component            | Responsibility                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `Tab`                | Public API: `body` + `style?: Partial<TabStyleConfig>`                                                  |
| `usePreparedSong`    | Memo on `body`, `transposeNumber`, `viewMode`                                                           |
| `useTabNodes`        | Memo on `PreparedSong`, `displayMode`, style fields                                                     |
| `TabStyledContainer` | `pre`/`div` with `fontSize`, `lineHeight`, colors, `backgroundColor`, `contentMarginRightPx`, monospace |
| `TabStyledSection`   | Section title + bordered block (minimal v0.2)                                                           |
| `TabChordSpan`       | Applies offset styles                                                                                   |
| `TabLyricSpan`       | Lyric color                                                                                             |

### CSS trick (chord above lyric)

For each chord segment, inline styles (from Achordex `Tab.tsx`):

```ts
const marginRightEm = chordText.length * blockMarginRight;
const offsetBottomRem = isNoLyricsLine
  ? fontSize * chordHeight - 1
  : fontSize * chordHeight;

const style: CSSProperties = {
  position: "relative",
  bottom: `${offsetBottomRem}rem`,
  marginRight: `-${marginRightEm}em`,
  fontWeight: "bold",
  color: chordColor,
};
```

Container:

```ts
{
  fontSize: `${fontSize}px`,
  paddingTop: `${fontSize - fontSize * lineHeight}px`,
  color: lyricColor,
  backgroundColor,
  marginRight: contentMarginRightPx ? `${contentMarginRightPx}px` : undefined,
  whiteSpace: "pre-wrap",
  fontFamily: "var(--tab-mono, monospace)",
}
```

Each bar group wrapped in a span with **per-segment `lineHeight`** (see Achordex `Section.tsx`) when `isNoLyricsLine` — required for chord-only rows.

### `displayMode` (render-time filter)

When building React nodes from `barList`:

| Mode     | Skip               |
| -------- | ------------------ |
| `both`   | nothing            |
| `chords` | `kind === "lyric"` |
| `lyrics` | `kind === "chord"` |

Separators follow Achordex rules: lyric separators skipped in `chords` mode; chord nodes skipped in `lyrics` mode.

### Performance: two memos

1. **Bars memo** — deps: `body`, `transposeNumber`, `viewMode`, `beat`
2. **Nodes memo** — deps: `preparedSong`, `displayMode`, `fontSize`, `lineHeight`, `chordHeight`, `blockMarginRight`, colors

Never add typography deps to the bars memo.

## Public API

### Core (`.`)

```ts
export { prepareSong } from "./core/prepareSong";
export type {
  PreparedSong,
  PreparedSection,
  BarSegment,
  PrepareSongOptions,
  TabStyleConfig, // pure type shared with react
} from "./core/types";

export { transform } from "./core/transform"; // legacy
```

### React (`./react`)

```ts
export { Tab } from "./Tab";
export type { TabProps, TabStyleConfig } from "./types";

export const DEFAULT_TAB_STYLE: TabStyleConfig;

// Primitives unchanged
export { TabRoot, TabSection, TabLine, TabChord, TabLyric } from "./...";
```

### `TabStyleConfig` (full type)

```ts
export type TabStyleConfig = {
  transposeNumber: number;
  fontSize: number;
  lineHeight: number;
  blockMarginRight: number;
  chordHeight: number;
  contentMarginRightPx: number;
  viewMode: "o" | "e";
  displayMode: "chords" | "lyrics" | "both";
  chordColor: string;
  lyricColor: string;
  backgroundColor: string;
};
```

`TabProps`:

```ts
type TabProps = {
  body: string;
  className?: string;
  style?: Partial<TabStyleConfig>;
};
```

Merged with `DEFAULT_TAB_STYLE` at runtime.

### Validation

| Field                  | Constraint                                        |
| ---------------------- | ------------------------------------------------- |
| `contentMarginRightPx` | clamp 0 or 200–1000 when set                      |
| `transposeNumber`      | integer; wrap 0–11 at UI layer optional           |
| colors                 | valid CSS color strings (consumer responsibility) |

## Source Layout (planned)

```
src/core/
  parser/           splitSections, pairer, extractor
  transposer/       transposeSection, chordToText
  renderer/         generateBarList.ts
  prepareSong.ts    orchestrator
  types.ts          PreparedSong, BarSegment, legacy types
  transform.ts      legacy (unchanged)

src/react/
  styled/           TabStyledContainer, TabChordSpan, useTabNodes, ...
  Tab.tsx           wires prepareSong + styled render
  stories/
    07-styling/     sequential styling stories
```

## Storybook Contract

Group: **`tab-renderer/07 Styling`**

| #   | Story          | Controls introduced                           |
| --- | -------------- | --------------------------------------------- |
| 1   | Typography     | `fontSize`, `lineHeight`                      |
| 2   | Colors         | `chordColor`, `lyricColor`, `backgroundColor` |
| 3   | Chord offset   | `chordHeight`, `blockMarginRight`             |
| 4   | Display mode   | `displayMode`                                 |
| 5   | View mode      | `viewMode`                                    |
| 6   | Transpose      | `transposeNumber`                             |
| 7   | Content margin | `contentMarginRightPx`                        |
| 8   | Full config    | all fields                                    |

Shared: `story-decorators`, `tua-flor` or `sectionedBody` fixture, dark background default.

ArgTypes: use Storybook `control` types (`number`, `color`, `radio` for enums).

## Trade-offs

### Why interleaved bars instead of CSS Grid on two lines?

Two physical lines break on wrap; interleaving + negative margins is the proven Achordex approach and matches musician mental model (one flow, chords floated up).

### Why keep legacy `transform()`?

Avoid breaking pedagogical stories and early adopters; clear migration path.

### Why `@tonaljs/tonal` in core?

Transpose is structural (chord identity changes), not presentational — belongs in headless phase.

### Risks

| Risk                     | Mitigation                                                |
| ------------------------ | --------------------------------------------------------- |
| Large port from Achordex | Phase plan; copy tests first                              |
| Bundle size (tonal)      | Tree-shake; document optional future `transpose` peer dep |
| API surface growth       | Single `TabStyleConfig`; primitives stay clean            |

## Alternatives Considered

1. **CSS-only on current AST** — rejected; cannot align chords over lyrics across wraps.
2. **Style props only in Storybook** — rejected; user requires full public API.
3. **Hide full chord/lyric lines** — rejected; user chose Achordex segment filtering.

## Related Documents

- [PRD 0002](../prd/0002-styled-viewer-pipeline.md)
- [Implementation plan](../plans/2026-05-23-styled-viewer-pipeline-and-stories.md)
- [RFC 0001](./0001-package-structure-and-public-api.md)
