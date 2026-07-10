import { describe, expect, it } from 'vitest'
import { captureKey, playerKey } from '@/shared/stream'

describe('captureKey', () => {
  it('builds a key from the tab id', () => {
    expect(captureKey(42)).toBe('capture:42')
  })
})

describe('playerKey', () => {
  it('builds a key from the player id', () => {
    expect(playerKey('abc-123')).toBe('player:abc-123')
  })
})
