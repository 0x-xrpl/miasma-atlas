import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  LIVE_TESTNET_TRANSFER_LABEL,
  buildLiveTestnetTransferTransaction,
  buildSuiVisionTxUrl,
} from './sui';
import { getHeySuiFlow, heySuiFlows, type HeySuiFlowId } from './lib/hey-sui/flows';
import { sampleScanArtifact } from './lib/miasma/sample-scan-artifact';

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

function detectFlowId(command: string): HeySuiFlowId {
  const normalized = command.toLowerCase();
  if (normalized.includes('deepbook') || normalized.includes('sui falls')) {
    return 'deepBookTrade';
  }

  if (normalized.includes('hidden transfer') || normalized.includes('recipient mismatch')) {
    return 'hiddenTransferBlock';
  }

  return 'transitTopUp';
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
  const { network } = useSuiClientContext();
  const { mutateAsync: signAndExecuteTransaction, isPending: isExecuting } =
    useSignAndExecuteTransaction();

  const activeFlow = getHeySuiFlow(activeFlowId);
  const speechRecognitionAvailable = Boolean(getSpeechRecognitionConstructor());
  const isLiveTransferFlow = activeFlowId === 'transitTopUp';
  const isPreviewOnlyFlow = activeFlowId === 'deepBookTrade';
  const isBlockedFlow = activeFlowId === 'hiddenTransferBlock';

  useEffect(() => {
    setDraft(activeFlow.command);
    setExecutionRecord(null);
    setErrorMessage('');
    setStage(isBlockedFlow ? 'blocked' : 'idle');
    setStatusMessage(
      isBlockedFlow
        ? 'Hidden transfer block selected. Funds moved: 0.'
        : HEY_SUI_TAGLINE,
    );
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, [activeFlow.command, isBlockedFlow]);

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    },
    [],
  );

  const syncIntent = (nextDraft: string) => {
    setDraft(nextDraft);
    setActiveFlowId(detectFlowId(nextDraft));
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
    setActiveFlowId(detectFlowId(draft));
    setStage('preview');
    setStatusMessage('Previewing the action session.');
    setErrorMessage('');
    setExecutionRecord(null);
  };

  const confirmIntent = () => {
    setActiveFlowId(detectFlowId(draft));
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
    isExecuting || (isLiveTransferFlow && stage !== 'confirm') || isPreviewOnlyFlow;

  const runPrimaryAction = async () => {
    setActiveFlowId(detectFlowId(draft));

    if (isPreviewOnlyFlow) {
      setStage('preview');
      setStatusMessage('DeepBook remains preview only in this pass.');
      return;
    }

    if (isBlockedFlow) {
      setStage('blocked');
      setStatusMessage('Hidden transfer blocked before execution. Funds moved: 0.');
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

  const sessionFields =
    activeFlowId === 'transitTopUp' && stage === 'executed'
      ? [
          { label: 'Session type', value: 'Sui Action Session' },
          { label: 'Status', value: 'Executed on testnet' },
          { label: 'Proposed amount', value: '10 USDC' },
          { label: 'Testnet transfer', value: LIVE_TESTNET_TRANSFER_LABEL },
        ]
      : activeFlow.sessionFields;

  const verifierNote = isBlockedFlow
    ? `Funds moved: ${sampleScanArtifact.fundsMoved}.`
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

          <p className="panel-note">{statusMessage}</p>
          {speechRecognitionAvailable ? (
            <p className="panel-note">Voice input uses the browser SpeechRecognition API when available.</p>
          ) : (
            <p className="panel-note">Voice input is unavailable in this browser, so the type-private path stays active.</p>
          )}
          {errorMessage ? <p className="panel-note">{errorMessage}</p> : null}
        </Panel>

        <Panel title="AI Reads" subtitle="What the agent is proposing.">
          <FieldList fields={activeFlow.readFields} />
        </Panel>

        <Panel title="Action Session Verifier" subtitle="Internal verifier path.">
          <FieldList fields={activeFlow.verifyFields} />
          <p className="panel-note">
            The verifier reads before value moves. DeepBook stays preview only. Transit stays a
            demo boundary.
          </p>
        </Panel>

        <Panel title="Sui Action Session" subtitle="The public session record.">
          <div className="session-emphasis">
            <div className="status-pill">{activeFlow.sessionStatus}</div>
            <div className="session-value">
              {isLiveTransferFlow && stage === 'executed'
                ? `Transferred ${LIVE_TESTNET_TRANSFER_LABEL} on testnet`
                : 'Funds moved: 0'}
            </div>
          </div>
          <FieldList fields={sessionFields} />
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
