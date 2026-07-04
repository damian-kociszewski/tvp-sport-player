import { useEffect, useState } from 'react'
import { logger } from '../shared/logger'
import { playerKey, type StreamPayload } from '../shared/types'

export type PayloadState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; payload: StreamPayload }

export function usePayload(): PayloadState {
  const [state, setState] = useState<PayloadState>({ status: 'loading' })

  useEffect(() => {
    const params = new URLSearchParams(location.search)

    const src = params.get('src')
    if (src) {
      const payload: StreamPayload = {
        src,
        title: params.get('title') ?? 'Transmisja',
        subtitle: params.get('subtitle') ?? '',
        sourceUrl: '',
        capturedAt: Date.now(),
      }
      document.title = `${payload.title} — Odtwarzacz dla TVP SPORT™`
      setState({ status: 'ready', payload })
      return
    }

    const id = params.get('id')
    if (!id || typeof chrome === 'undefined' || !chrome.storage?.session) {
      setState({ status: 'missing' })
      return
    }
    void chrome.storage.session.get(playerKey(id)).then((entries) => {
      const payload = entries[playerKey(id)] as StreamPayload | undefined
      if (!payload) {
        logger.warn('player', 'brak payloadu dla id', id)
        setState({ status: 'missing' })
        return
      }
      logger.info('player', 'załadowano transmisję', payload.title, payload.src)
      document.title = `${payload.title} — Odtwarzacz dla TVP SPORT™`
      setState({ status: 'ready', payload })
    })
  }, [])

  return state
}
