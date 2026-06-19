const walrusEvidenceStatus = {
  state: 'gate_failed',
  detail: 'PRODUCTION GATE FAILED: Walrus artifact upload not configured',
  available: false,
  blobId: '',
  objectId: '',
  uploadRelayUrl: '',
  network: '',
} as const;

export default walrusEvidenceStatus;
