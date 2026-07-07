import { AirplayIcon, ScreencastIcon } from '@phosphor-icons/react'
import {
  type MediaPlayerInstance,
  useMediaPlayer,
  useMediaProvider,
} from '@vidstack/react'
import { useEffect, useState } from 'react'
import { isEditableTarget } from '@/lib/utils'
import { logger } from '@/shared/logger'

type WebKitVideo = HTMLVideoElement & {
  webkitShowPlaybackTargetPicker?: () => void
}

type PlaybackTargetEvent = Event & { availability?: string }

const getVideo = (player: MediaPlayerInstance): WebKitVideo | null => {
  return player.el?.querySelector('video') ?? null
}

const isAirPlayPlatform = () =>
  'WebKitPlaybackTargetAvailabilityEvent' in window

const requestRemotePlayback = (player: MediaPlayerInstance) => {
  const video = getVideo(player)
  if (!video) return
  if (video.webkitShowPlaybackTargetPicker) {
    video.webkitShowPlaybackTargetPicker()
    return
  }
  if (!video.remote) {
    logger.warn('player', 'remote playback not supported')
    return
  }
  video.remote
    .prompt()
    .catch((e) => logger.warn('player', 'remote playback failed', String(e)))
}

const useRemotePlaybackAvailable = (): boolean => {
  const player = useMediaPlayer()
  const provider = useMediaProvider()
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    if (!player || !provider) return
    const video = getVideo(player)
    if (!video) return

    if (isAirPlayPlatform()) {
      const onChange = (e: PlaybackTargetEvent) => {
        setAvailable(e.availability === 'available')
      }
      video.addEventListener(
        'webkitplaybacktargetavailabilitychanged',
        onChange,
      )
      return () =>
        video.removeEventListener(
          'webkitplaybacktargetavailabilitychanged',
          onChange,
        )
    }

    if (!video.remote) return
    let watchId: number | null = null
    video.remote
      .watchAvailability((v) => setAvailable(v))
      .then((id) => {
        watchId = id
      })
      .catch((e: unknown) => {
        setAvailable(e instanceof Error && e.name === 'NotSupportedError')
      })
    return () => {
      if (watchId != null) {
        video.remote.cancelWatchAvailability(watchId).catch(() => {})
      }
      setAvailable(false)
    }
  }, [player, provider])

  return available
}

export const RemotePlaybackButton = () => {
  const player = useMediaPlayer()
  const available = useRemotePlaybackAvailable()

  useEffect(() => {
    if (!player) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'a' || e.repeat) return
      if (isEditableTarget()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      requestRemotePlayback(player)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [player])

  if (!available) return null
  const airplay = isAirPlayPlatform()
  const label = airplay ? 'AirPlay (A)' : 'Przesyłaj na urządzenie (A)'
  return (
    <button
      id="tvp-btn-remote"
      type="button"
      title={label}
      aria-label={label}
      onClick={() => {
        if (player) requestRemotePlayback(player)
      }}
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {airplay ? (
        <AirplayIcon className="size-4.5" />
      ) : (
        <ScreencastIcon className="size-4.5" />
      )}
    </button>
  )
}
