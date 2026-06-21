#!/usr/bin/env node

import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';

type Network = 'mainnet' | 'testnet' | 'devnet';

const encoder = new TextEncoder();

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function networkToUrl(network: Network) {
  switch (network) {
    case 'mainnet':
      return 'https://fullnode.mainnet.sui.io:443';
    case 'devnet':
      return 'https://fullnode.devnet.sui.io:443';
    default:
      return 'https://fullnode.testnet.sui.io:443';
  }
}

function buildSuiVisionTxUrl(digest: string, network: Network) {
  return `https://suivision.xyz/txblock/${digest}?network=${network}`;
}

function bytes(transaction: Transaction, value: string) {
  return transaction.pure.vector('u8', encoder.encode(value));
}

function loadSigner() {
  const mnemonic =
    process.env.SUI_RECEIPT_SIGNER_MNEMONIC ||
    process.env.SUI_CAPSULE_SIGNER_MNEMONIC ||
    '';
  const secretKey =
    process.env.SUI_RECEIPT_SIGNER_SECRET_KEY ||
    process.env.SUI_CAPSULE_SIGNER_SECRET_KEY ||
    '';

  if (mnemonic) {
    return Ed25519Keypair.deriveKeypair(mnemonic);
  }

  if (secretKey) {
    return Ed25519Keypair.fromSecretKey(secretKey);
  }

  fail('Missing signer configuration: set SUI_RECEIPT_SIGNER_MNEMONIC or SUI_RECEIPT_SIGNER_SECRET_KEY.');
}

function readReceiptMetadata() {
  const network = ((process.env.SUI_RECEIPT_NETWORK || process.env.VITE_SUI_NETWORK || 'testnet') as Network);
  const packageId = process.env.SUI_RECEIPT_PACKAGE_ID || process.env.VITE_SUI_RECEIPT_PACKAGE_ID || '';

  if (!packageId) {
    fail('Missing package ID: set SUI_RECEIPT_PACKAGE_ID.');
  }

  return {
    network,
    packageId,
    receiptId: process.env.SUI_RECEIPT_RECEIPT_ID || 'miasma-receipt-blocked-scan',
    sampleHash:
      process.env.SUI_RECEIPT_SAMPLE_HASH ||
      'vendor_policy_v3.txt -> payment_rules.md -> send_usdc',
    sampleDigest:
      process.env.SUI_RECEIPT_SAMPLE_DIGEST ||
      'blocked-scan-digest',
    projectedExposure: process.env.SUI_RECEIPT_PROJECTED_EXPOSURE || '900 USDC',
    detectorResult:
      process.env.SUI_RECEIPT_DETECTOR_RESULT ||
      'hidden instruction contamination detected',
    riskScore: Number(process.env.SUI_RECEIPT_RISK_SCORE || '87'),
    blocked: (process.env.SUI_RECEIPT_BLOCKED || 'true') !== 'false',
    createdAtMs: Number(process.env.SUI_RECEIPT_CREATED_AT_MS || Date.now().toString()),
  };
}

async function main() {
  const signer = loadSigner();
  const receipt = readReceiptMetadata();
  const client = new SuiGrpcClient({
    network: receipt.network,
    baseUrl: networkToUrl(receipt.network),
  });
  const transaction = new Transaction();

  transaction.moveCall({
    target: `${receipt.packageId}::miasma_receipt::record_receipt`,
    arguments: [
      bytes(transaction, receipt.receiptId),
      bytes(transaction, receipt.sampleHash),
      bytes(transaction, receipt.sampleDigest),
      bytes(transaction, receipt.projectedExposure),
      bytes(transaction, receipt.detectorResult),
      transaction.pure.u64(receipt.riskScore),
      transaction.pure.bool(receipt.blocked),
      bytes(transaction, receipt.network),
      transaction.pure.u64(receipt.createdAtMs),
    ],
  });

  const result = await client.signAndExecuteTransaction({
    transaction,
    signer,
  });

  const explorerUrl = buildSuiVisionTxUrl(result.digest, receipt.network);
  console.log(result.digest);
  console.log(explorerUrl);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(message);
});
