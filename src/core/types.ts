export type ActionKind =
  | 'transfer'
  | 'deepbook_swap'
  | 'transit'
  | 'balance_check'
  | 'unknown';

export type ExecutionMode = 'preview' | 'confirmed' | 'blocked';

export type BoundaryState = 'implemented' | 'preview' | 'boundary' | 'blocked' | 'unavailable';

export type ParsedIntent = {
  input: string;
  kind: ActionKind;
  flowId: ActionKind | 'block';
  confidence: number;
  normalizedIntent: string;
  reason: string;
  slots: Record<string, string>;
  missingSlots: string[];
  needsClarification: boolean;
  language: 'en' | 'ja' | 'mixed' | 'unknown';
};

export type TransferPreview = {
  kind: 'transfer';
  token: string;
  amount: number;
  recipient: string;
  executionMode: ExecutionMode;
  requiresWalletSignature: true;
  fundsMoved: 0;
};

export type DeepBookPreview = {
  kind: 'deepbook_swap';
  venue: 'DeepBook';
  tokenIn: string;
  tokenOut: string;
  amountIn: number;
  estimatedOutput: number;
  priceImpact: number;
  slippageBps: number;
  executionMode: ExecutionMode;
  fundsMoved: 0;
};

export type TransitPreview = {
  kind: 'transit';
  executionMode: ExecutionMode;
  fundsMoved: 0;
  label: string;
};

export type BalanceCheckPreview = {
  kind: 'balance_check';
  executionMode: ExecutionMode;
  fundsMoved: 0;
  label: string;
};

export type UnknownPreview = {
  kind: 'unknown';
  executionMode: ExecutionMode;
  fundsMoved: 0;
  label: string;
};

export type ActionPreview =
  | TransferPreview
  | DeepBookPreview
  | TransitPreview
  | BalanceCheckPreview
  | UnknownPreview;

export type PolicyResult = {
  ruleId: string;
  allowed: boolean;
  blocked: boolean;
  requiresConfirmation: boolean;
  reasons: string[];
  summary: string;
};

export type AgenticActionSession = {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  status: ExecutionMode;
  intent: ParsedIntent;
  preview: ActionPreview | null;
};

export type SuiActionObject = {
  actionId: string;
  kind: ActionKind;
  executionMode: ExecutionMode;
  fundsMoved: 0;
  requiresWalletSignature: boolean;
  summary: string;
  token?: string;
  amount?: number;
  recipient?: string;
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: number;
  estimatedOutput?: number;
  priceImpact?: number;
  slippageBps?: number;
  venue?: string;
  network?: 'mainnet' | 'testnet' | 'devnet';
};

export type EvidenceRef = {
  kind: 'memory' | 'scan' | 'artifact' | 'receipt' | 'proof';
  ref: string;
  status: BoundaryState;
};

export type ReceiptPreview = {
  receiptId: string;
  status: ExecutionMode;
  decision: 'allow' | 'blocked';
  summary: string;
  createdAt: string;
  fundsMoved: 0;
  evidenceRef: EvidenceRef;
  artifactRef: EvidenceRef;
  sessionId: string;
  actionRef: string;
};

export type BoundaryStatus = {
  name: string;
  state: BoundaryState;
  detail: string;
  available: boolean;
};

export type FlowResult = {
  sessionId: string;
  intent: ParsedIntent;
  preview: ActionPreview;
  policy: PolicyResult;
  receipt: ReceiptPreview;
  executionMode: ExecutionMode;
  fundsMoved: 0;
  boundaryStates: Record<string, BoundaryStatus>;
  action: SuiActionObject | null;
};
