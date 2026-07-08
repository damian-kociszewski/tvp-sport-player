import type { ReactNode } from 'react'
import { useSettings } from '@/app/hooks/useSettings'
import { useTheme } from '@/app/hooks/useTheme'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings()
  useTheme(settings.theme)
  return children
}
