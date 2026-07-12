import type { Page } from '@playwright/test'
import { expect, test, waitForPlaying } from '../fixtures'
import { isUnreachable, TVP_PAGE } from '../streams'

const dismissConsent = async (page: Page) => {
  for (let attempt = 0; attempt < 12; attempt++) {
    const dismissed = await page.evaluate(() => {
      const root = document.querySelector('.tvp-cookie-overlay')
      if (!root) return false
      const leaf = Array.from(root.querySelectorAll('*')).find(
        (el) =>
          el.children.length === 0 &&
          /Akceptuję i przechodzę/i.test(el.textContent ?? ''),
      )
      if (!(leaf instanceof HTMLElement)) return false
      leaf.click()
      return true
    })
    if (dismissed) return
    await page.waitForTimeout(1_000)
  }
}

test('extension captures the stream on the TVP page and opens the player', async ({
  context,
}) => {
  test.setTimeout(120_000)
  test.skip(await isUnreachable(TVP_PAGE), 'TVP page is unreachable')

  const tvpPage = await context.newPage()
  await tvpPage.goto(TVP_PAGE, { waitUntil: 'load', timeout: 60_000 })
  await dismissConsent(tvpPage)

  const playOverlay = tvpPage.locator('.news-video__overlay--play').first()
  const hasVideo = await playOverlay
    .waitFor({ timeout: 20_000 })
    .then(() => true)
    .catch(() => false)
  test.skip(!hasVideo, 'TVP page has no playable video anymore')

  await playOverlay.scrollIntoViewIfNeeded()
  await playOverlay.click()

  const playerPage = await context.waitForEvent('page', {
    predicate: (page) =>
      page.url().includes('-extension://') &&
      page.url().includes('/index.html'),
    timeout: 45_000,
  })
  expect(playerPage.url()).toContain('?id=')
  await expect(playerPage.locator('#tvp-stream-title')).toContainText(
    /Hiszpania.*Belgia/,
  )
  await expect(playerPage.locator('#tvp-stream-subtitle')).toContainText(
    'MŚ 2026',
  )
  await waitForPlaying(playerPage)
})
