import {
  assertNoForbiddenSourceCatalogKeys,
  createIsoDateTime,
  generateSourceCatalog,
  type IsoDateTime,
  SOURCE_CATALOG_CONTENT_LICENSE,
  type SourceCatalogOperator,
  type SourceCatalogBuildOutput,
} from "@achorde/source-catalog";
import {
  assertContributionManifestV3,
  canonicalContributionEntryOrder,
  sha256Text,
  type ContributionManifestEntryV3,
  type ContributionManifestV3,
} from "@achorde/contribution-protocol";

export type CatalogPortalArtist = {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  links?: ReadonlyArray<{ label: string; url: string }>;
  updatedAt: IsoDateTime;
};

export type CatalogPortalWork = {
  id: string;
  slug: string;
  title: string;
  artistId: string;
  artistSlug: string;
  updatedAt: IsoDateTime;
};

export type CatalogPortalChart = {
  id: string;
  workId: string;
  version: string;
  rawText: string;
  updatedAt: IsoDateTime;
  published: boolean;
};

export type EditorialCatalog = {
  sourceId: string;
  name: string;
  operator: SourceCatalogOperator;
  artists: ReadonlyArray<CatalogPortalArtist>;
  works: ReadonlyArray<CatalogPortalWork>;
  charts?: ReadonlyArray<CatalogPortalChart>;
};

export type CatalogSearchResult =
  | { kind: "artist"; artist: CatalogPortalArtist; score: number }
  | { kind: "work"; work: CatalogPortalWork; artist: CatalogPortalArtist; score: number };

const MONOGRAM_PALETTE = ["#335C81", "#A4473A", "#4B6651", "#7A5C3E", "#66558D", "#246B68"] as const;

function normalize(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function titleCaseInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => [...word][0]?.toLocaleUpperCase("pt-BR") ?? "").join("");
}

function assertNoLegacyPublicationPolicyFields(value: unknown): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) assertNoLegacyPublicationPolicyFields(item);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (key === "rights" || key === "evidence" || key === "evidenceId") {
      throw new Error("Editorial catalogs no longer accept rights/evidence fields.");
    }
    assertNoLegacyPublicationPolicyFields(nested);
  }
}

export function createArtistMonogram(artist: Pick<CatalogPortalArtist, "id" | "name">): { initials: string; color: string } {
  return { initials: titleCaseInitials(artist.name), color: MONOGRAM_PALETTE[stableHash(artist.id) % MONOGRAM_PALETTE.length] };
}

export function searchCatalog(catalog: EditorialCatalog, query: string): CatalogSearchResult[] {
  const needle = normalize(query);
  if (!needle) return [];
  const artists = new Map(catalog.artists.map((artist) => [artist.id, artist]));
  const results: CatalogSearchResult[] = [];
  for (const artist of catalog.artists) {
    const haystack = normalize(`${artist.name} ${artist.slug}`);
    if (haystack.includes(needle)) results.push({ kind: "artist", artist, score: haystack === needle ? 0 : 1 });
  }
  for (const work of catalog.works) {
    const artist = artists.get(work.artistId);
    if (!artist) continue;
    const haystack = normalize(`${work.title} ${work.slug} ${artist.name}`);
    if (haystack.includes(needle)) results.push({ kind: "work", work, artist, score: haystack === needle ? 0 : 2 });
  }
  const label = (result: CatalogSearchResult) => result.kind === "artist" ? result.artist.name : result.work.title;
  return results.sort((left, right) => left.score - right.score || label(left).localeCompare(label(right), "pt-BR"));
}

