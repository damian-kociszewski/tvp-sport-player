export type QualityMode = 'auto' | 'highest' | 'lowest'
export type Theme = 'light' | 'dark' | 'system'

export interface PlayerSettings {
  theme: Theme
  defaultVolume: number
  startMuted: boolean
  qualityMode: QualityMode
  autoplay: boolean
  rememberVolume: boolean
  seekStep: number
  autoOpen: boolean
}

export const DEFAULT_SETTINGS: PlayerSettings = {
  theme: 'system',
  defaultVolume: 0.5,
  startMuted: false,
  qualityMode: 'auto',
  autoplay: true,
  rememberVolume: true,
  seekStep: 10,
  autoOpen: false,
}

const SETTINGS_KEY = 'settings'

function hasStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

export async function loadSettings(): Promise<PlayerSettings> {
  if (!hasStorage()) return { ...DEFAULT_SETTINGS }
  const stored = (await chrome.storage.local.get(SETTINGS_KEY))[SETTINGS_KEY]
  return {
    ...DEFAULT_SETTINGS,
    ...(stored as Partial<PlayerSettings> | undefined),
  }
}

export async function saveSettings(
  patch: Partial<PlayerSettings>,
): Promise<void> {
  if (!hasStorage()) return
  const current = await loadSettings()
  await chrome.storage.local.set({ [SETTINGS_KEY]: { ...current, ...patch } })
}

export { SETTINGS_KEY }
