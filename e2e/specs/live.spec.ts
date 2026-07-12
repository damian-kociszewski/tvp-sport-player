import type { Page } from '@playwright/test'
import {
  expect,
  showControls,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { isUnreachable, STREAMS } from '../streams'

const liveEdgeDistance = (page: Page) =>
  page.evaluate(() => {
    const video = document.querySelector('#tvp-player video')
    if (!(video instanceof HTMLVideoElement) || video.seekable.length === 0) {
      return Number.NaN
    }
    return video.seekable.end(video.seekable.length - 1) - video.currentTime
  })

const seekBack = (page: Page, seconds: number) =>
  page.evaluate((s) => {
    const video = document.querySelector('#tvp-player video')
    if (!(video instanceof HTMLVideoElement)) throw new Error('video not found')
    video.currentTime = Math.max(video.seekable.start(0), video.currentTime - s)
  }, seconds)

test('recording shows the NAGRANIE badge', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  const badge = page.locator('#tvp-live')
  await expect(badge).toHaveText('NAGRANIE')
  const tag = await badge.evaluate((el) => el.tagName)
  expect(tag).toBe('SPAN')
})

test.describe('live stream', () => {
  let page: Page

  test.beforeEach(async ({ openPlayer }) => {
    test.skip(await isUnreachable(STREAMS.live), 'live test stream is down')
    page = await openPlayer({ src: STREAMS.live, title: 'Live test' })
    await waitForPlaying(page)
    await showControls(page)
  })

  test('shows the NA ŻYWO button and hides seek controls', async () => {
    const live = page.locator('#tvp-live')
    await expect(live).toHaveText('NA ŻYWO')
    const tag = await live.evaluate((el) => el.tagName)
    expect(tag).toBe('BUTTON')
    await expect(page.locator('#tvp-seekbar')).toHaveCount(0)
    await expect(page.locator('#tvp-time')).toHaveCount(0)
    await expect(page.locator('#tvp-btn-seek-back')).toHaveCount(0)
    await expect(page.locator('#tvp-btn-seek-forward')).toHaveCount(0)
  })

  test('l key jumps back to the live edge', async () => {
    await seekBack(page, 30)
    const behind = (await videoState(page)).currentTime
    expect(await liveEdgeDistance(page)).toBeGreaterThan(20)
    await page.keyboard.press('l')
    await expect
      .poll(async () => (await videoState(page)).currentTime, {
        timeout: 4_000,
      })
      .toBeGreaterThan(behind + 15)
  })

  test('NA ŻYWO button jumps back to the live edge', async () => {
    await seekBack(page, 30)
    const behind = (await videoState(page)).currentTime
    expect(await liveEdgeDistance(page)).toBeGreaterThan(20)
    await showControls(page)
    await page.click('#tvp-live')
    await expect
      .poll(async () => (await videoState(page)).currentTime, {
        timeout: 4_000,
      })
      .toBeGreaterThan(behind + 15)
  })
})
