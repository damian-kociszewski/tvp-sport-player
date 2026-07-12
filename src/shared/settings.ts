export type QualityMode = 'auto' | 'highest' | 'lowest'
export type Theme = 'light' | 'dark' | 'system'
export type ClickAction = 'playPause' | 'muteUnmute' | 'none'

export interface PlayerSettings {
  theme: Theme
  defaultVolume: number
  startMuted: boolean
  qualityMode: QualityMode
  autoplay: boolean
  rememberVolume: boolean
  seekStep: number
  autoOpen: boolean
  clickAction: ClickAction
  customCss: string
}

export const DEFAULT_SETTINGS: PlayerSettings = {
  theme: 'system',
  defaultVolume: 0.2,
  startMuted: false,
  qualityMode: 'auto',
  autoplay: true,
  rememberVolume: false,
  seekStep: 15,
  autoOpen: true,
  clickAction: 'none',
  customCss: '',
}

export const SETTING_KEYS = Object.keys(
  DEFAULT_SETTINGS,
) as (keyof PlayerSettings)[]

export const LEGACY_SETTINGS_KEY = 'settings'

export const settingKeyOf = (key: keyof PlayerSettings): string =>
  `settings.${key}`

const hasStorage = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

const migrateLegacySettings = async (): Promise<void> => {
  const legacy = (await chrome.storage.local.get(LEGACY_SETTINGS_KEY))[
    LEGACY_SETTINGS_KEY
  ] as Partial<PlayerSettings> | undefined
  if (!legacy) return
  const items: Record<string, unknown> = {}
  for (const key of SETTING_KEYS) {
    if (legacy[key] !== undefined) items[settingKeyOf(key)] = legacy[key]
  }
  await chrome.storage.local.set(items)
  await chrome.storage.local.remove(LEGACY_SETTINGS_KEY)
}

export const loadSettings = async (): Promise<PlayerSettings> => {
  if (!hasStorage()) return { ...DEFAULT_SETTINGS }
  await migrateLegacySettings()
  const stored = await chrome.storage.local.get(SETTING_KEYS.map(settingKeyOf))
  const entries = SETTING_KEYS.map((key) => [
    key,
    stored[settingKeyOf(key)] ?? DEFAULT_SETTINGS[key],
  ])
  return Object.fromEntries(entries) as PlayerSettings
}

export const saveSettings = async (
  patch: Partial<PlayerSettings>,
): Promise<void> => {
  if (!hasStorage()) return
  const items: Record<string, unknown> = {}
  for (const key of SETTING_KEYS) {
    const value = patch[key]
    if (value !== undefined) items[settingKeyOf(key)] = value
  }
  if (Object.keys(items).length === 0) return
  await chrome.storage.local.set(items)
}
