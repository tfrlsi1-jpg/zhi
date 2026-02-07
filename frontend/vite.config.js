import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 8080,
    host: true,
    allowedHosts: true // 或者指定具体域名 ['sublime-quietude-production-0477.up.railway.app']
  },  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
