import { describe, expect, it } from "vitest";
import {
  assertSourceCatalogEnvelope,
  assertSourceCatalogDataset,
  assertSourceCatalogManifest,
  createChecksum,
  createChecksumFromText,
  createIsoDateTime,
  createSourceCatalogChecksums,
  assertSourceCatalogRightsBasis,
  generateSourceCatalog,
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

  it("rejects a complete dataset whose envelope belongs to another source", () => {
    expect(() => assertSourceCatalogDataset(manifest, {
      "entities/artists.ndjson": [{ sourceId: "other", sourceRecordId: "artist", entityType: "artist", schemaVersion: "1.0.0", payload: {} }],
    })).toThrow("Source catalog envelope does not match entities/artists.ndjson.");
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

  it("validates public rights evidence and rejects review-required", () => {
    const evidence = { id: "permission-1", url: "rights/evidence/permission-1.json", sha256: "a".repeat(64) };
    expect(() => assertSourceCatalogRightsBasis({ kind: "direct-permission", evidence })).not.toThrow();
    expect(() => assertSourceCatalogRightsBasis({ kind: "review-required" })).toThrow("not public");
    expect(() => assertSourceCatalogRightsBasis({
      kind: "direct-permission",
      evidence,
      license: { kind: "spdx", id: "CC-BY-4.0" },
    })).toThrow("only valid");
  });

  it("requires rights for 1.2 published charts while allowing metadata-only records", async () => {
    const metadata = await generateSourceCatalog({
      id: "ac12",
      name: "Acervo AC12",
      records: [{
        entityType: "artist",
        sourceRecordId: "artist:demo",
        payload: { name: "Demo", slug: "demo" },
        updatedAt: createIsoDateTime("2026-08-11T00:00:00.000Z"),
      }],
    });
    expect(metadata.manifest.schemaVersion).toBe("1.2.0");
    expect(metadata.manifest.generatedAt).toBe("2026-08-11T00:00:00.000Z");
    expect(Object.keys(metadata.files)).toEqual(["entities/artist.ndjson"]);

    const chart = {
      sourceId: "ac12",
      sourceRecordId: "chart:demo",
      entityType: "chordChart",
      schemaVersion: "1.2.0",
      payload: { playableVersionSourceRecordId: "version:demo", rawText: "C" },
    };
    expect(() => assertSourceCatalogEnvelope(chart)).toThrow("rights basis");
    const evidence = JSON.stringify({ id: "permission-1", summary: "sanitized" });
    const rights = { kind: "direct-permission" as const, evidence: { id: "permission-1", url: "rights/evidence/permission-1.json", sha256: await createChecksumFromText(evidence) } };
    await expect(generateSourceCatalog({ id: "ac12", name: "Acervo AC12", records: [{ entityType: "chordChart", sourceRecordId: "chart:demo", payload: { playableVersionSourceRecordId: "version:demo", rawText: "C", rights, published: true } }], evidenceFiles: { "rights/evidence/permission-1.json": evidence } })).resolves.toMatchObject({ manifest: { schemaVersion: "1.2.0" } });
    await expect(generateSourceCatalog({ id: "ac12", name: "Acervo AC12", records: [{ entityType: "chordChart", sourceRecordId: "chart:demo", payload: { playableVersionSourceRecordId: "version:demo", rawText: "C", rights, published: true } }] })).rejects.toThrow("evidence missing");
  });

  it("produces byte-identical output when records arrive in another order", async () => {
    const records = [
      { entityType: "artist" as const, sourceRecordId: "artist:z", payload: { name: "Z", slug: "z" } },
      { entityType: "artist" as const, sourceRecordId: "artist:a", payload: { name: "A", slug: "a" } },
    ];
    const first = await generateSourceCatalog({ id: "demo", name: "Demo", records });
    const second = await generateSourceCatalog({ id: "demo", name: "Demo", records: [...records].reverse() });
    expect(second.manifest).toEqual(first.manifest);
    expect(second.files).toEqual(first.files);
    expect(second.checksums).toEqual(first.checksums);
  });
});
