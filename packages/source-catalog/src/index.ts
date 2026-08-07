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
] as const;

const NON_EMPTY = /\S/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const CHECKSUM = /^[a-f0-9]{64}$/i;

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
  const sortedFiles = [...files].sort((a, b) => a.url.localeCompare(b.url));
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
  if (manifest.schemaVersion !== "1.0.0" && manifest.schemaVersion !== "1.1.0") {
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
  return value as SourceCatalogEnvelope<TPayload>;
}
