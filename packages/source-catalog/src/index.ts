export type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type IsoDateTime = Brand<string, "IsoDateTime">;
export type Checksum = Brand<string, "Checksum">;

export type SyncCapabilities = {
  pull: boolean;
  push: boolean;
  batchPush: boolean;
  realtime: boolean;
  proposals: boolean;
  revisions: boolean;
  moderation: boolean;
  conflictResolution: "client" | "server" | "manual";
  auth: "none" | "api-key" | "oauth" | "session";
};

export type SourceCatalogEntityType =
  | "artist"
  | "musicalWork"
  | "playableVersion"
  | "chordChart"
  | "voicing"
  | "chordAlias";

export const SOURCE_CATALOG_ENTITY_TYPES = [
  "artist",
  "musicalWork",
  "playableVersion",
  "chordChart",
  "voicing",
  "chordAlias",
] as const satisfies readonly SourceCatalogEntityType[];

/** A real license that a rightsholder or authorized representative can grant. */
export type SourceCatalogContentLicense =
  | { kind: "spdx"; id: string }
  | { kind: "custom"; name: string; url: string };

export type SourceCatalogRightsEvidenceRef = {
  id: string;
  /** Relative path to a sanitized public summary. */
  url: string;
  sha256: Checksum;
};

export type SourceCatalogRightsBasis =
  | { kind: "rightsholder-contribution"; evidence: SourceCatalogRightsEvidenceRef }
  | { kind: "direct-permission"; evidence: SourceCatalogRightsEvidenceRef }
  | { kind: "platform-repertoire-license"; evidence: SourceCatalogRightsEvidenceRef }
  | {
      kind: "public-license";
      evidence: SourceCatalogRightsEvidenceRef;
      license: SourceCatalogContentLicense;
    }
  | { kind: "public-domain"; evidence: SourceCatalogRightsEvidenceRef };

export type SourceCatalogArtistPayload = {
  name: string;
  slug: string;
  summary?: string;
  links?: ReadonlyArray<{ label: string; url: string }>;
};

export type SourceCatalogMusicalWorkPayload = {
  title: string;
  slug: string;
  artistSlug: string;
  identityKey?: string;
};

export type SourceCatalogPlayableVersionPayload = {
  title: string;
  musicalWorkKey: string;
  artistSlug?: string;
};

export type SourceCatalogChordChartPayload = {
  playableVersionSourceRecordId: string;
  rawText: string;
  /** Public catalogs must provide this for every published chart. */
  rights: SourceCatalogRightsBasis;
  published?: boolean;
};

export type SourceCatalogFile = {
  url: string;
  entityType: SourceCatalogEntityType;
  mediaType: "application/json" | "application/x-ndjson";
  sizeBytes?: number;
  sha256?: Checksum;
  updatedAt?: IsoDateTime;
};

export type SourceCatalogManifest = {
  id: string;
  name: string;
  version: string;
  schemaVersion: string;
  mode: "readonly";
  generatedAt: IsoDateTime;
  files: SourceCatalogFile[];
  capabilities: SyncCapabilities;
};

export type SourceCatalogEnvelope<TPayload = unknown> = {
  sourceId: string;
  sourceRecordId: string;
  entityType: SourceCatalogEntityType;
  schemaVersion: string;
  updatedAt?: IsoDateTime;
  payload: TPayload;
};

export type SourceCatalogDataset = Record<string, ReadonlyArray<SourceCatalogEnvelope>>;

export const SOURCE_CATALOG_FORBIDDEN_KEYS = [
  "access_token",
  "refresh_token",
  "id_token",
  "sessionToken",
  "email",
  "providerAccountId",
  "owner_id",
  "owner_name",
  "owner_username",
  "identity",
  "contract",
  "agreement",
  "document",
] as const;

const NON_EMPTY = /\S/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const CHECKSUM = /^[a-f0-9]{64}$/i;

