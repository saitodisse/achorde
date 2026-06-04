# Quickstart: @achorde/interactive-fretboard

> Implementation pending — API stable per contracts.

## Install

```bash
pnpm add @achorde/interactive-fretboard achorde-musical-domain react react-dom
```

## Controlled voicing (canonical)

```tsx
import { useState } from "react";
import {
  InteractiveFretboard,
  type InteractiveFretboardChangeDetails,
} from "@achorde/interactive-fretboard";
import type { FrettedInstrumentVoicing } from "achorde-musical-domain";

export function ChordEditor() {
  const [voicing, setVoicing] =
    useState<FrettedInstrumentVoicing>(initialVoicing);

  return (
    <div style={{ width: "100%", maxWidth: 1100 }}>
      <InteractiveFretboard
        value={voicing}
        onChange={(details: InteractiveFretboardChangeDetails) => {
          setVoicing(details.voicing);
        }}
        orientation="horizontal"
        handedness="right"
        fretCount={16}
        detectChord
      />
    </div>
  );
}
```

## Fret notation mode (embeds / simple apps)

```tsx
<InteractiveFretboard
  valueMode="fretNotation"
  fretNotation="x32010"
  chordSymbol="C"
  onChange={(details) => {
    console.log(details.fretNotation, details.voicing);
  }}
/>
```

## Four view modes

```tsx
<InteractiveFretboard value={voicing} onChange={...} orientation="horizontal" handedness="right" />
<InteractiveFretboard value={voicing} onChange={...} orientation="horizontal" handedness="left" />
<InteractiveFretboard value={voicing} onChange={...} orientation="vertical" handedness="right" />
<InteractiveFretboard value={voicing} onChange={...} orientation="vertical" handedness="left" />
```

## Theming (CSS variables)

```css
.interactive-fretboard-theme {
  --ifret-bg: #1a1a1a;
  --ifret-fret-color: #444;
  --ifret-string-color: #888;
  --ifret-dot-fill: #f59e0b;
  --ifret-dot-muted: #dc2626;
}
```

## Pair with chord diagram (AC15 pattern)

```tsx
import { ChordDiagram } from "@ac15/ui"; // or svguitar-react directly

<InteractiveFretboard value={voicing} onChange={...} />
<ChordDiagram voicing={voicing} />
```

## Responsive container

```css
.fretboard-wrap {
  width: 100%;
  overflow-x: auto;
}
.fretboard-wrap svg {
  width: 100%;
  height: auto;
  display: block;
}
```

Hit-testing uses the SVG `viewBox`, not the CSS pixel size.
