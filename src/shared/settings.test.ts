import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  settingKeyOf,
} from '@/shared/settings'
import {
  createChromeMock,
  seedSettings,
  storedSettings,
} from '@/test/chrome-mock'

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

  it('merges stored per-key values over defaults', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { theme: 'dark', seekStep: 30 })
    vi.stubGlobal('chrome', mock)
    expect(await loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'dark',
      seekStep: 30,
    })
  })

  it('keeps falsy stored values instead of defaults', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { defaultVolume: 0, autoplay: false, customCss: '' })
    vi.stubGlobal('chrome', mock)
    const settings = await loadSettings()
    expect(settings.defaultVolume).toBe(0)
    expect(settings.autoplay).toBe(false)
  })
})

describe('saveSettings', () => {
  it('is a no-op when chrome storage is unavailable', async () => {
    await expect(saveSettings({ theme: 'dark' })).resolves.toBeUndefined()
  })

  it('writes only the keys present in the patch', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await saveSettings({ theme: 'light', defaultVolume: 0.5 })
    expect(storedSettings(local)).toEqual({
      theme: 'light',
      defaultVolume: 0.5,
    })
    expect(local.data.size).toBe(2)
  })

  it('never rewrites settings outside the patch', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { startMuted: true, rememberVolume: true })
    vi.stubGlobal('chrome', mock)
    await saveSettings({ defaultVolume: 0.7 })
    expect(storedSettings(local)).toEqual({
      startMuted: true,
      rememberVolume: true,
      defaultVolume: 0.7,
    })
  })

  it('does not lose either write when two saves race', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await Promise.all([
      saveSettings({ defaultVolume: 0.9 }),
      saveSettings({ startMuted: true }),
    ])
    expect(storedSettings(local)).toEqual({
      defaultVolume: 0.9,
      startMuted: true,
    })
  })

  it('accumulates sequential patches', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await saveSettings({ theme: 'dark' })
    await saveSettings({ seekStep: 5 })
    expect(storedSettings(local)).toEqual({ theme: 'dark', seekStep: 5 })
  })
})

describe('settingKeyOf', () => {
  it('namespaces each setting under its own storage key', () => {
    expect(settingKeyOf('startMuted')).toBe('settings.startMuted')
  })
})
