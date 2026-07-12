import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsMenu } from '@/app/components/menus/settings-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { SettingsProvider } from '@/app/providers/settings-provider'
import {
  createChromeMock,
  seedSettings,
  storedSettings,
} from '@/test/chrome-mock'

const media = vi.hoisted(() => ({ volume: 0.2, muted: false }))

vi.mock('@vidstack/react', () => ({
  useMediaStore: () => ({ volume: media.volume, muted: media.muted }),
  useMediaState: (key: 'muted' | 'volume') => media[key],
  MuteButton: ({ children }: { children: ReactNode }) => (
    <button type="button">{children}</button>
  ),
  VolumeSlider: {
    Root: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Track: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    TrackFill: () => null,
    Thumb: () => null,
  },
}))

import { VolumeControl } from './volume-control'

const App = () => (
  <SettingsProvider>
    <TooltipProvider>
      <SettingsMenu />
      <VolumeControl />
    </TooltipProvider>
  </SettingsProvider>
)

const renderApp = async () => {
  const view = render(<App />)
  await act(async () => {})
  fireEvent.click(screen.getByRole('button', { name: 'Ustawienia' }))
  await act(async () => {})
  return () => view.rerender(<App />)
}

const startMutedSwitch = () => {
  const row = screen.getByText('Rozpoczynaj wyciszony')
    .parentElement as HTMLElement
  return within(row).getByRole('switch')
}

const flushSave = async () => {
  await act(async () => {
    vi.advanceTimersByTime(350)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  media.volume = 0.2
  media.muted = false
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('sound settings and player interplay', () => {
  it('muting the player never flips the start muted switch or its stored value', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderApp()
    expect(startMutedSwitch().getAttribute('data-state')).toBe('unchecked')
    media.muted = true
    rerender()
    await flushSave()
    expect(startMutedSwitch().getAttribute('data-state')).toBe('unchecked')
    expect(storedSettings(local)).toEqual({ rememberVolume: true })
  })

  it('a player volume change updates only the default volume shown in the menu', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderApp()
    media.volume = 0.7
    rerender()
    await flushSave()
    const panel = document.getElementById('tvp-settings-panel') as HTMLElement
    expect(within(panel).getByText('70%')).toBeTruthy()
    expect(startMutedSwitch().getAttribute('data-state')).toBe('unchecked')
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      defaultVolume: 0.7,
    })
  })

  it('clicking the start muted switch is the only thing that changes it', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderApp()
    fireEvent.click(startMutedSwitch())
    await act(async () => {})
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      startMuted: true,
    })
    media.muted = true
    rerender()
    await flushSave()
    media.muted = false
    media.volume = 0.6
    rerender()
    await flushSave()
    expect(startMutedSwitch().getAttribute('data-state')).toBe('checked')
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      startMuted: true,
      defaultVolume: 0.6,
    })
  })
})
