import { describe, expect, it } from "vitest";
import {
  CONTRIBUTION_PROTOCOL,
  CONTRIBUTION_PROTOCOL_V2,
  assertContributionManifest,
  assertContributionManifestV2,
  canonicalContributionEntryOrder,
  canonicalJson,
  contributionIdempotencyKey,
  assertContributionBundleLimits,
  sha256Text,
} from "./index";

const manifest = {
  protocol: CONTRIBUTION_PROTOCOL, contributionId: "abc", createdAt: "2026-08-08T00:00:00.000Z", sourceId: "demo",
  publicationBranch: "main", operation: "update-version", base: { path: "catalog/charts/demo/main.md", contentSha256: "a".repeat(64), expectedAbsent: false }, contentSha256: "b".repeat(64), files: ["manifest.json"],
};

describe("contribution protocol", () => {
  it("canonicalizes object keys and hashes browser-safe text", async () => {
    expect(canonicalJson({ b: 1, a: [true, null] })).toBe('{"a":[true,null],"b":1}');
    await expect(sha256Text("artist portal\n")).resolves.toHaveLength(64);
  });
  it("rejects unsafe paths", () => {
    expect(() => assertContributionManifest({ ...manifest, base: { ...manifest.base, path: "../secret" } })).toThrow("unsafe");
  });
  it("accepts a safe manifest", () => expect(() => assertContributionManifest(manifest)).not.toThrow());

  it("validates an atomic v2 artist contribution", () => {
    const entry = (path: string, role: string, action = "create") => ({
      path,
      role,
      action,
      contentSha256: "a".repeat(64),
    });
    const value = {
      protocol: CONTRIBUTION_PROTOCOL_V2,
      contributionId: "c-1",
      createdAt: "2026-08-11T00:00:00.000Z",
      sourceId: "ac12",
      publicationBranch: "main",
      operation: "create-artist",
      termsId: "ac12-contribution",
      termsVersion: "1.0.0",
      acceptedAt: "2026-08-11T00:00:00.000Z",
      rights: { kind: "direct-permission", evidenceId: "e-1" },
      entries: [
        entry("catalog/artists/demo.md", "artist"),
        entry("catalog/works/demo/song.md", "work"),
        entry("catalog/charts/demo/song/v1.md", "chart"),
        entry("rights/evidence/e-1.json", "rights-evidence"),
      ],
    };
    expect(() => assertContributionManifestV2(value)).not.toThrow();
    expect(canonicalContributionEntryOrder(value.entries).map((item) => item.path)).toEqual([
      "catalog/artists/demo.md",
      "catalog/charts/demo/song/v1.md",
      "catalog/works/demo/song.md",
      "rights/evidence/e-1.json",
    ]);
  });

  it("rejects v2 traversal, missing base hash, and non-atomic artist creation", () => {
    const base = {
      protocol: CONTRIBUTION_PROTOCOL_V2,
      contributionId: "c-1",
      createdAt: "2026-08-11T00:00:00.000Z",
      sourceId: "ac12",
      publicationBranch: "main",
      operation: "create-artist",
      termsId: "terms",
      termsVersion: "1.0.0",
      acceptedAt: "2026-08-11T00:00:00.000Z",
      rights: { kind: "direct-permission", evidenceId: "e-1" },
      entries: [{ path: "../secret", role: "artist", action: "create", contentSha256: "a".repeat(64) }],
    };
    expect(() => assertContributionManifestV2(base)).toThrow("allowlist");
    expect(() => assertContributionManifestV2({
      ...base,
      operation: "update-chart",
      entries: [{ path: "catalog/charts/demo/song/v1.md", role: "chart", action: "update", contentSha256: "a".repeat(64) }],
    })).toThrow("baseSha256");
    expect(() => assertContributionManifestV2({
      ...base,
      entries: [{ path: "catalog/artists/demo.md", role: "artist", action: "create", contentSha256: "a".repeat(64) }],
    })).toThrow("atomically");
  });

  it("creates an idempotency key from contribution and ZIP hashes", () => {
    expect(contributionIdempotencyKey("c-1", "A".repeat(64))).toBe(`c-1:${"a".repeat(64)}`);
  });

  it("rejects malformed bundle size metadata", () => {
    expect(() => assertContributionBundleLimits({ entryCount: Number.NaN, compressedBytes: 1, expandedBytes: 1, textBytes: [1] })).toThrow("finite");
    expect(() => assertContributionBundleLimits({ entryCount: 1, compressedBytes: -1, expandedBytes: 1, textBytes: [1] })).toThrow("finite");
  });
});