function stableCompare(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function brand<T, Name extends string>(value: T): Brand<T, Name> {
  return value as Brand<T, Name>;
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && NON_EMPTY.test(value);
}

export function createIsoDateTime(value: string): IsoDateTime {
  const normalized = normalizeWhitespace(value);

  if (!ISO_DATE_TIME.test(normalized)) {
    throw new Error("IsoDateTime must be an ISO-8601 UTC timestamp.");
  }

  return brand<string, "IsoDateTime">(normalized);
}

export function createChecksum(value: string): Checksum {
  const normalized = normalizeWhitespace(value).toLowerCase();

  if (!CHECKSUM.test(normalized)) {
    throw new Error("Checksum must be a 64-character hexadecimal string.");
  }

  return brand<string, "Checksum">(normalized);
}

export async function createChecksumFromText(content: string): Promise<Checksum> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto SHA-256 support is required to create source catalog checksums.");
  }

  const bytes = new TextEncoder().encode(content);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

  return createChecksum(hex);
}

export function createSourceCatalogChecksums(
  files: ReadonlyArray<{ url: string; sha256: string }>,
): Record<string, Checksum> {
  const sortedFiles = [...files].sort((a, b) => stableCompare(a.url, b.url));
  const checksums: Record<string, Checksum> = {};

  for (const file of sortedFiles) {
    checksums[file.url] = createChecksum(file.sha256);
  }

  return checksums;
}

function isSourceCatalogEntityType(value: unknown): value is SourceCatalogEntityType {
  return typeof value === "string" && (SOURCE_CATALOG_ENTITY_TYPES as readonly string[]).includes(value);
}

function assertObjectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

export function assertNoForbiddenSourceCatalogKeys(value: unknown): void {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      assertNoForbiddenSourceCatalogKeys(item);
    }
    return;
  }

  for (const [key, nested] of Object.entries(value)) {
    if ((SOURCE_CATALOG_FORBIDDEN_KEYS as readonly string[]).includes(key)) {
      throw new Error(`Forbidden source catalog key: ${key}`);
    }
    assertNoForbiddenSourceCatalogKeys(nested);
  }
}

function assertPullOnlyCapabilities(value: unknown): asserts value is SyncCapabilities {
  const capabilities = assertObjectRecord(value, "SyncCapabilities");

  if (
    capabilities.pull !== true ||
    capabilities.push !== false ||
    capabilities.batchPush !== false ||
    capabilities.realtime !== false ||
    capabilities.proposals !== false ||
    capabilities.revisions !== false ||
    capabilities.moderation !== false ||
    capabilities.conflictResolution !== "manual" ||
    capabilities.auth !== "none"
  ) {
    throw new Error("Source catalog manifests must be pull-only.");
  }
}

function assertSafeRelativeUrl(value: string): void {
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith("//") || value.startsWith("/") || value.split("/").includes("..")) {
    throw new Error("SourceCatalogFile.url must be a safe relative URL.");
  }
}

function assertRightsEvidence(value: unknown): asserts value is SourceCatalogRightsEvidenceRef {
  const evidence = assertObjectRecord(value, "SourceCatalogRightsEvidenceRef");
  if (!isNonEmptyString(evidence.id)) {
    throw new Error("Rights evidence id must be a non-empty string.");
  }
  if (!isNonEmptyString(evidence.url)) {
    throw new Error("Rights evidence url must be a non-empty string.");
  }
  assertSafeRelativeUrl(evidence.url);
  if (!evidence.url.startsWith("rights/evidence/")) {
    throw new Error("Rights evidence url must be under rights/evidence/.");
  }
  createChecksum(String(evidence.sha256));
}

function assertSanitizedEvidenceFile(url: string, content: string): void {
  assertSafeRelativeUrl(url);
  if (!url.startsWith("rights/evidence/") || !url.endsWith(".json")) {
    throw new Error("Rights evidence files must be JSON under rights/evidence/.");
  }
  try {
    const parsed = JSON.parse(content) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Evidence summary must be a JSON object.");
    }
    assertNoForbiddenSourceCatalogKeys(parsed);
  } catch (error) {
    throw new Error(`Rights evidence is not a sanitized JSON summary: ${error instanceof Error ? error.message : "invalid JSON"}`);
  }
}

