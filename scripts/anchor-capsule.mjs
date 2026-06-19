#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactsDir = path.join(repoRoot, 'artifacts');
const capsulePath = path.join(artifactsDir, 'evidence-capsule.json');
const anchorPath = path.join(artifactsDir, 'evidence-capsule.anchor.json');
const statusPath = path.join(repoRoot, 'src', 'core', 'boundaries', 'capsule-anchor-status.ts');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function networkToUrl(network) {
  switch (network) {
    case 'mainnet':
      return 'https://fullnode.mainnet.sui.io:443';
    case 'devnet':
      return 'https://fullnode.devnet.sui.io:443';
    default:
      return 'https://fullnode.testnet.sui.io:443';
  }
}

function writeStatus(payload) {
  fs.writeFileSync(
    statusPath,
    `const capsuleAnchorStatus = ${JSON.stringify(payload, null, 2)} as const;\n\nexport default capsuleAnchorStatus;\n`,
  );
}

function loadSigner() {
  const mnemonic = process.env.SUI_CAPSULE_SIGNER_MNEMONIC || '';
  const secretKey = process.env.SUI_CAPSULE_SIGNER_SECRET_KEY || '';
  if (mnemonic) {
    return Ed25519Keypair.deriveKeypair(mnemonic);
  }
  if (secretKey) {
    return Ed25519Keypair.fromSecretKey(secretKey);
  }
  throw new Error('PRODUCTION GATE FAILED: Sui capsule anchor package not configured');
}

function bytes(text) {
  return new TextEncoder().encode(text);
}

async function main() {
  const network = process.env.VITE_SUI_NETWORK || 'testnet';
  const packageId = process.env.VITE_SUI_CAPSULE_PACKAGE_ID || process.env.SUI_CAPSULE_PACKAGE_ID || '';

  if (!packageId) {
    throw new Error('PRODUCTION GATE FAILED: Sui capsule anchor package not configured');
  }

  if (!fs.existsSync(capsulePath)) {
    throw new Error('PRODUCTION GATE FAILED: Verified Evidence Capsule not configured');
  }

  const capsule = JSON.parse(fs.readFileSync(capsulePath, 'utf8'));
  const signer = loadSigner();
  const client = new SuiGrpcClient({
    network,
    baseUrl: networkToUrl(network),
  });
  const transaction = new Transaction();

  const byteArg = (value) => transaction.pure.vector('u8', bytes(value ?? ''));
  transaction.moveCall({
    target: `${packageId}::evidence_capsule::create_evidence_capsule`,
    arguments: [
      byteArg(capsule.capsuleId),
      byteArg(capsule.capsuleHash),
      byteArg(capsule.actionKind),
      byteArg(capsule.intentHash),
      byteArg(capsule.policyHash),
      byteArg(capsule.contextHash),
      byteArg(capsule.memoryActionContextHash),
      byteArg(capsule.suiDigest),
      byteArg(capsule.deepbookDigest),
      byteArg(capsule.proofHash),
      byteArg(capsule.publicSignalsHash),
      byteArg(capsule.verificationState),
      transaction.pure.u64(capsule.fundsMoved),
      transaction.pure.bool(capsule.blocked),
      transaction.pure.bool(capsule.confirmationRequired),
      byteArg(capsule.walrusBlobId),
      byteArg(capsule.walrusObjectId),
      byteArg(capsule.walrusStatus),
      byteArg(capsule.sealPolicyId),
      byteArg(capsule.sealStatus),
      byteArg(capsule.sealCiphertextHash),
      transaction.pure.u64(capsule.createdAtMs),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction,
    signer,
  });

  const payload = {
    digest: result.digest,
    explorerUrl: `https://suivision.xyz/txblock/${result.digest}?network=${network}`,
    packageId,
    source: path.relative(repoRoot, capsulePath),
    createdAtMs: Date.now(),
  };

  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(anchorPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeStatus({
    state: 'verified',
    detail: `Sui capsule anchor passed. Digest: ${result.digest}.`,
    available: true,
    digest: result.digest,
    explorerUrl: payload.explorerUrl,
    packageId,
  });
  console.log(result.digest);
  console.log(`Artifact: ${path.relative(repoRoot, anchorPath)}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
