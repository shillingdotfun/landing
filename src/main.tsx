// src/main.tsx

import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCK !== 'true') {
    console.log('🚀 Running without mocks (real API mode)');
    return;
  }

  try {
    const { worker, simulateRealtime } = await import('./mocks/browser');

    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });

    console.log('🎭 Mock Service Worker enabled');
    console.log('📡 Intercepting:', import.meta.env.VITE_API_URL);

    simulateRealtime();
    
  } catch (error) {
    console.error('❌ Failed to start MSW:', error);
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PrivyProvider
          appId={import.meta.env.VITE_PRIVY_APP_ID}
          clientId={import.meta.env.VITE_PRIVY_APP_CLIENT_ID}
          config={{
            appearance: {
              walletChainType: 'solana-only',
              walletList: [
                //'detected_solana_wallets',
                'phantom',
                'solflare',
                //'wallet_connect',
              ],
              accentColor: '#000000ff',
              theme: '#ffffffdf',
              showWalletLoginFirst: false,
              logo: '/purple-transparent.png',
            },
            externalWallets: {
              solana: {
                connectors: toSolanaWalletConnectors(),
              },
            },
            loginMethods: ['wallet'],
            embeddedWallets: {
              showWalletUIs: false,
              ethereum: { createOnLogin: 'off' },
              solana: { createOnLogin: 'off' },
            },
            mfa: { noPromptOnMfaRequired: false },
          }}
        >
          <App />
      </PrivyProvider>
    </React.StrictMode>
  );
});