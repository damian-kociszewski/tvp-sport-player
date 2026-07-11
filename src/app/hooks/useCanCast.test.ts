import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCanCast } from '@/app/hooks/useCanCast'

const usePlayerState = vi.hoisted(() => vi.fn())

vi.mock('@/app/hooks/usePlayerState', () => ({ usePlayerState }))

beforeEach(() => {
  usePlayerState.mockReset()
})

describe('useCanCast', () => {
  it('subscribes to the canGoogleCast state', () => {
    usePlayerState.mockReturnValue(false)
    renderHook(() => useCanCast())
    expect(usePlayerState).toHaveBeenCalledWith('canGoogleCast')
  })

  it('returns true when the player can cast', () => {
    usePlayerState.mockReturnValue(true)
    const { result } = renderHook(() => useCanCast())
    expect(result.current).toBe(true)
  })

  it('returns false when the player cannot cast', () => {
    usePlayerState.mockReturnValue(false)
    const { result } = renderHook(() => useCanCast())
    expect(result.current).toBe(false)
  })
})
