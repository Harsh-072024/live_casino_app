import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: 'esbuild',
  },
  preview: {
    host: true,
    port: 4173,
    // ✅ Add this line
    allowedHosts: ['live-casino-app-1.onrender.com']
  },
  server: {
    host: true,
    port: 5173,
  },
});
