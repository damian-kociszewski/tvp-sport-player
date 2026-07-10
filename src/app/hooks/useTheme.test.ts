import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from '@/app/hooks/useTheme'

const createMatchMedia = (matches: boolean) => {
  const listeners = new Set<() => void>()
  const mql = {
    matches,
    addEventListener: (_type: string, listener: () => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: () => void) => {
      listeners.delete(listener)
    },
  }
  return {
    matchMedia: vi.fn(() => mql),
    setMatches: (value: boolean) => {
      mql.matches = value
      for (const listener of listeners) listener()
    },
    listeners,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  delete document.documentElement.dataset.theme
})

describe('useTheme', () => {
  it('applies an explicit dark theme', () => {
    vi.stubGlobal('matchMedia', createMatchMedia(false).matchMedia)
    renderHook(() => useTheme('dark'))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('applies an explicit light theme', () => {
    vi.stubGlobal('matchMedia', createMatchMedia(true).matchMedia)
    renderHook(() => useTheme('light'))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('resolves the system theme from the media query', () => {
    const media = createMatchMedia(true)
    vi.stubGlobal('matchMedia', media.matchMedia)
    renderHook(() => useTheme('system'))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('follows system theme changes', () => {
    const media = createMatchMedia(false)
    vi.stubGlobal('matchMedia', media.matchMedia)
    renderHook(() => useTheme('system'))
    expect(document.documentElement.dataset.theme).toBe('light')
    act(() => media.setMatches(true))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('does not subscribe for explicit themes', () => {
    const media = createMatchMedia(false)
    vi.stubGlobal('matchMedia', media.matchMedia)
    renderHook(() => useTheme('dark'))
    expect(media.listeners.size).toBe(0)
  })

  it('unsubscribes on unmount', () => {
    const media = createMatchMedia(false)
    vi.stubGlobal('matchMedia', media.matchMedia)
    const { unmount } = renderHook(() => useTheme('system'))
    expect(media.listeners.size).toBe(1)
    unmount()
    expect(media.listeners.size).toBe(0)
  })
})
