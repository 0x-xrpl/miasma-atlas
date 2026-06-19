#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { WalrusClient, WalrusFile } from '@mysten/walrus';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactsDir = path.join(repoRoot, 'artifacts');
const capsulePath = path.join(artifactsDir, 'evidence-capsule.json');
const sealedPath = path.join(artifactsDir, 'evidence-capsule.sealed.json');
const walrusPath = path.join(artifactsDir, 'evidence-capsule.walrus.json');
const statusPath = path.join(repoRoot, 'src', 'core', 'boundaries', 'walrus-evidence-status.ts');

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
    `const walrusEvidenceStatus = ${JSON.stringify(payload, null, 2)} as const;\n\nexport default walrusEvidenceStatus;\n`,
  );
}

function loadSigner() {
  const mnemonic = process.env.WALRUS_SIGNER_MNEMONIC || '';
  const secretKey = process.env.WALRUS_SIGNER_SECRET_KEY || '';
  if (mnemonic) {
    return Ed25519Keypair.deriveKeypair(mnemonic);
  }
  if (secretKey) {
    return Ed25519Keypair.fromSecretKey(secretKey);
  }
  throw new Error('PRODUCTION GATE FAILED: Walrus artifact upload not configured');
}

async function main() {
  const network = process.env.VITE_WALRUS_NETWORK || process.env.VITE_SUI_NETWORK || 'testnet';
  const relayUrl = process.env.WALRUS_UPLOAD_RELAY_URL || process.env.WALRUS_PUBLISHER_URL || process.env.WALRUS_AGGREGATOR_URL || '';
  const epochs = Number(process.env.WALRUS_EPOCHS || '');

  if (!relayUrl || !Number.isFinite(epochs) || epochs <= 0) {
    throw new Error('PRODUCTION GATE FAILED: Walrus artifact upload not configured');
  }

  if (!fs.existsSync(capsulePath) && !fs.existsSync(sealedPath)) {
    throw new Error('PRODUCTION GATE FAILED: Verified Evidence Capsule not configured');
  }

  const sourcePath = fs.existsSync(sealedPath) ? sealedPath : capsulePath;
  const contents = fs.readFileSync(sourcePath);
  const signer = loadSigner();
  const suiClient = new SuiGrpcClient({
    network,
    baseUrl: networkToUrl(network),
  });
  const client = new WalrusClient({
    suiClient,
    network,
    uploadRelay: { host: relayUrl },
  });

  const file = WalrusFile.from({
    contents,
    identifier: path.basename(sourcePath),
    tags: {
      'content-type': 'application/json',
    },
  });

  const result = await client.writeFiles({
    files: [file],
    signer,
    owner: signer.toSuiAddress(),
    epochs,
    deletable: true,
  });

  const payload = {
    blobId: result.blobId,
    objectId: result.blobObject.id,
    network,
    uploadRelayUrl: relayUrl,
    source: path.relative(repoRoot, sourcePath),
    createdAtMs: Date.now(),
  };

  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(walrusPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeStatus({
    state: 'verified',
    detail: `Walrus upload passed. Blob ID: ${result.blobId}.`,
    available: true,
    blobId: result.blobId,
    objectId: result.blobObject.id,
    uploadRelayUrl: relayUrl,
    network,
  });
  console.log(result.blobId);
  console.log(`Artifact: ${path.relative(repoRoot, walrusPath)}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
