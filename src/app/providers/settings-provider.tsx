import {
  createContext,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { logger } from '@/shared/logger'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  type PlayerSettings,
  SETTING_KEYS,
  saveSettings,
  settingKeyOf,
} from '@/shared/settings'

export interface SettingsState {
  settings: PlayerSettings
  initial: PlayerSettings
  update: (patch: Partial<PlayerSettings>) => void
}

export const SettingsContext = createContext<SettingsState | null>(null)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const initialRef = useRef<PlayerSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    void loadSettings().then((s) => {
      initialRef.current = s
      setSettings(s)
      setReady(true)
    })

    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return
    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== 'local') return
      const patch: Partial<PlayerSettings> = {}
      for (const key of SETTING_KEYS) {
        const change = changes[settingKeyOf(key)]
        if (!change) continue
        ;(patch as Record<keyof PlayerSettings, unknown>)[key] =
          change.newValue ?? DEFAULT_SETTINGS[key]
      }
      if (Object.keys(patch).length === 0) return
      setSettings((prev) => ({ ...prev, ...patch }))
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  const update = (patch: Partial<PlayerSettings>) => {
    logger.info('player', 'settings changed', patch)
    setSettings((prev) => ({ ...prev, ...patch }))
    void saveSettings(patch)
  }

  if (!ready) return null

  return (
    <SettingsContext.Provider
      value={{ settings, initial: initialRef.current, update }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
