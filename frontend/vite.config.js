import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) =>{
  const env = loadEnv(mode, process.cwd(), '');

  const BACKEND_URL = 'https://zhi-production.up.railway.app';

  const API_TARGET = BACKEND_URL || process.env.VITE_API_URL || env.VITE_API_URL || 'http://localhost:3001';

  console.log('--- Current API URL:', env.VITE_API_URL);
  console.log('--- 🛡️ Target API Debugging:', API_TARGET);

  return{
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: API_TARGET || env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
        port: 8080,        // 告訴 Railway 監聽哪個 Port
        host: true,        // 允許公網訪問
        allowedHosts: true, // 防止域名被擋掉
        proxy: {           // 轉發 API 請求到後端
          '/api': {
            target: API_TARGET || env.VITE_API_URL || 'http://localhost:3001',
            changeOrigin: true,
          },
        },
    }    
  };
});
