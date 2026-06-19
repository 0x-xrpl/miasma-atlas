export function createMockWallet(address = '0xmockwallet') {
  return {
    address,
    connected: true,
    network: 'testnet' as const,
  };
}
