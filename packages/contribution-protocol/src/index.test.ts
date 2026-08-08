import { describe, expect, it } from "vitest";
import { CONTRIBUTION_PROTOCOL, assertContributionManifest, canonicalJson, sha256Text } from "./index";

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
});
