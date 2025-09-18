import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      fastRefresh: mode !== 'production',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));