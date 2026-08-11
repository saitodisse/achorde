# @achorde/source-catalog

Runtime-light TypeScript contracts and validators for static, read-only source catalogs. Version `0.3.0` adds the public `1.2.0` rights-basis contract and a deterministic metadata-safe generator.

The package is designed for artist portals, static catalog publishers, discovery indexes, and offline-first readers that need a common import format without depending on React, storage engines, routing, or a specific hosting provider.

## ACHORDE Docs Hub

Use the [ACHORDE Docs Hub](https://achorde-musical-domain.vercel.app/en) as the main entry point for understanding every public package in the ecosystem.

- English package docs: <https://achorde-musical-domain.vercel.app/en/packages/source-catalog>
- Local development version: <http://127.0.0.1:5286/>

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
- complete snapshot validation with manifest, envelope, and checksum agreement
- deterministic checksum helpers
- `SourceCatalogRightsBasis` and sanitized evidence references
- deterministic metadata-safe catalog generation
- forbidden sensitive key validation at any object depth

## Usage

```ts
import {
  assertSourceCatalogDataset,
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

assertSourceCatalogDataset(
  manifest,
  {
    "entities/artists.ndjson": [envelope],
  },
);
```

`assertSourceCatalogDataset()` accepts schemas `1.0.0`, `1.1.0`, and `1.2.0`, rejects unsafe relative file paths, and requires each envelope to match the manifest source, schema, and declared entity file. A separate checksum map is optional only when every manifest file already declares `sha256`; values present in both places must agree.

## Contract

Source catalogs are pull-only public artifacts. A valid manifest must not advertise push, auth, moderation, proposals, realtime updates, or server-side conflict resolution. Sensitive account/session fields are rejected anywhere in manifests and envelopes.

## Scripts

| Script | Description |
| ------ | ----------- |
| `pnpm test` | Run validator tests |
| `pnpm build` | Build JS and declaration files |
| `pnpm typecheck` | Run TypeScript without emitting |
