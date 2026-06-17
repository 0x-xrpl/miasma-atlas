import { MIASMA_ATLAS_NAME } from './sui';
import { sampleScanArtifact } from './lib/miasma/sample-scan-artifact';
import { sampleQuarantineReceipt } from './lib/miasma/sample-quarantine-receipt';
import { sampleEvidencePath } from './lib/miasma/sample-evidence-path';
import { sampleQuarantineProof } from './lib/miasma/sample-quarantine-proof';
import { sampleAgentRuntime } from './lib/miasma/sample-agent-runtime';

const artifact = sampleScanArtifact;
const receipt = sampleQuarantineReceipt;

const verifiedPath = [
  'Memory hash',
  'Rust verifier',
  'Nitro enclave verifier',
  'Seal locked evidence',
  'Walrus artifact ref',
  'Groth16 quarantine proof',
  'Sui QuarantineReceipt',
] as const;

const verifierStates = [
  { label: 'Memory hash', state: 'Live', tone: 'live', copy: 'Verified before execution begins.' },
  { label: 'Rust verifier', state: 'Local', tone: 'local', copy: 'Current local scan artifact path.' },
  { label: 'Nitro enclave verifier', state: 'Target', tone: 'pending', copy: 'Scaffolded isolated execution target for the same verifier boundary.' },
  { label: 'Seal locked evidence', state: 'Locked', tone: 'scaffolded', copy: 'Sensitive evidence is sealed and raw memory stays hidden.' },
  { label: 'Walrus artifact ref', state: 'Scaffolded', tone: 'pending', copy: 'Public artifact reference only; no raw memory on-chain.' },
  { label: 'Groth16 quarantine proof', state: 'Pending', tone: 'pending', copy: 'Proof layer remains scaffolded only.' },
  { label: 'Sui QuarantineReceipt', state: 'Scaffolded', tone: 'scaffolded', copy: 'Receipt contract path reserved for later integration.' },
] as const;

