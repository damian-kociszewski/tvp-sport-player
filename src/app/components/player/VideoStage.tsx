import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  type MediaProviderAdapter,
  useMediaPlayer,
  useMediaState,
  useMediaStore,
  useVideoQualityOptions,
} from '@vidstack/react'
import HLS, { type ErrorData } from 'hls.js'
import { useEffect, useRef, useState } from 'react'
import { logger } from '../../../shared/logger'
import { type PlayerSettings, saveSettings } from '../../../shared/settings'
import type { StreamPayload } from '../../../shared/types'
import { CenterPlayButton } from './CenterPlayButton'
import { ControlBar } from './ControlBar'
import { ErrorOverlay, type PlayerError } from './ErrorOverlay'
import { PlaybackLogger } from './PlaybackLogger'
import { StreamInfo } from './StreamInfo'

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (isHLSProvider(provider)) {
    provider.library = HLS
  }
}

function QualityStrategy({ mode }: { mode: PlayerSettings['qualityMode'] }) {
  const options = useVideoQualityOptions({ sort: 'descending' })
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current || mode === 'auto' || options.length === 0) return
    const target = mode === 'highest' ? options[0] : options[options.length - 1]
    target?.select()
    applied.current = true
    logger.info('player', 'zastosowano domyślną jakość', mode, target?.label)
  }, [mode, options])

  return null
}

function SeekKeys({ step }: { step: number }) {
  const player = useMediaPlayer()
  const live = useMediaState('live')

  useEffect(() => {
    if (!player || live) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (document.activeElement instanceof HTMLInputElement) return
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

function VolumeMemory() {
  const { volume, muted } = useMediaStore()
  const primed = useRef(false)

  useEffect(() => {
    if (!primed.current) {
      primed.current = true
      return
    }
    const id = setTimeout(
      () => void saveSettings({ defaultVolume: volume, startMuted: muted }),
      300,
    )
    return () => clearTimeout(id)
  }, [volume, muted])

  return null
}

export function VideoStage({
  payload,
  settings,
}: {
  payload: StreamPayload
  settings: PlayerSettings
}) {
  const [error, setError] = useState<PlayerError | null>(null)

  function onHlsError(data: ErrorData) {
    logger.error('player', 'błąd HLS', data.type, data.details, data.fatal)
    if (
      data.details?.startsWith('keySystem') ||
      data.details === 'fragDecryptError'
    ) {
      setError('drm')
    } else if (data.fatal && data.type === 'networkError') {
      setError(data.response?.code === 403 ? 'expired' : 'network')
    }
  }

  return (
    <>
      <MediaPlayer
        className="group relative aspect-video w-full overflow-hidden border border-line bg-[#0c0b0a] font-sans"
        src={{ src: payload.src, type: 'application/x-mpegurl' }}
        title={payload.title}
        artwork={[]}
        autoPlay={settings.autoplay}
        volume={settings.defaultVolume}
        muted={settings.startMuted}
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
      >
        <MediaProvider />
        <PlaybackLogger />
        <SeekKeys step={settings.seekStep} />
        <QualityStrategy mode={settings.qualityMode} />
        {settings.rememberVolume && <VolumeMemory />}
        <CenterPlayButton />
        <ControlBar seekStep={settings.seekStep} />
        {error && <ErrorOverlay error={error} sourceUrl={payload.sourceUrl} />}
      </MediaPlayer>

      <StreamInfo payload={payload} />
    </>
  )
}
