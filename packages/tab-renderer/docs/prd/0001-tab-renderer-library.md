# Tab Renderer Library PRD

## Problem

Chord sheet rendering is currently tied to an application-specific stack. That makes the rendering pipeline hard to reuse, hard to publish as a public package, and awkward to test in isolation.

## Goal

Build an open-source npm package that transforms raw chord sheet text into a normalized musical AST and renders it through a composable React adapter.

## Non-Goals (bootstrap scope)

- Reproducing the entire existing application.
- Shipping application-specific persistence, authentication, or routing.

> **Update:** [PRD 0002](./0002-styled-viewer-pipeline.md) adds a documented `TabStyleConfig` on the convenience `Tab` component for the Achordex-equivalent viewer. Composable primitives remain style-agnostic.

## Target Users

- Frontend applications that need to render chord sheets from raw text.
- Library consumers who want a headless parser/transformation pipeline.
- Design systems that want composable React primitives rather than a monolithic widget.

## Product Shape

The package exposes a single public npm package with subpath exports:

- `.` for the headless core
- `./react` for the React adapter

The core accepts raw `body` text and returns a normalized AST:

- `Song`
- `Section[]`
- `Line[]`
- `Token[]`

Tokens are explicit:

- `ChordToken`
- `LyricToken`
- `SpaceToken`

The React adapter exposes:

- `Tab.Root`
- `Tab.Section`
- `Tab.Line`
- `Tab.Chord`
- `Tab.Lyric`
- `Tab`

## Success Criteria

- Consumers can install the package from npm or a git URL.
- Consumers can use the core without React.
- Consumers can use the React adapter with composition and slots.
- The AST is stable enough for downstream renderers and tests.
- The package can be developed locally with Vite, Storybook, and Vitest.

## Acceptance Criteria

- A raw text input can be transformed into a normalized AST.
- The React adapter can render a song from the AST.
- Storybook contains representative stories for the core UI primitives.
- Vitest covers at least the core transformation path and one React rendering path.
