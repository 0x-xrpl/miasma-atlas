const HIDDEN_TRANSFER_PATH = 'vendor_policy_v3.txt -> payment_rules.md -> send_usdc';

export type HeySuiFlowId = 'transitTopUp' | 'deepBookTrade' | 'hiddenTransferBlock';

export type HeySuiField = {
  label: string;
  value: string;
};

export type HeySuiFlow = {
  id: HeySuiFlowId;
  tabLabel: string;
  command: string;
  readFields: readonly HeySuiField[];
  verifyFields: readonly HeySuiField[];
  sessionStatus: string;
  sessionFields: readonly HeySuiField[];
};

export const heySuiFlows: readonly HeySuiFlow[] = [
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
      { label: 'Path check', value: HIDDEN_TRANSFER_PATH },
      { label: 'Policy check', value: 'Policy violation detected' },
      { label: 'Hidden transfer check', value: 'hidden instruction contamination' },
      { label: 'Decision', value: 'Blocked' },
    ],
    sessionStatus: 'Action session blocked',
    sessionFields: [
      { label: 'Session type', value: 'Sui Action Session' },
      { label: 'Status', value: 'Blocked' },
      { label: 'Proposed amount', value: '900 USDC' },
      { label: 'Funds moved', value: '0' },
    ],
  },
];

export function getHeySuiFlow(flowId: HeySuiFlowId) {
  return heySuiFlows.find((flow) => flow.id === flowId) ?? heySuiFlows[0];
}
