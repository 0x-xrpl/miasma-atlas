export type SealEvidenceStatus = {
  state: 'verified' | 'gate_failed' | 'preview';
  detail: string;
  available: boolean;
  policyId?: string;
  ciphertextHash?: string;
  packageId?: string;
  accessObjectId?: string;
};

export function buildSealEvidenceFields(status: SealEvidenceStatus) {
  return [
    { label: 'Status', value: status.state === 'verified' ? 'verified' : status.state },
    { label: 'Detail', value: status.detail },
    { label: 'Policy ID', value: status.policyId || 'PRODUCTION GATE FAILED: Seal access policy not configured' },
    { label: 'Ciphertext hash', value: status.ciphertextHash || 'PRODUCTION GATE FAILED: Seal access policy not configured' },
  ];
}
