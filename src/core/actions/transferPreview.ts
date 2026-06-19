import type { ParsedIntent, TransferPreview } from '../types';

export function createTransferPreview(intent: ParsedIntent, executionMode: TransferPreview['executionMode']): TransferPreview {
  return {
    kind: 'transfer',
    token: intent.slots.token ?? 'SUI',
    amount: Number.parseFloat(intent.slots.amount ?? '0'),
    recipient: intent.slots.recipient ?? 'recipient',
    executionMode,
    requiresWalletSignature: true,
    fundsMoved: 0,
  };
}
