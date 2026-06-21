import type { ActionPreview, FlowResult, PolicyResult, ReceiptPreview, SuiActionObject } from '../types';

function makeRef(kind: string, sessionId: string) {
  return `${kind}_${sessionId}`;
}

export function createReceiptPreview(
  sessionId: string,
  intentLabel: string,
  preview: ActionPreview,
  policy: PolicyResult,
  action: SuiActionObject | null,
  executionMode: FlowResult['executionMode'],
): ReceiptPreview {
  const decision = policy.blocked ? 'blocked' : 'allow';
  const summary =
    decision === 'blocked'
      ? `Blocked before execution: ${policy.reasons[0] ?? 'policy rejected.'}`
      : executionMode === 'confirmed'
        ? `Confirmed preview for ${intentLabel}.`
        : `Preview created for ${intentLabel}.`;

  return {
    receiptId: makeRef('receipt', sessionId),
    status: executionMode,
    decision,
    summary,
    createdAt: new Date().toISOString(),
    fundsMoved: 0,
    evidenceRef: {
      kind: 'scan',
      ref: makeRef('evidence', sessionId),
      status: policy.blocked ? 'blocked' : 'boundary',
    },
    artifactRef: {
      kind: 'artifact',
      ref: action ? makeRef(action.kind, sessionId) : makeRef(preview.kind, sessionId),
      status: policy.blocked ? 'blocked' : 'preview',
    },
    sessionId,
    actionRef: action?.actionId ?? makeRef('action', sessionId),
  };
}
