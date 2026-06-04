# Contract: Hit Testing

## Pipeline

```text
PointerEvent
  → screenToSvgPoint(svg, event) → { x, y } | null
  → hitTestFretCell(frame, point) → { stringIndex, fret } | null
  → apply editor tap rules → new voicing
```

## `screenToSvgPoint`

```ts
export function screenToSvgPoint(
	svg: SVGSVGElement,
	event: PointerEvent | MouseEvent,
): { x: number; y: number } | null;
```

### Algorithm

1. If `!svg.isConnected`, return `null`.
2. `const ctm = svg.getScreenCTM()`; if `!ctm`, return `null`.
3. `new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse())`.
4. Return `{ x, y }`.

### Requirements

- Must not use `offsetX` / `offsetY` alone.
- Must not use line `getBoundingClientRect` for fret/string selection.

## `hitTestFretCell`

```ts
export function hitTestFretCell(
	frame: FretboardFrame,
	point: { x: number; y: number },
): { stringIndex: number; fret: number } | null;
```

### Algorithm (geometry-first)

1. Reject points outside frame bounding box.
2. Find visual string index from Y (horizontal) or X (vertical) using `frame.strings` or cell centers.
3. Map to `stringIndex` via `frame.visualToStringIndex`.
4. Find fret index by comparing `point` against fret boundaries along the fret axis.
5. Return canonical `{ stringIndex, fret }`.

### Optional DOM path

Render invisible `<rect>` elements from `frame.cells` with `data-string-index` and `data-fret`. On `pointerdown`, if `event.target` carries dataset, use it **only** when it matches geometry hit (assert in dev).

## Invisible hit areas

```ts
export function buildHitAreas(frame: FretboardFrame): Array<{
	stringIndex: number;
	fret: number;
	hitRect: { x: number; y: number; width: number; height: number };
}>;
```

- `pointer-events: all`, `fill: transparent`, `aria-hidden="true"`.
- Minimum size: `minHitSize` from props.

## Test matrix (required)

| Case                                       | Assertion                                              |
| ------------------------------------------ | ------------------------------------------------------ |
| Point in cell (3, fret 5) horizontal-right | `{ stringIndex: 3, fret: 5 }`                          |
| Same logical cell after CSS width 50%      | Same result with mocked CTM scale                      |
| horizontal-left vs horizontal-right        | Same `stringIndex`, different visual row               |
| vertical-left mirror                       | Same `stringIndex` as vertical-right for symmetric tap |
| Point outside grid                         | `null`                                                 |

## Events

- Listen on root SVG: `onPointerDown` (primary), `onPointerMove` (hover preview), `onPointerLeave` (clear hover).
- Call `event.preventDefault()` on down when editing to reduce scroll jitter on touch.
