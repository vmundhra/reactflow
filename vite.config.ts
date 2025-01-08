import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false
    },
    watch: {
      usePolling: true
    }
  },
  optimizeDeps: {
    force: true,
    include: [
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/with-selector'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      'use-sync-external-store/shim/with-selector': 'node_modules/use-sync-external-store/shim/with-selector.js'
    }
  },
  clearScreen: false
})
