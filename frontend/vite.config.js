import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
});