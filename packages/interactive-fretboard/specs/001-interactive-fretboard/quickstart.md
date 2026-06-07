# Quickstart: @achorde/interactive-fretboard

**npm `latest`:** `0.1.9` — requires `@achorde/musical-domain@^0.5.2` and React 18+.

## Install

```bash
pnpm add @achorde/interactive-fretboard @achorde/musical-domain react react-dom
```

## Controlled voicing (canonical)

```tsx
import { useState } from "react";
import {
	InteractiveFretboard,
	type InteractiveFretboardChangeDetails,
} from "@achorde/interactive-fretboard";
import type { FrettedInstrumentVoicing } from "@achorde/musical-domain";
import "@achorde/interactive-fretboard/style.css";

export function ChordEditor() {
	const [voicing, setVoicing] = useState<FrettedInstrumentVoicing>(initialVoicing);

	return (
		<div style={{ width: "100%", maxWidth: 1100 }}>
			<InteractiveFretboard
				value={voicing}
				onChange={(details: InteractiveFretboardChangeDetails) => {
					setVoicing(details.voicing);
					// details.pointerButton: "primary" | "middle" | "secondary"
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
import { ChordDiagram, InteractiveFretboard } from "@ac15/ui";

<InteractiveFretboard value={voicing} onChange={...} />
<ChordDiagram voicing={voicing} />
```

## Local validation

```bash
cd packages/interactive-fretboard
pnpm test:run
pnpm build
pnpm storybook   # port 6010
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
