# achorde-musical-domain

Shared TypeScript contracts for musical applications that need a common language for chord charts, parsed tabs, parser diagnostics, and fretted-instrument voicings.

The package is intentionally small and runtime-light. It defines stable data shapes that parsers, renderers, editors, and storage layers can agree on without depending on React, browser APIs, SVG rendering, or a specific music-theory engine.

## What It Provides

- parser diagnostics
- parsed chord symbols
- textual tab AST contracts (`ParsedTab` with strict line kinds)
- legacy chord-chart segment AST (deprecated; use `ParsedTab`)
- fretted-instrument voicing contracts
- an explicit adapter interface for external music-theory engines

## Installation

```bash
pnpm add achorde-musical-domain
```

## Usage

```ts
import type {
  FrettedInstrumentVoicing,
  ParsedTab,
} from "achorde-musical-domain";

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
