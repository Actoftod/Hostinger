import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentGretaTagger } from "@questlabs/greta-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [componentGretaTagger(), react()],
    base: './',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        "lucide-react": path.resolve(__dirname, "node_modules/lucide-react/dist/esm/lucide-react.js"),
      }
    },
    server: {
      historyApiFallback: true,
      port: 3000,
      host: '0.0.0.0',
    },
    optimizeDeps: {
      include: ['lucide-react', 'scheduler'],
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'framer-motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
  };
});