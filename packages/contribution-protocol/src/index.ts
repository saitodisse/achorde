export const CONTRIBUTION_PROTOCOL = "achorde.portal-contribution/v1" as const;

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

const SHA_256 = /^[a-f0-9]{64}$/i;
const SAFE_PATH = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._/-]+$/;

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
