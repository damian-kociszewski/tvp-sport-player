import type { Page } from '@playwright/test'
import { expect, readSettings, test } from '../fixtures'
import { STREAMS } from '../streams'

const CSS = '#tvp-navbar { background-color: rgb(255, 0, 0) !important; }'

const navbarBackground = (page: Page) =>
  page.evaluate(() => {
    const navbar = document.querySelector('#tvp-navbar')
    if (!navbar) throw new Error('navbar not found')
    return getComputedStyle(navbar).backgroundColor
  })

const openCssDialog = async (page: Page) => {
  await page.click('#tvp-menu-settings')
  await page.getByRole('button', { name: 'Edytuj CSS' }).click()
  await expect(page.locator('#tvp-css-modal')).toBeVisible()
}

test('saved custom css is injected and survives a reload', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  await openCssDialog(page)
  await page.locator('#tvp-css-textarea').fill(CSS)
  await page.getByRole('button', { name: 'Zapisz' }).click()
  await expect(page.locator('#tvp-css-modal')).toBeHidden()
  await expect.poll(() => navbarBackground(page)).toBe('rgb(255, 0, 0)')
  await expect
    .poll(async () => (await readSettings(serviceWorker)).customCss)
    .toBe(CSS)
  await page.reload()
  await expect.poll(() => navbarBackground(page)).toBe('rgb(255, 0, 0)')
})

test('clearing the css in the modal removes the applied styles', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  const original = await navbarBackground(page)
  await openCssDialog(page)
  await page.locator('#tvp-css-textarea').fill(CSS)
  await page.getByRole('button', { name: 'Zapisz' }).click()
  await expect.poll(() => navbarBackground(page)).toBe('rgb(255, 0, 0)')
  await openCssDialog(page)
  await page.locator('#tvp-css-textarea').fill('')
  await page.getByRole('button', { name: 'Zapisz' }).click()
  await expect(page.locator('#tvp-css-modal')).toBeHidden()
  await expect.poll(() => navbarBackground(page)).toBe(original)
  await expect
    .poll(async () => (await readSettings(serviceWorker)).customCss)
    .toBe('')
})

test('cancel discards the edited css', async ({
  openPlayer,
  serviceWorker,
}) => {
  const page = await openPlayer({ src: STREAMS.vod })
  const before = await navbarBackground(page)
  await openCssDialog(page)
  await page.locator('#tvp-css-textarea').fill(CSS)
  await page.getByRole('button', { name: 'Anuluj' }).click()
  await expect(page.locator('#tvp-css-modal')).toBeHidden()
  expect(await navbarBackground(page)).toBe(before)
  expect((await readSettings(serviceWorker)).customCss).toBe('')
})
