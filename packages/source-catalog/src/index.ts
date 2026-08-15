export type Brand<T, Name extends string> = T & {
  readonly __brand: Name;
};

export type IsoDateTime = Brand<string, "IsoDateTime">;
export type Checksum = Brand<string, "Checksum">;

export const SOURCE_CATALOG_CONTENT_LICENSE = "CC-BY-NC-SA-4.0" as const;
export type SourceCatalogContentLicense = typeof SOURCE_CATALOG_CONTENT_LICENSE;

export const SOURCE_CATALOG_SCHEMA_VERSIONS = ["1.0.0", "1.1.0", "1.2.0", "1.3.0"] as const;
export type SourceCatalogSchemaVersion = (typeof SOURCE_CATALOG_SCHEMA_VERSIONS)[number];
export type LegacySourceCatalogSchemaVersion = Exclude<SourceCatalogSchemaVersion, "1.3.0">;

export type SourceCatalogOperator = {
  name: string;
  noticeUrl: string;
};

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

/** Editorial chart payloads are licensed by the catalog as a whole. */
export type SourceCatalogChordChartPayload = {
  playableVersionSourceRecordId: string;
  rawText: string;
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

type SourceCatalogManifestBase = {
  id: string;
  name: string;
  version: string;
  mode: "readonly";
  generatedAt: IsoDateTime;
  files: SourceCatalogFile[];
  capabilities: SyncCapabilities;
};

export type SourceCatalogManifestLegacy = SourceCatalogManifestBase & {
  schemaVersion: LegacySourceCatalogSchemaVersion;
  /** Kept optional so old catalogs remain readable. */
  contentLicense?: unknown;
  operator?: unknown;
};

export type SourceCatalogManifestV1_3 = SourceCatalogManifestBase & {
  schemaVersion: "1.3.0";
  contentLicense: SourceCatalogContentLicense;
  operator: SourceCatalogOperator;
};

export type SourceCatalogManifest = SourceCatalogManifestLegacy | SourceCatalogManifestV1_3;

export type SourceCatalogEnvelope<TPayload = unknown> = {
  sourceId: string;
  sourceRecordId: string;
  entityType: SourceCatalogEntityType;
  schemaVersion: SourceCatalogSchemaVersion;
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
const LEGACY_RIGHTS_KINDS = [
  "rightsholder-contribution",
  "direct-permission",
  "platform-repertoire-license",
  "public-license",
  "public-domain",
] as const;

type LegacyRightsEvidence = { id: string; url: string; sha256: Checksum };
type LegacyRightsBasis =
  | { kind: (typeof LEGACY_RIGHTS_KINDS)[number]; evidence: LegacyRightsEvidence; license?: unknown };

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
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return createChecksum(hex);
}

export function createSourceCatalogChecksums(
  files: ReadonlyArray<{ url: string; sha256: string }>,
): Record<string, Checksum> {
  const checksums: Record<string, Checksum> = {};
  for (const file of [...files].sort((a, b) => stableCompare(a.url, b.url))) {
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
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) assertNoForbiddenSourceCatalogKeys(item);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if ((SOURCE_CATALOG_FORBIDDEN_KEYS as readonly string[]).includes(key)) {
      throw new Error(`Forbidden source catalog key: ${key}`);
    }
    assertNoForbiddenSourceCatalogKeys(nested);
  }
}

