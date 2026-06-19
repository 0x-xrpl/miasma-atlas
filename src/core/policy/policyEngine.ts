import type { ActionPreview, BoundaryStatus, ParsedIntent, PolicyResult } from '../types';

type EvaluatePolicyOptions = {
  confirmed?: boolean;
  boundaryStates?: Record<string, BoundaryStatus>;
};

function hasBlockedBoundary(boundaryStates: Record<string, BoundaryStatus> | undefined) {
  return Object.values(boundaryStates ?? {}).some((boundary) => boundary.state === 'blocked');
}

export function evaluatePolicy(
  intent: ParsedIntent,
  preview: ActionPreview,
  options: EvaluatePolicyOptions = {},
): PolicyResult {
  const reasons: string[] = [];

  if (hasBlockedBoundary(options.boundaryStates)) {
    reasons.push('Context contamination detected.');
  }

  if (intent.kind === 'unknown') {
    reasons.push('Unknown intent.');
  }

  if (preview.kind === 'transfer') {
    if (!intent.slots.amount || Number.parseFloat(intent.slots.amount) <= 0) {
      reasons.push('Invalid amount.');
    }
    if (!intent.slots.token) {
      reasons.push('Missing token.');
    }
    if (!intent.slots.recipient) {
      reasons.push('Missing recipient.');
    }
    if (/suspicious|怪しい|不正|危ない/i.test(intent.slots.recipient ?? '')) {
      reasons.push('Suspicious recipient.');
    }
  }

  if (preview.kind === 'deepbook_swap' && Number.parseFloat(intent.slots.amountIn ?? '0') <= 0) {
    reasons.push('Invalid amount.');
  }

  if (preview.kind === 'unknown') {
    reasons.push('Unsupported action kind.');
  }

  if (intent.needsClarification && intent.kind !== 'balance_check') {
    reasons.push('Clarification required.');
  }

  const blocked = reasons.length > 0;
  const requiresConfirmation = !blocked && preview.kind !== 'balance_check' && options.confirmed !== true;

  if (options.confirmed !== true && !blocked && preview.kind !== 'balance_check') {
    reasons.push('Missing explicit confirmation for execution.');
  }

  return {
    ruleId: blocked ? 'policy_block_v1' : 'policy_preview_v1',
    allowed: !blocked,
    blocked,
    requiresConfirmation,
    reasons,
    summary: blocked
      ? reasons[0] ?? 'Blocked.'
      : requiresConfirmation
        ? 'Preview created; confirmation still required.'
        : 'Policy passed.',
  };
}
