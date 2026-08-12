# Source Catalog contract

This document is the normative reference for the file layout and validation behavior implemented by `@achorde/source-catalog@0.3.0`.

## Publication layout

A catalog normally publishes these paths below `/source-catalog/`:

```text
source-manifest.json
checksums.json
entities/<entity-type>.ndjson
rights/evidence/<id>.json
```

`checksums.json` is optional only when every entity file in the manifest already contains `sha256`. When a checksum exists in both places, the values must match.

File URLs must be relative. Absolute URLs, scheme-relative URLs, absolute paths, and `..` segments are invalid.

## Supported schemas

Readers accept `1.0.0`, `1.1.0`, and `1.2.0`. Every envelope must match the manifest `id`, `schemaVersion`, and the `entityType` declared for its file.

Entity types are `artist`, `musicalWork`, `playableVersion`, `chordChart`, `voicing`, and `chordAlias`.

## Pull-only capabilities

A public manifest must use:

- `mode: "readonly"`;
- `pull: true`;
- `push`, `batchPush`, `realtime`, `proposals`, `revisions`, and `moderation`: `false`;
- `auth: "none"`;
- `conflictResolution: "manual"`.

Contribution bundles and gateways are separate systems. They do not add write or authentication capabilities to a Source Catalog.

## Rights in schema 1.2

Every public `chordChart` must have non-empty `rawText` and a `SourceCatalogRightsBasis`.

Accepted rights bases are:

- `rightsholder-contribution`;
- `direct-permission`;
- `platform-repertoire-license`;
- `public-license`;
- `public-domain`.

Every basis points to a sanitized summary at `rights/evidence/<id>.json` and includes its SHA-256 checksum. Only `public-license` may also contain a real SPDX or custom public license. `review-required` is never public.

The generator requires the referenced evidence text, validates it as a JSON object, rejects forbidden sensitive keys, and verifies its checksum. The current contract does not model evidence expiration.

## Sensitive information

Manifests, entity envelopes, and evidence summaries must not contain any key listed in `SOURCE_CATALOG_FORBIDDEN_KEYS`. This includes account tokens, email, identity fields, and full agreement or contract documents.

The check is key-based and recursive. Publishers remain responsible for reviewing values and any additional fields before deployment.

## Deterministic generation

`generateSourceCatalog()`:

- defaults to schema `1.2.0`;
- sorts entity files by the exported entity-type order;
- sorts rows by `sourceRecordId`;
- sets `generatedAt` to the newest record `updatedAt`, or the Unix epoch when none exists;
- derives a 16-character manifest version from canonical content;
- returns entity and evidence text in `files` and all checksums in `checksums`.

The caller writes `source-manifest.json` and `checksums.json`; the package performs no file-system IO.

## Reader responsibility

`assertSourceCatalogDataset()` validates already-decoded rows and agreement between declared checksums. Before decoding, the importer must compute SHA-256 from each downloaded raw file and compare it with the trusted declaration. The package cannot perform that check after receiving arrays of objects.