function assertNoLegacyPublicationPolicyKeys(value: unknown): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) assertNoLegacyPublicationPolicyKeys(item);
    return;
  }
  for (const [key, nested] of Object.entries(value)) {
    if (key === "rights" || key === "evidence" || key === "evidenceId") {
      throw new Error("Source Catalog 1.3 does not accept rights/evidence fields.");
    }
    assertNoLegacyPublicationPolicyKeys(nested);
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

function assertOperator(value: unknown): asserts value is SourceCatalogOperator {
  const operator = assertObjectRecord(value, "SourceCatalogManifest.operator");
  if (!isNonEmptyString(operator.name)) throw new Error("SourceCatalogManifest.operator.name must be a non-empty string.");
  if (!isNonEmptyString(operator.noticeUrl)) throw new Error("SourceCatalogManifest.operator.noticeUrl must be a non-empty string.");
  let url: URL;
  try {
    url = new URL(String(operator.noticeUrl));
  } catch {
    throw new Error("SourceCatalogManifest.operator.noticeUrl must be an absolute URL.");
  }
  if (url.protocol !== "https:") throw new Error("SourceCatalogManifest.operator.noticeUrl must use https.");
}

function assertLegacyRightsEvidence(value: unknown): asserts value is LegacyRightsEvidence {
  const evidence = assertObjectRecord(value, "Legacy rights evidence");
  if (!isNonEmptyString(evidence.id) || !isNonEmptyString(evidence.url)) {
    throw new Error("Legacy rights evidence id and url are required.");
  }
  assertSafeRelativeUrl(evidence.url);
  if (!evidence.url.startsWith("rights/evidence/")) {
    throw new Error("Legacy rights evidence url must be under rights/evidence/.");
  }
  createChecksum(String(evidence.sha256));
}

function assertLegacyContentLicense(value: unknown): void {
  const license = assertObjectRecord(value, "Legacy content license");
  if (license.kind === "spdx" && isNonEmptyString(license.id)) return;
  if (license.kind === "custom" && isNonEmptyString(license.name) && isNonEmptyString(license.url)) {
    const url = new URL(String(license.url));
    if (url.protocol === "https:") return;
  }
  throw new Error("Unsupported legacy content license.");
}

function assertLegacyRightsBasis(value: unknown): asserts value is LegacyRightsBasis {
  const basis = assertObjectRecord(value, "Legacy rights basis");
  if (basis.kind === "review-required") throw new Error("review-required rights basis is not public.");
  if (typeof basis.kind !== "string" || !(LEGACY_RIGHTS_KINDS as readonly string[]).includes(basis.kind)) {
    throw new Error("Unsupported source catalog rights basis.");
  }
  assertLegacyRightsEvidence(basis.evidence);
  if (basis.kind === "public-license") {
    assertLegacyContentLicense(basis.license);
  } else if ("license" in basis) {
    throw new Error("license is only valid for public-license rights basis.");
  }
}

function assertLegacyChart(value: SourceCatalogEnvelope): void {
  if (value.schemaVersion !== "1.2.0" || value.entityType !== "chordChart") return;
  const payload = assertObjectRecord(value.payload, "SourceCatalogChordChartPayload");
  if (!isNonEmptyString(payload.rawText)) throw new Error("Published chord chart rawText is required.");
  if (!("rights" in payload)) throw new Error("Published chord chart rights basis is required.");
  assertLegacyRightsBasis(payload.rights);
  if (payload.published !== undefined && typeof payload.published !== "boolean") {
    throw new Error("Chord chart published must be boolean when present.");
  }
}

function assertManifestFile(value: unknown, schemaVersion: SourceCatalogSchemaVersion): SourceCatalogFile {
  const sourceFile = assertObjectRecord(value, "SourceCatalogFile");
  if (!isNonEmptyString(sourceFile.url)) throw new Error("SourceCatalogFile.url must be a non-empty string.");
  assertSafeRelativeUrl(sourceFile.url);
  if (schemaVersion === "1.3.0" && sourceFile.url.split("/").some((segment) => segment === "rights" || segment === "evidence")) {
    throw new Error("Source Catalog 1.3 does not accept rights/evidence files.");
  }
  if (!isSourceCatalogEntityType(sourceFile.entityType)) throw new Error("SourceCatalogFile.entityType is unsupported.");
  if (sourceFile.mediaType !== "application/json" && sourceFile.mediaType !== "application/x-ndjson") {
    throw new Error("SourceCatalogFile.mediaType is unsupported.");
  }
  if (sourceFile.sizeBytes !== undefined && (typeof sourceFile.sizeBytes !== "number" || !Number.isInteger(sourceFile.sizeBytes) || sourceFile.sizeBytes < 0)) {
    throw new Error("SourceCatalogFile.sizeBytes must be a non-negative integer when present.");
  }
  if (sourceFile.sha256 !== undefined) createChecksum(String(sourceFile.sha256));
  if (sourceFile.updatedAt !== undefined) createIsoDateTime(String(sourceFile.updatedAt));
  return value as SourceCatalogFile;
}

export function assertSourceCatalogManifest(value: unknown): SourceCatalogManifest {
  const manifest = assertObjectRecord(value, "SourceCatalogManifest");
  if (!isNonEmptyString(manifest.id)) throw new Error("SourceCatalogManifest.id must be a non-empty string.");
  if (!isNonEmptyString(manifest.name)) throw new Error("SourceCatalogManifest.name must be a non-empty string.");
  if (!isNonEmptyString(manifest.version)) throw new Error("SourceCatalogManifest.version must be a non-empty string.");
  if (!isNonEmptyString(manifest.schemaVersion)) throw new Error("SourceCatalogManifest.schemaVersion must be a non-empty string.");
  if (!(SOURCE_CATALOG_SCHEMA_VERSIONS as readonly string[]).includes(manifest.schemaVersion)) {
    throw new Error("SourceCatalogManifest.schemaVersion is unsupported.");
  }
  const schemaVersion = manifest.schemaVersion as SourceCatalogSchemaVersion;
  if (manifest.mode !== "readonly") throw new Error("SourceCatalogManifest.mode must be readonly.");
  createIsoDateTime(String(manifest.generatedAt));
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error("SourceCatalogManifest.files must be a non-empty array.");
  for (const file of manifest.files) assertManifestFile(file, schemaVersion);
  if (schemaVersion === "1.3.0") {
    if (manifest.contentLicense !== SOURCE_CATALOG_CONTENT_LICENSE) {
      throw new Error("SourceCatalogManifest.contentLicense must be CC-BY-NC-SA-4.0.");
    }
    assertOperator(manifest.operator);
    assertNoLegacyPublicationPolicyKeys(manifest);
  }
  assertPullOnlyCapabilities(manifest.capabilities);
  assertNoForbiddenSourceCatalogKeys(manifest);
  return value as SourceCatalogManifest;
}

export function assertSourceCatalogEnvelope<TPayload = unknown>(value: unknown): SourceCatalogEnvelope<TPayload> {
  const envelope = assertObjectRecord(value, "SourceCatalogEnvelope");
  if (!isNonEmptyString(envelope.sourceId)) throw new Error("SourceCatalogEnvelope.sourceId must be a non-empty string.");
  if (!isNonEmptyString(envelope.sourceRecordId)) throw new Error("SourceCatalogEnvelope.sourceRecordId must be a non-empty string.");
  if (!isSourceCatalogEntityType(envelope.entityType)) throw new Error("SourceCatalogEnvelope.entityType is unsupported.");
  if (!isNonEmptyString(envelope.schemaVersion) || !(SOURCE_CATALOG_SCHEMA_VERSIONS as readonly string[]).includes(envelope.schemaVersion)) {
    throw new Error("SourceCatalogEnvelope.schemaVersion is unsupported.");
  }
  if (!("payload" in envelope)) throw new Error("SourceCatalogEnvelope.payload is required.");
  if (envelope.updatedAt !== undefined) createIsoDateTime(String(envelope.updatedAt));
  assertNoForbiddenSourceCatalogKeys(envelope);
  if (envelope.schemaVersion === "1.3.0") {
    assertNoLegacyPublicationPolicyKeys(envelope);
    if (envelope.entityType === "chordChart") {
      const payload = assertObjectRecord(envelope.payload, "SourceCatalogChordChartPayload");
      if (!isNonEmptyString(payload.rawText)) throw new Error("Source Catalog 1.3 chord chart rawText is required.");
    }
  } else {
    assertLegacyChart(envelope as SourceCatalogEnvelope);
  }
  return value as SourceCatalogEnvelope<TPayload>;
}

export function assertSourceCatalogDataset(
  manifestValue: unknown,
  files: Record<string, unknown>,
  checksums?: Record<string, string>,
): SourceCatalogDataset {
  const manifest = assertSourceCatalogManifest(manifestValue);
  const allManifestChecksums = manifest.files.every((file) => file.sha256 !== undefined);
  if (!allManifestChecksums && !checksums) throw new Error("Source catalog checksums.json is required when a manifest checksum is missing.");
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
    dataset[file.url] = rows.map((row) => {
      const envelope = assertSourceCatalogEnvelope(row);
      if (envelope.sourceId !== manifest.id || envelope.schemaVersion !== manifest.schemaVersion || envelope.entityType !== file.entityType) {
        throw new Error(`Source catalog envelope does not match ${file.url}.`);
      }
      return envelope;
    });
  }
  return dataset;
}

