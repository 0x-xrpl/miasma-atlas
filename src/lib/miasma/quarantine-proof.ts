export type QuarantineProofStatus = 'scaffolded' | 'pending' | 'verified';

export type QuarantineProofPublicInputs = {
  memoryHash: string;
  scanArtifactHash: string;
  contaminationThreshold: number;
  quarantineRuleId: string;
};

export type QuarantineProof = {
  proofStatus: QuarantineProofStatus;
  quarantineRuleId: string;
  contaminationThreshold: number;
  contaminationScore: number;
  memoryHash: string;
  scanArtifactHash: string;
  result: 'rule_satisfied' | 'rule_not_satisfied';
  proofRef: string;
  verificationKeyRef: string;
  circuitRef: string;
  publicInputs: QuarantineProofPublicInputs;
};
