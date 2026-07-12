import type { Page } from '@playwright/test'
import { expect, test } from '../fixtures'
import { STREAMS } from '../streams'

const appliedTheme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.theme)

test('seeded light and dark themes are applied', async ({ openPlayer }) => {
  const dark = await openPlayer({
    src: STREAMS.vod,
    settings: { theme: 'dark' },
  })
  await expect.poll(() => appliedTheme(dark)).toBe('dark')
  await dark.close()
  const light = await openPlayer({
    src: STREAMS.vod,
    settings: { theme: 'light' },
  })
  await expect.poll(() => appliedTheme(light)).toBe('light')
})

test('selecting a theme in settings applies immediately', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await page.click('#tvp-menu-settings')
  const row = page
    .locator('#tvp-settings-panel div.px-3.py-2')
    .filter({ hasText: 'Motyw' })
  await row.getByText('Ciemny', { exact: true }).click()
  await expect.poll(() => appliedTheme(page)).toBe('dark')
  await row.getByText('Jasny', { exact: true }).click()
  await expect.poll(() => appliedTheme(page)).toBe('light')
})

test('system theme follows the color scheme preference live', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { theme: 'system' },
  })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect.poll(() => appliedTheme(page)).toBe('dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect.poll(() => appliedTheme(page)).toBe('light')
})
