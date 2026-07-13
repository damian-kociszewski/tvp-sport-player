import { readFile, readdir, rm, rmdir } from 'node:fs/promises'
import { join } from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import manifest from './manifest.config'

const CAST_VENDOR_FILES = ['cast_framework.js', 'cast_sender.js']

const ALLOWED_URL_PREFIXES = [
  'http://www.w3.org/',
  'https://react.dev/errors/',
  'https://sport.tvp.pl',
  'https://github.com/damian-kociszewski/tvp-sport-player',
  'https://buymeacoffee.com/kociszewski',
  'https://kociszew.ski/',
  'https://aomedia.org/emsg/ID3',
]
const TEXT_FILE_PATTERN = /\.(js|html|css|json|svg)$/
const URL_PATTERN = /https?:\/\/[^\s"'`<>\\)]+/g

const assertNoExternalUrls = (outDir: string): Plugin => ({
  name: 'assert-no-external-urls',
  apply: 'build',
  async closeBundle() {
    const entries = await readdir(outDir, {
      recursive: true,
      withFileTypes: true,
    })
    const violations = new Set<string>()
    for (const entry of entries) {
      if (!entry.isFile() || !TEXT_FILE_PATTERN.test(entry.name)) continue
      const path = join(entry.parentPath, entry.name)
      const content = await readFile(path, 'utf8')
      for (const url of content.match(URL_PATTERN) ?? []) {
        if (!ALLOWED_URL_PREFIXES.some((prefix) => url.startsWith(prefix))) {
          violations.add(`${path}: ${url}`)
        }
      }
    }
    if (violations.size > 0) {
      throw new Error(
        'External URLs found in the final package (Manifest V3 forbids remotely hosted code; ' +
          'patch the dependency or extend ALLOWED_URL_PREFIXES in vite.config.ts):\n' +
          [...violations].join('\n'),
      )
    }
  },
})

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
    assertNoExternalUrls(mode === 'gecko' ? 'dist/gecko' : 'dist/chromium'),
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
