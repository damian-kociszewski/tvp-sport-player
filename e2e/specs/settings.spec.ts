import type { Locator, Page } from '@playwright/test'
import { DEFAULT_SETTINGS } from '../../src/shared/settings'
import {
  expect,
  readSettings,
  showControls,
  test,
  videoState,
  waitForPlaying,
} from '../fixtures'
import { STREAMS } from '../streams'

const settingsRow = (page: Page, label: string): Locator =>
  page
    .locator('#tvp-settings-panel div.px-3.py-2')
    .filter({ has: page.locator(`span:text-is("${label}")`) })

const openSettings = async (page: Page) => {
  await page.click('#tvp-menu-settings')
  await expect(page.locator('#tvp-settings-panel')).toBeVisible()
}

test('renders every settings row', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await openSettings(page)
  for (const label of [
    'Głośność domyślna',
    'Zapamiętaj głośność',
    'Rozpoczynaj wyciszony',
    'Autoodtwarzanie',
    'Otwieraj automatycznie',
    'Jakość',
    'Kliknięcie w obraz',
    'Przewijanie',
    'Motyw',
    'Własny CSS',
  ]) {
    await expect(settingsRow(page, label)).toBeVisible()
  }
  await expect(
    page.getByRole('button', { name: 'Resetuj ustawienia' }),
  ).toBeVisible()
})

test('switches and segments persist to storage', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await openSettings(page)

  await settingsRow(page, 'Zapamiętaj głośność').getByRole('switch').click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).rememberVolume)
    .toBe(true)

  await settingsRow(page, 'Rozpoczynaj wyciszony').getByRole('switch').click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).startMuted)
    .toBe(true)

  await settingsRow(page, 'Autoodtwarzanie').getByRole('switch').click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).autoplay)
    .toBe(false)

  await settingsRow(page, 'Otwieraj automatycznie').getByRole('switch').click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).autoOpen)
    .toBe(false)

  await settingsRow(page, 'Jakość')
    .getByText('Najwyższa', { exact: true })
    .click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).qualityMode)
    .toBe('highest')

  await settingsRow(page, 'Kliknięcie w obraz')
    .getByText('Wycisz / odcisz', { exact: true })
    .click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).clickAction)
    .toBe('muteUnmute')

  await settingsRow(page, 'Przewijanie')
    .getByText('30s', { exact: true })
    .click()
  await expect
    .poll(async () => (await readSettings(serviceWorker)).seekStep)
    .toBe(30)
})

test('changed settings survive a reload', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await openSettings(page)
  await settingsRow(page, 'Rozpoczynaj wyciszony').getByRole('switch').click()
  await expect(
    settingsRow(page, 'Rozpoczynaj wyciszony').getByRole('switch'),
  ).toHaveAttribute('data-state', 'checked')
  await page.reload()
  await openSettings(page)
  await expect(
    settingsRow(page, 'Rozpoczynaj wyciszony').getByRole('switch'),
  ).toHaveAttribute('data-state', 'checked')
})

test('default volume and start muted apply to a new window', async ({
  openPlayer,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { defaultVolume: 0.5, startMuted: true },
  })
  await waitForPlaying(page)
  const state = await videoState(page)
  expect(state.volume).toBeCloseTo(0.5, 2)
  expect(state.muted).toBe(true)
  await showControls(page)
  await expect(page.locator('#tvp-volume-value')).toHaveText('0%')
})

test('remember volume stores changes as the new default', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { rememberVolume: true },
  })
  await waitForPlaying(page)
  await page.keyboard.press('ArrowUp')
  await expect
    .poll(async () => (await readSettings(serviceWorker)).defaultVolume, {
      timeout: 5_000,
    })
    .toBeGreaterThan(DEFAULT_SETTINGS.defaultVolume)
})

test('muting and unmuting the player changes no stored setting', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { rememberVolume: true },
  })
  await waitForPlaying(page)
  await page.keyboard.press('ArrowUp')
  await expect
    .poll(async () => (await readSettings(serviceWorker)).defaultVolume, {
      timeout: 5_000,
    })
    .toBeGreaterThan(DEFAULT_SETTINGS.defaultVolume)
  const before = await readSettings(serviceWorker)
  expect(before.startMuted).toBe(false)

  await page.keyboard.press('m')
  await showControls(page)
  await expect(page.locator('#tvp-volume-value')).toHaveText('0%')
  await page.waitForTimeout(600)
  expect(await readSettings(serviceWorker)).toEqual(before)

  await page.keyboard.press('m')
  await page.waitForTimeout(600)
  expect(await readSettings(serviceWorker)).toEqual(before)
})

test('reset restores the defaults', async ({ openPlayer, serviceWorker }) => {
  const page = await openPlayer({
    src: STREAMS.vod,
    settings: { seekStep: 60, theme: 'dark', startMuted: true },
  })
  await openSettings(page)
  await page.getByRole('button', { name: 'Resetuj ustawienia' }).click()
  await expect
    .poll(async () => readSettings(serviceWorker))
    .toEqual(DEFAULT_SETTINGS)
})
