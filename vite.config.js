import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'three128': 'three',
      '@designcodeio/threeui/style.css': path.resolve(__dirname, './src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(__dirname, './src/shaders/animated-top-dock/AnimatedTopDock.tsx'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
