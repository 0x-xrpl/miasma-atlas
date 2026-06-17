export type ShadowExecutionStatus = 'simulated' | 'blocked' | 'not_run';
export type ShadowExecutionResult = {
  proposedAction: string;
  simulationStatus: ShadowExecutionStatus;
  realExecutionStatus: 'blocked' | 'not_executed' | 'completed';
  fundsMoved: 0;
  decision: 'blocked' | 'allow';
  reason: string;
};

export function shadowExecute(proposedAction: string, decision: 'blocked' | 'allow', reason: string): ShadowExecutionResult {
  return {
    proposedAction,
    simulationStatus: 'simulated',
    realExecutionStatus: decision === 'blocked' ? 'blocked' : 'not_executed',
    fundsMoved: 0,
    decision,
    reason,
  };
}
