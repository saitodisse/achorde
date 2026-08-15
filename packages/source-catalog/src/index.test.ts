import { describe, expect, it } from "vitest";
import {
  SOURCE_CATALOG_CONTENT_LICENSE,
  assertSourceCatalogEnvelope,
  assertSourceCatalogDataset,
  assertSourceCatalogManifest,
  createChecksum,
  createChecksumFromText,
  createIsoDateTime,
  createSourceCatalogChecksums,
  generateSourceCatalog,
  type SourceCatalogEnvelope,
  type SourceCatalogManifest,
} from "./index";

const operator = { name: "Demo operator", noticeUrl: "https://demo.example/notice" };
const manifest: SourceCatalogManifest = {
  id: "demo-portal",
  name: "Demo Portal",
  version: "2026-07-04T00:00:00.000Z",
  schemaVersion: "1.3.0",
  mode: "readonly",
  generatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
  contentLicense: SOURCE_CATALOG_CONTENT_LICENSE,
  operator,
  files: [{
    url: "entities/artists.ndjson",
    entityType: "artist",
    mediaType: "application/x-ndjson",
    sizeBytes: 42,
    sha256: createChecksum("a".repeat(64)),
    updatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
  }],
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
  it("requires the fixed license and operator in schema 1.3", () => {
    expect(assertSourceCatalogManifest(manifest)).toBe(manifest);
    expect(() => assertSourceCatalogManifest({ ...manifest, contentLicense: "CC-BY-4.0" })).toThrow("CC-BY-NC-SA-4.0");
    expect(() => assertSourceCatalogManifest({ ...manifest, operator: undefined })).toThrow("operator");
  });

  it("keeps schemas 1.0.0 through 1.2.0 readable", () => {
    for (const schemaVersion of ["1.0.0", "1.1.0", "1.2.0"] as const) {
      const legacy = { ...manifest, schemaVersion, contentLicense: undefined, operator: undefined };
      expect(assertSourceCatalogManifest(legacy)).toBe(legacy);
      expect(assertSourceCatalogEnvelope({
        sourceId: "demo-portal",
        sourceRecordId: "artist:demo",
        entityType: "artist",
        schemaVersion,
        payload: { name: "Demo Artist", slug: "demo-artist" },
      })).toMatchObject({ schemaVersion });
    }
  });

  it("rejects rights/evidence fields and files in new catalogs", () => {
    expect(() => assertSourceCatalogManifest({
      ...manifest,
      files: [{ ...manifest.files[0]!, url: "rights/evidence/permission.json" }],
    })).toThrow("rights/evidence");
    expect(() => assertSourceCatalogEnvelope({
      sourceId: "demo-portal",
      sourceRecordId: "chart:demo",
      entityType: "chordChart",
      schemaVersion: "1.3.0",
      payload: { playableVersionSourceRecordId: "version:demo", rawText: "C", rights: {} },
    })).toThrow("rights");
    expect(() => assertSourceCatalogEnvelope({
      sourceId: "demo-portal",
      sourceRecordId: "chart:demo",
      entityType: "chordChart",
      schemaVersion: "1.3.0",
      payload: { playableVersionSourceRecordId: "version:demo", rawText: "C", evidenceId: "legacy" },
    })).toThrow("rights");
  });

  it("validates a source entity envelope and complete dataset", () => {
    const envelope: SourceCatalogEnvelope<{ name: string; slug: string }> = {
      sourceId: "demo-portal",
      sourceRecordId: "artist:demo",
      entityType: "artist",
      schemaVersion: "1.3.0",
      updatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),
      payload: { name: "Demo Artist", slug: "demo-artist" },
    };
    expect(assertSourceCatalogEnvelope(envelope)).toBe(envelope);
    expect(assertSourceCatalogDataset(manifest, { "entities/artists.ndjson": [envelope] }, { "entities/artists.ndjson": "a".repeat(64) })).toEqual({ "entities/artists.ndjson": [envelope] });
  });

  it("rejects forbidden sensitive keys anywhere in a source envelope", () => {
    expect(() => assertSourceCatalogEnvelope({
      sourceId: "demo-portal",
      sourceRecordId: "artist:demo",
      entityType: "artist",
      schemaVersion: "1.3.0",
      payload: { name: "Demo", nested: [{ owner_name: "Do Not Publish" }] },
    })).toThrow("Forbidden source catalog key: owner_name");
  });

  it("calculates deterministic checksums", async () => {
    await expect(createChecksumFromText("artist portal\n")).resolves.toBe("174f7eaccfebcfdef516af8e165e4c5f9098c219e67834fbb1e215d4b8e27d36");
    expect(createSourceCatalogChecksums([
      { url: "z.ndjson", sha256: "b".repeat(64) },
      { url: "a.ndjson", sha256: "a".repeat(64) },
    ])).toEqual({ "a.ndjson": "a".repeat(64), "z.ndjson": "b".repeat(64) });
  });

  it("generates only schema 1.3 catalogs with chart payloads free of rights fields", async () => {
    const output = await generateSourceCatalog({
      id: "demo",
      name: "Demo",
      operator,
      records: [
        { entityType: "artist", sourceRecordId: "artist:demo", payload: { name: "Demo", slug: "demo" } },
        { entityType: "chordChart", sourceRecordId: "chart:demo", payload: { playableVersionSourceRecordId: "version:demo", rawText: "C" } },
      ],
    });
    expect(output.manifest.schemaVersion).toBe("1.3.0");
    expect(output.manifest.contentLicense).toBe(SOURCE_CATALOG_CONTENT_LICENSE);
    expect(output.manifest.operator).toEqual(operator);
    expect(output.files["entities/chordChart.ndjson"]).not.toContain("rights");
  });

  it("rejects a legacy evidence-files generator input", async () => {
    await expect(generateSourceCatalog({
      id: "demo",
      name: "Demo",
      operator,
      records: [{ entityType: "artist", sourceRecordId: "artist:demo", payload: { name: "Demo", slug: "demo" } }],
      evidenceFiles: {},
    } as never)).rejects.toThrow("rights/evidence");
  });

  it("rejects legacy policy fields anywhere in generator input", async () => {
    await expect(generateSourceCatalog({
      id: "demo",
      name: "Demo",
      operator,
      records: [{ entityType: "artist", sourceRecordId: "artist:demo", payload: { name: "Demo", slug: "demo", rights: {} } }],
    })).rejects.toThrow("rights/evidence");
  });
});
