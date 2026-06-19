import { sampleScanArtifact } from './sample-scan-artifact';

export type MiasmaFlowId = 'transitTopUp' | 'deepBookTrade' | 'hiddenTransferBlock';

export type MiasmaField = {
  label: string;
  value: string;
};

export type MiasmaFlow = {
  id: MiasmaFlowId;
  tabLabel: string;
  command: string;
  readFields: readonly MiasmaField[];
  verifyFields: readonly MiasmaField[];
  sessionStatus: string;
  sessionFields: readonly MiasmaField[];
};

export const miasmaFlows: readonly MiasmaFlow[] = [
  {
    id: 'transitTopUp',
    tabLabel: 'Top up',
    command: 'Top up my transit pass. Max 10 USDC.',
    readFields: [
      { label: 'Action', value: 'Transit top-up' },
      { label: 'Amount / limit', value: '10 USDC max' },
      { label: 'Recipient / venue', value: 'Transit provider' },
      { label: 'Policy', value: 'Top-up policy' },
    ],
    verifyFields: [
      { label: 'Path check', value: 'Path verified' },
      { label: 'Policy check', value: 'Policy verified' },
      { label: 'Hidden transfer check', value: 'No hidden transfer' },
      { label: 'Decision', value: 'Allow' },
    ],
    sessionStatus: 'Action session created',
    sessionFields: [
      { label: 'Session type', value: 'Sui Action Session' },
      { label: 'Status', value: 'Created' },
      { label: 'Proposed amount', value: '10 USDC' },
      { label: 'Funds moved', value: '0' },
    ],
  },
  {
    id: 'deepBookTrade',
    tabLabel: 'Trade',
    command: 'If SUI falls to 0.80, buy 100 USDC on DeepBook. Stop at 0.74. Take profit at 0.90. Max slippage 0.5%.',
    readFields: [
      { label: 'Action', value: 'DeepBook trade' },
      { label: 'Amount / limit', value: '100 USDC buy' },
      { label: 'Recipient / venue', value: 'DeepBook' },
      { label: 'Policy', value: 'Stop at 0.74 / take profit at 0.90 / max slippage 0.5%' },
    ],
    verifyFields: [
      { label: 'Path check', value: 'Path verified' },
      { label: 'Policy check', value: 'Policy verified' },
      { label: 'Hidden transfer check', value: 'No hidden transfer' },
      { label: 'Decision', value: 'Allow' },
    ],
    sessionStatus: 'Action session created',
    sessionFields: [
      { label: 'Session type', value: 'Sui Action Session' },
      { label: 'Status', value: 'Created' },
      { label: 'Proposed amount', value: '100 USDC' },
      { label: 'Funds moved', value: '0' },
    ],
  },
  {
    id: 'hiddenTransferBlock',
    tabLabel: 'Block',
    command: 'Visible request: top up 10 USDC. Hidden transfer: 900 USDC. Recipient mismatch detected. Policy violation detected.',
    readFields: [
      { label: 'Action', value: 'Hidden transfer block' },
      { label: 'Amount / limit', value: 'Visible 10 USDC / hidden 900 USDC' },
      { label: 'Recipient / venue', value: 'Recipient mismatch' },
      { label: 'Policy', value: 'Policy violation detected' },
    ],
    verifyFields: [
      { label: 'Path check', value: sampleScanArtifact.memoryPath.join(' -> ') },
      { label: 'Policy check', value: 'Policy violation detected' },
      { label: 'Hidden transfer check', value: sampleScanArtifact.detectorResults[0] },
      { label: 'Decision', value: 'Blocked' },
    ],
    sessionStatus: 'Action session blocked',
    sessionFields: [
      { label: 'Session type', value: 'Sui Action Session' },
      { label: 'Status', value: 'Blocked' },
      { label: 'Proposed amount', value: `${sampleScanArtifact.proposedAmount} USDC` },
      { label: 'Funds moved', value: `${sampleScanArtifact.fundsMoved}` },
    ],
  },
];

export function getMiasmaFlow(flowId: MiasmaFlowId) {
  return miasmaFlows.find((flow) => flow.id === flowId) ?? miasmaFlows[0];
}

export type HeySuiFlowId = MiasmaFlowId;
export type HeySuiField = MiasmaField;
export type HeySuiFlow = MiasmaFlow;

export const heySuiFlows = miasmaFlows;

export function getHeySuiFlow(flowId: HeySuiFlowId) {
  return getMiasmaFlow(flowId);
}
