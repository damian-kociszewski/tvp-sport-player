import { expect, test, waitForPlaying } from '../fixtures'
import { STREAMS } from '../streams'

test('shortcuts menu lists the keyboard shortcuts', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await page.click('#tvp-menu-shortcuts')
  const panel = page.locator('#tvp-shortcuts-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByText('Odtwórz / pauza')).toBeVisible()
  await expect(panel.getByText('Spacja')).toBeVisible()
  await expect(panel.getByText('Pełny ekran')).toBeVisible()
  await expect(panel.getByText('Przejdź na żywo')).toBeVisible()
  await expect(panel.getByText('Głośność')).toBeVisible()
})

test('faq menu opens with help content', async ({ openPlayer }) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await page.click('#tvp-menu-faq')
  const panel = page.locator('#tvp-faq-panel')
  await expect(panel).toBeVisible()
  await expect(panel.locator('div, p').first()).not.toBeEmpty()
})

test('logs menu shows entries, copies and clears them', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await waitForPlaying(page)
  await page.evaluate(() => {
    const holder = window as unknown as { __copied: string | null }
    holder.__copied = null
    navigator.clipboard.writeText = (text: string) => {
      holder.__copied = text
      return Promise.resolve()
    }
  })
  await page.click('#tvp-menu-logs')
  const panel = page.locator('#tvp-logs-panel')
  await expect(panel).toBeVisible()
  await expect(panel.getByText('ready to play').first()).toBeVisible()

  await panel.getByRole('button', { name: 'Kopiuj' }).click()
  const copied = await page.evaluate(
    () => (window as unknown as { __copied: string | null }).__copied,
  )
  expect(copied).toContain('ready to play')

  await panel.getByRole('button', { name: 'Wyczyść' }).click()
  await expect(panel.getByText('Brak logów.')).toBeVisible()
})
