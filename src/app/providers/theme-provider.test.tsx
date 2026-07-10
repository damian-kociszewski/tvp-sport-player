import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { SETTINGS_KEY } from '@/shared/settings'
import { createChromeMock } from '@/test/chrome-mock'

const createMatchMedia = (matches: boolean) =>
  vi.fn(() => ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
})

describe('ThemeProvider', () => {
  it('applies the theme from settings and renders children', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(SETTINGS_KEY, { theme: 'dark' })
    vi.stubGlobal('chrome', mock)
    vi.stubGlobal('matchMedia', createMatchMedia(false))
    render(
      <SettingsProvider>
        <ThemeProvider>content</ThemeProvider>
      </SettingsProvider>,
    )
    await act(async () => {})
    expect(screen.queryByText('content')).not.toBeNull()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('resolves the system theme via the media query', async () => {
    vi.stubGlobal('matchMedia', createMatchMedia(true))
    render(
      <SettingsProvider>
        <ThemeProvider>content</ThemeProvider>
      </SettingsProvider>,
    )
    await act(async () => {})
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
