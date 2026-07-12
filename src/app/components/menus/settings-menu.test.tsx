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
import { DEFAULT_SETTINGS, type PlayerSettings } from '@/shared/settings'
import {
  createChromeMock,
  seedSettings,
  storedSettings,
} from '@/test/chrome-mock'

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
    expect(storedSettings(local)).toEqual({ autoplay: false })
  })

  it('reflects stored settings in the controls', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { startMuted: true })
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
    expect(storedSettings(local)).toEqual({ qualityMode: 'highest' })
  })

  it('changes the seek step and persists it as a number', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('radio', { name: '60s' }))
    await act(async () => {})
    expect(storedSettings(local)).toEqual({ seekStep: 60 })
  })

  const SWITCHES: [string, keyof PlayerSettings][] = [
    ['Zapamiętaj głośność', 'rememberVolume'],
    ['Rozpoczynaj wyciszony', 'startMuted'],
    ['Autoodtwarzanie', 'autoplay'],
    ['Otwieraj automatycznie', 'autoOpen'],
  ]

  for (const [label, key] of SWITCHES) {
    it(`toggling the ${key} switch writes ${key} and nothing else`, async () => {
      const { chrome: mock, local } = createChromeMock()
      vi.stubGlobal('chrome', mock)
      await openMenu()
      fireEvent.click(rowSwitch(label))
      await act(async () => {})
      expect(storedSettings(local)).toEqual({
        [key]: !DEFAULT_SETTINGS[key],
      })
    })

    it(`toggling the ${key} switch leaves other stored settings untouched`, async () => {
      const stored: Partial<PlayerSettings> = {
        ...DEFAULT_SETTINGS,
        defaultVolume: 0.55,
        seekStep: 30,
        theme: 'dark',
        qualityMode: 'highest',
        clickAction: 'playPause',
        customCss: '.x{}',
      }
      const { chrome: mock, local } = createChromeMock()
      seedSettings(local, stored)
      vi.stubGlobal('chrome', mock)
      await openMenu()
      fireEvent.click(rowSwitch(label))
      await act(async () => {})
      expect(storedSettings(local)).toEqual({
        ...stored,
        [key]: !DEFAULT_SETTINGS[key],
      })
    })
  }

  it('resets settings to defaults', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { theme: 'dark', seekStep: 60 })
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('button', { name: /Resetuj ustawienia/ }))
    await act(async () => {})
    expect(storedSettings(local)).toEqual(DEFAULT_SETTINGS)
  })
})
