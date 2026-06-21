import type { QuarantineReceipt } from './quarantine-receipt';
import { sampleEvidencePath } from './sample-evidence-path';
import { sampleScanArtifact } from './sample-scan-artifact';

export const sampleQuarantineReceipt: QuarantineReceipt = {
  receiptId: `local-${sampleScanArtifact.memoryHash}`,
  network: 'testnet',
  status: 'local_scaffold',
  decision: 'blocked',
  recommendation: 'quarantine',
  proposedAmount: sampleScanArtifact.proposedAmount,
  fundsMoved: 0,
  contaminationScore: sampleScanArtifact.contaminationScore,
  memoryHash: sampleScanArtifact.memoryHash,
  artifactHash: sampleScanArtifact.memoryHash,
  artifactRef: sampleEvidencePath.publicArtifactRef,
  sealPolicyId: sampleEvidencePath.sealPolicyId,
  walrusBlobRef: sampleEvidencePath.walrusBlobRef,
  groth16ProofRef: sampleEvidencePath.groth16ProofRef,
  verifier: 'Local Rust verifier',
  createdAt: 'local-scaffold',
  verifiedPath: [
    'Memory hash',
    'Rust verifier',
    'Seal locked evidence',
    'Walrus artifact ref',
    'Groth16 quarantine proof',
    'Sui QuarantineReceipt',
  ],
};
