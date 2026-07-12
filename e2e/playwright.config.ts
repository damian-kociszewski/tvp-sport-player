import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './specs',
  outputDir: '../test-results',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [
        ['list'],
        ['github'],
        ['junit', { outputFile: '../test-results/junit.xml' }],
      ]
    : [['list'], ['junit', { outputFile: '../test-results/junit.xml' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
})
