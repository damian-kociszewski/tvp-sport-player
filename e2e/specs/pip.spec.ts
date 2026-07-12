import type { Page } from '@playwright/test'
import { expect, showControls, test, waitForPlaying } from '../fixtures'
import { STREAMS } from '../streams'

const pipActive = (page: Page) =>
  page.evaluate(() => document.pictureInPictureElement != null)

test('picture in picture toggles via button and i key', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  await page.click('#tvp-btn-pip')
  await expect.poll(() => pipActive(page)).toBe(true)
  await page.keyboard.press('i')
  await expect.poll(() => pipActive(page)).toBe(false)
  await page.keyboard.press('i')
  await expect.poll(() => pipActive(page)).toBe(true)
})
