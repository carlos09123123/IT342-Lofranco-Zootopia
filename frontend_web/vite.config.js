import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/features/shared'),
      '@admin': path.resolve(__dirname, './src/features/admin'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@shop': path.resolve(__dirname, './src/features/shop'),
      '@checkout': path.resolve(__dirname, './src/features/checkout'),
      '@about': path.resolve(__dirname, './src/features/about'),
    },
  },
});
