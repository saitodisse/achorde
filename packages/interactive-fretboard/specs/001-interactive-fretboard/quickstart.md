# Quickstart: @achorde/interactive-fretboard

**npm `latest`:** `0.1.11` — requires `@achorde/musical-domain@^0.5.2` and React 18+.

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

## Appearance props

Sizes are in viewBox units; font sizes become CSS variables on the wrapper (px).

```tsx
<InteractiveFretboard
	value={voicing}
	onChange={setVoicing}
	dotRadius={21}
	dotHoverPadding={3}
	dotLabelFontSize={17}
	fretLabelFontSize={10}
	tuningLabelFontSize={10}
	inlayRadius={6}
	tuningLabelGap={10}
	nutStrokeWidth={3}
	colors={{
		background: "#1a1a1a",
		dot: "#3b82f6",
		dotMuted: "#ef4444",
	}}
/>
```

Headless merge with defaults:

```tsx
import {
	resolveInteractiveFretboardAppearance,
	interactiveFretboardThemeStyle,
} from "@achorde/interactive-fretboard";

const appearance = resolveInteractiveFretboardAppearance({ dotRadius: 28 });
const style = interactiveFretboardThemeStyle(appearance);
```

## Finger assignment (mouse)

On fretted cells only:

- **Right click**: cycle finger 1→4→1 (`pointerButton: "secondary"`).
- **Middle click**: apply sticky finger (`pointerButton: "middle"`).

Finger numbers appear inside dots when assigned and persist on `FrettedInstrumentVoicing.strings[].finger`.

## Theming (CSS variables)

Props `colors` map to wrapper CSS variables. You can also set them in CSS:

```css
.ifret-root {
	--ifret-bg: #1a1a1a;
	--ifret-fret-color: #444;
	--ifret-string-color: #888;
	--ifret-dot-fill: #f59e0b;
	--ifret-dot-muted: #dc2626;
	--ifret-dot-label-size: 17px;
	--ifret-fret-label-size: 10px;
	--ifret-tuning-label-size: 10px;
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
pnpm storybook   # port 6010 — use AppearancePlayground for visual QA
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
