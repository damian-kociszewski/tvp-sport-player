import { useEffect, useState } from 'react'
import { logger } from '@/shared/logger'
import { playerKey, type StreamPayload } from '@/shared/stream'

export type StreamPayloadState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; payload: StreamPayload }

export const useStreamPayload = (): StreamPayloadState => {
  const [state, setState] = useState<StreamPayloadState>({ status: 'loading' })

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
        logger.warn('player', 'no payload for id', id)
        setState({ status: 'missing' })
        return
      }
      logger.info('player', 'stream loaded', payload.title, payload.src)
      document.title = `${payload.title} — Odtwarzacz dla TVP SPORT™`
      setState({ status: 'ready', payload })
    })
  }, [])

  return state
}