export function validateEditorialCatalog(catalog: EditorialCatalog): EditorialCatalog {
  if (!catalog.sourceId.trim() || !catalog.name.trim()) throw new Error("Editorial catalog sourceId and name are required.");
  assertNoLegacyPublicationPolicyFields(catalog);
  if (!catalog.operator || !catalog.operator.name.trim() || !catalog.operator.noticeUrl.trim()) throw new Error("Editorial catalog operator name and noticeUrl are required.");
  let noticeUrl: URL;
  try { noticeUrl = new URL(catalog.operator.noticeUrl); } catch { throw new Error("Editorial catalog operator noticeUrl must be an absolute URL."); }
  if (noticeUrl.protocol !== "https:") throw new Error("Editorial catalog operator noticeUrl must use HTTPS.");
  const artistIds = new Set<string>();
  const artistSlugs = new Set<string>();
  for (const artist of catalog.artists) {
    if (!artist.id.trim() || !artist.slug.trim() || !artist.name.trim()) throw new Error("Artist metadata is incomplete.");
    if (artistIds.has(artist.id) || artistSlugs.has(artist.slug)) throw new Error("Artist IDs and slugs must be unique.");
    artistIds.add(artist.id); artistSlugs.add(artist.slug);
    if (artist.links?.some((link) => !link.url.startsWith("https://"))) throw new Error("Artist links must use https.");
  }
  const workIds = new Set<string>();
  const workKeys = new Set<string>();
  for (const work of catalog.works) {
    if (!artistIds.has(work.artistId) || !artistSlugs.has(work.artistSlug)) throw new Error(`Work ${work.id} references an unknown artist.`);
    const key = `${work.artistId}:${work.slug}`;
    if (workIds.has(work.id) || workKeys.has(key)) throw new Error("Work IDs and artist/slug keys must be unique.");
    workIds.add(work.id); workKeys.add(key);
  }
  for (const chart of catalog.charts ?? []) {
    const legacyChart = chart as unknown as Record<string, unknown>;
    if ("rights" in legacyChart || "evidence" in legacyChart) throw new Error("Editorial charts no longer accept rights/evidence fields.");
    if (!workIds.has(chart.workId) || !chart.rawText.trim()) throw new Error(`Chart ${chart.id} references an unknown work or is empty.`);
    if (chart.published && !chart.rawText.trim()) throw new Error(`Chart ${chart.id} is empty.`);
  }
  assertNoForbiddenSourceCatalogKeys(catalog);
  return catalog;
}

export async function projectPublicSourceCatalog(catalog: EditorialCatalog): Promise<SourceCatalogBuildOutput> {
  const valid = validateEditorialCatalog(catalog);
  const records = [
    ...valid.artists.map((artist) => ({ entityType: "artist" as const, sourceRecordId: artist.id, updatedAt: artist.updatedAt, payload: { name: artist.name, slug: artist.slug, ...(artist.summary ? { summary: artist.summary } : {}), ...(artist.links?.length ? { links: artist.links } : {}) } })),
    ...valid.works.map((work) => ({ entityType: "musicalWork" as const, sourceRecordId: work.id, updatedAt: work.updatedAt, payload: { title: work.title, slug: work.slug, artistSlug: work.artistSlug, identityKey: `${work.artistSlug}:${work.slug}` } })),
    ...(valid.charts ?? []).filter((chart) => chart.published).map((chart) => ({ entityType: "chordChart" as const, sourceRecordId: chart.id, updatedAt: chart.updatedAt, payload: { playableVersionSourceRecordId: chart.workId, rawText: chart.rawText, published: true } })),
  ];
  return generateSourceCatalog({ id: valid.sourceId, name: valid.name, operator: valid.operator, contentLicense: SOURCE_CATALOG_CONTENT_LICENSE, schemaVersion: "1.3.0", records });
}

export type LocalDraft = {
  id: string;
  workId: string;
  text: string;
  updatedAt: IsoDateTime;
};

export function createLocalDraft(input: Omit<LocalDraft, "updatedAt"> & { updatedAt?: string }): LocalDraft {
  return { ...input, updatedAt: createIsoDateTime(input.updatedAt ?? new Date().toISOString()) };
}

export type ContributionApplyResult = { files: Readonly<Record<string, string>>; manifest: ContributionManifestV3 };

export async function applyContributionFiles(input: { manifest: unknown; files: Readonly<Record<string, string>> }): Promise<ContributionApplyResult> {
  assertContributionManifestV3(input.manifest);
  const manifest = input.manifest as ContributionManifestV3;
  const sorted = canonicalContributionEntryOrder(manifest.entries);
  const next = { ...input.files };
  for (const entry of sorted) {
    const content = input.files[entry.path];
    if (content === undefined) throw new Error(`Contribution file missing: ${entry.path}`);
    if (entry.role === "manifest") continue;
    const checksum = await sha256Text(content);
    if (checksum.toLowerCase() !== entry.contentSha256.toLowerCase()) throw new Error(`Contribution content hash mismatch: ${entry.path}`);
    next[entry.path] = content;
  }
  return { files: next, manifest };
}

export { normalize, MONOGRAM_PALETTE };
