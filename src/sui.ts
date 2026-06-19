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

export function buildLiveTestnetTransferTransaction(recipientAddress: string) {
  const transaction = new Transaction();
  const [coin] = transaction.splitCoins(transaction.gas, [LIVE_TESTNET_TRANSFER_MIST]);
  transaction.transferObjects([coin], recipientAddress);
  return transaction;
}

export function buildSuiVisionTxUrl(
  digest: string,
  network: 'mainnet' | 'testnet' | 'devnet' = DEFAULT_NETWORK,
) {
  return `https://suivision.xyz/txblock/${digest}?network=${network}`;
}
