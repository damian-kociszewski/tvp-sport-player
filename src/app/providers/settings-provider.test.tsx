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
import { DEFAULT_SETTINGS, SETTINGS_KEY } from '@/shared/settings'
import { createChromeMock } from '@/test/chrome-mock'

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
    local.data.set(SETTINGS_KEY, { theme: 'dark', seekStep: 30 })
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
    expect(local.data.get(SETTINGS_KEY)).toEqual({
      ...DEFAULT_SETTINGS,
      defaultVolume: 0.8,
    })
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
        { [SETTINGS_KEY]: { newValue: { theme: 'dark' } } },
        'local',
      ),
    )
    expect(result.current.settings).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
    })
  })

  it('ignores changes from other storage areas', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { result } = await renderSettings()
    act(() =>
      emitStorageChange(
        { [SETTINGS_KEY]: { newValue: { theme: 'dark' } } },
        'session',
      ),
    )
    expect(result.current.settings.theme).toBe(DEFAULT_SETTINGS.theme)
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