function ArtifactField({ label, value }: { label: string; value: string }) {
  return (
    <div className="miasma-metric">
      <div className="miasma-metric-label">{label}</div>
      <div className="miasma-metric-value">
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function StepCard({
  label,
  state,
  tone,
  copy,
}: {
  label: string;
  state: string;
  tone: string;
  copy: string;
}) {
  return (
    <div className="miasma-step">
      <div className={`miasma-step-status ${tone}`}>{state}</div>
      <p className="miasma-step-title">{label}</p>
      <p className="miasma-step-sub">{copy}</p>
    </div>
  );
}

export default function App() {
  return (
    <main className="miasma-atlas">
      <section className="miasma-shell">
        <header className="miasma-hero">
          <div className="miasma-kicker">
            <span>{MIASMA_ATLAS_NAME}</span>
            <span>Agentic Memory Firewall</span>
            <span>Sui Agent Security</span>
          </div>
          <h1 className="miasma-title">The agent was poisoned in memory.</h1>
          <p className="miasma-subcopy">
            Miasma Atlas verifies the memory-action path before execution and blocks contaminated skills before funds move.
          </p>
          <div className="miasma-statusline">
            <div className="miasma-status-pill">Local Rust Verifier</div>
            <div className="miasma-status-pill">Pre-execution</div>
            <div className="miasma-status-copy">Funds moved: 0 · quarantine locked</div>
          </div>
        </header>

        <section className="miasma-grid" aria-label="Miasma Atlas prototype">
          <aside className="miasma-panel miasma-agent">
            <div className="miasma-panel-head">
              <div>
                <h2 className="miasma-panel-title">Agent Action</h2>
                <p className="miasma-panel-subtitle">The request entering the firewall.</p>
              </div>
              <div className="miasma-chip">Pre-execution</div>
            </div>

            <div className="miasma-agent-callout">
              <h3 className="miasma-agent-headline">Agent wants to pay {artifact.proposedAmount} USDC</h3>
              <p className="miasma-agent-note">
                The memory path is mapped first. The action is still only proposed here, not executed.
              </p>
            </div>

            <div className="miasma-metric-list">
              <ArtifactField label="Skill" value="send_usdc" />
              <ArtifactField label="Recipient" value="vendor" />
              <ArtifactField label="Source" value="autonomous finance agent" />
              <ArtifactField label="Risk" value="high-value payment" />
              <ArtifactField label="Proposed amount" value={`${artifact.proposedAmount} USDC`} />
              <ArtifactField label="Execution state" value="pre-execution" />
            </div>

            <div className="miasma-proof-box" style={{ marginTop: 2 }}>
              <div className="miasma-panel-title" style={{ marginBottom: 10 }}>
                Skill Firewall
              </div>
              <div className="miasma-semantic-grid">
                <div>
                  Blocked skill: <strong style={{ color: 'var(--text)' }}>{sampleAgentRuntime.skillManifest.skillId}</strong>
                </div>
                <div>
                  Shadow execution: <strong style={{ color: 'var(--text)' }}>{sampleAgentRuntime.shadowExecutionResult.simulationStatus}</strong>
                </div>
                <div>
                  Real execution: <strong style={{ color: 'var(--red)' }}>{sampleAgentRuntime.shadowExecutionResult.realExecutionStatus}</strong>
                </div>
                <div>
                  Funds moved: <strong style={{ color: 'var(--red)' }}>{sampleAgentRuntime.shadowExecutionResult.fundsMoved}</strong>
                </div>
                <div>
                  Agent loop: <strong style={{ color: 'var(--text)' }}>Observe → Bind → Retrieve → Map → Verify → Seal → Prove → Store → Gate → Receipt → Learn</strong>
                </div>
              </div>
            </div>
          </aside>

          <section className="miasma-panel miasma-map" aria-label="Miasma Atlas Map">
            <div className="miasma-panel-head">
              <div>
                <h2 className="miasma-panel-title">Miasma Atlas Map</h2>
                <p className="miasma-panel-subtitle">Memory causality is the hero, not decoration.</p>
              </div>
              <div className="miasma-chip">Contaminated path</div>
            </div>

            <div className="miasma-map-surface">
              <div className="miasma-map-legend">Atlas map · <strong>poisoned path</strong> locked</div>
              <div className="miasma-fog"></div>
              <div className="miasma-contamination-sheen"></div>
              <div className="miasma-map-stamp">BLOCKED SKILL LINE</div>
              <div className="miasma-ghost"></div>
              <div className="miasma-boundary" aria-hidden="true"></div>
              <div className="miasma-gate" aria-hidden="true">
                <div className="miasma-gate-label">Gate locked</div>
              </div>
              <div className="miasma-blocked-line">
                <strong>Blocked</strong> skill line
              </div>
              <svg className="miasma-graph" viewBox="0 0 900 560" role="img" aria-label="Memory path graph">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path className="miasma-path miasma-path-base" d="M 180 360 C 300 330, 360 280, 450 270 C 545 258, 615 245, 760 210" />
                <path className="miasma-path miasma-path-infected" d="M 180 360 C 300 330, 360 280, 450 270 C 545 258, 615 245, 760 210" filter="url(#glow)" />
                <path className="miasma-path miasma-path-quarantine" d="M 760 210 C 715 285, 665 335, 590 390 C 530 435, 465 455, 390 460" />

                <g className="miasma-node miasma-node-memory" transform="translate(170 360)">
                  <circle r="34"></circle>
                  <text className="miasma-node-label" x="-52" y="-48">
                    vendor_policy_v3.txt
                  </text>
                  <text className="miasma-node-sub" x="-18" y="58">
                    memory
                  </text>
                </g>

                <g className="miasma-node miasma-node-policy" transform="translate(450 270)">
                  <circle r="38"></circle>
                  <text className="miasma-node-label" x="-49" y="-54">
                    payment_rules.md
                  </text>
                  <text className="miasma-node-sub" x="-21" y="60">
                    poisoned
                  </text>
                </g>

                <g className="miasma-node miasma-node-action" transform="translate(760 210)">
                  <circle r="40"></circle>
                  <text className="miasma-node-label" x="-27" y="-56">
                    send_usdc
                  </text>
                  <text className="miasma-node-sub" x="-32" y="62">
                    blocked
                  </text>
                </g>

                <g className="miasma-node miasma-node-quarantine" transform="translate(370 455)">
                  <circle r="30"></circle>
                  <text className="miasma-node-label" x="-52" y="-42">
                    quarantine
                  </text>
                  <text className="miasma-node-sub" x="-38" y="50">
                    locked
                  </text>
                </g>
              </svg>
            </div>
          </section>

          <aside className="miasma-panel miasma-proof">
            <div className="miasma-panel-head">
              <div>
                <h2 className="miasma-panel-title">Quarantine Proof</h2>
                <p className="miasma-panel-subtitle">Verifier output rendered as a proof panel.</p>
              </div>
              <div className="miasma-chip">Local Rust verifier</div>
            </div>

            <div className="miasma-proof-banner">
              <div className="miasma-proof-banner-top">
                <div>
                  <div className="miasma-proof-chip">Quarantine receipt</div>
                  <h3 className="miasma-proof-banner-title">MiasmaScanArtifact</h3>
                </div>
                <div className="miasma-proof-stat">
                  <span>Funds moved</span>
                  <strong>0</strong>
                </div>
              </div>
                <p className="miasma-proof-banner-sub">
                  The verifier runs before execution. `proposedAmount` is the amount the agent wanted to move. Raw memory stays hidden.
                </p>
                <p className="miasma-proof-banner-sub">
                  Groth16 proof: {sampleQuarantineProof.proofStatus}. Quarantine rule: {sampleQuarantineProof.quarantineRuleId}. Threshold: {sampleQuarantineProof.contaminationThreshold}. Score: {sampleQuarantineProof.contaminationScore}. Result: {sampleQuarantineProof.result.replaceAll('_', ' ')}.
                </p>
              </div>

            <div className="miasma-proof-box">
              <div className="miasma-proof-grid">
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Decision</div>
                  <div className="miasma-proof-value">
                    <span className="miasma-proof-blocked">BLOCKED</span>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Recommendation</div>
                <div className="miasma-proof-value">
                    <strong>{receipt.recommendation}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Contamination score</div>
                  <div className="miasma-proof-value">
                    <strong>{receipt.contaminationScore}%</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Detector</div>
                  <div className="miasma-proof-value">
                    <strong>{artifact.detectorResults[0]}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Proposed amount</div>
                  <div className="miasma-proof-value">
                    <strong>{receipt.proposedAmount} USDC</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Funds moved</div>
                  <div className="miasma-proof-value">
                    <strong>{receipt.fundsMoved}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Verifier</div>
                  <div className="miasma-proof-value">
                    <strong>{receipt.verifier}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Artifact</div>
                  <div className="miasma-proof-value">
                    <strong>MiasmaScanArtifact</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Evidence</div>
                  <div className="miasma-proof-value">
                    <strong>Seal locked</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Nitro target</div>
                  <div className="miasma-proof-value">
                    <strong>target scaffold</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Raw memory</div>
                  <div className="miasma-proof-value">
                    <strong>hidden</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Artifact ref</div>
                  <div className="miasma-proof-value">
                    <strong>Walrus ref scaffold</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Receipt</div>
                  <div className="miasma-proof-value">
                    <strong>Sui QuarantineReceipt</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Groth16 proof</div>
                  <div className="miasma-proof-value">
                    <strong>{sampleQuarantineProof.proofStatus}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Quarantine rule</div>
                  <div className="miasma-proof-value">
                    <strong>{sampleQuarantineProof.quarantineRuleId}</strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Threshold / score</div>
                  <div className="miasma-proof-value">
                    <strong>
                      {sampleQuarantineProof.contaminationThreshold} / {sampleQuarantineProof.contaminationScore}
                    </strong>
                  </div>
                </div>
                <div className="miasma-proof-row">
                  <div className="miasma-proof-label">Result</div>
                  <div className="miasma-proof-value">
                    <strong>{sampleQuarantineProof.result.replaceAll('_', ' ')}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="miasma-proof-box">
              <div className="miasma-panel-title" style={{ marginBottom: 10 }}>
                Sui QuarantineReceipt
              </div>
              <div className="miasma-footnote miasma-semantic-grid">
                <div>
                  Status: <strong style={{ color: 'var(--text)' }}>{receipt.status}</strong>
                </div>
                <div>
                  Decision: <strong style={{ color: 'var(--red)' }}>{receipt.decision.toUpperCase()}</strong>
                </div>
                <div>
                  Proposed amount: <strong style={{ color: 'var(--text)' }}>{receipt.proposedAmount} USDC</strong>
                </div>
                <div>
                  Funds moved: <strong style={{ color: 'var(--red)' }}>{receipt.fundsMoved}</strong>
                </div>
                <div>
                  Memory hash: <strong style={{ color: 'var(--text)' }}>{receipt.memoryHash}</strong>
                </div>
                <div>Evidence: Seal locked</div>
                <div>Nitro target: target scaffold</div>
                <div>Raw memory: hidden</div>
                <div>Artifact ref: {sampleEvidencePath.walrusBlobRef}</div>
                <div>Seal policy: {receipt.sealPolicyId}</div>
                <div>Walrus ref: {receipt.walrusBlobRef}</div>
                <div>Groth16 proof: {receipt.groth16ProofRef}</div>
                <div>Quarantine rule: {sampleQuarantineProof.quarantineRuleId}</div>
              </div>
            </div>
          </aside>
        </section>

        <section className="miasma-panel" aria-label="Verified chain">
          <div className="miasma-panel-head">
            <div>
              <h2 className="miasma-panel-title">Verified Chain</h2>
              <p className="miasma-panel-subtitle">The chain stays visually connected even where later systems are pending.</p>
            </div>
            <div className="miasma-chip">Live · Local · Scaffolded · Pending</div>
          </div>

          <div className="miasma-pathline" style={{ padding: '0 20px 22px', position: 'relative' }}>
            <div className="miasma-pathline-rail"></div>
            <div className="miasma-pathline-track" style={{ position: 'relative', zIndex: 1 }}>
              {verifiedPath.map((step, index) => (
                <span key={step} style={{ display: 'contents' }}>
                  <StepCard
                    label={step}
                    state={verifierStates[index].state}
                    tone={verifierStates[index].tone}
                    copy={verifierStates[index].copy}
                  />
                  {index < verifiedPath.length - 1 ? <div className="miasma-pathline-arrow">→</div> : null}
                </span>
              ))}
            </div>
            <div className="miasma-footnote">
              Memory hash → Rust verifier → Nitro enclave verifier → Seal locked evidence → Walrus artifact ref → Groth16 quarantine proof → Sui QuarantineReceipt
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
