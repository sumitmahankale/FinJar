import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash]-v2.js`,
          chunkFileNames: `assets/[name]-[hash]-v2.js`,
          assetFileNames: `assets/[name]-[hash]-v2.[ext]`
        }
      }
    },
    server: {
      port: 5173,
      host: true
    },
    preview: {
      port: 4173,
      host: true
    },
    define: {
      // Ensure environment variables are properly loaded
      'process.env': {}
    }
  }
})
