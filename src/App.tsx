import type { ReactNode } from 'react';
import { sampleEvidencePath } from './lib/miasma/sample-evidence-path';
import { sampleQuarantineProof } from './lib/miasma/sample-quarantine-proof';
import { sampleQuarantineReceipt } from './lib/miasma/sample-quarantine-receipt';
import { sampleScanArtifact } from './lib/miasma/sample-scan-artifact';

type Field = {
  label: string;
  value: ReactNode;
};

function Panel({
  eyebrow,
  title,
  subtitle,
  className = '',
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className="panel-head">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
        {subtitle ? <p className="subcopy">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Fields({ items }: { items: Field[] }) {
  return (
    <dl className="fields">
      {items.map((item) => (
        <div className="field" key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Chip({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'danger' }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}

function InlineCode({ children }: { children: ReactNode }) {
  return <code className="inline-code">{children}</code>;
}

function PathRail() {
  const nodes = sampleScanArtifact.memoryPath;

  return (
    <div className="path-rail" aria-label="Memory-action path">
      {nodes.map((node, index) => {
        const isContaminated = index > 0;
        return (
          <div className={`path-node ${isContaminated ? 'path-node-danger' : ''}`} key={node}>
            <span className="path-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="path-label">{node}</span>
            <span className="path-state">{index === nodes.length - 1 ? 'blocked' : isContaminated ? 'tainted' : 'checked'}</span>
          </div>
        );
      })}
      <div className="path-arrow" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  const receiptFields: Field[] = [
    { label: 'Action', value: 'send_usdc' },
    { label: 'Recipient', value: 'vendor' },
    { label: 'Proposed exposure', value: '900 USDC' },
    { label: 'Contamination score', value: sampleScanArtifact.contaminationScore },
    { label: 'Detector result', value: sampleScanArtifact.detectorResults[0] },
    { label: 'Recommendation', value: sampleScanArtifact.recommendation },
    { label: 'Action blocked', value: String(sampleScanArtifact.actionBlocked) },
    { label: 'Funds moved', value: '0' },
  ];

  const proofFields: Field[] = [
    { label: 'Memory hash', value: sampleQuarantineReceipt.memoryHash },
    { label: 'Artifact ref', value: sampleEvidencePath.publicArtifactRef },
    { label: 'Seal locked evidence', value: sampleEvidencePath.sealLockedEvidenceRef },
    { label: 'Walrus artifact ref', value: sampleEvidencePath.walrusBlobRef },
    { label: 'Groth16 quarantine proof', value: sampleQuarantineReceipt.groth16ProofRef },
    { label: 'Quarantine receipt', value: sampleQuarantineReceipt.receiptId },
  ];

  return (
    <main className="shell">
      <div className="backdrop" aria-hidden="true" />
      <div className="grid-noise" aria-hidden="true" />

      <header className="hero panel">
        <div className="hero-top">
          <Chip tone="danger">MIASMA / live quarantine firewall</Chip>
          <Chip>Funds moved: 0</Chip>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">Pre-execution verifier for agentic Sui actions</p>
          <h1>Memory-action paths are checked before any Sui action is signed or executed.</h1>
          <p className="lede">
            The agent asked to pay 900 USDC. MIASMA mapped the memory path,
            detected hidden instruction contamination, suppressed the wallet request, and blocked the path before value moved.
          </p>
        </div>

        <div className="hero-metrics" aria-label="Quarantine summary">
          <div className="metric">
            <span className="metric-label">Memory-action path checked</span>
            <strong>vendor_policy_v3.txt → payment_rules.md → send_usdc</strong>
          </div>
          <div className="metric">
            <span className="metric-label">Poisoned path detected</span>
            <strong>hidden instruction contamination</strong>
          </div>
          <div className="metric">
            <span className="metric-label">Wallet request</span>
            <strong>suppressed</strong>
          </div>
        </div>
      </header>

      <section className="dashboard">
        <Panel
          eyebrow="Quarantine verdict"
          title="Blocked before funds moved"
          subtitle="The agent looked legitimate, but the memory-action path was contaminated."
          className="verdict-panel"
        >
          <div className="verdict-card">
            <div className="verdict-score">
              <span>Funds moved</span>
              <strong>0</strong>
            </div>
            <div className="verdict-copy">
              <Chip tone="danger">blocked</Chip>
              <p>
                Action <InlineCode>send_usdc</InlineCode> to <InlineCode>vendor</InlineCode> was quarantined. The dangerous path was
                suppressed before any approval surfaced.
              </p>
            </div>
          </div>

          <Fields items={receiptFields} />
        </Panel>

        <Panel
          eyebrow="Memory-action map"
          title="Memory-Action Map"
          subtitle="The map stays readable on mobile by collapsing the rail into a vertical stack."
          className="map-panel"
        >
          <PathRail />
          <div className="contamination-banner">
            <div>
              <span className="banner-label">Detected contamination</span>
              <strong>87 / 100</strong>
            </div>
            <p>Recommendation: quarantine. Verified path recorded without releasing funds.</p>
          </div>
        </Panel>

        <Panel
          eyebrow="Verified capsule"
          title="Proof chain"
          subtitle="Memory hash to Sui QuarantineReceipt, with the locked evidence path surfaced for audit."
          className="proof-panel"
        >
          <div className="proof-chain" aria-label="Verified path">
            {sampleQuarantineReceipt.verifiedPath.map((step, index) => (
              <div className="proof-step" key={step}>
                <span className="proof-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="proof-text">{step}</span>
              </div>
            ))}
          </div>
          <Fields items={proofFields} />
          <div className="proof-note">
            <span className="eyebrow">Quarantine proof</span>
            <p>{sampleQuarantineProof.proofRef}</p>
          </div>
        </Panel>

        <Panel
          eyebrow="Execution record"
          title="Sui quarantine receipt"
          subtitle="The receipt is the public outcome of the blocked path, not an execution success."
          className="receipt-panel"
        >
          <Fields
            items={[
              { label: 'Status', value: sampleQuarantineReceipt.status },
              { label: 'Decision', value: sampleQuarantineReceipt.decision },
              { label: 'Recommendation', value: sampleQuarantineReceipt.recommendation },
              { label: 'Verifier', value: sampleQuarantineReceipt.verifier },
              { label: 'Verified path', value: sampleQuarantineReceipt.verifiedPath.length },
              { label: 'Funds moved', value: sampleQuarantineReceipt.fundsMoved },
            ]}
          />
          <div className="receipt-callout">
            <strong>Wallet approval never appears for the dangerous path.</strong>
            <p>Memory hash → Rust verifier → Seal locked evidence → Walrus artifact ref → Groth16 quarantine proof → Sui QuarantineReceipt.</p>
          </div>
        </Panel>
      </section>
    </main>
  );
}
