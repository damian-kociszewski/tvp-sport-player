import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __CAST_AVAILABLE__: 'true',
  },
  resolve: {
    alias: { '@': new URL('src', import.meta.url).pathname },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['src/test/setup.ts'],
    execArgv: ['--no-experimental-webstorage'],
  },
})
