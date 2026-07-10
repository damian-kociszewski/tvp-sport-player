import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSettings } from '@/app/hooks/useSettings'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { DEFAULT_SETTINGS } from '@/shared/settings'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useSettings', () => {
  it('throws when used outside a SettingsProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useSettings())).toThrow(
      'useSettings must be used within a SettingsProvider',
    )
  })

  it('returns the settings state inside a SettingsProvider', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SettingsProvider>{children}</SettingsProvider>
    )
    const { result } = renderHook(() => useSettings(), { wrapper })
    await act(async () => {})
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS)
  })
})
