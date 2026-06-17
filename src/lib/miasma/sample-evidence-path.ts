import { buildGroth16Proof } from './groth16-proof';
import { sealEvidence } from './seal-evidence';
import { buildWalrusArtifactRef } from './walrus-artifact';
import { sampleScanArtifact } from './sample-scan-artifact';
import type { MiasmaEvidencePath } from './evidence-path';

const localEvidenceKey = 'local/sample/evidence';

export const sampleEvidencePath: MiasmaEvidencePath = {
  memoryHash: sampleScanArtifact.memoryHash,
  scanArtifactHash: sampleScanArtifact.memoryHash,
  publicArtifactRef: 'local/sample/public-artifact',
  sensitiveEvidenceRef: sealEvidence(localEvidenceKey),
  sealPolicyId: 'scaffolded',
  sealLockedEvidenceRef: sealEvidence(`${localEvidenceKey}/locked`),
  walrusBlobRef: buildWalrusArtifactRef('local/sample/artifact'),
  evidenceVisibility: 'restricted_scaffold',
  rawMemoryPublic: false,
  accessPolicyStatus: 'scaffolded',
  sealStatus: 'locked_scaffold',
  walrusStatus: 'artifact_ref_scaffold',
  groth16ProofRef: buildGroth16Proof('local/sample/quarantine-proof'),
};
