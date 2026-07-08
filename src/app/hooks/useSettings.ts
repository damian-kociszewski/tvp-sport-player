import { useContext } from 'react'
import {
  SettingsContext,
  type SettingsState,
} from '@/app/providers/settings-provider'

export const useSettings = (): SettingsState => useContext(SettingsContext)
