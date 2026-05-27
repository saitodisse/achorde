# Styled Viewer and Interleaved Pipeline PRD

## Status

Implemented (v0.2.0) — supersedes parts of [0001-tab-renderer-library.md](./0001-tab-renderer-library.md) for viewer styling and layout. The bootstrap PRD remains valid for package shape, tooling, and composable primitives.

## Problem

The bootstrap release (`0.1.x`) tokenizes each physical text line independently. That AST is useful for teaching and headless inspection, but it cannot reproduce the Achordex-style viewer:

- Chords visually **above** lyrics on the same flow
- **Line wrapping** without breaking column alignment
- **Transposition** applied before render props are built
- **Display modes** that hide chord or lyric **segments** (not whole source lines)
- A single public **`TabStyleConfig`** surface for typography, colors, layout margins, and view modes

Consumers who want a production chord viewer must currently reimplement pairing, interleaving, and CSS offset logic themselves.

## Goal

Evolve `tab-renderer` into a library that:

1. Runs a **multi-phase headless pipeline** (sections → pair → extract → transpose → interleaved bars), aligned with the proven Achordex model.
2. Exposes a **documented `TabStyleConfig`** on the React `Tab` entrypoint (and related types from the core entrypoint where pure).
3. Renders via the **CSS offset trick** (`position: relative`, negative `bottom`, negative `marginRight`) inside a `white-space: pre-wrap` container so lines can wrap.
4. Ships a **sequential Storybook group** (`07 Styling`) that teaches configuration from simplest to most complex, with Storybook controls for every style field.

## Reference Implementation

Behavior and defaults are derived from Achordex (`lib/tab/`, `components/tab/Tab.tsx`). Product language:

- **Original view** (`viewMode: "o"`) — compact; bar suffix is newline (`\n`); closer to stored text layout.
- **Extended view** (`viewMode: "e"`) — bars separated by `". . "` suffix; more spacing for live reading.

See Achordex admin docs: `components/admin-docs/PipelineCifrasContent.tsx`.

## Target Users

- App developers embedding a chord viewer (e.g. Achordex consuming this package over time).
- Contributors learning the pipeline via Storybook.
- Consumers who still want headless output without React.

## Product Shape (additions)

### Headless core

New primary output: **`PreparedSong`** (name TBD in RFC) with:

- `sections: PreparedSection[]`
- Each section has `title` and `barList: BarSegment[]`
- Segments are interleaved lyric fragments, chord items, and bar separators (space / newline)

Existing **`transform()` → token-per-line AST** remains available for primitive-level stories and backward compatibility until a deprecation window ends.

New orchestrator (name TBD): **`prepareSong(input)`** where `input` includes:

| Field             | Type                | Role                                           |
| ----------------- | ------------------- | ---------------------------------------------- |
| `body`            | `string`            | Raw chord sheet text                           |
| `transposeNumber` | `number`            | Semitone shift applied in core (0 = no change) |
| `viewMode`        | `"o" \| "e"`        | Original vs extended bar suffix                |
| `beat`            | `number` (optional) | Time signature hint for pairing (default `4`)  |

### React adapter

Exported **`TabStyleConfig`** (full public API):

| Property               | Type                             | Purpose                                                                                                                        |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `transposeNumber`      | `number`                         | Passed to core (may duplicate `prepareSong` input when using low-level API)                                                    |
| `fontSize`             | `number`                         | Container font size (px)                                                                                                       |
| `lineHeight`           | `number`                         | Lyric line height multiplier (rem scale via fontSize)                                                                          |
| `blockMarginRight`     | `number`                         | Negative margin factor per chord character (`em`)                                                                              |
| `chordHeight`          | `number`                         | Vertical offset factor for chord above baseline (`fontSize * chordHeight` rem)                                                 |
| `contentMarginRightPx` | `number`                         | `margin-right` on chord content container (200–1000 px); makes room for adjacent UI (e.g. dial panel) without shipping dial UI |
| `viewMode`             | `"o" \| "e"`                     | Original vs extended                                                                                                           |
| `displayMode`          | `"chords" \| "lyrics" \| "both"` | Filter segment types in render stream                                                                                          |
| `chordColor`           | `string`                         | Chord text color                                                                                                               |
| `lyricColor`           | `string`                         | Lyric text color                                                                                                               |
| `backgroundColor`      | `string`                         | Viewer background                                                                                                              |

**Default values** (aligned with Achordex `DEFAULT_TAB_VIEWER_PREFS`):

