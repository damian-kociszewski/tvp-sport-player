import type { Page } from '@playwright/test'
import {
  expect,
  showControls,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { STREAMS } from '../streams'

let page: Page

test.beforeEach(async ({ openPlayer }) => {
  page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
})

test('play button toggles pause and play', async () => {
  await showControls(page)
  await page.click('#tvp-btn-play')
  await expect.poll(async () => (await videoState(page)).paused).toBe(true)
  await page.click('#tvp-btn-play')
  await expect.poll(async () => (await videoState(page)).paused).toBe(false)
})

test('space and k toggle pause', async () => {
  await page.keyboard.press('Space')
  await expect.poll(async () => (await videoState(page)).paused).toBe(true)
  await page.keyboard.press('k')
  await expect.poll(async () => (await videoState(page)).paused).toBe(false)
})

test('mute button and m toggle mute', async () => {
  await showControls(page)
  await page.click('#tvp-btn-mute')
  await expect.poll(async () => (await videoState(page)).muted).toBe(true)
  await expect(page.locator('#tvp-volume-value')).toHaveText('0%')
  await page.keyboard.press('m')
  await expect.poll(async () => (await videoState(page)).muted).toBe(false)
})

test('arrow keys change volume and value display follows', async () => {
  const before = (await videoState(page)).volume
  await page.keyboard.press('ArrowUp')
  await expect
    .poll(async () => (await videoState(page)).volume)
    .toBeGreaterThan(before)
  const raised = (await videoState(page)).volume
  await showControls(page)
  await expect(page.locator('#tvp-volume-value')).toHaveText(
    `${Math.round(raised * 100)}%`,
  )
  await page.keyboard.press('ArrowDown')
  await expect
    .poll(async () => (await videoState(page)).volume)
    .toBeLessThan(raised)
})

test('volume slider reacts to keyboard and pointer', async () => {
  await showControls(page)
  const slider = page.locator('#tvp-volume-slider')
  await slider.focus()
  const before = Math.round((await videoState(page)).volume * 100)
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(async () => Math.round((await videoState(page)).volume * 100))
    .toBe(before + 1)
  await showControls(page)
  const box = await slider.boundingBox()
  if (!box) throw new Error('slider not visible')
  const target = { x: box.x + box.width * 0.5, y: box.y + box.height / 2 }
  await page.mouse.move(target.x, target.y)
  await page.mouse.down()
  await page.mouse.up()
  await expect
    .poll(async () => (await videoState(page)).volume)
    .toBeGreaterThan(0.44)
  const volume = (await videoState(page)).volume
  expect(volume).toBeLessThan(0.56)
  await expect(page.locator('#tvp-volume-value')).toHaveText(
    `${Math.round(volume * 100)}%`,
  )
})
