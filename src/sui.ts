import { DeepBookClient } from '@mysten/deepbook-v3';
import { Transaction } from '@mysten/sui/transactions';

export const HEY_SUI_NAME = 'Hey Sui';
export const HEY_SUI_TAGLINE = 'Say it or type it. Hey Sui reads before value moves.';
export const HEY_SUI_SCOPE = 'Top up. Trade. Block.';
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
