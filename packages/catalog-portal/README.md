# @achorde/catalog-portal

This package contains shared building blocks for multi-artist catalog portals. Version `0.1.0` provides a framework-free core, small React adapters, and browser draft storage.

## Install

```bash
pnpm add @achorde/catalog-portal
```

Install React 18 or 19 only when using `@achorde/catalog-portal/react`.

## Entrypoints

| Import | Purpose |
| --- | --- |
| `@achorde/catalog-portal` | Editorial types, validation, search, monograms, metadata projection, and contribution-file checks |
| `@achorde/catalog-portal/react` | Search, reader, editor, and monogram components |
| `@achorde/catalog-portal/browser` | Memory or IndexedDB draft repository and service worker registration |

## Search a catalog

```ts
import { searchCatalog, type EditorialCatalog } from "@achorde/catalog-portal";
import { createIsoDateTime } from "@achorde/source-catalog";

const catalog: EditorialCatalog = {
  sourceId: "demo",
  name: "Demo catalog",
  artists: [
    {
      id: "artist:joao",
      slug: "joao",
      name: "João",
      updatedAt: createIsoDateTime("2026-08-11T12:00:00.000Z"),
    },
  ],
  works: [],
};

searchCatalog(catalog, "joao"); // case- and accent-insensitive
```

`createArtistMonogram()` returns up to two initials and a stable color derived from the artist ID.

## Build a public catalog

```ts
import { projectPublicSourceCatalog } from "@achorde/catalog-portal";

const output = await projectPublicSourceCatalog(catalog);

JSON.stringify(output.manifest); // write as source-manifest.json
output.files;                    // entity NDJSON and public evidence files
output.checksums;                // write as checksums.json
```

The projection uses Source Catalog schema `1.2.0`. Metadata-only catalogs work today, and unpublished charts and local drafts are left out.

The current `EditorialCatalog` model does not carry evidence-file content. For that reason, `projectPublicSourceCatalog()` cannot complete a chart publication: Source Catalog correctly rejects the missing evidence file. A publisher that includes charts must call `generateSourceCatalog()` with sanitized `evidenceFiles` or provide an application-level adapter that does so.

The package returns strings in memory. The portal application decides where and how to write them.

## Save local drafts

```ts
import { createLocalDraft } from "@achorde/catalog-portal";
import { createIndexedDbDraftRepository } from "@achorde/catalog-portal/browser";

const drafts = createIndexedDbDraftRepository("my-catalog-drafts");
const draft = createLocalDraft({
  id: "draft-1",
  workId: "work:demo:song",
  text: "C  G\nA line of lyrics",
});

await drafts.save(draft);
```

When IndexedDB is unavailable, `createIndexedDbDraftRepository()` falls back to memory for that session.

## Use the React adapters

```tsx
import { CatalogEditor, CatalogSearch } from "@achorde/catalog-portal/react";

<CatalogSearch catalog={catalog} onSelect={(result) => console.log(result)} />;
<CatalogEditor initial={draft} onComplete={(nextDraft) => drafts.save(nextDraft)} />;
```

The components are intentionally small and use built-in Portuguese labels. A product still owns routing, localization, design, autosave timing, error handling, and the reading flow.

## Contribution files

`applyContributionFiles()` validates a v2 manifest, sorts allowlisted paths, and checks the supplied content hashes. It does not compare `baseSha256` with an existing repository, write files, or run Git. A caller must perform those steps before applying an update.

## What this package does not do

It does not provide:

- an Astro or Next.js application;
- routing or page generation;
- Markdown loading or writing;
- a service worker file or cache policy;
- a ZIP reader or writer;
- gateway, OAuth, Git, or pull-request integration;
- a CLI.

## Development

```bash
pnpm test
pnpm build
pnpm typecheck
```

See [`CHANGELOG.md`](./CHANGELOG.md) for version history.
