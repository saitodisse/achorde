import { describe, expect, it } from "vitest";
import {
  assertSourceCatalogEnvelope,
  assertSourceCatalogManifest,
  createChecksum,
  createChecksumFromText,
  createIsoDateTime,
  createSourceCatalogChecksums,
  type SourceCatalogEnvelope,
  type SourceCatalogManifest,
} from "./index";

const manifest: SourceCatalogManifest = {
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
      sizeBytes: 42,
      sha256: createChecksum("a".repeat(64)),
      updatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
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
};

describe("source catalog contracts", () => {
  it("validates a read-only source catalog manifest", () => {
    expect(assertSourceCatalogManifest(manifest)).toBe(manifest);
  });

  it.each([
    ["push", { push: true }],
    ["batch push", { batchPush: true }],
    ["auth", { auth: "oauth" }],
    ["moderation", { moderation: true }],
    ["server conflict resolution", { conflictResolution: "server" }],
  ])("rejects %s capabilities in a manifest", (_label, capabilities) => {
    expect(() =>
      assertSourceCatalogManifest({
        ...manifest,
        capabilities: { ...manifest.capabilities, ...capabilities },
      }),
    ).toThrow("Source catalog manifests must be pull-only.");
  });

  it("validates a source entity envelope", () => {
    const envelope: SourceCatalogEnvelope<{ name: string; slug: string }> = {
      sourceId: "demo-portal",
      sourceRecordId: "artist:demo",
      entityType: "artist",
      schemaVersion: "1.0.0",
      updatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
      payload: { name: "Demo Artist", slug: "demo-artist" },
    };

    expect(assertSourceCatalogEnvelope(envelope)).toBe(envelope);
  });

  it("rejects forbidden sensitive keys anywhere in a source envelope", () => {
    const envelope = {
      sourceId: "demo-portal",
      sourceRecordId: "chart:1",
      entityType: "chordChart",
      schemaVersion: "1.0.0",
      payload: {
        rawText: "C\nLyrics",
        nested: [{ owner_name: "Do Not Publish" }],
      },
    };

    expect(() => assertSourceCatalogEnvelope(envelope)).toThrow("Forbidden source catalog key: owner_name");
  });

  it("rejects forbidden sensitive keys anywhere in a source manifest", () => {
    expect(() =>
      assertSourceCatalogManifest({
        ...manifest,
        publisher: { email: "hidden@example.test" },
      }),
    ).toThrow("Forbidden source catalog key: email");
  });

  it("calculates deterministic checksums", async () => {
    await expect(createChecksumFromText("artist portal\n")).resolves.toBe(
      "174f7eaccfebcfdef516af8e165e4c5f9098c219e67834fbb1e215d4b8e27d36",
    );
    expect(
      createSourceCatalogChecksums([
        { url: "z.ndjson", sha256: "b".repeat(64) },
        { url: "a.ndjson", sha256: "a".repeat(64) },
      ]),
    ).toEqual({
      "a.ndjson": "a".repeat(64),
      "z.ndjson": "b".repeat(64),
    });
  });
});
