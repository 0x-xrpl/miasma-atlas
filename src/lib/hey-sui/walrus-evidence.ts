export type WalrusEvidenceStatus = {
  state: 'verified' | 'gate_failed' | 'preview';
  detail: string;
  available: boolean;
  blobId?: string;
  objectId?: string;
  uploadRelayUrl?: string;
  network?: string;
};

export function buildWalrusEvidenceFields(status: WalrusEvidenceStatus) {
  return [
    { label: 'Status', value: status.state === 'verified' ? 'verified' : status.state },
    { label: 'Detail', value: status.detail },
    { label: 'Blob ID', value: status.blobId || 'PRODUCTION GATE FAILED: Walrus artifact upload not configured' },
    { label: 'Object ID', value: status.objectId || 'PRODUCTION GATE FAILED: Walrus artifact upload not configured' },
  ];
}
