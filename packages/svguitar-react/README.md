# @achorde/svguitar-react

A React component that renders compact fretted-instrument chord diagrams as SVG.

Workspace version: `3.0.0` · [npm](https://www.npmjs.com/package/@achorde/svguitar-react) · [Docs Hub](https://achorde-musical-domain.vercel.app/en/packages/svguitar-react) · [demo](https://svguitar-react.vercel.app/) · [Storybook](https://storybook-svguitar-react.vercel.app/?path=/docs/components-chorddiagram--docs)

## Install

```bash
pnpm add @achorde/svguitar-react @achorde/musical-domain react react-dom
```

## Preferred usage

Pass a shared `FrettedInstrumentVoicing`. It takes precedence over legacy inline inputs.

```tsx
import { ChordDiagram } from "@achorde/svguitar-react";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";

const cMajor = parseFretNotationToVoicing({
	id: "c-major",
	chordSymbol: "C",
	fretNotation: "x32010",
});

<ChordDiagram voicing={cMajor!} view="vertical-right" />;
```

The same low-to-high string rule is used across Achorde: string `1` is low E and string `6` is high E.

## Other inputs

Existing consumers can still pass fret notation or structured fingers and barres:

```tsx
<ChordDiagram fretNotation="x32010" />;

<ChordDiagram
	fingers={[
		{ fret: 0, string: 1, is_muted: true },
		{ fret: 3, string: 2, is_muted: false, text: "3" },
	]}
	barres={[]}
/>;
```

Input precedence is `voicing`, then structured `fingers`/`barres`, then `fretNotation`.

## Layout and appearance

Built-in views are:

- `vertical-right` (default);
- `vertical-left`;
- `horizontal-right`;
- `horizontal-left`.

Use `layoutEngine` for a custom coordinate strategy. Colors, dimensions, offsets, tuning labels, string indicators, nut appearance, and zoom are direct component props. Storybook exposes the visual options interactively.

## Automatic behavior

- `autoBarreEnabled` defaults to `true` for eligible inline finger sets unless manual barres exist.
- `autoFirstFret` defaults to `false`; when enabled, it can move the first visible fret and expand the visible range up to 12 frets.
- Explicit `firstFret` and manual barres take precedence.

Automatic barres are a rendering convenience. To persist a barre in shared data, use `inferBarresFromFrettedVoicing()` from `@achorde/musical-domain` before saving.

## Invalid input

`validation` can be `strict` or `lenient`. `invalidBehavior` can keep the last valid chord, render a fallback, or suppress the diagram. Use `onError` or `errorFallback` when the application needs its own feedback.

## Public helpers

The package exports layout registration, defaults, parsing and validation helpers, and public TypeScript types. Read the declarations from the root entrypoint for the complete API.

## Package boundary

This package draws a diagram. It does not resolve chord aliases, select the preferred voicing, edit a full fretboard, or persist data. Use [`@achorde/interactive-fretboard`](../interactive-fretboard/) for interactive editing.

## Development

```bash
pnpm test:run
pnpm build
pnpm lint
pnpm storybook
```

See [`CHANGELOG.md`](./CHANGELOG.md) for version history.