function assertContentLicense(value: unknown): asserts value is SourceCatalogContentLicense {
  const license = assertObjectRecord(value, "SourceCatalogContentLicense");
  if (license.kind === "spdx") {
    if (!isNonEmptyString(license.id)) throw new Error("SPDX license id is required.");
    return;
  }
  if (license.kind === "custom") {
    if (!isNonEmptyString(license.name) || !isNonEmptyString(license.url)) {
      throw new Error("Custom content license requires name and url.");
    }
    const parsed = new URL(String(license.url));
    if (parsed.protocol !== "https:") throw new Error("Custom content license url must use https.");
    return;
  }
  throw new Error("Unsupported content license.");
}

export function assertSourceCatalogRightsBasis(value: unknown): asserts value is SourceCatalogRightsBasis {
  const basis = assertObjectRecord(value, "SourceCatalogRightsBasis");
  if (basis.kind === "review-required") {
    throw new Error("review-required rights basis is not public.");
  }
  const kinds = [
    "rightsholder-contribution",
    "direct-permission",
    "platform-repertoire-license",
    "public-license",
    "public-domain",
  ];
  if (typeof basis.kind !== "string" || !kinds.includes(basis.kind)) {
    throw new Error("Unsupported source catalog rights basis.");
  }
  assertRightsEvidence(basis.evidence);
  if (basis.kind === "public-license") {
    assertContentLicense(basis.license);
  } else if ("license" in basis) {
    throw new Error("license is only valid for public-license rights basis.");
  }
}

function assertPublishedChartRights(envelope: SourceCatalogEnvelope): void {
  if (envelope.schemaVersion !== "1.2.0" || envelope.entityType !== "chordChart") return;
  const payload = assertObjectRecord(envelope.payload, "SourceCatalogChordChartPayload");
  if (!isNonEmptyString(payload.rawText)) {
    throw new Error("Published chord chart rawText is required.");
  }
  if (!("rights" in payload)) {
    throw new Error("Published chord chart rights basis is required.");
  }
  assertSourceCatalogRightsBasis(payload.rights);
  if (payload.published !== undefined && typeof payload.published !== "boolean") {
    throw new Error("Chord chart published must be boolean when present.");
  }
}

export function assertSourceCatalogManifest(value: unknown): SourceCatalogManifest {
  const manifest = assertObjectRecord(value, "SourceCatalogManifest");

  if (!isNonEmptyString(manifest.id)) {
    throw new Error("SourceCatalogManifest.id must be a non-empty string.");
  }
  if (!isNonEmptyString(manifest.name)) {
    throw new Error("SourceCatalogManifest.name must be a non-empty string.");
  }
  if (!isNonEmptyString(manifest.version)) {
    throw new Error("SourceCatalogManifest.version must be a non-empty string.");
  }
  if (!isNonEmptyString(manifest.schemaVersion)) {
    throw new Error("SourceCatalogManifest.schemaVersion must be a non-empty string.");
  }
  if (manifest.schemaVersion !== "1.0.0" && manifest.schemaVersion !== "1.1.0" && manifest.schemaVersion !== "1.2.0") {
    throw new Error("SourceCatalogManifest.schemaVersion is unsupported.");
  }
  if (manifest.mode !== "readonly") {
    throw new Error("SourceCatalogManifest.mode must be readonly.");
  }
  createIsoDateTime(String(manifest.generatedAt));
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error("SourceCatalogManifest.files must be a non-empty array.");
  }

  for (const file of manifest.files) {
    const sourceFile = assertObjectRecord(file, "SourceCatalogFile");

    if (!isNonEmptyString(sourceFile.url)) {
      throw new Error("SourceCatalogFile.url must be a non-empty string.");
    }
    assertSafeRelativeUrl(sourceFile.url);
    if (!isSourceCatalogEntityType(sourceFile.entityType)) {
      throw new Error("SourceCatalogFile.entityType is unsupported.");
    }
    if (sourceFile.mediaType !== "application/json" && sourceFile.mediaType !== "application/x-ndjson") {
      throw new Error("SourceCatalogFile.mediaType is unsupported.");
    }
    if (sourceFile.sizeBytes !== undefined && typeof sourceFile.sizeBytes !== "number") {
      throw new Error("SourceCatalogFile.sizeBytes must be a number when present.");
    }
    if (sourceFile.sha256 !== undefined) {
      createChecksum(String(sourceFile.sha256));
    }
    if (sourceFile.updatedAt !== undefined) {
      createIsoDateTime(String(sourceFile.updatedAt));
    }
  }

  assertPullOnlyCapabilities(manifest.capabilities);
  assertNoForbiddenSourceCatalogKeys(manifest);
  return value as SourceCatalogManifest;
}

