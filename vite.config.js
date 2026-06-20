import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  // sockjs-client asume que existe la variable global "global" (propia
  // de Node.js). El navegador no la tiene, así que sin esto la app
  // explota apenas se importa el hook de WebSocket, con pantalla en
  // blanco y "Uncaught ReferenceError: global is not defined".
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})