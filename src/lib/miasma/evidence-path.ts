export type EvidenceVisibility = 'public_scaffold' | 'restricted_scaffold';
export type EvidencePathStatus = 'scaffolded' | 'locked_scaffold' | 'artifact_ref_scaffold';
export type EvidenceAccessPolicyStatus = 'scaffolded' | 'pending';

export type MiasmaEvidencePath = {
  memoryHash: string;
  scanArtifactHash: string;
  publicArtifactRef: string;
  sensitiveEvidenceRef: string;
  sealPolicyId: string;
  sealLockedEvidenceRef: string;
  walrusBlobRef: string;
  evidenceVisibility: EvidenceVisibility;
  rawMemoryPublic: false;
  accessPolicyStatus: EvidenceAccessPolicyStatus;
  sealStatus: Extract<EvidencePathStatus, 'scaffolded' | 'locked_scaffold'>;
  walrusStatus: Extract<EvidencePathStatus, 'scaffolded' | 'artifact_ref_scaffold'>;
  groth16ProofRef: string;
};
