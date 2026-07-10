import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SettingsMenu } from '@/app/components/menus/settings-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { DEFAULT_SETTINGS, SETTINGS_KEY } from '@/shared/settings'
import { createChromeMock } from '@/test/chrome-mock'

const openMenu = async () => {
  render(
    <SettingsProvider>
      <TooltipProvider>
        <SettingsMenu />
      </TooltipProvider>
    </SettingsProvider>,
  )
  await act(async () => {})
  fireEvent.click(screen.getByRole('button', { name: 'Ustawienia' }))
  await act(async () => {})
}

const rowSwitch = (label: string) => {
  const row = screen.getByText(label).parentElement as HTMLElement
  return within(row).getByRole('switch')
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SettingsMenu', () => {
  it('shows the default volume', async () => {
    vi.stubGlobal('chrome', createChromeMock().chrome)
    await openMenu()
    expect(screen.getByText('20%')).toBeTruthy()
  })

  it('toggles autoplay and persists it', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(rowSwitch('Autoodtwarzanie'))
    await act(async () => {})
    expect(local.data.get(SETTINGS_KEY)).toMatchObject({ autoplay: false })
  })

  it('reflects stored settings in the controls', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(SETTINGS_KEY, { startMuted: true })
    vi.stubGlobal('chrome', mock)
    await openMenu()
    const control = rowSwitch('Rozpoczynaj wyciszony')
    expect(control.getAttribute('data-state')).toBe('checked')
  })

  it('changes the quality mode and persists it', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('radio', { name: 'Najwyższa' }))
    await act(async () => {})
    expect(local.data.get(SETTINGS_KEY)).toMatchObject({
      qualityMode: 'highest',
    })
  })

  it('changes the seek step and persists it as a number', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('radio', { name: '60s' }))
    await act(async () => {})
    expect(local.data.get(SETTINGS_KEY)).toMatchObject({ seekStep: 60 })
  })

  it('resets settings to defaults', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(SETTINGS_KEY, { theme: 'dark', seekStep: 60 })
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('button', { name: /Resetuj ustawienia/ }))
    await act(async () => {})
    expect(local.data.get(SETTINGS_KEY)).toEqual(DEFAULT_SETTINGS)
  })
})
