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

const SETTINGS_KEY = 'settings'

const hasStorage = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

export const loadSettings = async (): Promise<PlayerSettings> => {
  if (!hasStorage()) return { ...DEFAULT_SETTINGS }
  const stored = (await chrome.storage.local.get(SETTINGS_KEY))[SETTINGS_KEY]
  return {
    ...DEFAULT_SETTINGS,
    ...(stored as Partial<PlayerSettings> | undefined),
  }
}

export const saveSettings = async (
  patch: Partial<PlayerSettings>,
): Promise<void> => {
  if (!hasStorage()) return
  const current = await loadSettings()
  await chrome.storage.local.set({ [SETTINGS_KEY]: { ...current, ...patch } })
}

export { SETTINGS_KEY }
