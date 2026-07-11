import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCanPip } from '@/app/hooks/useCanPip'

const usePlayerState = vi.hoisted(() => vi.fn())

vi.mock('@/app/hooks/usePlayerState', () => ({ usePlayerState }))

beforeEach(() => {
  usePlayerState.mockReset()
})

describe('useCanPip', () => {
  it('subscribes to the canPictureInPicture state', () => {
    usePlayerState.mockReturnValue(false)
    renderHook(() => useCanPip())
    expect(usePlayerState).toHaveBeenCalledWith('canPictureInPicture')
  })

  it('returns true when the player supports pip', () => {
    usePlayerState.mockReturnValue(true)
    const { result } = renderHook(() => useCanPip())
    expect(result.current).toBe(true)
  })

  it('returns false when the player does not support pip', () => {
    usePlayerState.mockReturnValue(false)
    const { result } = renderHook(() => useCanPip())
    expect(result.current).toBe(false)
  })
})
