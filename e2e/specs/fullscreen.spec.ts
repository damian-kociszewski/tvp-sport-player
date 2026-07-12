import type { Page } from '@playwright/test'
import { expect, showControls, test, waitForPlaying } from '../fixtures'
import { STREAMS } from '../streams'

const fullscreenActive = (page: Page) =>
  page.evaluate(() => document.fullscreenElement != null)

test('fullscreen toggles via button and f key', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  await page.click('#tvp-btn-fullscreen')
  await expect.poll(() => fullscreenActive(page)).toBe(true)
  await page.waitForTimeout(1_000)
  await page.keyboard.press('f')
  await expect.poll(() => fullscreenActive(page)).toBe(false)
  await page.waitForTimeout(1_000)
  await page.keyboard.press('f')
  await expect.poll(() => fullscreenActive(page)).toBe(true)
  await page.waitForTimeout(1_000)
  await page.keyboard.press('f')
  await expect.poll(() => fullscreenActive(page)).toBe(false)
})
