# @achorde/interactive-fretboard

**npm `latest`:** `0.1.11` — [package page](https://www.npmjs.com/package/@achorde/interactive-fretboard)

Responsive SVG **interactive fretboard** editor for React. Build chord fingerings by pointer (mouse, touch, pen) on a full neck view—suitable for chord apps, education sites, and video embeds.

## Features

- Controlled **`FrettedInstrumentVoicing`** value (from `@achorde/musical-domain@^0.5.2`) with optional **`fretNotation`** convenience mode
- Four **view modes**: horizontal / vertical × right-handed / left-handed (inverted string axis)
- Robust hit-testing: fixed **`viewBox`**, `DOMPoint` + `getScreenCTM().inverse()`, pure geometry + invisible hit areas
- Optional chord detection on change (`tonal` + `@tonaljs/chord-detect`)
- **`pointerButton`** in `onChange` details: `"primary"` (left / touch / pen), `"middle"`, or `"secondary"` (right)
- **Finger assignment** (mouse): right-click cycles finger 1→4→1 on fretted cells; middle-click applies the sticky finger
- **Configurable appearance**: dot size, label sizes, inlay radius, nut stroke, and theme colors via props or CSS variables
- Headless helpers: `resolveInteractiveFretboardAppearance`, `resolvePointerButton`, `applyFingerCycle`, `applyFingerStick`

## Install

```bash
npm install @achorde/interactive-fretboard @achorde/musical-domain react react-dom
```

## Quick usage

```tsx
import { InteractiveFretboard } from "@achorde/interactive-fretboard";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";

const voicing = parseFretNotationToVoicing({
	fretNotation: "x32010",
	chordSymbol: "C",
	id: "draft",
});

<InteractiveFretboard
	value={voicing!}
	onChange={(details) => {
		console.log(details.pointerButton, details.voicing, details.detectedChord);
	}}
/>;
```

### Appearance props

All sizes are in **viewBox units** (except font sizes, in px via CSS variables on the wrapper):

```tsx
<InteractiveFretboard
	value={voicing!}
	onChange={setVoicing}
	dotRadius={21}
	dotHoverPadding={3}
	dotLabelFontSize={17}
	fretLabelFontSize={10}
	tuningLabelFontSize={10}
	inlayRadius={6}
	nutStrokeWidth={3}
	colors={{ dot: "#3b82f6", background: "#1a1a1a" }}
/>
```

Or nest overrides under `appearance`:

```tsx
<InteractiveFretboard value={voicing!} appearance={{ dotRadius: 28, colors: { dot: "#f59e0b" } }} />
```

Use `resolveInteractiveFretboardAppearance()` and `interactiveFretboardThemeStyle()` for headless theming.

Import the package CSS in your app (or copy the variables):

```ts
import "@achorde/interactive-fretboard/dist/interactive-fretboard.css";
```

For local development, import from `src/components/InteractiveFretboard/interactive-fretboard.css`.

## Storybook

```bash
pnpm storybook   # port 6010
```

Stories expose **all** component props in Controls (Layout, Appearance, Colors, Behavior). Use the **AppearancePlayground** story to tweak dot size, labels, inlays, and theme colors interactively.

## Scripts

| Script           | Description                |
| ---------------- | -------------------------- |
| `pnpm build`     | Typecheck + Vite library   |
| `pnpm test:run`  | Vitest unit tests          |
| `pnpm storybook` | Storybook on port **6010** |
| `pnpm lint`      | ESLint                     |

## Publishing (`@achorde` scope)

Org: **[npm @achorde packages](https://www.npmjs.com/settings/achorde/packages)**.

1. Ensure your npm user is a member of `@achorde` with publish rights.
2. Log in: `npm login`.
3. From this package: `pnpm build && pnpm test:run && pnpm publish` (uses `publishConfig.access: public`).
4. Or from `ac15`: `pnpm check:npm-publish -i` (guia interativo).
5. Bump consumers (`ac15` `@ac15/ui`, `apps/web`) per the monorepo release skill.

CI should use a restricted `NPM_TOKEN` with publish access to `@achorde/*` only.

## Related packages

| Package                                         | Role                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------- |
| [`@achorde/musical-domain`](../musical-domain/) | Voicing contracts, `parseFretNotationToVoicing`, `inferBarresFromFrettedVoicing` |
| [`@achorde/svguitar-react`](../svguitar-react/) | Compact **chord diagram** renderer (not the interactive neck editor)             |

## Documentation

- [Feature spec](./specs/001-interactive-fretboard/spec.md)
- [Implementation plan](./specs/001-interactive-fretboard/plan.md)
- [Task checklist](./specs/001-interactive-fretboard/tasks.md)
- [Quickstart](./specs/001-interactive-fretboard/quickstart.md)
- [Component API contract](./specs/001-interactive-fretboard/contracts/component-api.md)

## License

MIT
