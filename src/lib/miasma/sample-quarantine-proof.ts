import { sampleScanArtifact } from './sample-scan-artifact';
import type { QuarantineProof } from './quarantine-proof';

export const sampleQuarantineProof: QuarantineProof = {
  proofStatus: 'scaffolded',
  quarantineRuleId: 'hidden_instruction_quarantine_v1',
  contaminationThreshold: 80,
  contaminationScore: sampleScanArtifact.contaminationScore,
  memoryHash: sampleScanArtifact.memoryHash,
  scanArtifactHash: 'scan_artifact_hash_scaffold',
  result: 'rule_satisfied',
  proofRef: 'groth16://local/sample/quarantine-proof',
  verificationKeyRef: 'groth16://local/sample/verification-key',
  circuitRef: 'zk/circuits/quarantine_threshold.circom',
  publicInputs: {
    memoryHash: sampleScanArtifact.memoryHash,
    scanArtifactHash: 'scan_artifact_hash_scaffold',
    contaminationThreshold: 80,
    quarantineRuleId: 'hidden_instruction_quarantine_v1',
  },
};
