// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/recommend': 'http://127.0.0.1:5000',
      '/api': 'http://localhost:5000', // ✅ Corrected from 3000 to 5000
    },
  },
});
