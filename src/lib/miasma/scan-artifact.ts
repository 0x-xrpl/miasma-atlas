import type { MiasmaMemoryActionContext } from './memory-action-context';

export type MiasmaScanArtifact = {
  name: string;
  memoryPath: readonly string[];
  memoryHash: string;
  proposedAmount: number;
  contaminationScore: number;
  actionBlocked: boolean;
  fundsMoved: number;
  recommendation: 'quarantine' | 'allow';
  infectedPath: readonly string[];
  detectorResults: readonly string[];
};

export function scanArtifact(context: MiasmaMemoryActionContext): MiasmaScanArtifact {
  return {
    name: 'poisoned-memory',
    memoryPath: context.memoryPath,
    memoryHash: context.memoryHash,
    proposedAmount: context.proposedAmount,
    contaminationScore: 87,
    actionBlocked: true,
    fundsMoved: 0,
    recommendation: 'quarantine',
    infectedPath: ['vendor_policy_v3.txt', 'payment_rules.md', 'send_usdc'],
    detectorResults: ['hidden instruction contamination'],
  };
}
