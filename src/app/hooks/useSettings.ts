import { useEffect, useState } from 'react'
import { logger } from '@/shared/logger'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  type PlayerSettings,
  SETTINGS_KEY,
  saveSettings,
} from '@/shared/settings'

export interface SettingsState {
  ready: boolean
  settings: PlayerSettings
  update: (patch: Partial<PlayerSettings>) => void
}

export const useSettings = (): SettingsState => {
  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    void loadSettings().then((s) => {
      setSettings(s)
      setReady(true)
    })

    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return
    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'local' && changes[SETTINGS_KEY]?.newValue) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...(changes[SETTINGS_KEY].newValue as Partial<PlayerSettings>),
        })
      }
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  const update = (patch: Partial<PlayerSettings>) => {
    logger.info('player', 'settings changed', patch)
    setSettings((prev) => ({ ...prev, ...patch }))
    void saveSettings(patch)
  }

  return { ready, settings, update }
}
