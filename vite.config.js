import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy HTTP requests
      '/api': {
        target: 'https://whatsapp-server-lemon.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix
      },
      // Proxy WebSocket requests
      '/socket.io': {
        target: 'wss://https://whatsapp-server-lemon.vercel.app',
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
});
