import {
  expect,
  showControls,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { STREAMS, VOD_HEIGHTS } from '../streams'

test('quality menu lists Auto and every variant height', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  const trigger = page.locator('#tvp-menu-quality')
  await expect(trigger).toHaveText('Auto')
  await trigger.click()
  const panel = page.locator('#tvp-player [data-radix-popper-content-wrapper]')
  await expect(panel.getByText('Auto', { exact: true })).toBeVisible()
  for (const height of VOD_HEIGHTS) {
    await expect(panel.getByText(`${height}p`, { exact: true })).toBeVisible()
  }
})

test('selecting a variant switches the rendered quality', async ({
  openPlayer,
}) => {
  test.setTimeout(60_000)
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await showControls(page)
  const lowest = VOD_HEIGHTS[VOD_HEIGHTS.length - 1]
  await page.click('#tvp-menu-quality')
  await page
    .locator('#tvp-player [data-radix-popper-content-wrapper]')
    .getByText(`${lowest}p`, { exact: true })
    .click()
  await expect(page.locator('#tvp-menu-quality')).toHaveText(`${lowest}p`)
  await expect
    .poll(async () => (await videoState(page)).videoHeight, {
      timeout: 40_000,
    })
    .toBe(lowest)
})

test('qualityMode highest picks the top variant on load', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { qualityMode: 'highest' },
  })
  await waitForPlaying(page)
  await showControls(page)
  await expect(page.locator('#tvp-menu-quality')).toHaveText(
    `${VOD_HEIGHTS[0]}p`,
    { timeout: 20_000 },
  )
})

test('qualityMode lowest picks the bottom variant on load', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { qualityMode: 'lowest' },
  })
  await waitForPlaying(page)
  await showControls(page)
  await expect(page.locator('#tvp-menu-quality')).toHaveText(
    `${VOD_HEIGHTS[VOD_HEIGHTS.length - 1]}p`,
    {
      timeout: 20_000,
    },
  )
})
