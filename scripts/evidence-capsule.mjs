#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactsDir = path.join(repoRoot, 'artifacts');
const zkStatusPath = path.join(repoRoot, 'zk', 'generated', 'quarantine_threshold.status.json');
const capsulePath = path.join(artifactsDir, 'evidence-capsule.json');

const canonicalIntent = {
  actionKind: 'transfer',
  flowId: 'hiddenTransferBlock',
  input: 'Visible request: top up 10 USDC. Hidden transfer: 900 USDC. Recipient mismatch detected. Policy violation detected.',
  normalizedIntent: 'Hidden transfer block',
  reason: 'Hidden transfer and recipient mismatch detected.',
};

const canonicalPolicy = {
  ruleId: 'hidden_transfer_quarantine_v1',
  blocked: true,
  confirmationRequired: true,
  summary: 'Blocked. Funds moved: 0.',
};

const canonicalContext = {
  agent: 'Agent wants to pay 900 USDC',
  skillId: 'send_usdc',
  amountLabel: '900 USDC',
  proposedAmount: 900,
  intent: 'Pay vendor',
  asset: 'USDC',
  recipient: 'vendor',
  memoryPath: ['vendor_policy_v3.txt', 'payment_rules.md', 'send_usdc'],
  memoryHash: 'mhash_2a3b4c5d6e7f8091',
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  }

  return `{${Object.entries(value)
    .filter(([, entry]) => entry !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
    .join(',')}}`;
}

function sha256Hex(value) {
  return createHash('sha256').update(value).digest('hex');
}

function loadZkStatus() {
  if (!fs.existsSync(zkStatusPath)) {
    fail('PRODUCTION GATE FAILED: Groth16 verification not configured');
  }

  const status = JSON.parse(fs.readFileSync(zkStatusPath, 'utf8'));
  if (status.state !== 'verified') {
    fail('PRODUCTION GATE FAILED: Groth16 verification not configured');
  }

  if (!status.proofHash || !status.publicSignalsHash) {
    fail('PRODUCTION GATE FAILED: Groth16 verification not configured');
  }

  return status;
}

function main() {
  const zkStatus = loadZkStatus();
  fs.mkdirSync(artifactsDir, { recursive: true });

  const proofHash = zkStatus.proofHash;
  const publicSignalsHash = zkStatus.publicSignalsHash;

  const capsuleBase = {
    capsuleId: `capsule-${canonicalContext.memoryHash.slice(0, 12)}-${proofHash.slice(0, 12)}`,
    actionKind: canonicalIntent.actionKind,
    intentHash: sha256Hex(stableStringify(canonicalIntent)),
    policyHash: sha256Hex(stableStringify(canonicalPolicy)),
    contextHash: sha256Hex(stableStringify({
      memoryPath: canonicalContext.memoryPath,
      memoryHash: canonicalContext.memoryHash,
      proposedAmount: canonicalContext.proposedAmount,
    })),
    memoryActionContextHash: sha256Hex(stableStringify(canonicalContext)),
    proofHash,
    publicSignalsHash,
    verificationState: 'verified',
    fundsMoved: 0,
    blocked: true,
    confirmationRequired: true,
    walrusStatus: 'gate_failed',
    sealStatus: 'gate_failed',
    createdAtMs: Date.now(),
  };

  const capsuleHash = sha256Hex(stableStringify(capsuleBase));
  const capsule = {
    ...capsuleBase,
    capsuleHash,
  };

  fs.writeFileSync(capsulePath, `${JSON.stringify(capsule, null, 2)}\n`);
  console.log(capsuleHash);
  console.log(`Artifact: ${path.relative(repoRoot, capsulePath)}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
}
