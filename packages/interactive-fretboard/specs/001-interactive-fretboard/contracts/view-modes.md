# Contract: View Modes (orientation × handedness)

## Four modes

```ts
export type FretboardOrientation = "horizontal" | "vertical";
export type FretboardHandedness = "right" | "left";

export type FretboardViewMode = {
	orientation: FretboardOrientation;
	handedness: FretboardHandedness;
};
```

| #   | orientation | handedness | Id                 |
| --- | ----------- | ---------- | ------------------ |
| 1   | horizontal  | right      | `horizontal-right` |
| 2   | horizontal  | left       | `horizontal-left`  |
| 3   | vertical    | right      | `vertical-right`   |
| 4   | vertical    | left       | `vertical-left`    |

## Canonical string index (never mirrored in data)

| stringIndex | Open note (standard tuning) |
| ----------- | --------------------------- |
| 1           | E4 (high)                   |
| 2           | B3                          |
| 3           | G3                          |
| 4           | D3                          |
| 5           | A2                          |
| 6           | E2 (low)                    |

Persisted `FrettedInstrumentVoicing.strings[].stringIndex` always uses this table.

## Visual mapping rules

### Horizontal + right-handed (default)

- Frets increase along **+X** (left = nut, right = higher frets).
- **High string (6)** at top visual row (−Y), **low string (1)** at bottom (+Y).
- Matches AC12 edit-page mental model for right-handed players.

### Horizontal + left-handed

- Same fret axis as horizontal-right.
- **Mirror string axis**: low string (1) at top, high string (6) at bottom (documented in tests).

### Vertical + right-handed

- Frets increase along **+Y** (nut at top).
- Strings spaced along **X**; low string (1) on the player’s left side of the diagram (screen −X).

### Vertical + left-handed

- Same fret axis as vertical-right.
- **Mirror string axis** along X.

## `visualToStringIndex`

Layout engine exposes:

```ts
visualToStringIndex(visualStringIndex: number): number;
```

where `visualStringIndex` is `0 .. stringCount-1` in **top-to-bottom** order for horizontal modes and **left-to-right** for vertical modes (document exact mapping in unit tests per mode).

## Default viewBox (implementation constants)

| Mode          | Default viewBox (w × h) |
| ------------- | ----------------------- |
| horizontal-\* | 1100 × 250              |
| vertical-\*   | 400 × 900               |

Consumers may override via props; hit-test must use the same frame as render.

## Storybook requirement

One story per mode with the same voicing (`x32010` parsed) so reviewers can verify inversion does not corrupt `stringIndex` in `onChange`.

## Companion chord diagram (AC15 / `@ac15/ui`)

When pairing this fretboard with `@achorde/svguitar-react` in product UIs:

- Vertical + right-handed fretboard → diagram **`vertical-right`** (`ViewId`).
- Map orientation/handedness directly: `` `${orientation}-${handedness}` `` — **no extra mirroring** for vertical modes.
- Low string (6) appears on the **left** in both components for right-handed vertical layouts.
