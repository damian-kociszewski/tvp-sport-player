import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  SETTINGS_KEY,
  saveSettings,
} from '@/shared/settings'
import { createChromeMock } from '@/test/chrome-mock'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadSettings', () => {
  it('returns defaults when chrome storage is unavailable', async () => {
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('returns a copy that does not share state with defaults', async () => {
    const settings = await loadSettings()
    settings.seekStep = 99
    expect(DEFAULT_SETTINGS.seekStep).toBe(15)
  })

  it('returns defaults when nothing is stored', async () => {
    vi.stubGlobal('chrome', createChromeMock().chrome)
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('merges a stored partial over defaults', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(SETTINGS_KEY, { theme: 'dark', seekStep: 30 })
    vi.stubGlobal('chrome', mock)
    expect(await loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
      seekStep: 30,
    })
  })
})

describe('saveSettings', () => {
  it('is a no-op when chrome storage is unavailable', async () => {
    await expect(saveSettings({ theme: 'dark' })).resolves.toBeUndefined()
  })

  it('persists the patch merged with current settings', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await saveSettings({ theme: 'light', defaultVolume: 0.5 })
    expect(local.data.get(SETTINGS_KEY)).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'light',
      defaultVolume: 0.5,
    })
  })

  it('accumulates sequential patches', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await saveSettings({ theme: 'dark' })
    await saveSettings({ seekStep: 5 })
    expect(local.data.get(SETTINGS_KEY)).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
      seekStep: 5,
    })
  })
})
