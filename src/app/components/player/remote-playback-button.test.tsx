import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemotePlaybackButton } from '@/app/components/player/remote-playback-button'

const support = vi.hoisted(() => ({ canCast: true }))
const player = vi.hoisted(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}))
const loadCastSdk = vi.hoisted(() => vi.fn(() => Promise.resolve(true)))
const logger = vi.hoisted(() => ({ warn: vi.fn(), info: vi.fn() }))

vi.mock('@/app/hooks/useCanCast', () => ({
  useCanCast: () => support.canCast,
}))

vi.mock('@/lib/google-cast-sdk', () => ({ loadCastSdk }))

vi.mock('@/shared/logger', () => ({ logger }))

vi.mock('@vidstack/react', () => ({
  GoogleCastButton: ({ children, ...props }: ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  useMediaPlayer: () => player,
}))

beforeEach(() => {
  support.canCast = true
  vi.clearAllMocks()
})

describe('RemotePlaybackButton', () => {
  it('renders the button and loads the sdk when casting is available', () => {
    render(<RemotePlaybackButton />)
    expect(screen.getByTitle('Przesyłaj na urządzenie (A)')).toBeTruthy()
    expect(loadCastSdk).toHaveBeenCalledOnce()
  })

  it('renders nothing and skips the sdk when casting is unavailable', () => {
    support.canCast = false
    const { container } = render(<RemotePlaybackButton />)
    expect(container.firstChild).toBeNull()
    expect(loadCastSdk).not.toHaveBeenCalled()
  })

  it('logs cast prompt errors', () => {
    render(<RemotePlaybackButton />)
    const call = player.addEventListener.mock.calls.find(
      ([event]) => event === 'google-cast-prompt-error',
    )
    expect(call).toBeTruthy()
    const handler = call?.[1] as (event: unknown) => void
    handler({ detail: { message: 'boom' } })
    expect(logger.warn).toHaveBeenCalledWith(
      'player',
      'cast prompt error',
      'boom',
    )
  })

  it('removes the error listener on unmount', () => {
    const { unmount } = render(<RemotePlaybackButton />)
    const handler = player.addEventListener.mock.calls.find(
      ([event]) => event === 'google-cast-prompt-error',
    )?.[1]
    unmount()
    expect(player.removeEventListener).toHaveBeenCalledWith(
      'google-cast-prompt-error',
      handler,
    )
  })
})
