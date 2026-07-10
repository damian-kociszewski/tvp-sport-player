import { useContext } from 'react'
import {
  SettingsContext,
  type SettingsState,
} from '@/app/providers/settings-provider'

export const useSettings = (): SettingsState => {
  const context = useContext(SettingsContext)
  if (!context)
    throw new Error('useSettings must be used within a SettingsProvider')
  return context
}
