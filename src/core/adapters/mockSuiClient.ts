export function createMockSuiClient() {
  return {
    network: 'testnet' as const,
    getNetwork() {
      return this.network;
    },
  };
}
