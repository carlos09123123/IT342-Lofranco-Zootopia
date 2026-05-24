import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/features/shared'),
      '@components': path.resolve(__dirname, './src/features/shared/components'),
      '@pages': path.resolve(__dirname, './src/features/pages'),
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@admin': path.resolve(__dirname, './src/features/admin'),
      '@shop': path.resolve(__dirname, './src/features/shop'),
      '@checkout': path.resolve(__dirname, './src/features/checkout'),
      '@about': path.resolve(__dirname, './src/features/about'),
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
