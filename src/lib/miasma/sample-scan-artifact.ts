import type { MiasmaScanArtifact } from './scan-artifact';

export const sampleScanArtifact: MiasmaScanArtifact = {
  name: 'poisoned-memory',
  memoryPath: ['vendor_policy_v3.txt', 'payment_rules.md', 'send_usdc'],
  memoryHash: 'mhash_2a3b4c5d6e7f8091',
  proposedAmount: 900,
  contaminationScore: 87,
  actionBlocked: true,
  fundsMoved: 0,
  recommendation: 'quarantine',
  infectedPath: ['vendor_policy_v3.txt', 'payment_rules.md', 'send_usdc'],
  detectorResults: ['hidden instruction contamination'],
};
