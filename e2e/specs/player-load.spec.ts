import {
  expect,
  expectTimeAdvancing,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { STREAMS } from '../streams'

test('shows title, subtitle and layout', async ({ openPlayer }) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    title: 'Hiszpania - Belgia',
    subtitle: 'MŚ 2026: 1/4 finału',
  })
  await expect(page.locator('#tvp-stream-title')).toHaveText(
    'Hiszpania - Belgia',
  )
  await expect(page.locator('#tvp-stream-subtitle')).toHaveText(
    'MŚ 2026: 1/4 finału',
  )
  await expect(page).toHaveTitle(
    'Hiszpania - Belgia — Odtwarzacz dla TVP SPORT™',
  )
  await expect(page.locator('#tvp-navbar')).toBeVisible()
  await expect(page.locator('#tvp-footer')).toBeVisible()
})

test('autoplays and playback advances', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await expectTimeAdvancing(page)
})

test('stays paused when autoplay is disabled', async ({ openPlayer }) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { autoplay: false },
  })
  await expect(page.locator('#tvp-player')).toHaveAttribute('data-can-play', '')
  expect((await videoState(page)).paused).toBe(true)
})

test('loads a stream payload by id from session storage', async ({
  serviceWorker,
  context,
  extensionBaseUrl,
}) => {
  await serviceWorker.evaluate(
    (payload) => {
      const api = (globalThis as { browser?: typeof chrome }).browser ?? chrome
      return api.storage.session.set({ 'player:e2e-id': payload })
    },
    {
      src: STREAMS.vod,
      title: 'Sesja testowa',
      subtitle: 'Podtytuł',
      sourceUrl: 'https://sport.tvp.pl/12345/test',
      capturedAt: Date.now(),
    },
  )
  const page = await context.newPage()
  await page.goto(`${extensionBaseUrl}/index.html?id=e2e-id`)
  await expect(page.locator('#tvp-stream-title')).toHaveText('Sesja testowa')
  await waitForPlaying(page)
})

test('shows missing state for an unknown id', async ({
  context,
  extensionBaseUrl,
}) => {
  const page = await context.newPage()
  await page.goto(`${extensionBaseUrl}/index.html?id=nope`)
  await expect(page.locator('#tvp-missing')).toBeVisible()
  await expect(page.locator('#tvp-error')).toContainText(
    'Brak danych transmisji',
  )
})
