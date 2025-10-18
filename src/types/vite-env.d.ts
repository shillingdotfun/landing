/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_PRIVY_APP_ID;
  readonly VITE_PRIVY_APP_SECRET: string;
  readonly VITE_PRIVY_APP_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}