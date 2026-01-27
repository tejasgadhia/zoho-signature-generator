import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  base: '/zoho-signature-generator/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Let Vite handle code splitting automatically - no manual chunks
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
