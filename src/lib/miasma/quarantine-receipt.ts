import type { MiasmaScanArtifact } from './scan-artifact';

export type QuarantineReceiptStatus = 'local_scaffold' | 'pending_onchain_mint';
export type QuarantineReceiptDecision = 'blocked' | 'allow';
export type QuarantineReceiptVerifier = 'Local Rust verifier';

export type QuarantineReceipt = {
  receiptId: string;
  network: string;
  status: QuarantineReceiptStatus;
  decision: QuarantineReceiptDecision;
  recommendation: 'quarantine' | 'allow';
  proposedAmount: number;
  fundsMoved: 0;
  contaminationScore: number;
  memoryHash: string;
  artifactHash: string;
  artifactRef: string;
  sealPolicyId?: string;
  walrusBlobRef?: string;
  groth16ProofRef?: string;
  verifier: QuarantineReceiptVerifier;
  createdAt: string;
  suiObjectId?: string;
  suiExplorerUrl?: string;
  verifiedPath: readonly string[];
};

export function buildQuarantineReceipt(scan: MiasmaScanArtifact): QuarantineReceipt {
  return {
    receiptId: `local-${scan.memoryHash}`,
    network: 'testnet',
    status: 'local_scaffold',
    decision: scan.actionBlocked ? 'blocked' : 'allow',
    recommendation: scan.recommendation,
    proposedAmount: scan.proposedAmount,
    fundsMoved: 0,
    contaminationScore: scan.contaminationScore,
    memoryHash: scan.memoryHash,
    artifactHash: scan.memoryHash,
    artifactRef: 'local/sample/pending',
    sealPolicyId: 'scaffolded',
    walrusBlobRef: 'scaffolded',
    groth16ProofRef: 'scaffolded',
    verifier: 'Local Rust verifier',
    createdAt: 'local-scaffold',
    verifiedPath: [
      'Memory hash',
      'Rust verifier',
      'Nitro enclave verifier',
      'Seal locked evidence',
      'Walrus artifact ref',
      'Groth16 quarantine proof',
      'Sui QuarantineReceipt',
    ],
  };
}
