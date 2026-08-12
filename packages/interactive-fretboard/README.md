# @achorde/interactive-fretboard

A controlled React component for editing fretted-instrument voicings with mouse, touch, or pen.

Workspace version: `0.2.0` · [npm](https://www.npmjs.com/package/@achorde/interactive-fretboard) · [Docs Hub](https://achorde-musical-domain.vercel.app/en/packages/interactive-fretboard) · [demo](https://interactive-fretboard.vercel.app/) · [Storybook](https://storybook-interactive-fretboard.vercel.app/)

## Install

```bash
pnpm add @achorde/interactive-fretboard @achorde/musical-domain react react-dom
```

Import the package stylesheet once:

```ts
import "@achorde/interactive-fretboard/style.css";
```

## Quick start

```tsx
import { useState } from "react";
import { InteractiveFretboard } from "@achorde/interactive-fretboard";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";

const initial = parseFretNotationToVoicing({
	id: "draft",
	chordSymbol: "C",
	fretNotation: "x32010",
});

export function Editor() {
	const [voicing, setVoicing] = useState(initial);
	if (!voicing) return null;

	return (
		<InteractiveFretboard
			value={voicing}
			onChange={(details) => setVoicing(details.voicing)}
			aria-label="Edit C major fingering"
		/>
	);
}
```

## Main behavior

- Four visual modes: horizontal or vertical, right- or left-handed.
- Canonical data never mirrors: string `1` remains low E and string `6` remains high E.
- Hit testing converts pointer coordinates into the SVG `viewBox` before choosing a string and fret.
- Primary input changes the fret state. Secondary and middle mouse input can assign fingers.
- Optional chord detection and barre inference run when requested by props.
- Appearance can be changed with props or CSS variables.

The component emits the next voicing through `onChange`; it does not save data.

## Headless helpers

The root entrypoint also exports layout, hit-test, view-mode, editor-state, pointer-button, finger-assignment, and appearance helpers. See the exported TypeScript declarations for the complete API.

## Package boundary

This package owns full-neck interaction. Use [`@achorde/svguitar-react`](../svguitar-react/) for a compact read-only diagram. Routing, persistence, localization, and product copy belong to the consuming application.

## Development

```bash
pnpm test:run
pnpm build
pnpm lint
pnpm storybook
```

See [`CHANGELOG.md`](./CHANGELOG.md) for version history.
