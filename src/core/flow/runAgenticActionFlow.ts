import { createDeepBookPreview } from '../actions/deepbookPreview';
import { createTransitPreview } from '../actions/transitPreview';
import { createTransferPreview } from '../actions/transferPreview';
import { mapIntentToSuiAction } from '../actions/suiActionMapper';
import { getBoundaryStatus } from '../boundaries/getBoundaryStatus';
import { createSession } from '../session/createSession';
import { parseIntent } from '../intent/parseIntent';
import { createReceiptPreview } from '../receipt/createReceiptPreview';
import { evaluatePolicy } from '../policy/policyEngine';
import type {
  ActionPreview,
  BoundaryState,
  BoundaryStatus,
  FlowResult,
  ParsedIntent,
} from '../types';

export type RunAgenticActionFlowOptions = {
  sessionId?: string;
  confirmed?: boolean;
  source?: 'voice' | 'type' | 'api';
  locale?: string;
  demoRecipientAddress?: string;
  boundaryStates?: Partial<Record<string, BoundaryState>>;
};

function buildBoundaryStates(overrides?: Partial<Record<string, BoundaryState>>): Record<string, BoundaryStatus> {
  return {
    voiceBoundary: getBoundaryStatus('voiceBoundary', overrides?.voiceBoundary),
    localAiBoundary: getBoundaryStatus('localAiBoundary', overrides?.localAiBoundary),
    contextBoundary: getBoundaryStatus('contextBoundary', overrides?.contextBoundary),
    verificationBoundary: getBoundaryStatus('verificationBoundary', overrides?.verificationBoundary),
    evidenceBoundary: getBoundaryStatus('evidenceBoundary', overrides?.evidenceBoundary),
    identityBoundary: getBoundaryStatus('identityBoundary', overrides?.identityBoundary),
    sponsoredTxBoundary: getBoundaryStatus('sponsoredTxBoundary', overrides?.sponsoredTxBoundary),
    proofBoundary: getBoundaryStatus('proofBoundary', overrides?.proofBoundary),
  };
}

function createPreview(intent: ParsedIntent, confirmed: boolean): ActionPreview {
  const executionMode = confirmed ? 'confirmed' : 'preview';
  if (intent.kind === 'transfer') {
    return createTransferPreview(intent, executionMode);
  }
  if (intent.kind === 'deepbook_swap') {
    return createDeepBookPreview(intent, executionMode);
  }
  if (intent.kind === 'transit') {
    return createTransitPreview(intent, executionMode);
  }
  if (intent.kind === 'balance_check') {
    return {
      kind: 'balance_check',
      executionMode,
      fundsMoved: 0,
      label: 'Balance check',
    };
  }
  return {
    kind: 'unknown',
    executionMode: 'blocked',
    fundsMoved: 0,
    label: 'Unknown action',
  };
}

export function runAgenticActionFlow(
  input: string,
  options: RunAgenticActionFlowOptions = {},
): FlowResult {
  const intent = parseIntent(input, {
    demoRecipientAddress: options.demoRecipientAddress,
    locale: options.locale,
  });
  const boundaryStates = buildBoundaryStates(options.boundaryStates);
  const preview = createPreview(intent, options.confirmed === true);
  const policy = evaluatePolicy(intent, preview, {
    confirmed: options.confirmed,
    boundaryStates,
  });

  const session = createSession(intent, options.sessionId);

  const executionMode: FlowResult['executionMode'] = policy.blocked
    ? 'blocked'
    : options.confirmed
      ? 'confirmed'
      : 'preview';

  const action =
    policy.blocked || intent.kind === 'unknown'
      ? null
      : mapIntentToSuiAction(intent, preview, 'testnet');

  const receipt = createReceiptPreview(
    session.sessionId,
    intent.normalizedIntent,
    preview,
    policy,
    action,
    executionMode,
  );

  return {
    sessionId: session.sessionId,
    intent,
    preview,
    policy,
    receipt,
    executionMode,
    fundsMoved: 0,
    boundaryStates,
    action,
  };
}
