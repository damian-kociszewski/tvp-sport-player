import { useMediaState } from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { logger } from '../../../shared/logger'

function useTransition<T>(value: T, log: (v: T) => void) {
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

export function PlaybackLogger() {
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

  useTransition(paused, (v) =>
    logger.info('player', v ? 'pauza' : 'odtwarzanie'),
  )
  useTransition(muted, (v) =>
    logger.info('player', v ? 'wyciszono' : 'wyłączono wyciszenie'),
  )
  useTransition(fullscreen, (v) =>
    logger.info('player', v ? 'pełny ekran włączony' : 'pełny ekran wyłączony'),
  )
  useTransition(pip, (v) =>
    logger.info(
      'player',
      v ? 'obraz w obrazie włączony' : 'obraz w obrazie wyłączony',
    ),
  )
  useTransition(quality ? `${quality.height}p` : 'auto', (v) =>
    logger.info('player', `jakość: ${v}`),
  )
  useTransition(canPlay, (v) => {
    if (v) logger.info('player', 'gotowy do odtwarzania')
  })
  useTransition(ended, (v) => {
    if (v) logger.info('player', 'transmisja zakończona')
  })
  useTransition(textTrack?.label ?? '—', (v) =>
    logger.info('player', `napisy: ${v}`),
  )
  useTransition(audioTrack?.label ?? '—', (v) =>
    logger.info('player', `ścieżka audio: ${v}`),
  )
  useTransition(live && liveEdge, (v) => {
    if (live)
      logger.info(
        'player',
        v ? 'na żywo (krawędź)' : 'opóźnienie względem live',
      )
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
        logger.info('player', `głośność ${volPct}%`)
      }
    }, 400)
    return () => clearTimeout(id)
  }, [volPct])

  return null
}
