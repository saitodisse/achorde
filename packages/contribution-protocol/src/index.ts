export const CONTRIBUTION_PROTOCOL = "achorde.portal-contribution/v1" as const;
export const CONTRIBUTION_PROTOCOL_V2 = "achorde.portal-contribution/v2" as const;

export type ContributionOperation = "update-version" | "create-version" | "create-work";
export type ContributionState = "local" | "prepared" | "awaiting-review";

export type ContributionManifest = {
  protocol: typeof CONTRIBUTION_PROTOCOL;
  contributionId: string;
  createdAt: string;
  sourceId: string;
  publicationBranch: string;
  operation: ContributionOperation;
  base: { path: string; contentSha256?: string; expectedAbsent: boolean };
  contentSha256: string;
  files: readonly string[];
};

export type GatewayError = {
  error: { code: string; message: string; retryable: boolean; field?: string; provider?: string; requestId?: string };
};

export type GatewaySubmission = {
  id: string;
  state: "created" | "authorization-required" | "ready" | "sending" | "awaiting-review" | "failed" | "expired";
  provider?: "github" | "gitlab";
  proposalUrl?: string;
  expiresAt: string;
};

export type ContributionOperationV2 = "update-chart" | "create-version" | "create-work" | "create-artist";
export type ContributionEntryRole = "artist" | "work" | "chart" | "rights-evidence" | "manifest" | "proposal";
export type ContributionEntryAction = "create" | "update";
export type ContributionManifestEntryV2 = {
  path: string;
  role: ContributionEntryRole;
  action: ContributionEntryAction;
  baseSha256?: string;
  contentSha256: string;
};
export type ContributionRightsAttestation = {
  kind: "rightsholder-contribution" | "direct-permission" | "platform-repertoire-license" | "public-license" | "public-domain";
  evidenceId: string;
};
export type ContributionManifestV2 = {
  protocol: typeof CONTRIBUTION_PROTOCOL_V2;
  contributionId: string;
  createdAt: string;
  sourceId: string;
  publicationBranch: string;
  operation: ContributionOperationV2;
  termsId: string;
  termsVersion: string;
  acceptedAt: string;
  rights: ContributionRightsAttestation;
  entries: readonly ContributionManifestEntryV2[];
};

export const CONTRIBUTION_LIMITS = {
  maxEntries: 16,
  maxCompressedBytes: 2 * 1024 * 1024,
  maxExpandedBytes: 8 * 1024 * 1024,
  maxTextBytes: 512 * 1024,
} as const;

const SHA_256 = /^[a-f0-9]{64}$/i;
const SAFE_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/;
const EDITORIAL_PATH = /^(?:catalog\/(?:artists\/[^/]+|works\/[^/]+\/[^/]+|charts\/[^/]+\/[^/]+\/[^/]+)\.md|rights\/evidence\/[^/]+\.json|manifest\.json|proposal\.md)$/;

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
}

export async function sha256Text(value: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto SHA-256 support is required.");
  const hash = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function assertContributionManifest(value: unknown): asserts value is ContributionManifest {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Contribution manifest must be an object.");
  const manifest = value as Record<string, unknown>;
  if (manifest.protocol !== CONTRIBUTION_PROTOCOL) throw new Error("Unsupported contribution protocol.");
  for (const field of ["contributionId", "createdAt", "sourceId", "publicationBranch"] as const) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim()) throw new Error(`Contribution manifest ${field} must be a non-empty string.`);
  }
  if (manifest.operation !== "update-version" && manifest.operation !== "create-version" && manifest.operation !== "create-work") throw new Error("Unsupported contribution operation.");
  if (!manifest.base || typeof manifest.base !== "object" || Array.isArray(manifest.base)) throw new Error("Contribution manifest base must be an object.");
  const base = manifest.base as Record<string, unknown>;
  if (typeof base.path !== "string" || !SAFE_PATH.test(base.path)) throw new Error("Contribution target path is unsafe.");
  if (base.contentSha256 !== undefined && (typeof base.contentSha256 !== "string" || !SHA_256.test(base.contentSha256))) throw new Error("Contribution base hash is invalid.");
  if (typeof base.expectedAbsent !== "boolean") throw new Error("Contribution expectedAbsent must be a boolean.");
  if (typeof manifest.contentSha256 !== "string" || !SHA_256.test(manifest.contentSha256)) throw new Error("Contribution content hash is invalid.");
  if (!Array.isArray(manifest.files) || manifest.files.length === 0 || manifest.files.some((file) => typeof file !== "string" || !SAFE_PATH.test(file))) throw new Error("Contribution files are invalid.");
}

function assertSha256(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !SHA_256.test(value)) throw new Error(`${label} must be a SHA-256 checksum.`);
}

function assertTimestamp(value: unknown, label: string): void {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) {
    throw new Error(`${label} must be an ISO-8601 UTC timestamp.`);
  }
}

