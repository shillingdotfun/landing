/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;

  readonly VITE_WS_URL: string;
  readonly VITE_USE_MOCK: string;

  readonly VITE_PRIVY_APP_ID;
  readonly VITE_PRIVY_APP_SECRET: string;
  readonly VITE_PRIVY_APP_CLIENT_ID: string;

  readonly VITE_SOLANA_RPC_ENDPOINT: string;
  readonly VITE_SOLANA_WS_ENDPOINT: string;

  readonly VITE_TOKEN_MINT_TOKEN_SYMBOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}