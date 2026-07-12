import { render } from '@testing-library/react'
import type { ReactNode, Ref } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VideoStage } from '@/app/components/player/video-stage'
import type { StreamPayload } from '@/shared/stream'

type ShortcutHandler = (context: {
  player: {
    state: { canPictureInPicture?: boolean; canGoogleCast?: boolean }
  }
  remote: {
    togglePictureInPicture: () => void
    requestGoogleCast: () => void
  }
}) => void

type CapturedProps = {
  artwork: unknown
  autoPlay: boolean
  volume: number
  muted: boolean
  keyShortcuts: {
    togglePictureInPicture: { keys: string; onKeyDown: ShortcutHandler }
    remotePlayback: { keys: string; onKeyDown: ShortcutHandler }
  }
}

const captured = vi.hoisted(() => ({
  props: null as CapturedProps | null,
  ref: null as Ref<unknown> | null,
}))

const setPlayerInstance = vi.hoisted(() => vi.fn())

vi.mock('@vidstack/react', () => ({
  MediaPlayer: ({
    children,
    ref,
    ...props
  }: CapturedProps & { children: ReactNode; ref: Ref<unknown> }) => {
    captured.props = props
    captured.ref = ref
    return <div>{children}</div>
  },
  MediaProvider: () => null,
  isHLSProvider: () => false,
}))

vi.mock('hls.js', () => ({ default: class {} }))

vi.mock('@/app/components/player/click-gesture', () => ({
  ClickGesture: () => null,
}))
vi.mock('@/app/components/player/error-overlay', () => ({
  PlayerErrorOverlay: () => null,
}))
vi.mock('@/app/components/player/playback-logger', () => ({
  PlaybackLogger: () => null,
}))
vi.mock('@/app/components/player/player-controls', () => ({
  PlayerControls: () => null,
}))
vi.mock('@/app/components/player/stream-info', () => ({
  StreamInfo: () => null,
}))
vi.mock('@/app/hooks/usePlayerState', () => ({ setPlayerInstance }))
vi.mock('@/app/hooks/useSettings', () => ({
  useSettings: () => ({
    initial: { autoplay: false, defaultVolume: 0.35, startMuted: true },
  }),
}))

const payload: StreamPayload = {
  src: 'https://example.com/master.m3u8',
  capturedAt: 0,
  sourceUrl: 'https://example.com',
  title: 'Test',
  subtitle: '',
}

const remote = () => ({
  togglePictureInPicture: vi.fn(),
  requestGoogleCast: vi.fn(),
})

beforeEach(() => {
  captured.props = null
  captured.ref = null
  vi.clearAllMocks()
  render(<VideoStage payload={payload} />)
})

describe('VideoStage', () => {
  it('passes empty artwork so media session gets no invalid image url', () => {
    expect(captured.props?.artwork).toEqual([])
  })

  it('starts the player from the initial settings snapshot', () => {
    expect(captured.props?.autoPlay).toBe(false)
    expect(captured.props?.volume).toBe(0.35)
    expect(captured.props?.muted).toBe(true)
  })

  it('registers the player instance for out-of-tree hooks', () => {
    const player = {}
    if (typeof captured.ref !== 'function') throw new Error('expected ref')
    captured.ref(player)
    expect(setPlayerInstance).toHaveBeenCalledWith(player)
  })

  it('toggles pip via shortcut only when pip is supported', () => {
    const shortcut = captured.props?.keyShortcuts.togglePictureInPicture
    expect(shortcut?.keys).toBe('i')
    const unsupported = remote()
    shortcut?.onKeyDown({
      player: { state: { canPictureInPicture: false } },
      remote: unsupported,
    })
    expect(unsupported.togglePictureInPicture).not.toHaveBeenCalled()
    const supported = remote()
    shortcut?.onKeyDown({
      player: { state: { canPictureInPicture: true } },
      remote: supported,
    })
    expect(supported.togglePictureInPicture).toHaveBeenCalledOnce()
  })

  it('casts via shortcut only when casting is supported', () => {
    const shortcut = captured.props?.keyShortcuts.remotePlayback
    expect(shortcut?.keys).toBe('a')
    const unsupported = remote()
    shortcut?.onKeyDown({
      player: { state: { canGoogleCast: false } },
      remote: unsupported,
    })
    expect(unsupported.requestGoogleCast).not.toHaveBeenCalled()
    const supported = remote()
    shortcut?.onKeyDown({
      player: { state: { canGoogleCast: true } },
      remote: supported,
    })
    expect(supported.requestGoogleCast).toHaveBeenCalledOnce()
  })
})
