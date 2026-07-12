import { expect, test } from '../fixtures'
import { STREAMS } from '../streams'

test('shows the missing state without any parameters', async ({
  openPlayer,
}) => {
  const page = await openPlayer()
  await expect(page.locator('#tvp-missing')).toBeVisible()
  await expect(page.locator('#tvp-error')).toContainText(
    'Brak danych transmisji',
  )
  await expect(page.locator('#tvp-error')).toContainText(
    'Otwórz odtwarzacz z ikony rozszerzenia',
  )
})

test('shows the network error overlay for an unreachable stream', async ({
  openPlayer,
}) => {
  const page = await openPlayer({ src: STREAMS.unreachable })
  await expect(page.locator('#tvp-error')).toContainText(
    'Nie udało się załadować transmisji',
    { timeout: 25_000 },
  )
  await expect(page.locator('#tvp-error')).toContainText(
    'Sprawdź połączenie z internetem',
  )
  await expect(page.locator('#tvp-error a')).toHaveCount(0)
})
