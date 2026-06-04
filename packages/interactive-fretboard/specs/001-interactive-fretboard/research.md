# Research: Interactive Fretboard Editor

**Date:** 2026-06-04

## Legacy reference: AC12

| Topic       | AC12 behavior                                            | New package                                  |
| ----------- | -------------------------------------------------------- | -------------------------------------------- |
| Hit-test    | `getBoundingClientRect` on fret/string `<line>` elements | **Rejected** — breaks under CSS scale/zoom   |
| Coordinates | Screen pixels vs line bounds                             | **viewBox** + `getScreenCTM().inverse()`     |
| Data model  | `DotsObject` keyed by open-string note (`E4`, `A2`)      | **`FrettedInstrumentVoicing` / stringIndex** |
| Layout      | Horizontal 16-fret neck                                  | Four modes: H/V × R/L handed                 |
| Diagram     | Separate `ClientChordDiagram` (svguitar)                 | Unchanged pattern for consumers              |
| Transpose   | In-page ±1 buttons                                       | AC15 UI (not required in lib v1)             |

## Pointer Events vs Mouse Events

Use **`PointerEvent`** on the root SVG so mouse, touch, and pen share one code path ([Pointer Events Level 3](https://www.w3.org/TR/pointerevents3/)).

## SVG coordinate conversion

```ts
const point = new DOMPoint(event.clientX, event.clientY);
const svgPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());
```

Works when CSS sets `width: 100%` while `viewBox` stays fixed ([MDN `getScreenCTM`](https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM)).

## Hit-test strategy (hybrid)

1. **Pure geometry** — `hitTestFretCell(frame, point)` for tests and fallback.
2. **Invisible hit rects** — generated from the same `frame.cells` for generous touch targets (≥ 44px equivalent in viewBox space at default size).

Do **not** rely on clicking thin `<line>` elements.

## Libraries considered

| Library     | Verdict                             |
| ----------- | ----------------------------------- |
| svg.js      | Skip v1 — DOM generation not needed |
| D3          | Skip — not data-driven charts       |
| interact.js | Skip v1 — no drag barre             |
| PixiJS      | Skip — not a game canvas            |

## npm scope `@achorde`

Sibling packages use unscoped names (`svguitar-react`, `achorde-musical-domain`). This package adopts **`@achorde/interactive-fretboard`** for clearer org branding; requires creating the **`@achorde`** npm organization before first publish.

## Relationship to `svguitar-react`

- **`svguitar-react`**: compact chord **diagram**, multiple layout engines, export/import state.
- **`@achorde/interactive-fretboard`**: full-neck **editor**, pointer-first.

No merge of packages; optional Storybook story showing both side by side.
