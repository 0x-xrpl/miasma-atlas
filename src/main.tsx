import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import App from './App';
import './styles.css';
import '@mysten/dapp-kit/dist/index.css';

const queryClient = new QueryClient();
const network = (import.meta.env.VITE_SUI_NETWORK || 'testnet') as 'mainnet' | 'testnet' | 'devnet';
const networks = {
  mainnet: new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('mainnet'), network: 'mainnet' }),
  testnet: new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('testnet'), network: 'testnet' }),
  devnet: new SuiJsonRpcClient({ url: getJsonRpcFullnodeUrl('devnet'), network: 'devnet' }),
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={network}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
