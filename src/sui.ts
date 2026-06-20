import { DeepBookClient } from '@mysten/deepbook-v3';
import { Transaction } from '@mysten/sui/transactions';
import type { EvidenceCapsule } from './lib/hey-sui/evidence-capsule';

export const HEY_SUI_NAME = 'MIASMA';
export const HEY_SUI_TAGLINE = 'Pre-execution memory-action quarantine for agentic Sui actions.';
export const HEY_SUI_SCOPE = 'Block. Verify. Proceed.';
export const DEFAULT_NETWORK = (import.meta.env.VITE_SUI_NETWORK || 'testnet') as
  | 'mainnet'
  | 'testnet'
  | 'devnet';
export const LIVE_TESTNET_TRANSFER_MIST = 1_000_000;
export const LIVE_TESTNET_TRANSFER_LABEL = '0.001 SUI';
export const LIVE_DEEPBOOK_POOL_KEY = 'SUI_USDC';
export const LIVE_DEEPBOOK_BASE_TO_QUOTE_SLIPPAGE_BPS = 50;

export function buildLiveTestnetTransferTransaction(recipientAddress: string) {
  const transaction = new Transaction();
  const [coin] = transaction.splitCoins(transaction.gas, [LIVE_TESTNET_TRANSFER_MIST]);
  transaction.transferObjects([coin], recipientAddress);
  return transaction;
}

export function buildLiveDeepBookSwapTransaction({
  client,
  senderAddress,
  amountIn,
  estimatedOutput,
  network,
  slippageBps = LIVE_DEEPBOOK_BASE_TO_QUOTE_SLIPPAGE_BPS,
}: {
  client: unknown;
  senderAddress: string;
  amountIn: number;
  estimatedOutput: number;
  network: 'mainnet' | 'testnet' | 'devnet';
  slippageBps?: number;
}) {
  const deepBookClient = new DeepBookClient({
    client: client as any,
    address: senderAddress,
    env: network === 'mainnet' ? 'mainnet' : 'testnet',
  });

  const transaction = new Transaction();
  const minOut = Number((estimatedOutput * (1 - slippageBps / 10_000)).toFixed(6));

  deepBookClient.deepBook.swapExactBaseForQuote({
    poolKey: LIVE_DEEPBOOK_POOL_KEY,
    amount: amountIn,
    deepAmount: 0,
    minOut,
  })(transaction as any);

  return transaction;
}

export function buildSuiVisionTxUrl(
  digest: string,
  network: 'mainnet' | 'testnet' | 'devnet' = DEFAULT_NETWORK,
) {
  return `https://suivision.xyz/txblock/${digest}?network=${network}`;
}

export function buildEvidenceCapsuleAnchorTransaction({
  packageId,
  capsule,
}: {
  packageId: string;
  capsule: EvidenceCapsule;
}) {
  const transaction = new Transaction();
  const encoder = new TextEncoder();
  const bytes = (value: string) => transaction.pure.vector('u8', encoder.encode(value));

  transaction.moveCall({
    target: `${packageId}::evidence_capsule::create_evidence_capsule`,
    arguments: [
      bytes(capsule.capsuleId),
      bytes(capsule.capsuleHash),
      bytes(capsule.actionKind),
      bytes(capsule.intentHash),
      bytes(capsule.policyHash),
      bytes(capsule.contextHash),
      bytes(capsule.memoryActionContextHash),
      bytes(capsule.suiDigest ?? ''),
      bytes(capsule.deepbookDigest ?? ''),
      bytes(capsule.proofHash),
      bytes(capsule.publicSignalsHash),
      bytes(capsule.verificationState),
      transaction.pure.u64(capsule.fundsMoved),
      transaction.pure.bool(capsule.blocked),
      transaction.pure.bool(capsule.confirmationRequired),
      bytes(capsule.walrusBlobId ?? ''),
      bytes(capsule.walrusObjectId ?? ''),
      bytes(capsule.walrusStatus),
      bytes(capsule.sealPolicyId ?? ''),
      bytes(capsule.sealStatus),
      bytes(capsule.sealCiphertextHash ?? ''),
      transaction.pure.u64(capsule.createdAtMs),
    ],
  });

  return transaction;
}
