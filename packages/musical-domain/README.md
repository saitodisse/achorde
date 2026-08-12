# @achorde/musical-domain

This package is the shared musical vocabulary for Achorde. It provides TypeScript contracts and pure helpers without React, storage, routing, SVG, or a bundled theory engine.

Workspace version: `0.6.0` · [npm](https://www.npmjs.com/package/@achorde/musical-domain) · [Docs Hub](https://achorde-musical-domain.vercel.app/en/packages/musical-domain) · [demo](https://achorde-musical-domain.vercel.app/)

## Install

```bash
pnpm add @achorde/musical-domain
```

## What it provides

- `ParsedTab`, strict line kinds, tokens, and parser diagnostics;
- chord-symbol normalization and spelling metadata;
- `FrettedInstrumentVoicing` and standard guitar constants;
- fret-notation parsing and formatting;
- voicing ranking, display-base-fret normalization, and barre inference;
- a small adapter interface for external music-theory engines.

`ChordChartAst` remains exported for compatibility but is deprecated. New code should use `ParsedTab`.

## Voicing example

```ts
import {
  formatVoicingToFretNotation,
  parseFretNotationToVoicing,
  selectPreferredFrettedVoicing,
} from "@achorde/musical-domain";

const cMajor = parseFretNotationToVoicing({
  id: "c-major",
  chordSymbol: "C",
  fretNotation: "x32010",
});

if (cMajor) {
  formatVoicingToFretNotation(cMajor); // x32010
  selectPreferredFrettedVoicing([cMajor]);
}
```

Guitar strings use low-to-high coordinates: `stringIndex: 1` is low E and `stringIndex: 6` is high E. Fret notation uses the same order.

## Package boundary

This package defines shared musical meaning. Parsers own text interpretation, renderers own visuals, and applications own persistence and product rules.

## Documentation

- [Architecture](./docs/architecture.md)
- [Migration guide](./docs/migration.md)
- [Changelog](./CHANGELOG.md)

## Development

```bash
pnpm test
pnpm build
pnpm build:site
```
