import type { Page } from '@playwright/test'
import { expect, test, videoState, waitForPlaying } from '../fixtures'
import { STREAMS } from '../streams'

const clickVideo = async (page: Page) => {
  const box = await page.locator('#tvp-player').boundingBox()
  if (!box) throw new Error('player not visible')
  await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.3)
}

test('click does nothing with the default none action', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await clickVideo(page)
  await page.waitForTimeout(1_000)
  const state = await videoState(page)
  expect(state.paused).toBe(false)
  expect(state.muted).toBe(false)
})

test('click toggles pause with the playPause action', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { clickAction: 'playPause' },
  })
  await waitForPlaying(page)
  await clickVideo(page)
  await expect.poll(async () => (await videoState(page)).paused).toBe(true)
  await clickVideo(page)
  await expect.poll(async () => (await videoState(page)).paused).toBe(false)
})

test('click toggles mute with the muteUnmute action', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { clickAction: 'muteUnmute' },
  })
  await waitForPlaying(page)
  await clickVideo(page)
  await expect.poll(async () => (await videoState(page)).muted).toBe(true)
  await clickVideo(page)
  await expect.poll(async () => (await videoState(page)).muted).toBe(false)
})

test('changing the click action applies without a reload', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await page.click('#tvp-menu-settings')
  const row = page
    .locator('#tvp-settings-panel div.px-3.py-2')
    .filter({ hasText: 'Kliknięcie w obraz' })
  await row.getByText('Odtwórz / pauza', { exact: true }).click()
  await page.keyboard.press('Escape')
  await clickVideo(page)
  await expect.poll(async () => (await videoState(page)).paused).toBe(true)
})