function assertEditorialPath(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !SAFE_PATH.test(value) || !EDITORIAL_PATH.test(value)) {
    throw new Error(`${label} is outside the editorial allowlist.`);
  }
}

export function assertContributionManifestV2(value: unknown): asserts value is ContributionManifestV2 {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Contribution v2 manifest must be an object.");
  const manifest = value as Record<string, unknown>;
  if (manifest.protocol !== CONTRIBUTION_PROTOCOL_V2) throw new Error("Unsupported contribution protocol.");
  for (const field of ["contributionId", "sourceId", "publicationBranch", "termsId", "termsVersion"] as const) {
    if (typeof manifest[field] !== "string" || !manifest[field].trim()) throw new Error(`Contribution v2 ${field} must be a non-empty string.`);
  }
  assertTimestamp(manifest.createdAt, "createdAt");
  assertTimestamp(manifest.acceptedAt, "acceptedAt");
  if (!["update-chart", "create-version", "create-work", "create-artist"].includes(String(manifest.operation))) {
    throw new Error("Unsupported contribution v2 operation.");
  }
  const rights = manifest.rights;
  if (!rights || typeof rights !== "object" || Array.isArray(rights)) throw new Error("Contribution v2 rights attestation is required.");
  const rightsRecord = rights as Record<string, unknown>;
  if (!["rightsholder-contribution", "direct-permission", "platform-repertoire-license", "public-license", "public-domain"].includes(String(rightsRecord.kind))) {
    throw new Error("Contribution v2 rights attestation is invalid.");
  }
  if (typeof rightsRecord.evidenceId !== "string" || !rightsRecord.evidenceId.trim()) throw new Error("Contribution v2 evidenceId is required.");
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0 || manifest.entries.length > CONTRIBUTION_LIMITS.maxEntries) {
    throw new Error(`Contribution v2 entries must contain 1-${CONTRIBUTION_LIMITS.maxEntries} files.`);
  }
  const paths = new Set<string>();
  for (const item of manifest.entries) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Contribution v2 entry must be an object.");
    const entry = item as Record<string, unknown>;
    assertEditorialPath(entry.path, "Contribution v2 entry path");
    if (paths.has(entry.path)) throw new Error("Contribution v2 entries must not contain duplicate paths.");
    paths.add(entry.path);
    if (!["artist", "work", "chart", "rights-evidence", "manifest", "proposal"].includes(String(entry.role))) throw new Error("Contribution v2 entry role is invalid.");
    if (entry.action !== "create" && entry.action !== "update") throw new Error("Contribution v2 entry action is invalid.");
    assertSha256(entry.contentSha256, "Contribution v2 contentSha256");
    if (entry.action === "update") {
      assertSha256(entry.baseSha256, "Contribution v2 baseSha256");
    } else if (entry.baseSha256 !== undefined) {
      throw new Error("baseSha256 is forbidden for create entries.");
    }
  }

  const operation = manifest.operation as ContributionOperationV2;
  const roles = new Set((manifest.entries as unknown[]).map((entry) => (entry as Record<string, unknown>).role));
  if (operation === "create-artist" && (!roles.has("artist") || !roles.has("work") || !roles.has("chart"))) {
    throw new Error("create-artist must atomically include artist, work, and chart entries.");
  }
  if (operation === "update-chart" && !roles.has("chart")) throw new Error("update-chart requires a chart entry.");
}

/** Stable entry order used by ZIP writers in browser, CLI, and gateway adapters. */
export function canonicalContributionEntryOrder(entries: ReadonlyArray<ContributionManifestEntryV2>): ContributionManifestEntryV2[] {
  return [...entries].sort((left, right) => left.path.localeCompare(right.path));
}

export function contributionIdempotencyKey(contributionId: string, zipSha256: string): string {
  if (!contributionId.trim()) throw new Error("contributionId is required.");
  assertSha256(zipSha256, "zipSha256");
  return `${contributionId}:${zipSha256.toLowerCase()}`;
}

export function assertContributionBundleLimits(input: { entryCount: number; compressedBytes: number; expandedBytes: number; textBytes: ReadonlyArray<number> }): void {
  const values = [input.entryCount, input.compressedBytes, input.expandedBytes, ...input.textBytes];
  if (values.some((value) => !Number.isFinite(value) || value < 0 || !Number.isInteger(value))) {
    throw new Error("Contribution bundle sizes must be finite non-negative integers.");
  }
  if (input.entryCount < 1 || input.entryCount > CONTRIBUTION_LIMITS.maxEntries) throw new Error("Contribution entry count exceeds limit.");
  if (input.compressedBytes > CONTRIBUTION_LIMITS.maxCompressedBytes) throw new Error("Contribution compressed size exceeds limit.");
  if (input.expandedBytes > CONTRIBUTION_LIMITS.maxExpandedBytes) throw new Error("Contribution expanded size exceeds limit.");
  if (input.textBytes.some((size) => size > CONTRIBUTION_LIMITS.maxTextBytes)) throw new Error("Contribution text file exceeds limit.");
}
