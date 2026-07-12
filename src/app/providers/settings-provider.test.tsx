import {
  act,
  cleanup,
  render,
  renderHook,
  screen,
} from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSettings } from '@/app/hooks/useSettings'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { DEFAULT_SETTINGS, settingKeyOf } from '@/shared/settings'
import {
  createChromeMock,
  seedSettings,
  storedSettings,
} from '@/test/chrome-mock'

const wrapper = ({ children }: { children: ReactNode }) => (
  <SettingsProvider>{children}</SettingsProvider>
)

const flushEffects = () => act(async () => {})

const renderSettings = async () => {
  const view = renderHook(() => useSettings(), { wrapper })
  await flushEffects()
  expect(view.result.current).toBeTruthy()
  return view
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SettingsProvider', () => {
  it('renders children only after settings are loaded', async () => {
    render(<SettingsProvider>ready</SettingsProvider>)
    expect(screen.queryByText('ready')).toBeNull()
    await flushEffects()
    expect(screen.queryByText('ready')).not.toBeNull()
  })

  it('provides defaults when chrome storage is unavailable', async () => {
    const { result } = await renderSettings()
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
    expect(result.current.initial).toEqual(DEFAULT_SETTINGS)
  })

  it('loads stored settings and exposes them as initial', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { theme: 'dark', seekStep: 30 })
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    expect(result.current.settings.theme).toBe('dark')
    expect(result.current.settings.seekStep).toBe(30)
    expect(result.current.initial.theme).toBe('dark')
  })

  it('update patches settings and persists them', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() => result.current.update({ defaultVolume: 0.8 }))
    expect(result.current.settings.defaultVolume).toBe(0.8)
    await flushEffects()
    expect(storedSettings(local)).toEqual({ defaultVolume: 0.8 })
  })

  it('update does not change initial', async () => {
    const { chrome: mock } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() => result.current.update({ theme: 'light' }))
    expect(result.current.initial.theme).toBe(DEFAULT_SETTINGS.theme)
  })

  it('applies external changes from local storage', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() =>
      emitStorageChange(
        { [settingKeyOf('theme')]: { newValue: 'dark' } },
        'local',
      ),
    )
    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
    })
  })

  it('applies only the changed keys, leaving the rest of the state intact', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() => result.current.update({ startMuted: true }))
    act(() =>
      emitStorageChange(
        { [settingKeyOf('defaultVolume')]: { newValue: 0.6 } },
        'local',
      ),
    )
    expect(result.current.settings.defaultVolume).toBe(0.6)
    expect(result.current.settings.startMuted).toBe(true)
  })

  it('falls back to the default when a setting key is removed', async () => {
    const { chrome: mock, local, emitStorageChange } = createChromeMock()
    seedSettings(local, { seekStep: 60 })
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    expect(result.current.settings.seekStep).toBe(60)
    act(() =>
      emitStorageChange(
        { [settingKeyOf('seekStep')]: { oldValue: 60 } },
        'local',
      ),
    )
    expect(result.current.settings.seekStep).toBe(DEFAULT_SETTINGS.seekStep)
  })

  it('ignores changes from other storage areas', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() =>
      emitStorageChange(
        { [settingKeyOf('theme')]: { newValue: 'dark' } },
        'session',
      ),
    )
    expect(result.current.settings.theme).toBe(DEFAULT_SETTINGS.theme)
  })

  it('ignores unrelated storage keys', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() => emitStorageChange({ logs: { newValue: ['entry'] } }, 'local'))
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })

  it('unsubscribes from storage changes on unmount', async () => {
    const { chrome: mock, changeListeners } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const view = await renderSettings()
    expect(changeListeners.size).toBe(1)
    view.unmount()
    expect(changeListeners.size).toBe(0)
  })
})
