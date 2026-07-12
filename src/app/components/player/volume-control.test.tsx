import { act, cleanup, render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSettings } from '@/app/hooks/useSettings'
import { SettingsProvider } from '@/app/providers/settings-provider'
import type { PlayerSettings } from '@/shared/settings'
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

let updateSettings: (patch: Partial<PlayerSettings>) => void

const Probe = () => {
  const { update } = useSettings()
  updateSettings = update
  return null
}

const renderControl = async () => {
  const view = render(
    <SettingsProvider>
      <Probe />
      <VolumeControl />
    </SettingsProvider>,
  )
  await act(async () => {})
  return () =>
    view.rerender(
      <SettingsProvider>
        <Probe />
        <VolumeControl />
      </SettingsProvider>,
    )
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

describe('VolumeMemory', () => {
  it('writes nothing on mount even with rememberVolume on', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    await renderControl()
    await flushSave()
    expect(storedSettings(local)).toEqual({ rememberVolume: true })
  })

  it('writes nothing when rememberVolume is toggled on', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    media.volume = 0.5
    media.muted = true
    await renderControl()
    act(() => updateSettings({ rememberVolume: true }))
    await flushSave()
    expect(storedSettings(local)).toEqual({ rememberVolume: true })
  })

  it('saves only defaultVolume after the volume changes while rememberVolume is on', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderControl()
    media.volume = 0.7
    rerender()
    await flushSave()
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      defaultVolume: 0.7,
    })
  })

  it('never writes startMuted when the player is muted or unmuted', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderControl()
    media.muted = true
    rerender()
    await flushSave()
    expect(storedSettings(local)).toEqual({ rememberVolume: true })
    media.muted = false
    rerender()
    await flushSave()
    expect(storedSettings(local)).toEqual({ rememberVolume: true })
  })

  it('saves only defaultVolume when the volume changes while muted', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const rerender = await renderControl()
    media.muted = true
    media.volume = 0.4
    rerender()
    await flushSave()
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      defaultVolume: 0.4,
    })
  })

  it('writes nothing when rememberVolume is off', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const rerender = await renderControl()
    media.volume = 0.9
    media.muted = true
    rerender()
    await flushSave()
    expect(storedSettings(local)).toEqual({})
  })

  it('debounces rapid volume changes into a single save of the final value', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    const setSpy = vi.spyOn(chrome.storage.local, 'set')
    const rerender = await renderControl()
    for (const volume of [0.3, 0.5, 0.7]) {
      media.volume = volume
      rerender()
      await act(async () => {
        vi.advanceTimersByTime(100)
      })
    }
    await flushSave()
    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(storedSettings(local)).toEqual({
      rememberVolume: true,
      defaultVolume: 0.7,
    })
  })
})
