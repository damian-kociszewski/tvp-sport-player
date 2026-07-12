import type { Page } from '@playwright/test'
import {
  expect,
  showControls,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { STREAMS } from '../streams'

const currentTime = async (page: Page) => (await videoState(page)).currentTime

test('time display shows current and total time', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  await expect(page.locator('#tvp-time')).toHaveText(/\d+:\d{2}.*\/.*\d+:\d{2}/)
})

test('seek buttons jump by the default 15s step', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  await expect(page.locator('#tvp-btn-seek-forward')).toHaveAttribute(
    'title',
    'Przewiń o 15s do przodu',
  )
  const before = await currentTime(page)
  await page.click('#tvp-btn-seek-forward')
  await expect.poll(() => currentTime(page)).toBeGreaterThanOrEqual(before + 13)
  const forwarded = await currentTime(page)
  await page.click('#tvp-btn-seek-back')
  await expect.poll(() => currentTime(page)).toBeLessThan(forwarded - 13)
})

test('seek step setting changes the jump size and clamps at zero', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { seekStep: 60 },
  })
  await waitForPlaying(page)
  await showControls(page)
  await expect(page.locator('#tvp-btn-seek-forward')).toHaveAttribute(
    'title',
    'Przewiń o 60s do przodu',
  )
  const before = await currentTime(page)
  await page.click('#tvp-btn-seek-forward')
  await expect.poll(() => currentTime(page)).toBeGreaterThanOrEqual(before + 58)
  await page.click('#tvp-btn-seek-back')
  await page.click('#tvp-btn-seek-back')
  await expect.poll(() => currentTime(page)).toBeLessThan(5)
})

test('arrow left and right seek by the step', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  const before = await currentTime(page)
  await page.keyboard.press('ArrowRight')
  await expect.poll(() => currentTime(page)).toBeGreaterThanOrEqual(before + 13)
  const forwarded = await currentTime(page)
  await page.keyboard.press('ArrowLeft')
  await expect.poll(() => currentTime(page)).toBeLessThan(forwarded - 13)
})

test('clicking the seek bar jumps to that position', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  const bar = page.locator('#tvp-seekbar')
  const box = await bar.boundingBox()
  if (!box) throw new Error('seek bar not visible')
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height / 2)
  const { duration } = await videoState(page)
  await expect.poll(() => currentTime(page)).toBeGreaterThan(duration * 0.4)
  expect(await currentTime(page)).toBeLessThan(duration * 0.6)
})
