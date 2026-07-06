import { useMediaState } from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { logger } from '@/shared/logger'

const useTransition = <T,>(value: T, log: (v: T) => void) => {
  const prev = useRef(value)
  const primed = useRef(false)
  useEffect(() => {
    if (!primed.current) {
      primed.current = true
      prev.current = value
      return
    }
    if (value !== prev.current) {
      prev.current = value
      log(value)
    }
  }, [value, log])
}

export const PlaybackLogger = () => {
  const paused = useMediaState('paused')
  const muted = useMediaState('muted')
  const volume = useMediaState('volume')
  const fullscreen = useMediaState('fullscreen')
  const pip = useMediaState('pictureInPicture')
  const quality = useMediaState('quality')
  const canPlay = useMediaState('canPlay')
  const ended = useMediaState('ended')
  const live = useMediaState('live')
  const liveEdge = useMediaState('liveEdge')
  const textTrack = useMediaState('textTrack')
  const audioTrack = useMediaState('audioTrack')

  useTransition(paused, (v) => logger.info('player', v ? 'paused' : 'playing'))
  useTransition(muted, (v) => logger.info('player', v ? 'muted' : 'unmuted'))
  useTransition(fullscreen, (v) =>
    logger.info('player', v ? 'fullscreen on' : 'fullscreen off'),
  )
  useTransition(pip, (v) =>
    logger.info(
      'player',
      v ? 'picture-in-picture on' : 'picture-in-picture off',
    ),
  )
  useTransition(quality ? `${quality.height}p` : 'auto', (v) =>
    logger.info('player', `quality: ${v}`),
  )
  useTransition(canPlay, (v) => {
    if (v) logger.info('player', 'ready to play')
  })
  useTransition(ended, (v) => {
    if (v) logger.info('player', 'stream ended')
  })
  useTransition(textTrack?.label ?? '—', (v) =>
    logger.info('player', `captions: ${v}`),
  )
  useTransition(audioTrack?.label ?? '—', (v) =>
    logger.info('player', `audio track: ${v}`),
  )
  useTransition(live && liveEdge, (v) => {
    if (live) logger.info('player', v ? 'at live edge' : 'behind live edge')
  })

  const volPct = Math.round(volume * 100)
  const lastVol = useRef(volPct)
  const volPrimed = useRef(false)
  useEffect(() => {
    if (!volPrimed.current) {
      volPrimed.current = true
      lastVol.current = volPct
      return
    }
    const id = setTimeout(() => {
      if (volPct !== lastVol.current) {
        lastVol.current = volPct
        logger.info('player', `volume ${volPct}%`)
      }
    }, 400)
    return () => clearTimeout(id)
  }, [volPct])

  return null
}
