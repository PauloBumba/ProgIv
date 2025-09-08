import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      'Components': '/src/Components',
      'Pages': '/src/Pages',
      'Api': '/src/Api',
      'Reducers': '/src/Reducers',
      'Services': '/src/Services',
      'Router': '/src/Router',
      'Layout': '/src/Layout',
      'Helper': '/src/Helper',
    }
  },
  
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
   https: {
   key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),

  },// 🔥 aqui ativa HTTPS no Vite pra rodar seu front igual backend (HTTPS)
    hmr: {
      protocol: 'wss', // WebSocket seguro quando HTTPS tá ligado
      host: 'localhost',
      port: 5173,
    },
    fs: {
      strict: false,
    },
    open: true,
    proxy: {
      '/api': {
        target: ' https://localhost:7085/usecase',
        changeOrigin: true,
        secure: false, // aceita certificado dev autoassinado
       
      },
      
    }
  }
});
