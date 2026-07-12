import {
  isHLSProvider,
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  type MediaProviderAdapter,
} from '@vidstack/react'
import HLS from 'hls.js'
import { useRef } from 'react'
import { ClickGesture } from '@/app/components/player/click-gesture'
import { PlayerErrorOverlay } from '@/app/components/player/error-overlay'
import { PlaybackLogger } from '@/app/components/player/playback-logger'
import { PlayerControls } from '@/app/components/player/player-controls'
import { StreamInfo } from '@/app/components/player/stream-info'
import { suppressMutedSave } from '@/app/components/player/volume-control'
import { setPlayerInstance } from '@/app/hooks/usePlayerState'
import { useSettings } from '@/app/hooks/useSettings'
import { logger } from '@/shared/logger'
import type { StreamPayload } from '@/shared/stream'

const onProviderChange = (provider: MediaProviderAdapter | null) => {
  if (isHLSProvider(provider)) {
    provider.library = HLS
  }
}

export const VideoStage = ({ payload }: { payload: StreamPayload }) => {
  const { initial } = useSettings()
  const playerRef = useRef<MediaPlayerInstance>(null)
  const autoplayRetried = useRef(false)

  const retryAutoplay = async (
    player: MediaPlayerInstance,
    wasMuted: boolean,
  ) => {
    try {
      await player.play()
      logger.info('player', 'autoplay retried')
      return
    } catch {}
    if (wasMuted) {
      logger.warn('player', 'autoplay retry failed (muted)')
      return
    }
    suppressMutedSave.current = true
    player.muted = true
    try {
      await player.play()
      logger.info('player', 'autoplay retried without sound')
    } catch (e) {
      player.muted = false
      suppressMutedSave.current = false
      logger.warn(
        'player',
        'autoplay retry failed',
        e instanceof Error ? e.message : String(e),
      )
    }
  }

  const onAutoPlayFail = ({
    muted,
    error,
  }: {
    muted: boolean
    error: Error
  }) => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    logger.warn(
      'player',
      'autoplay failed',
      error.message,
      `muted=${muted}`,
      `reducedMotion=${reducedMotion}`,
    )
    if (autoplayRetried.current) return
    autoplayRetried.current = true
    const player = playerRef.current
    if (!player) return
    setTimeout(() => void retryAutoplay(player, muted), 0)
  }

  return (
    <>
      <MediaPlayer
        id="tvp-player"
        ref={(player) => {
          playerRef.current = player
          setPlayerInstance(player)
        }}
        className="group relative aspect-video w-full overflow-hidden border bg-[#0c0b0a] font-sans"
        src={{ src: payload.src, type: 'application/x-mpegurl' }}
        title={payload.title}
        artwork={[]}
        autoPlay={initial.autoplay}
        volume={initial.defaultVolume}
        muted={initial.startMuted}
        keyTarget="document"
        keyShortcuts={{
          togglePaused: 'k Space',
          toggleMuted: 'm',
          toggleFullscreen: 'f',
          togglePictureInPicture: {
            keys: 'i',
            onKeyDown: ({ player, remote }) => {
              if (player.state.canPictureInPicture)
                remote.togglePictureInPicture()
            },
          },
          volumeUp: 'ArrowUp',
          volumeDown: 'ArrowDown',
          remotePlayback: {
            keys: 'a',
            onKeyDown: ({ player, remote }) => {
              if (!player.state.canGoogleCast) return
              if (!__CAST_AVAILABLE__) return

              remote.requestGoogleCast()
            },
          },
        }}
        onProviderChange={onProviderChange}
        onAutoPlayFail={onAutoPlayFail}
      >
        <MediaProvider />
        <ClickGesture />
        <PlaybackLogger />
        <PlayerControls />
        <PlayerErrorOverlay />
      </MediaPlayer>

      <StreamInfo payload={payload} />
    </>
  )
}
