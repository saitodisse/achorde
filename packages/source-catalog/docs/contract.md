# Source Catalog Contract

A source catalog is a static, versioned, read-only publication. It is meant to be hosted on simple static infrastructure and imported into offline-first clients.

Required files normally live under `/source-catalog/`:

- `source-manifest.json`
- `checksums.json`
- one or more `entities/*.ndjson` files

The manifest is valid only when it advertises pull-only public access:

- `mode` is `readonly`
- `capabilities.pull` is `true`
- push, batch push, realtime, proposals, revisions, and moderation are all `false`
- `capabilities.auth` is `none`
- conflict resolution is `manual`

Sensitive account and session fields are rejected anywhere in manifests and entity envelopes.
