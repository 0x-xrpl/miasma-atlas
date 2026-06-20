export type EvidenceCapsuleVerificationState =
  | 'verified'
  | 'blocked'
  | 'confirmation_required'
  | 'preview'
  | 'gate_failed';

export type EvidenceCapsule = {
  capsuleId: string;
  capsuleHash: string;
  actionKind: string;
  intentHash: string;
  policyHash: string;
  contextHash: string;
  memoryActionContextHash: string;
  suiDigest?: string;
  deepbookDigest?: string;
  proofHash: string;
  publicSignalsHash: string;
  verificationState: EvidenceCapsuleVerificationState;
  fundsMoved: number;
  blocked: boolean;
  confirmationRequired: boolean;
  walrusBlobId?: string;
  walrusObjectId?: string;
  walrusStatus: 'verified' | 'gate_failed' | 'preview';
  sealPolicyId?: string;
  sealStatus: 'verified' | 'gate_failed' | 'preview';
  sealCiphertextHash?: string;
  createdAtMs: number;
};

export type EvidenceCapsuleInput = Omit<EvidenceCapsule, 'capsuleId' | 'capsuleHash'> & {
  capsuleId?: string;
};

export type EvidenceCapsuleDisplayRefs = {
  deepbookDigest?: string;
  suiDigest?: string;
  walrusArtifact?: string;
  sealAccessPolicy?: string;
  suiCapsuleAnchor?: string;
};

export type EvidenceCapsuleField = {
  label: string;
  value: string;
};

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, entry]) => entry !== undefined)
    .sort(([left], [right]) => left.localeCompare(right));

  return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`).join(',')}}`;
}

export async function sha256Hex(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createEvidenceCapsule(input: EvidenceCapsuleInput): Promise<EvidenceCapsule> {
  const capsuleId = input.capsuleId ?? `capsule-${input.actionKind}-${input.createdAtMs}`;
  const capsuleBase = {
    ...input,
    capsuleId,
  };
  const capsuleHash = await sha256Hex(stableStringify(capsuleBase));
  return {
    ...capsuleBase,
    capsuleHash,
  };
}

export function buildEvidenceCapsuleFields(
  capsule: EvidenceCapsule,
  refs: EvidenceCapsuleDisplayRefs = {},
): EvidenceCapsuleField[] {
  return [
    { label: 'DeepBook digest', value: refs.deepbookDigest ?? capsule.deepbookDigest ?? 'PRODUCTION GATE FAILED: DeepBook live SDK/client not configured' },
    { label: 'Sui digest', value: refs.suiDigest ?? capsule.suiDigest ?? 'PRODUCTION GATE FAILED: Sui digest not available yet' },
    { label: 'Groth16 proof', value: capsule.verificationState === 'verified' ? 'verified' : capsule.verificationState },
    { label: 'Proof hash', value: capsule.proofHash || 'PRODUCTION GATE FAILED: Groth16 verification not configured' },
    { label: 'Public signals hash', value: capsule.publicSignalsHash || 'PRODUCTION GATE FAILED: Groth16 verification not configured' },
    { label: 'Capsule hash', value: capsule.capsuleHash },
    { label: 'Walrus artifact', value: refs.walrusArtifact ?? capsule.walrusBlobId ?? 'PRODUCTION GATE FAILED: Walrus artifact upload not configured' },
    { label: 'Seal access policy', value: refs.sealAccessPolicy ?? capsule.sealPolicyId ?? 'PRODUCTION GATE FAILED: Seal access policy not configured' },
    { label: 'Sui capsule anchor', value: refs.suiCapsuleAnchor ?? 'PRODUCTION GATE FAILED: Sui capsule anchor package not configured' },
    { label: 'Blocked', value: capsule.blocked ? 'yes' : 'no' },
    { label: 'Confirmation required', value: capsule.confirmationRequired ? 'yes' : 'no' },
    { label: 'Funds moved', value: String(capsule.fundsMoved) },
  ];
}
