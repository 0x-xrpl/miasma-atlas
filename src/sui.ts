export const DEFAULT_NETWORK = (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'mainnet' | 'testnet' | 'devnet';
export const MIASMA_ATLAS_NAME = 'Miasma Atlas';
export const DEMO_USDC_AMOUNT = 900;
export const SUIVISION_BASE_URL = 'https://suivision.xyz';

export function getSuiVisionUrlTemplate() {
  return `${SUIVISION_BASE_URL}/txblock/:digest?network=${DEFAULT_NETWORK}`;
}

