import { defineConfig } from 'vite';
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
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console statements in production (keep error/warn for debugging)
        drop_console: ['log', 'info', 'debug'],
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      format: {
        // Remove comments in production build
        comments: false
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
});
