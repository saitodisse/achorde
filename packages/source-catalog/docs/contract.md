# Source Catalog Contract

A source catalog is a static, versioned, read-only publication. It is meant to be hosted on simple static infrastructure and imported into offline-first clients.

Required files normally live under `/source-catalog/`:

- `source-manifest.json`
- `checksums.json` when a manifest file omits `sha256`
- one or more `entities/*.ndjson` files

When both the manifest and `checksums.json` declare a checksum for the same file, their values must match. Schema versions `1.0.0`, `1.1.0`, and `1.2.0` are supported; each envelope must use the manifest source ID, schema version, and the entity type declared by its file.

Schema `1.2.0` separates a public content license from the rights basis that permits publication. A published `chordChart` must carry a non-pending `SourceCatalogRightsBasis` and a relative `rights/evidence/<id>.json` checksum. Evidence files are sanitized summaries; contracts, personal identity, and full documents never belong in the catalog. `review-required` is an editorial-only state and is rejected by the public validator.

The manifest is valid only when it advertises pull-only public access:

- `mode` is `readonly`
- `capabilities.pull` is `true`
- push, batch push, realtime, proposals, revisions, and moderation are all `false`
- `capabilities.auth` is `none`
- conflict resolution is `manual`

Sensitive account and session fields are rejected anywhere in manifests and entity envelopes.

Contribution packages and any optional forge gateway are outside this contract.
They may help a person propose a source change, but they do not add write,
authentication, proposal, revision, or moderation capabilities to a published
source catalog.
