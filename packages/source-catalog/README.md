# @achorde/source-catalog

Runtime-light TypeScript contracts and validators for static, read-only source catalogs.

The package is designed for artist portals, static catalog publishers, discovery indexes, and offline-first readers that need a common import format without depending on React, storage engines, routing, or a specific hosting provider.

## ACHORDE Docs Hub

Use the [ACHORDE Docs Hub](https://musical-domain.vercel.app/en) as the main entry point for understanding every public package in the ecosystem. This package has its own hub page at <https://musical-domain.vercel.app/en/packages/source-catalog>. Local development version: <http://127.0.0.1:5286/>.

## Installation

```bash
pnpm add @achorde/source-catalog
```

## What It Provides

- `SourceCatalogManifest`
- `SourceCatalogEnvelope`
- `SourceCatalogEntityType`
- `SourceCatalogFile`
- `SyncCapabilities`
- manifest and envelope validators
- deterministic checksum helpers
- forbidden sensitive key validation at any object depth

## Usage

```ts
import {
  assertSourceCatalogEnvelope,
  assertSourceCatalogManifest,
  createChecksum,
  createIsoDateTime,
} from "@achorde/source-catalog";

const manifest = assertSourceCatalogManifest({
  id: "demo-portal",
  name: "Demo Portal",
  version: "2026-07-04T00:00:00.000Z",
  schemaVersion: "1.0.0",
  mode: "readonly",
  generatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
  files: [
    {
      url: "entities/artists.ndjson",
      entityType: "artist",
      mediaType: "application/x-ndjson",
      sha256: createChecksum("a".repeat(64)),
    },
  ],
  capabilities: {
    pull: true,
    push: false,
    batchPush: false,
    realtime: false,
    proposals: false,
    revisions: false,
    moderation: false,
    conflictResolution: "manual",
    auth: "none",
  },
});

const envelope = assertSourceCatalogEnvelope({
  sourceId: manifest.id,
  sourceRecordId: "artist:demo",
  entityType: "artist",
  schemaVersion: "1.0.0",
  payload: { name: "Demo Artist", slug: "demo-artist" },
});
```

## Contract

Source catalogs are pull-only public artifacts. A valid manifest must not advertise push, auth, moderation, proposals, realtime updates, or server-side conflict resolution. Sensitive account/session fields are rejected anywhere in manifests and envelopes.

## Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm test` | Run validator tests |
| `pnpm build` | Build JS and declaration files |
| `pnpm typecheck` | Run TypeScript without emitting |
