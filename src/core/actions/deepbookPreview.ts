import type { DeepBookPreview, ParsedIntent } from '../types';

export function createDeepBookPreview(
  intent: ParsedIntent,
  executionMode: DeepBookPreview['executionMode'],
): DeepBookPreview {
  const amountIn = Number.parseFloat(intent.slots.amountIn ?? intent.slots.amount ?? '5');
  return {
    kind: 'deepbook_swap',
    venue: 'DeepBook',
    tokenIn: intent.slots.tokenIn ?? 'SUI',
    tokenOut: intent.slots.tokenOut ?? 'USDC',
    amountIn,
    estimatedOutput: Number((amountIn * 0.98).toFixed(2)),
    priceImpact: 0.12,
    slippageBps: Number.parseFloat(intent.slots.slippageBps ?? '50'),
    executionMode,
    fundsMoved: 0,
  };
}
