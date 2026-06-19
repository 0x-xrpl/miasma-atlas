const sealEvidenceStatus = {
  state: 'gate_failed',
  detail: 'PRODUCTION GATE FAILED: Seal access policy not configured',
  available: false,
  policyId: '',
  ciphertextHash: '',
  packageId: '',
  accessObjectId: '',
} as const;

export default sealEvidenceStatus;
