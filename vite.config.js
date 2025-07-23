import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/restaurant/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'docs',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});
