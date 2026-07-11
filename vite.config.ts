import { readdir, rm, rmdir } from 'node:fs/promises'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import manifest from './manifest.config'

const CAST_VENDOR_FILES = ['cast_framework.js', 'cast_sender.js']

const stripCastVendor = (outDir: string): Plugin => ({
  name: 'strip-cast-vendor',
  apply: 'build',
  async closeBundle() {
    const vendorDir = `${outDir}/vendor`
    await Promise.all(
      CAST_VENDOR_FILES.map((file) =>
        rm(`${vendorDir}/${file}`, { force: true }),
      ),
    )
    const remaining = await readdir(vendorDir).catch(() => null)
    if (remaining?.length === 0) await rmdir(vendorDir)
  },
})

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    crx({ manifest, browser: mode === 'gecko' ? 'firefox' : 'chrome' }),
    ...(mode === 'gecko' ? [stripCastVendor('dist/gecko')] : []),
  ],
  define: {
    __CAST_AVAILABLE__: JSON.stringify(mode !== 'gecko'),
  },
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
