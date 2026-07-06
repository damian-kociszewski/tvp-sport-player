import {
  Gesture,
  isHLSProvider,
  MediaPlayer,
  type MediaPlayerInstance,
  MediaProvider,
  type MediaProviderAdapter,
  useMediaPlayer,
  useMediaProvider,
  useMediaState,
  useMediaStore,
  useVideoQualityOptions,
} from '@vidstack/react'
import HLS, { type ErrorData } from 'hls.js'
import { type RefObject, useEffect, useRef, useState } from 'react'
import { CenterPlayButton } from '@/app/components/player/CenterPlayButton'
import { ControlBar } from '@/app/components/player/ControlBar'
import {
  ErrorOverlay,
  type PlayerError,
} from '@/app/components/player/ErrorOverlay'
import { PlaybackLogger } from '@/app/components/player/PlaybackLogger'
import { StreamInfo } from '@/app/components/player/StreamInfo'
import { logger } from '@/shared/logger'
import {
  type ClickAction,
  type PlayerSettings,
  saveSettings,
} from '@/shared/settings'
import type { StreamPayload } from '@/shared/stream'

const onProviderChange = (provider: MediaProviderAdapter | null) => {
  if (isHLSProvider(provider)) {
    provider.library = HLS
  }
}

const QualityStrategy = ({
  mode,
  userOverride,
}: {
  mode: PlayerSettings['qualityMode']
  userOverride: RefObject<boolean>
}) => {
  const options = useVideoQualityOptions({ auto: false, sort: 'descending' })
  const applied = useRef(false)

  useEffect(() => {
    if (options.length === 0) {
      applied.current = false
      return
    }
    if (applied.current || userOverride.current || mode === 'auto') return
    const target = mode === 'highest' ? options[0] : options[options.length - 1]
    if (!target) return
    target.select()
    applied.current = true
    logger.info('player', 'applied default quality', mode, target.label)
  }, [mode, options, userOverride])

  return null
}

const AudioTrackSync = () => {
  const player = useMediaPlayer()
  const provider = useMediaProvider()
  const tracks = useMediaState('audioTracks')
  const selected = useMediaState('audioTrack')

  useEffect(() => {
    if (!player || selected || tracks.length === 0 || !isHLSProvider(provider))
      return
    const idx = provider.instance?.audioTrack ?? -1
    if (idx < 0) return
    const track = player.audioTracks[idx]
    if (track) {
      track.selected = true
      logger.info('player', 'audio track synced', track.label)
    }
  }, [player, provider, tracks, selected])

  return null
}

const isEditableTarget = (): boolean => {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

const SeekKeys = ({ step }: { step: number }) => {
  const player = useMediaPlayer()
  const live = useMediaState('live')

  useEffect(() => {
    if (!player || live) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (isEditableTarget()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      const delta = e.key === 'ArrowLeft' ? -step : step
      player.currentTime = Math.max(0, player.currentTime + delta)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [player, step, live])

  return null
}

const VolumeMemory = ({
  suppressMutedSave,
}: {
  suppressMutedSave: RefObject<boolean>
}) => {
  const { volume, muted } = useMediaStore()
  const primed = useRef(false)

  useEffect(() => {
    if (!primed.current) {
      primed.current = true
      return
    }
    if (!muted) suppressMutedSave.current = false
    if (muted && suppressMutedSave.current) return
    const id = setTimeout(
      () => void saveSettings({ defaultVolume: volume, startMuted: muted }),
      300,
    )
    return () => clearTimeout(id)
  }, [volume, muted, suppressMutedSave])

  return null
}

export const VideoStage = ({
  payload,
  initial,
  seekStep,
  clickAction,
  rememberVolume,
}: {
  payload: StreamPayload
  initial: PlayerSettings
  seekStep: number
  clickAction: ClickAction
  rememberVolume: boolean
}) => {
  const [error, setError] = useState<PlayerError | null>(null)
  const playerRef = useRef<MediaPlayerInstance>(null)
  const userQualityOverride = useRef(false)
  const autoplayRetried = useRef(false)
  const suppressMutedSave = useRef(false)

  const onHlsError = (data: ErrorData) => {
    logger.error('player', 'HLS error', data.type, data.details, data.fatal)
    if (
      data.details?.startsWith('keySystem') ||
      data.details === 'fragDecryptError'
    ) {
      setError('drm')
    } else if (data.fatal && data.type === 'networkError') {
      setError(data.response?.code === 403 ? 'expired' : 'network')
    }
  }

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
        ref={playerRef}
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
          togglePictureInPicture: 'i',
          volumeUp: 'ArrowUp',
          volumeDown: 'ArrowDown',
        }}
        onProviderChange={onProviderChange}
        onHlsError={onHlsError}
        onAutoPlayFail={onAutoPlayFail}
        onMediaQualityChangeRequest={(_, e) => {
          if (e.isOriginTrusted) userQualityOverride.current = true
        }}
      >
        <MediaProvider />
        {clickAction !== 'none' && (
          <Gesture
            className="absolute inset-0 z-0 block h-full w-full"
            event="pointerup"
            action={
              clickAction === 'playPause' ? 'toggle:paused' : 'toggle:muted'
            }
          />
        )}
        <PlaybackLogger />
        <SeekKeys step={seekStep} />
        <QualityStrategy
          mode={initial.qualityMode}
          userOverride={userQualityOverride}
        />
        <AudioTrackSync />
        {rememberVolume && (
          <VolumeMemory suppressMutedSave={suppressMutedSave} />
        )}
        <CenterPlayButton />
        <ControlBar seekStep={seekStep} />
        {error && <ErrorOverlay error={error} sourceUrl={payload.sourceUrl} />}
      </MediaPlayer>

      <StreamInfo payload={payload} />
    </>
  )
}