/** Validates the complete, already-downloaded snapshot before it is persisted. */
export function assertSourceCatalogDataset(
  manifestValue: unknown,
  files: Record<string, unknown>,
  checksums?: Record<string, string>,
): SourceCatalogDataset {
  const manifest = assertSourceCatalogManifest(manifestValue);
  const allManifestChecksums = manifest.files.every((file) => file.sha256 !== undefined);
  if (!allManifestChecksums && !checksums) {
    throw new Error("Source catalog checksums.json is required when a manifest checksum is missing.");
  }
  const dataset: SourceCatalogDataset = {};
  for (const file of manifest.files) {
    const manifestChecksum = file.sha256;
    const checksumFileValue = checksums?.[file.url];
    if (!manifestChecksum && !checksumFileValue) throw new Error(`Source catalog checksum missing for ${file.url}.`);
    if (manifestChecksum && checksumFileValue && manifestChecksum !== createChecksum(checksumFileValue)) {
      throw new Error(`Source catalog checksum disagreement for ${file.url}.`);
    }
    const rows = files[file.url];
    if (!Array.isArray(rows)) throw new Error(`Source catalog dataset missing ${file.url}.`);
    dataset[file.url] = rows.map((value) => {
      const envelope = assertSourceCatalogEnvelope(value);
      if (envelope.sourceId !== manifest.id || envelope.schemaVersion !== manifest.schemaVersion || envelope.entityType !== file.entityType) {
        throw new Error(`Source catalog envelope does not match ${file.url}.`);
      }
      return envelope;
    });
  }
  return dataset;
}

export function assertSourceCatalogEnvelope<TPayload = unknown>(value: unknown): SourceCatalogEnvelope<TPayload> {
  const envelope = assertObjectRecord(value, "SourceCatalogEnvelope");

  if (!isNonEmptyString(envelope.sourceId)) {
    throw new Error("SourceCatalogEnvelope.sourceId must be a non-empty string.");
  }
  if (!isNonEmptyString(envelope.sourceRecordId)) {
    throw new Error("SourceCatalogEnvelope.sourceRecordId must be a non-empty string.");
  }
  if (!isSourceCatalogEntityType(envelope.entityType)) {
    throw new Error("SourceCatalogEnvelope.entityType is unsupported.");
  }
  if (!isNonEmptyString(envelope.schemaVersion)) {
    throw new Error("SourceCatalogEnvelope.schemaVersion must be a non-empty string.");
  }
  if (!("payload" in envelope)) {
    throw new Error("SourceCatalogEnvelope.payload is required.");
  }
  if (envelope.updatedAt !== undefined) {
    createIsoDateTime(String(envelope.updatedAt));
  }

  assertNoForbiddenSourceCatalogKeys(envelope);
  assertPublishedChartRights(envelope as SourceCatalogEnvelope);
  return value as SourceCatalogEnvelope<TPayload>;
}

export function canonicalSourceCatalogJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalSourceCatalogJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalSourceCatalogJson(record[key])}`)
    .join(",")}}`;
}

export type SourceCatalogBuildRecord = {
  entityType: SourceCatalogEntityType;
  sourceRecordId: string;
  payload: unknown;
  updatedAt?: IsoDateTime;
};

export type SourceCatalogBuildInput = {
  id: string;
  name: string;
  schemaVersion?: "1.0.0" | "1.1.0" | "1.2.0";
  records: ReadonlyArray<SourceCatalogBuildRecord>;
  /** Sanitized public evidence files keyed by their relative URL. */
  evidenceFiles?: Readonly<Record<string, string>>;
};

export type SourceCatalogBuildOutput = {
  manifest: SourceCatalogManifest;
  files: Readonly<Record<string, string>>;
  checksums: Readonly<Record<string, Checksum>>;
};

function maxUpdatedAt(records: ReadonlyArray<SourceCatalogBuildRecord>): IsoDateTime {
  const dates = records.map((record) => record.updatedAt).filter((value): value is IsoDateTime => Boolean(value));
  return dates.length > 0
    ? dates.reduce((latest, value) => (value > latest ? value : latest))
    : createIsoDateTime("1970-01-01T00:00:00.000Z");
}

