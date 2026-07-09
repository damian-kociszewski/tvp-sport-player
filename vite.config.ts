import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import manifest from './manifest.config'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest, browser: mode === 'gecko' ? 'firefox' : 'chrome' }),
  ],
  resolve: {
    alias: { '@': new URL('src', import.meta.url).pathname },
  },
  build: {
    outDir: mode === 'gecko' ? 'dist/gecko' : 'dist/chromium',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: { index: 'index.html' },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/hls.js')) return 'hls'
          if (id.includes('node_modules/@vidstack')) return 'vidstack'
          return undefined
        },
      },
    },
  },
}))
