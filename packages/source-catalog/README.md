# @achorde/source-catalog

This package defines and validates static, read-only Source Catalogs. Version `0.3.0` reads schemas `1.0.0`, `1.1.0`, and `1.2.0` and can generate deterministic `1.2.0` catalogs.

## Install

```bash
pnpm add @achorde/source-catalog
```

Use this package when a static portal publishes data that an offline-first application can import. It has no React, storage, routing, network, or file-system dependency.

## Read a catalog

```ts
import { assertSourceCatalogDataset } from "@achorde/source-catalog";

const dataset = assertSourceCatalogDataset(
  manifest,
  {
    "entities/artist.ndjson": artistRows,
    "entities/musicalWork.ndjson": workRows,
  },
  checksums,
);
```

`assertSourceCatalogDataset()` checks the manifest, declared entity files, envelope identity, schema agreement, and checksum declarations. The caller must hash each downloaded raw file before parsing it; this function receives decoded rows and cannot recompute those hashes.

## Generate a metadata-only catalog

```ts
import {
  createIsoDateTime,
  generateSourceCatalog,
} from "@achorde/source-catalog";

const output = await generateSourceCatalog({
  id: "demo-catalog",
  name: "Demo catalog",
  schemaVersion: "1.2.0",
  records: [
    {
      entityType: "artist",
      sourceRecordId: "artist:joao",
      updatedAt: createIsoDateTime("2026-08-11T12:00:00.000Z"),
      payload: { name: "João", slug: "joao" },
    },
    {
      entityType: "musicalWork",
      sourceRecordId: "work:joao:song",
      updatedAt: createIsoDateTime("2026-08-11T12:00:00.000Z"),
      payload: {
        title: "Song",
        slug: "song",
        artistSlug: "joao",
      },
    },
  ],
});

const manifestText = JSON.stringify(output.manifest);
const checksumsText = JSON.stringify(output.checksums);
```

Write `manifestText` as `source-manifest.json`, `checksumsText` as `checksums.json`, and every entry in `output.files` below `/source-catalog/`.

The generator sorts records and files, derives `generatedAt` from the newest record, and derives the manifest version from canonical content. The same input produces the same bytes.

## Publishing a chart

Schema `1.2.0` requires every published `chordChart` to contain a `SourceCatalogRightsBasis`. The basis points to a checksum-protected JSON summary under `rights/evidence/`.

```ts
const rights = {
  kind: "direct-permission" as const,
  evidence: {
    id: "permission-123",
    url: "rights/evidence/permission-123.json",
    sha256: evidenceChecksum,
  },
};
```

Only `public-license` may contain a `license` field. `review-required` is private editorial state and is rejected in a public catalog. Full contracts, personal identity, and private documents do not belong in evidence summaries.

## Important limits

- Manifest capabilities are always pull-only and unauthenticated.
- Payload TypeScript types are exported, but runtime validation is structural. Chart rights and forbidden sensitive keys receive extra validation.
- Evidence summaries are checked for safe paths, JSON shape, forbidden keys, and checksums. The contract has no expiration field.
- The package does not fetch URLs, write files, schedule synchronization, or provide a CLI.

See the normative [`Source Catalog contract`](./docs/contract.md) for file rules and validation responsibilities.

## Development

```bash
pnpm test
pnpm build
pnpm typecheck
```

See [`CHANGELOG.md`](./CHANGELOG.md) for version history.