- `fontSize`: 21
- `transposeNumber`: 0
- `lineHeight`: 0.184
- `blockMarginRight`: 0.6
- `chordHeight`: 0.07
- `chordColor`: `#5884fe`
- `lyricColor`: `#d1dff5`
- `backgroundColor`: `#000000`
- `viewMode`: `"e"`
- `displayMode`: `"both"`
- `contentMarginRightPx`: 0 (no extra margin until consumer sets it)

### `Tab` component

- Accepts `body: string` and `style?: Partial<TabStyleConfig>` (exact prop name in RFC).
- Uses **two memo layers** (bars vs styled nodes) like Achordex for performance.
- Applies monospace font stack (consumer can override `className`).

### Storybook

New sidebar group: **`tab-renderer/07 Styling`**, ordered stories:

1. Typography only (`fontSize`, `lineHeight`)
2. Colors (`chordColor`, `lyricColor`, `backgroundColor`)
3. Chord offset (`chordHeight`, `blockMarginRight`) — explains CSS trick
4. `displayMode` (chords / lyrics / both)
5. `viewMode` (original vs extended)
6. `transposeNumber`
7. `contentMarginRightPx`
8. Full controls (all fields)

Existing groups `01 Core` … `06 Tab` stay on the **legacy token AST** for pedagogy until migrated.

## User-Visible Behavior

### Rendering model

- One **inline stream** per section (not two DOM rows per chord/lyric pair).
- Chords sit above lyrics using **relative positioning**, not a second line element.
- Container uses **`white-space: pre-wrap`** so long lines wrap; spaces in lyric segments preserve columns.

### `displayMode`

Achordex semantics (filter **segments** in the interleaved stream):

- `both` — lyric parts + chord items
- `chords` — chord items only (skip lyric parts; keep bar separators as needed)
- `lyrics` — lyric parts only (skip chord items)

### `viewMode`

- `"o"` (**original**) — `barSuffix = "\n"` between bars; compact.
- `"e"` (**extended**) — `barSuffix = ". . "` between bars; more readable spacing.

### `contentMarginRightPx`

- Applied as CSS `margin-right` on the scrollable chord content wrapper.
- Valid range **200–1000** when used (Storybook control clamped; runtime may clamp or warn).
- Does **not** render a dial or admin panel — layout hook only.

## Non-Goals (this initiative)

- **Auto-scroll / `scrollSpeed`** — product feature of fullscreen viewer; out of scope for `tab-renderer`.
- **Dial UI, nuqs, Convex, user settings** — stay in Achordex.
- **Section border colors hashed from title** — optional later; not required for v0.2.
- **Chord double-click copy, beat strong/weak opacity** — optional polish; may follow in a later PRD.
- Replacing Achordex in one migration PR — Achordex may adopt the package incrementally.

## Success Criteria

- PRD, RFC, and implementation plan are reviewed and stable before large code changes.
- Core pipeline tests cover pairing, transpose, interleaving, and both view modes.
- React tests cover `displayMode` filtering and style application on chord spans.
- Storybook `07 Styling` tells a complete styling story with interactive controls.
- README links to the new pipeline docs.

## Acceptance Criteria

- [x] `prepareSong` returns interleaved `barList` for the shared `tua-flor` fixture.
- [x] `transposeNumber !== 0` changes chord roots in output (test with C → D, etc.).
- [x] `viewMode: "o"` vs `"e"` produces detectably different bar suffix behavior in `barList`.
- [x] `Tab` with `displayMode: "chords"` renders no lyric segment text in the DOM.
- [x] `Tab` with `style.chordHeight` and `style.blockMarginRight` applies inline offset styles on chord spans.
- [x] `contentMarginRightPx` sets container `margin-right` in pixels.
- [x] Storybook group `07 Styling` exposes all `TabStyleConfig` fields via Storybook controls (except out-of-scope `scrollSpeed`).
- [x] `npm test`, `npm run build`, `npm run build-storybook` pass.

## Open Questions (resolved for v0.2)

| Question                   | Decision                                           |
| -------------------------- | -------------------------------------------------- |
| Style props on public API? | Yes — full `TabStyleConfig` export                 |
| Transpose where?           | Core pipeline                                      |
| displayMode semantics?     | Filter interleaved segments (Achordex)             |
| viewMode meaning?          | `"o"` original, `"e"` extended (per Achordex docs) |
| scrollSpeed?               | Out of scope                                       |
| contentMarginRightPx?      | In scope as CSS margin-right only                  |

## Related Documents

- [RFC 0002: Interleaved bars and TabStyleConfig](../rfc/0002-interleaved-bars-and-tab-style-config.md)
- [Plan: Styled viewer pipeline and stories](../plans/2026-05-23-styled-viewer-pipeline-and-stories.md)
- [PRD 0001 (bootstrap)](./0001-tab-renderer-library.md)
