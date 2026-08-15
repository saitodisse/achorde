# @achorde/contribution-protocol

This package validates portable contribution manifests without depending on React, a browser UI, Git, or a hosting provider. Version `0.3.0` keeps v1/v2 readers and adds `achorde.portal-contribution/v3` for new bundles.

## Install

```bash
pnpm add @achorde/contribution-protocol
```

## Choose a protocol

- Use `assertContributionManifest()` to keep reading existing v1 manifests.
- Use `assertContributionManifestV3()` for new chart, version, work, and artist contributions.

V3 records accepted, versioned terms and the fixed `CC-BY-NC-SA-4.0` content license. It deliberately has no rights attestation, `evidenceId`, `rights-evidence` role, or evidence path. V2 remains readable for old bundles, but is not emitted by new generators.

## Validate a v3 manifest

```ts
import {
  CONTRIBUTION_PROTOCOL_V3,
  CONTRIBUTION_CONTENT_LICENSE,
  assertContributionManifestV3,
  canonicalContributionEntryOrder,
  type ContributionManifestV3,
} from "@achorde/contribution-protocol";

const manifest = {
  protocol: CONTRIBUTION_PROTOCOL_V3,
  contributionId: "contribution-123",
  createdAt: "2026-08-11T12:00:00.000Z",
  sourceId: "demo-catalog",
  publicationBranch: "main",
  operation: "update-chart",
  termsId: "catalog-contribution-terms",
  termsVersion: "1.0.0",
  acceptedAt: "2026-08-11T12:00:00.000Z",
  contentLicense: CONTRIBUTION_CONTENT_LICENSE,
  entries: [
    {
      path: "catalog/charts/demo/song/main.md",
      role: "chart",
      action: "update",
      baseSha256: "a".repeat(64),
      contentSha256: "b".repeat(64),
    },
  ],
} satisfies ContributionManifestV3;

assertContributionManifestV3(manifest);
const entries = canonicalContributionEntryOrder(manifest.entries);
```

An update requires `baseSha256`. A create entry must not contain it. `create-artist` is atomic and must include at least one artist, work, and chart entry.

## Paths and limits

V3 accepts only these editorial paths:

```text
catalog/artists/<artist>.md
catalog/works/<artist>/<work>.md
catalog/charts/<artist>/<work>/<version>.md
manifest.json
proposal.md
```

The exported limits are:

| Limit | Value |
| --- | ---: |
| Entries | 16 |
| Compressed bundle | 2 MiB |
| Expanded bundle | 8 MiB |
| One text file | 512 KiB |

`assertContributionBundleLimits()` validates size metadata supplied by the caller. A ZIP reader must still measure the real archive, reject symlinks and duplicate entries, and compare every file with `contentSha256`.

## Determinism and replay protection

- `canonicalJson()` serializes object keys in stable order.
- `sha256Text()` uses Web Crypto to hash text.
- `canonicalContributionEntryOrder()` sorts entries by path.
- `contributionIdempotencyKey()` combines a contribution ID with the ZIP checksum.

These helpers make independent writers agree on the same data. They do not create a ZIP or store replay state.

## What this package does not do

It does not:

- read or write ZIP files;
- access the file system;
- authenticate users;
- call a contribution gateway;
- create commits or pull requests;
- provide a CLI.

Those jobs belong to portal, gateway, and forge adapters.

## Development

```bash
pnpm test
pnpm build
pnpm typecheck
```

See [`CHANGELOG.md`](./CHANGELOG.md) for version history.
