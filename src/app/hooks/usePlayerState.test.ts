import { act, renderHook } from '@testing-library/react'
import type { MediaPlayerInstance } from '@vidstack/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setPlayerInstance, usePlayerState } from '@/app/hooks/usePlayerState'

vi.mock('@vidstack/react', () => ({
  useMediaState: (
    prop: string,
    ref?: { current: { state: Record<string, unknown> } | null },
  ) => ref?.current?.state[prop] ?? false,
}))

const fakePlayer = (state: Record<string, unknown>) =>
  ({ state }) as unknown as MediaPlayerInstance

afterEach(() => {
  setPlayerInstance(null)
})

describe('usePlayerState', () => {
  it('returns the fallback value without a registered player', () => {
    const { result } = renderHook(() => usePlayerState('canGoogleCast'))
    expect(result.current).toBe(false)
  })

  it('reads state from an already registered player', () => {
    setPlayerInstance(fakePlayer({ canGoogleCast: true }))
    const { result } = renderHook(() => usePlayerState('canGoogleCast'))
    expect(result.current).toBe(true)
  })

  it('updates when the player registers after mount', () => {
    const { result } = renderHook(() => usePlayerState('canPictureInPicture'))
    expect(result.current).toBe(false)
    act(() => setPlayerInstance(fakePlayer({ canPictureInPicture: true })))
    expect(result.current).toBe(true)
  })

  it('falls back when the player unregisters', () => {
    setPlayerInstance(fakePlayer({ canGoogleCast: true }))
    const { result } = renderHook(() => usePlayerState('canGoogleCast'))
    expect(result.current).toBe(true)
    act(() => setPlayerInstance(null))
    expect(result.current).toBe(false)
  })
})