export function canonicalSourceCatalogJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalSourceCatalogJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalSourceCatalogJson(record[key])}`).join(",")}}`;
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
  operator: SourceCatalogOperator;
  contentLicense?: SourceCatalogContentLicense;
  schemaVersion?: "1.3.0";
  records: ReadonlyArray<SourceCatalogBuildRecord>;
};

export type SourceCatalogBuildOutput = {
  manifest: SourceCatalogManifestV1_3;
  files: Readonly<Record<string, string>>;
  checksums: Readonly<Record<string, Checksum>>;
};

function maxUpdatedAt(records: ReadonlyArray<SourceCatalogBuildRecord>): IsoDateTime {
  const dates = records.map((record) => record.updatedAt).filter((value): value is IsoDateTime => Boolean(value));
  return dates.length > 0 ? dates.reduce((latest, value) => (value > latest ? value : latest)) : createIsoDateTime("1970-01-01T00:00:00.000Z");
}

/** Builds a deterministic Source Catalog 1.3 snapshot. */
export async function generateSourceCatalog(input: SourceCatalogBuildInput): Promise<SourceCatalogBuildOutput> {
  assertNoLegacyPublicationPolicyKeys(input);
  if (input.schemaVersion !== undefined && input.schemaVersion !== "1.3.0") {
    throw new Error("New Source Catalog generators emit schema 1.3.0 only.");
  }
  if (input.contentLicense !== undefined && input.contentLicense !== SOURCE_CATALOG_CONTENT_LICENSE) {
    throw new Error("Source Catalog contentLicense must be CC-BY-NC-SA-4.0.");
  }
  assertOperator(input.operator);
  const legacyInput = input as unknown as Record<string, unknown>;
  if (legacyInput.evidenceFiles !== undefined) throw new Error("Source Catalog 1.3 does not accept rights/evidence files.");
  const schemaVersion = "1.3.0" as const;
  const generatedAt = maxUpdatedAt(input.records);
  const grouped = new Map<SourceCatalogEntityType, SourceCatalogBuildRecord[]>();
  for (const record of input.records) {
    assertSourceCatalogEnvelope({
      sourceId: input.id,
      sourceRecordId: record.sourceRecordId,
      entityType: record.entityType,
      schemaVersion,
      ...(record.updatedAt ? { updatedAt: record.updatedAt } : {}),
      payload: record.payload,
    });
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
    const content = `${sorted.map((record) => JSON.stringify({
      sourceId: input.id,
      sourceRecordId: record.sourceRecordId,
      entityType,
      schemaVersion,
      ...(record.updatedAt ? { updatedAt: record.updatedAt } : {}),
      payload: record.payload,
    })).join("\n")}\n`;
    const url = `entities/${entityType}.ndjson`;
    const checksum = await createChecksumFromText(content);
    files[url] = content;
    fileMetadata.push({ url, entityType, mediaType: "application/x-ndjson", sizeBytes: new TextEncoder().encode(content).byteLength, sha256: checksum, updatedAt: generatedAt });
  }
  if (fileMetadata.length === 0) throw new Error("Source catalog must contain at least one entity file.");
  const version = (await createChecksumFromText(canonicalSourceCatalogJson({
    id: input.id,
    name: input.name,
    operator: input.operator,
    contentLicense: SOURCE_CATALOG_CONTENT_LICENSE,
    schemaVersion,
    generatedAt,
    files,
  }))).slice(0, 16);
  const manifest: SourceCatalogManifestV1_3 = {
    id: input.id,
    name: input.name,
    version,
    schemaVersion,
    mode: "readonly",
    generatedAt,
    contentLicense: SOURCE_CATALOG_CONTENT_LICENSE,
    operator: input.operator,
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
  const checksums = createSourceCatalogChecksums(fileMetadata.map((file) => ({ url: file.url, sha256: String(file.sha256) })));
  return { manifest, files, checksums };
}
