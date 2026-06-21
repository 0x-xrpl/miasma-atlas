import type {
  ActionPreview,
  ParsedIntent,
  SuiActionObject,
} from '../types';

export function mapIntentToSuiAction(
  intent: ParsedIntent,
  preview: ActionPreview,
  network: 'mainnet' | 'testnet' | 'devnet' = 'testnet',
): SuiActionObject | null {
  if (intent.kind === 'unknown') {
    return null;
  }

  const actionId = `action_${Date.now().toString(36)}`;

  if (preview.kind === 'transfer') {
    return {
      actionId,
      kind: 'transfer',
      executionMode: preview.executionMode,
      fundsMoved: 0,
      requiresWalletSignature: true,
      summary: `Transfer ${preview.amount} ${preview.token} to ${preview.recipient}`,
      token: preview.token,
      amount: preview.amount,
      recipient: preview.recipient,
      network,
    };
  }

  if (preview.kind === 'deepbook_swap') {
    return {
      actionId,
      kind: 'deepbook_swap',
      executionMode: preview.executionMode,
      fundsMoved: 0,
      requiresWalletSignature: false,
      summary: `DeepBook swap ${preview.amountIn} ${preview.tokenIn} -> ${preview.tokenOut}`,
      tokenIn: preview.tokenIn,
      tokenOut: preview.tokenOut,
      amountIn: preview.amountIn,
      estimatedOutput: preview.estimatedOutput,
      priceImpact: preview.priceImpact,
      slippageBps: preview.slippageBps,
      venue: preview.venue,
      network,
    };
  }

  if (preview.kind === 'transit') {
    return {
      actionId,
      kind: 'transit',
      executionMode: preview.executionMode,
      fundsMoved: 0,
      requiresWalletSignature: false,
      summary: 'Transit top-up preview',
      network,
    };
  }

  if (preview.kind === 'balance_check') {
    return {
      actionId,
      kind: 'balance_check',
      executionMode: preview.executionMode,
      fundsMoved: 0,
      requiresWalletSignature: false,
      summary: 'Balance check preview',
      network,
    };
  }

  return {
    actionId,
    kind: 'unknown',
    executionMode: preview.executionMode,
    fundsMoved: 0,
    requiresWalletSignature: false,
    summary: 'Unknown action preview',
    network,
  };
}
