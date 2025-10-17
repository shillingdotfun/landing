// vite.config.ts

import { defineConfig } from 'vite';
import { config } from 'dotenv';
import react from '@vitejs/plugin-react';
import path from 'path';

// Load environment variables from .env file
config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Provide browser implementations for Node.js modules
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify/browser',
      url: 'url',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': process.env,
    'global': 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: 3000,
  },
  publicDir: 'public',
});