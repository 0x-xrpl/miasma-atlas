#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SealClient } from '@mysten/seal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const artifactsDir = path.join(repoRoot, 'artifacts');
const capsulePath = path.join(artifactsDir, 'evidence-capsule.json');
const sealedPath = path.join(artifactsDir, 'evidence-capsule.sealed.json');
const statusPath = path.join(repoRoot, 'src', 'core', 'boundaries', 'seal-evidence-status.ts');

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

function sha256Hex(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function writeStatus(payload) {
  fs.writeFileSync(
    statusPath,
    `const sealEvidenceStatus = ${JSON.stringify(payload, null, 2)} as const;\n\nexport default sealEvidenceStatus;\n`,
  );
}

function parseServerConfigs(raw) {
  if (!raw) {
    throw new Error('PRODUCTION GATE FAILED: Seal access policy not configured');
  }

  const parsed = JSON.parse(raw);
  const configs = Array.isArray(parsed) ? parsed : [parsed];
  if (!configs.length) {
    throw new Error('PRODUCTION GATE FAILED: Seal access policy not configured');
  }

  return configs.map((config) => {
    if (!config?.objectId || typeof config.weight !== 'number') {
      throw new Error('PRODUCTION GATE FAILED: Seal access policy not configured');
    }
    return config;
  });
}

async function main() {
  const network = (process.env.VITE_WALRUS_NETWORK || process.env.VITE_SUI_NETWORK || 'testnet');
  const packageId = process.env.SEAL_PACKAGE_ID || '';
  const policyId = process.env.SEAL_POLICY_ID || '';
  const accessObjectId = process.env.SEAL_ACCESS_OBJECT_ID || '';
  const thresholdServers = process.env.SEAL_THRESHOLD_SERVERS || '';

  if (!packageId || !policyId || !accessObjectId) {
    throw new Error('PRODUCTION GATE FAILED: Seal access policy not configured');
  }

  const serverConfigs = parseServerConfigs(thresholdServers);
  const threshold = Math.max(1, Math.ceil(serverConfigs.reduce((sum, server) => sum + server.weight, 0) / 2));

  if (!fs.existsSync(capsulePath)) {
    throw new Error('PRODUCTION GATE FAILED: Verified Evidence Capsule not configured');
  }

  const capsuleBytes = fs.readFileSync(capsulePath);
  const suiClient = new SuiGrpcClient({
    network,
    baseUrl: networkToUrl(network),
  });
  const sealClient = new SealClient({
    suiClient,
    serverConfigs,
    verifyKeyServers: true,
  });

  const { encryptedObject, key } = await sealClient.encrypt({
    threshold,
    packageId,
    id: accessObjectId,
    data: capsuleBytes,
  });

  const ciphertextHash = sha256Hex(encryptedObject);
  const payload = {
    sealPolicyId: policyId,
    sealPackageId: packageId,
    sealAccessObjectId: accessObjectId,
    ciphertextHash,
    threshold,
    serverCount: serverConfigs.length,
    encryptedObjectBase64: Buffer.from(encryptedObject).toString('base64'),
    keyBase64: Buffer.from(key).toString('base64'),
    source: path.relative(repoRoot, capsulePath),
    createdAtMs: Date.now(),
  };

  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(sealedPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeStatus({
    state: 'verified',
    detail: `Seal encryption passed. Ciphertext hash: ${ciphertextHash}.`,
    available: true,
    policyId,
    ciphertextHash,
    packageId,
    accessObjectId,
  });
  console.log(ciphertextHash);
  console.log(`Artifact: ${path.relative(repoRoot, sealedPath)}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
