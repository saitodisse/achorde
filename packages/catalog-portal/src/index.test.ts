import { describe, expect, it } from "vitest";
import { applyContributionFiles, createArtistMonogram, projectPublicSourceCatalog, searchCatalog, validateEditorialCatalog, type EditorialCatalog } from "./index";

const catalog: EditorialCatalog = {
  sourceId: "ac12",
  name: "Acervo AC12",
  artists: [
    { id: "artist:joao", slug: "joao", name: "João da Silva", updatedAt: "2026-08-11T00:00:00.000Z" },
  ],
  works: [
    { id: "work:joao:cancao", slug: "cancao", title: "Canção Azul", artistId: "artist:joao", artistSlug: "joao", updatedAt: "2026-08-11T00:00:00.000Z" },
  ],
};

describe("catalog portal core", () => {
  it("searches without case or diacritic sensitivity", () => {
    expect(searchCatalog(catalog, "JOAO")).toHaveLength(2);
    expect(searchCatalog(catalog, "cancao")[0]?.kind).toBe("work");
  });
  it("creates stable monograms", () => {
    expect(createArtistMonogram(catalog.artists[0]!)).toEqual(createArtistMonogram(catalog.artists[0]!));
    expect(createArtistMonogram(catalog.artists[0]!).initials).toBe("JD");
  });
  it("projects metadata-only source catalogs", async () => {
    const output = await projectPublicSourceCatalog(catalog);
    expect(output.manifest.schemaVersion).toBe("1.2.0");
    expect(Object.keys(output.files)).toEqual(["entities/artist.ndjson", "entities/musicalWork.ndjson"]);
    expect(output.files["entities/artist.ndjson"]).not.toMatch(/rawText|imageUrl|discogs|sourceTabUrl/);
  });
  it("rejects charts without rights basis", () => {
    expect(() => validateEditorialCatalog({ ...catalog, charts: [{ id: "chart:1", workId: "work:joao:cancao", version: "v1", rawText: "C", updatedAt: "2026-08-11T00:00:00.000Z", rights: { kind: "direct-permission", evidence: { id: "e", url: "rights/evidence/e.json", sha256: "a".repeat(64) } }, published: false }] })).not.toThrow();
  });
  it("applies only allowlisted contribution paths and verifies content hashes", async () => {
    const manifest = {
      protocol: "achorde.portal-contribution/v2",
      contributionId: "c",
      createdAt: "2026-08-11T00:00:00.000Z",
      sourceId: "ac12",
      publicationBranch: "main",
      operation: "create-work",
      termsId: "terms",
      termsVersion: "1",
      acceptedAt: "2026-08-11T00:00:00.000Z",
      rights: { kind: "direct-permission", evidenceId: "e" },
      entries: [{ path: "catalog/works/joao/cancao.md", role: "work", action: "create", contentSha256: "b".repeat(64) }],
    };
    const content = "title: Canção\n";
    const { sha256Text } = await import("@achorde/contribution-protocol");
    manifest.entries[0].contentSha256 = await sha256Text(content);
    await expect(applyContributionFiles({ manifest, files: { "catalog/works/joao/cancao.md": content } })).resolves.toMatchObject({ files: { "catalog/works/joao/cancao.md": content } });
    await expect(applyContributionFiles({ manifest: { ...manifest, entries: [{ ...manifest.entries[0], contentSha256: "a".repeat(64) }] }, files: { "catalog/works/joao/cancao.md": content } })).rejects.toThrow("hash mismatch");
  });
});
