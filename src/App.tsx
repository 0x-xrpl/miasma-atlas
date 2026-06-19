import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClientContext,
} from '@mysten/dapp-kit';
import {
  HEY_SUI_NAME,
  HEY_SUI_SCOPE,
  HEY_SUI_TAGLINE,
  LIVE_DEEPBOOK_BASE_TO_QUOTE_SLIPPAGE_BPS,
  buildLiveDeepBookSwapTransaction,
  LIVE_TESTNET_TRANSFER_LABEL,
  buildLiveTestnetTransferTransaction,
  buildSuiVisionTxUrl,
} from './sui';
import { runAgenticActionFlow, type FlowResult } from './core';
import { getHeySuiFlow, heySuiFlows, type HeySuiFlowId } from './lib/hey-sui/flows';

type Stage = 'idle' | 'listening' | 'intent_detected' | 'preview' | 'confirm' | 'executed' | 'blocked';

type ExecutionRecord = {
  digest: string;
  explorerUrl: string;
};

const STAGE_LABELS: Record<Stage, string> = {
  idle: 'Idle',
  listening: 'Listening',
  intent_detected: 'Intent detected',
  preview: 'Preview',
  confirm: 'Confirm',
  executed: 'Executed',
  blocked: 'Blocked',
};

function Panel({
  title,
  subtitle,
  className = '',
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div>
        <h2 className="panel-title">{title}</h2>
        {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function FlowSelector({
  activeFlowId,
  onSelect,
}: {
  activeFlowId: HeySuiFlowId;
  onSelect: (flowId: HeySuiFlowId) => void;
}) {
  return (
    <div className="flow-tabs" role="tablist" aria-label="Hey Sui flows">
      {heySuiFlows.map((flow) => (
        <button
          key={flow.id}
          type="button"
          className="flow-tab"
          aria-selected={flow.id === activeFlowId}
          onClick={() => onSelect(flow.id)}
        >
          {flow.tabLabel}
        </button>
      ))}
    </div>
  );
}

function FieldList({ fields }: { fields: readonly { label: string; value: string }[] }) {
  return (
    <div className="field-list">
      {fields.map((field) => (
        <div className="field-row" key={field.label}>
          <div className="field-label">{field.label}</div>
          <div className="field-value">{field.value}</div>
        </div>
      ))}
    </div>
  );
}

type SpeechRecognitionResultLike = {
  0: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function shortAddress(address: string) {
  if (address.length <= 12) {
    return address;
  }

  return `${address.slice(0, 8)}…${address.slice(-6)}`;
}

function shortDigest(digest: string) {
  if (digest.length <= 18) {
    return digest;
  }

  return `${digest.slice(0, 10)}…${digest.slice(-6)}`;
}

function flowToIntentFields(flow: FlowResult) {
  return [
    { label: 'Kind', value: flow.intent.kind },
    { label: 'Flow', value: flow.intent.flowId },
    { label: 'Confidence', value: `${Math.round(flow.intent.confidence * 100)}%` },
    { label: 'Normalized', value: flow.intent.normalizedIntent },
    { label: 'Reason', value: flow.intent.reason },
    { label: 'Clarification', value: flow.intent.needsClarification ? 'Needed' : 'Not needed' },
  ];
}

function flowToPreviewFields(flow: FlowResult) {
  const preview = flow.preview;
  if (preview.kind === 'transfer') {
    return [
      { label: 'Kind', value: preview.kind },
      { label: 'Token', value: preview.token },
      { label: 'Amount', value: String(preview.amount) },
      { label: 'Recipient', value: preview.recipient },
      { label: 'Mode', value: preview.executionMode },
      { label: 'Funds moved', value: String(preview.fundsMoved) },
    ];
  }
  if (preview.kind === 'deepbook_swap') {
    return [
      { label: 'Kind', value: preview.kind },
      { label: 'Venue', value: preview.venue },
      { label: 'Token in', value: preview.tokenIn },
      { label: 'Token out', value: preview.tokenOut },
      { label: 'Amount in', value: String(preview.amountIn) },
      { label: 'Estimated output', value: String(preview.estimatedOutput) },
      { label: 'Slippage bps', value: String(preview.slippageBps) },
      { label: 'Funds moved', value: String(preview.fundsMoved) },
    ];
  }
  return [
    { label: 'Kind', value: preview.kind },
    { label: 'Label', value: preview.label },
    { label: 'Mode', value: preview.executionMode },
    { label: 'Funds moved', value: String(preview.fundsMoved) },
  ];
}

function flowToPolicyFields(flow: FlowResult) {
  return [
    { label: 'Rule', value: flow.policy.ruleId },
    { label: 'Allowed', value: flow.policy.allowed ? 'Yes' : 'No' },
    { label: 'Blocked', value: flow.policy.blocked ? 'Yes' : 'No' },
    { label: 'Confirmation required', value: flow.policy.confirmationRequired ? 'Yes' : 'No' },
    { label: 'Summary', value: flow.policy.summary },
    { label: 'Reasons', value: flow.policy.reasons.join(' | ') || 'None' },
  ];
}

function flowToBoundaryFields(flow: FlowResult) {
  return Object.values(flow.boundaryStates).map((boundary) => ({
    label: boundary.name,
    value: `${boundary.state} — ${boundary.detail}`,
  }));
}

function flowToReceiptFields(flow: FlowResult) {
  return [
    { label: 'Receipt ID', value: flow.receipt.receiptId },
    { label: 'Status', value: flow.receipt.status },
    { label: 'Decision', value: flow.receipt.decision },
    { label: 'Summary', value: flow.receipt.summary },
    { label: 'Funds moved', value: String(flow.receipt.fundsMoved) },
    { label: 'Evidence ref', value: flow.receipt.evidenceRef.ref },
    { label: 'Artifact ref', value: flow.receipt.artifactRef.ref },
  ];
}

function nitroStatusFields() {
  return [
    { label: 'Status', value: 'TEE ATTESTATION GATE' },
    { label: 'State', value: 'PRODUCTION GATE FAILED' },
    { label: 'Detail', value: 'Nitro attestation document not configured' },
    { label: 'Command', value: 'npm run tee:verify' },
    { label: 'Fake attestation', value: 'Rejected' },
  ];
}

export default function App() {
  const [activeFlowId, setActiveFlowId] = useState<HeySuiFlowId>('transitTopUp');
  const [draft, setDraft] = useState(() => heySuiFlows[0].command);
  const [stage, setStage] = useState<Stage>('idle');
  const [statusMessage, setStatusMessage] = useState(HEY_SUI_TAGLINE);
  const [executionRecord, setExecutionRecord] = useState<ExecutionRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const currentAccount = useCurrentAccount();
  const { client, network } = useSuiClientContext();
  const { mutateAsync: signAndExecuteTransaction, isPending: isExecuting } =
    useSignAndExecuteTransaction();

  const coreFlow = useMemo(
    () =>
      runAgenticActionFlow(draft, {
        confirmed: stage === 'confirm' || stage === 'executed',
        source: 'voice',
      }),
    [draft, stage],
  );
  const activeFlow = getHeySuiFlow(activeFlowId);
  const speechRecognitionAvailable = Boolean(getSpeechRecognitionConstructor());
  const isDeepBookFlow = coreFlow.intent.kind === 'deepbook_swap';
  const selectedTabIsBlocked = activeFlowId === 'hiddenTransferBlock';
  const isLiveTransferFlow = coreFlow.intent.kind === 'transfer';
  const isPreviewOnlyFlow =
    coreFlow.intent.kind === 'transit' ||
    coreFlow.intent.kind === 'balance_check';
  const isBlockedFlow = coreFlow.policy.blocked;

  useEffect(() => {
    setDraft(activeFlow.command);
    setExecutionRecord(null);
    setErrorMessage('');
    setStage(selectedTabIsBlocked ? 'blocked' : 'idle');
    setStatusMessage(
      selectedTabIsBlocked
        ? 'Hidden transfer block selected. Funds moved: 0.'
        : isDeepBookFlow
          ? 'DeepBook config present. Preview then confirm to execute.'
        : HEY_SUI_TAGLINE,
    );
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, [activeFlow.command, isDeepBookFlow, selectedTabIsBlocked]);

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    },
    [],
  );

  const syncIntent = (nextDraft: string) => {
    setDraft(nextDraft);
    setStage('intent_detected');
    setStatusMessage('Intent detected.');
    setErrorMessage('');
    setExecutionRecord(null);
  };

  const startVoiceCapture = () => {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      textareaRef.current?.focus();
      setStage('idle');
      setStatusMessage('Voice input is unavailable here. Type privately instead.');
      return;
    }

    recognitionRef.current?.stop();

    const recognition = new SpeechRecognition();
    let capturedTranscript = '';

    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => {
      setStage('listening');
      setStatusMessage('Listening for a command.');
      setErrorMessage('');
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results, (result) => result[0].transcript)
        .filter(Boolean)
        .join(' ')
        .trim();

      if (transcript) {
        capturedTranscript = transcript;
        syncIntent(transcript);
      }
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setStage('idle');
      setStatusMessage('Voice input failed. Type privately instead.');
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      if (!capturedTranscript) {
        setStage('idle');
        setStatusMessage('Voice capture ended.');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const previewIntent = () => {
    setStage('preview');
    setStatusMessage('Previewing the action session.');
    setErrorMessage('');
    setExecutionRecord(null);
  };

  const confirmIntent = () => {
    setStage('confirm');
    setStatusMessage('Action session confirmed.');
    setErrorMessage('');
    setExecutionRecord(null);
  };

  const primaryActionLabel = isBlockedFlow
    ? 'Block request'
    : isPreviewOnlyFlow
      ? 'Preview only'
      : stage === 'executed'
        ? 'Executed'
        : 'Execute on Sui';

  const primaryActionDisabled =
    isExecuting ||
    ((isLiveTransferFlow || isDeepBookFlow) && stage !== 'confirm') ||
    isPreviewOnlyFlow;

  const runPrimaryAction = async () => {
    if (isDeepBookFlow && stage !== 'confirm') {
      setStage('preview');
      setStatusMessage('Preview DeepBook only. Confirm to execute.');
      return;
    }

    if (isDeepBookFlow) {
      if (!currentAccount) {
        setStage('confirm');
        setStatusMessage('Connect a wallet to execute the DeepBook transaction.');
        return;
      }

      if (network !== 'testnet') {
        setStage('confirm');
        setStatusMessage('Switch the wallet network to testnet to execute the DeepBook transaction.');
        setErrorMessage(`Current network: ${String(network)}.`);
        return;
      }

      try {
        setStage('confirm');
        setStatusMessage('DeepBook config present. Building transaction.');
        setErrorMessage('');

        const deepbookPreview = coreFlow.preview.kind === 'deepbook_swap' ? coreFlow.preview : null;
        if (!deepbookPreview) {
          throw new Error('PRODUCTION GATE FAILED: DeepBook config missing.');
        }

        const transaction = buildLiveDeepBookSwapTransaction({
          client,
          senderAddress: currentAccount.address,
          amountIn: deepbookPreview.amountIn,
          estimatedOutput: deepbookPreview.estimatedOutput,
          network: network as 'mainnet' | 'testnet' | 'devnet',
          slippageBps: deepbookPreview.slippageBps || LIVE_DEEPBOOK_BASE_TO_QUOTE_SLIPPAGE_BPS,
        });
        setStatusMessage('DeepBook transaction built. Wallet signature requested.');

        const result = await signAndExecuteTransaction({ transaction });
        const digest = result.digest;
        const explorerUrl = buildSuiVisionTxUrl(
          digest,
          network as 'mainnet' | 'testnet' | 'devnet',
        );

        setExecutionRecord({ digest, explorerUrl });
        setStage('executed');
        setStatusMessage(`Executed on Sui testnet. Digest: ${shortDigest(digest)}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Execution failed.';
        const deepBookConfigFailure = /config missing|resource not found|pool/i.test(message);
        const failureMessage =
          message.includes('PRODUCTION GATE FAILED') || deepBookConfigFailure
            ? 'PRODUCTION GATE FAILED: DeepBook config missing.'
            : 'DeepBook execution failed.';
        setErrorMessage(failureMessage);
        setStage('confirm');
        setStatusMessage(failureMessage);
      }
      return;
    }

    if (isPreviewOnlyFlow) {
      setStage('preview');
      setStatusMessage('Preview only — no funds move.');
      return;
    }

    if (isBlockedFlow) {
      setStage('blocked');
      setStatusMessage(`${coreFlow.policy.summary} Funds moved: 0.`);
      return;
    }

    if (!currentAccount) {
      setStage('confirm');
      setStatusMessage('Connect a wallet to execute the testnet transfer.');
      return;
    }

    if (network !== 'testnet') {
      setStage('confirm');
      setStatusMessage('Switch the wallet network to testnet to execute the live transfer.');
      setErrorMessage(`Current network: ${String(network)}.`);
      return;
    }

    try {
      setStage('confirm');
      setStatusMessage(`Submitting ${LIVE_TESTNET_TRANSFER_LABEL} testnet transfer.`);
      setErrorMessage('');

      const transaction = buildLiveTestnetTransferTransaction(currentAccount.address);
      const result = await signAndExecuteTransaction({ transaction });
      const digest = result.digest;
      const explorerUrl = buildSuiVisionTxUrl(
        digest,
        network as 'mainnet' | 'testnet' | 'devnet',
      );

      setExecutionRecord({ digest, explorerUrl });
      setStage('executed');
      setStatusMessage(`Executed on Sui testnet. Digest: ${shortDigest(digest)}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Execution failed.';
      setErrorMessage(message);
      setStage('confirm');
      setStatusMessage('Execution failed.');
    }
  };

  const sessionFields = [
    { label: 'Session type', value: 'Sui Action Session' },
    { label: 'Status', value: coreFlow.executionMode },
    { label: 'Proposed amount', value: coreFlow.preview.kind === 'transfer' ? `${coreFlow.preview.amount} ${coreFlow.preview.token}` : '0' },
    { label: 'Funds moved', value: String(coreFlow.fundsMoved) },
  ];

  const verifierNote = isBlockedFlow
    ? `Blocked. Funds moved: ${coreFlow.fundsMoved}.`
    : isLiveTransferFlow && stage === 'executed'
      ? `Testnet transfer complete.`
      : `Funds moved: 0 before confirmation.`;

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-kicker">{HEY_SUI_NAME}</div>
        <h1>{HEY_SUI_TAGLINE}</h1>
        <p>{HEY_SUI_SCOPE}</p>
        <div className="hero-meta">
          <span className="status-pill">Stage: {STAGE_LABELS[stage]}</span>
          <span className="status-pill">Network: {String(network)}</span>
          <span className="status-pill">{verifierNote}</span>
          <ConnectButton connectText="Connect wallet" />
        </div>
      </header>

      <FlowSelector activeFlowId={activeFlowId} onSelect={setActiveFlowId} />

      <section className="wireframe-grid" aria-label="Hey Sui flow wireframe">
        <Panel title="Input" subtitle="Say it or type it." className="input-panel">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => syncIntent(event.target.value)}
            rows={6}
            aria-label="Command input"
            style={{
              width: '100%',
              resize: 'vertical',
              borderRadius: '16px',
              border: '1px solid var(--line)',
              padding: '14px',
              background: 'var(--panel-alt)',
              color: 'var(--text)',
              lineHeight: 1.5,
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button type="button" className="flow-tab" onClick={startVoiceCapture} disabled={isExecuting}>
              Say it
            </button>
            <button
              type="button"
              className="flow-tab"
              onClick={() => {
                textareaRef.current?.focus();
                setStage('idle');
                setStatusMessage('Type privately below.');
              }}
            >
              Type privately
            </button>
            <button type="button" className="flow-tab" onClick={previewIntent}>
              Preview it
            </button>
            <button type="button" className="flow-tab" onClick={confirmIntent}>
              Confirm it
            </button>
            <button type="button" className="flow-tab" onClick={runPrimaryAction} disabled={primaryActionDisabled}>
              {primaryActionLabel}
            </button>
          </div>

          <FieldList fields={flowToIntentFields(coreFlow)} />

          <p className="panel-note">{statusMessage}</p>
          {speechRecognitionAvailable ? (
            <p className="panel-note">Voice input uses the browser SpeechRecognition API when available.</p>
          ) : (
            <p className="panel-note">Voice input is unavailable in this browser, so the type-private path stays active.</p>
          )}
          {errorMessage ? <p className="panel-note">{errorMessage}</p> : null}
        </Panel>

        <Panel title="AI Reads" subtitle="What the agent is proposing.">
          <FieldList fields={flowToPreviewFields(coreFlow)} />
        </Panel>

        <Panel title="Action Session Verifier" subtitle="Internal verifier path.">
          <FieldList fields={flowToPolicyFields(coreFlow)} />
          <FieldList fields={flowToBoundaryFields(coreFlow)} />
          <p className="panel-note">
            The core reads before value moves. DeepBook is live on testnet when the wallet is
            confirmed. Transit stays a boundary.
          </p>
        </Panel>

        <Panel title="Nitro / TEE" subtitle="Attestation gate.">
          <FieldList fields={nitroStatusFields()} />
          <p className="panel-note">
            Capture and verification are implemented. The gate only turns verified when a real
            Nitro attestation document and expected PCRs are supplied.
          </p>
        </Panel>

        <Panel title="Sui Action Session" subtitle="The public session record.">
          <div className="session-emphasis">
            <div className="status-pill">{coreFlow.executionMode}</div>
            <div className="session-value">
              {isLiveTransferFlow && stage === 'executed'
                ? `Transferred ${LIVE_TESTNET_TRANSFER_LABEL} on testnet`
                : `Funds moved: ${coreFlow.fundsMoved}`}
            </div>
          </div>
          <FieldList fields={sessionFields} />
          <FieldList fields={flowToReceiptFields(coreFlow)} />
          {executionRecord ? (
            <div className="field-list">
              <div className="field-row">
                <div className="field-label">Transaction digest</div>
                <div className="field-value">{shortDigest(executionRecord.digest)}</div>
              </div>
              <a className="status-pill" href={executionRecord.explorerUrl} target="_blank" rel="noreferrer">
                Open explorer
              </a>
            </div>
          ) : null}
        </Panel>
      </section>
    </main>
  );
}
