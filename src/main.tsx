// src/main.tsx

import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.css';

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
      <App />
    </React.StrictMode>
  );
});