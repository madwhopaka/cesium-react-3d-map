import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cesium from "vite-plugin-cesium";

export default defineConfig({
  plugins: [react(),cesium()],
  server: {
    host: "0.0.0.0",   // listen on all interfaces
    port: 5173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    
  },
});



