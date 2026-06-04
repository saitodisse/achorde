# @achorde/interactive-fretboard

Responsive SVG **interactive fretboard** editor for React. Build chord fingerings by pointer (mouse, touch, pen) on a full neck view—suitable for chord apps, education sites, and video embeds.

## Features

- Controlled **`FrettedInstrumentVoicing`** value (from `achorde-musical-domain`) with optional **`fretNotation`** convenience mode
- Four **view modes**: horizontal / vertical × right-handed / left-handed (inverted string axis)
- Robust hit-testing: fixed **`viewBox`**, `DOMPoint` + `getScreenCTM().inverse()`, pure geometry + invisible hit areas
- Optional chord detection on change (`tonal` + `@tonaljs/chord-detect`)
- CSS variables for theming (no required Tailwind)

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
	onChange={(details) => console.log(details.voicing, details.detectedChord)}
/>;
```

Import the package CSS in your app (or copy the variables):

```ts
import "@achorde/interactive-fretboard/dist/interactive-fretboard.css";
```

For local development, import from `src/components/InteractiveFretboard/interactive-fretboard.css`.

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

| Package                                        | Role                                                                             |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| [`@achorde/musical-domain`](../musical-domain/) | Voicing contracts, `parseFretNotationToVoicing`, `inferBarresFromFrettedVoicing` |
| [`@achorde/svguitar-react`](../svguitar-react/)         | Compact **chord diagram** renderer (not the interactive neck editor)             |

## Documentation

- [Feature spec](./specs/001-interactive-fretboard/spec.md)
- [Implementation plan](./specs/001-interactive-fretboard/plan.md)
- [Task checklist](./specs/001-interactive-fretboard/tasks.md)
- [Quickstart](./specs/001-interactive-fretboard/quickstart.md)

## License

MIT
