export type MiasmaMemoryActionContext = {
  agent: string;
  skillId: string;
  amountLabel: string;
  proposedAmount: number;
  intent: string;
  asset: string;
  recipient: string;
  memoryPath: readonly string[];
  memoryHash: string;
};

export const demoMemoryActionContext: MiasmaMemoryActionContext = {
  agent: 'Agent wants to pay 900 USDC',
  skillId: 'send_usdc',
  amountLabel: '900 USDC',
  proposedAmount: 900,
  intent: 'Pay vendor',
  asset: 'USDC',
  recipient: 'vendor',
  memoryPath: ['vendor_policy_v3.txt', 'payment_rules.md', 'send_usdc'],
  memoryHash: 'mhash_0f7e3c1b8a9d2e4f',
};

export function formatMemoryPath(memoryPath: readonly string[]) {
  return memoryPath.join(' -> ');
}
