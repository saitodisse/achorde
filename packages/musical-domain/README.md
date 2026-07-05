# @achorde/musical-domain

**npm `latest`:** `0.5.3` — [package page](https://www.npmjs.com/package/@achorde/musical-domain)
- 🌐 **Live Demo**: [https://achorde-musical-domain.vercel.app/](https://achorde-musical-domain.vercel.app/)

Shared TypeScript contracts for musical applications that need a common language for chord charts, parsed tabs, parser diagnostics, and fretted-instrument voicings.

## ACHORDE Docs Hub

Use the [ACHORDE Docs Hub](https://achorde-musical-domain.vercel.app/en) as the main entry point for understanding every public package in the ecosystem.

- English package docs: <https://achorde-musical-domain.vercel.app/en/packages/musical-domain>
- Local development version: <http://127.0.0.1:5286/>

The package is intentionally small and runtime-light. It defines stable data shapes that parsers, renderers, editors, and storage layers can agree on without depending on React, browser APIs, SVG rendering, or a specific music-theory engine.

Fretted guitar voicings use low-to-high string coordinates: `stringIndex: 1` is low E, then A, D, G, B, and `stringIndex: 6` is high E. Fret notation such as `x32010` is parsed and formatted in that same low-E-first order.

## What It Provides

- parser diagnostics
- parsed chord symbols
- textual tab AST contracts (`ParsedTab` with strict line kinds)
- legacy chord-chart segment AST (deprecated; use `ParsedTab`)
- fretted-instrument voicing contracts
- chord label lookup normalization (`normalizeChordSymbolLabel`, since 0.3.2)
- fretted voicing ranking (`compareFrettedVoicings`, `selectPreferredFrettedVoicing`, since 0.3.3)
- display base-fret normalization (`resolveVoicingDisplayBaseFret`, `normalizeVoicingDisplayBaseFret`, since 0.5.3)
- chord spelling metadata (`ChordSpellingMetadata`, `spellingFromParsedChordSymbol`, since 0.3.3)
- an explicit adapter interface for external music-theory engines

## Installation

```bash
pnpm add @achorde/musical-domain
```

## Demo site

```bash
pnpm dev:site      # port 5286
pnpm build:site
pnpm preview:site  # port 4286
```

## Usage

```ts
import type {
  FrettedInstrumentVoicing,
  ParsedTab,
} from "@achorde/musical-domain";
import {
  normalizeChordSymbolLabel,
  selectPreferredFrettedVoicing,
} from "@achorde/musical-domain";

const voicing: FrettedInstrumentVoicing = {
  id: "voicing-c-major",
  instrumentId: "guitar",
  tuningId: "standard",
  chordSymbol: "C",
  strings: [
    { stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
    { stringIndex: 2, openNote: "A2", fret: 3, state: "fretted", finger: 3 },
    { stringIndex: 3, openNote: "D3", fret: 2, state: "fretted", finger: 2 },
    { stringIndex: 4, openNote: "G3", fret: 0, state: "open" },
    { stringIndex: 5, openNote: "B3", fret: 1, state: "fretted", finger: 1 },
    { stringIndex: 6, openNote: "E4", fret: 0, state: "open" },
  ],
  source: "manual",
  quality: "exact",
};

const tab: ParsedTab = {
  body: "[Verse]\nC\nA line of lyrics",
  sections: [],
  diagnostics: [],
  parserVersion: "1.0.0",
  astVersion: "1.0.0",
  chordsFound: ["C"],
};

normalizeChordSymbolLabel("C♯maj7"); // "C#maj7"
selectPreferredFrettedVoicing([voicing /* ... */]);
```

## Design Goals

- Keep musical domain contracts portable across libraries and applications.
- Avoid runtime coupling to UI frameworks, storage engines, routing, or SVG renderers.
- Make parser and renderer boundaries explicit through typed AST and voicing contracts.
- Preserve semantic versioning so downstream packages can upgrade safely.

## Documentation

- [Architecture](docs/architecture.md)
- [Migration](docs/migration.md)
- [Changelog](CHANGELOG.md)

## Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm dev:site` | Demo site on port 5286 |
| `pnpm build:site` | Demo site build |
| `pnpm preview:site` | Preview built demo |
