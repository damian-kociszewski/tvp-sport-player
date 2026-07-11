import { useMediaPlayer } from '@vidstack/react'
import { useEffect, useState } from 'react'
import { useStreamPayload } from '@/app/hooks/useStreamPayload'
import { logger } from '@/shared/logger'

export type PlayerError = 'drm' | 'expired' | 'network' | 'missing'

const MESSAGES: Record<PlayerError, { title: string; detail: string }> = {
  drm: {
    title: 'Transmisja chroniona DRM',
    detail: 'Ta transmisja jest zabezpieczona i nie może zostać odtworzona.',
  },
  expired: {
    title: 'Link do transmisji wygasł',
    detail:
      'Wróć na stronę TVP SPORT, odśwież ją i otwórz odtwarzacz ponownie.',
  },
  network: {
    title: 'Nie udało się załadować transmisji',
    detail: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
  },
  missing: {
    title: 'Brak danych transmisji',
    detail: 'Otwórz odtwarzacz z ikony rozszerzenia na stronie TVP SPORT',
  },
}

export const ErrorOverlay = ({
  error,
  sourceUrl,
}: {
  error: PlayerError
  sourceUrl?: string
}) => {
  const { title, detail } = MESSAGES[error]
  return (
    <div
      id="tvp-error"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[repeating-linear-gradient(135deg,#171512_0_14px,#131110_14px_28px)] px-6 text-center"
    >
      <div className="text-lg font-bold tracking-[-0.01em] text-white/85">
        {title}
      </div>
      <div className="font-mono text-xs tracking-widest text-white/40">
        {detail}
      </div>
      {error !== 'network' && error !== 'missing' && sourceUrl && (
        <a
          href={sourceUrl}
          className="mt-2 border border-[#2c2925] bg-[#1d1b18] px-3.5 py-2 font-mono text-xs text-[#f2efe9] hover:border-primary"
        >
          Otwórz stronę transmisji TVP SPORT
        </a>
      )}
    </div>
  )
}

export const PlayerErrorOverlay = () => {
  const player = useMediaPlayer()
  const payload = useStreamPayload()
  const [error, setError] = useState<PlayerError | null>(null)

  useEffect(() => {
    if (!player) return
    return player.listen('hls-error', (event) => {
      const data = event.detail
      logger.error('player', 'HLS error', data.type, data.details, data.fatal)
      if (
        data.details?.startsWith('keySystem') ||
        data.details === 'fragDecryptError'
      ) {
        setError('drm')
      } else if (data.fatal && data.type === 'networkError') {
        setError(data.response?.code === 403 ? 'expired' : 'network')
      }
    })
  }, [player])

  if (!error) return null
  return (
    <ErrorOverlay
      error={error}
      sourceUrl={
        payload.status === 'ready' ? payload.payload.sourceUrl : undefined
      }
    />
  )
}