/**
 * Builds a byte-stable, pull-only snapshot. The caller can write `files` to
 * `/source-catalog/` without adding a second serializer in a portal.
 */
export async function generateSourceCatalog(input: SourceCatalogBuildInput): Promise<SourceCatalogBuildOutput> {
  const schemaVersion = input.schemaVersion ?? "1.2.0";
  const generatedAt = maxUpdatedAt(input.records);
  const evidenceFiles = input.evidenceFiles ?? {};
  for (const [url, content] of Object.entries(evidenceFiles)) {
    assertSanitizedEvidenceFile(url, content);
  }
  const grouped = new Map<SourceCatalogEntityType, SourceCatalogBuildRecord[]>();
  for (const record of input.records) {
    if (record.entityType === "chordChart") {
      const payload = assertObjectRecord(record.payload, "SourceCatalogChordChartPayload");
      assertPublishedChartRights({
        sourceId: input.id,
        sourceRecordId: record.sourceRecordId,
        entityType: record.entityType,
        schemaVersion,
        updatedAt: record.updatedAt,
        payload,
      });
      const basis = payload.rights as SourceCatalogRightsBasis;
      const evidenceUrl = basis.evidence.url;
      const evidenceContent = input.evidenceFiles?.[evidenceUrl];
      if (evidenceContent === undefined) throw new Error(`Rights evidence missing for ${record.sourceRecordId}.`);
      const evidenceChecksum = await createChecksumFromText(evidenceContent);
      if (evidenceChecksum !== basis.evidence.sha256) throw new Error(`Rights evidence checksum mismatch for ${record.sourceRecordId}.`);
      assertSanitizedEvidenceFile(evidenceUrl, evidenceContent);
    }
    const list = grouped.get(record.entityType) ?? [];
    list.push(record);
    grouped.set(record.entityType, list);
  }

  const files: Record<string, string> = {};
  const fileMetadata: SourceCatalogFile[] = [];
  for (const entityType of SOURCE_CATALOG_ENTITY_TYPES) {
    const rows = grouped.get(entityType);
    if (!rows?.length) continue;
    const sorted = [...rows].sort((left, right) => stableCompare(left.sourceRecordId, right.sourceRecordId));
    const content = `${sorted
      .map((record) => JSON.stringify({
        sourceId: input.id,
        sourceRecordId: record.sourceRecordId,
        entityType,
        schemaVersion,
        ...(record.updatedAt ? { updatedAt: record.updatedAt } : {}),
        payload: record.payload,
      }))
      .join("\n")}\n`;
    const url = `entities/${entityType}.ndjson`;
    const checksum = await createChecksumFromText(content);
    files[url] = content;
    fileMetadata.push({
      url,
      entityType,
      mediaType: "application/x-ndjson",
      sizeBytes: new TextEncoder().encode(content).byteLength,
      sha256: checksum,
      updatedAt: generatedAt,
    });
  }

  if (fileMetadata.length === 0) throw new Error("Source catalog must contain at least one entity file.");
  for (const [url, content] of Object.entries(evidenceFiles)) files[url] = content;
  const version = (await createChecksumFromText(canonicalSourceCatalogJson({
    id: input.id,
    name: input.name,
    schemaVersion,
    generatedAt,
    files: fileMetadata,
    content: files,
  }))).slice(0, 16);
  const manifest: SourceCatalogManifest = {
    id: input.id,
    name: input.name,
    version,
    schemaVersion,
    mode: "readonly",
    generatedAt,
    files: fileMetadata.sort((left, right) => stableCompare(left.url, right.url)),
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
  assertSourceCatalogManifest(manifest);
  const evidenceChecksums = Object.fromEntries(await Promise.all(Object.entries(evidenceFiles).map(async ([url, content]) => [url, await createChecksumFromText(content)] as const)));
  const checksums = createSourceCatalogChecksums([
    ...fileMetadata.map((file) => ({ url: file.url, sha256: String(file.sha256) })),
    ...Object.entries(evidenceChecksums).map(([url, sha256]) => ({ url, sha256: String(sha256) })),
  ]);
  return { manifest, files, checksums };
}
