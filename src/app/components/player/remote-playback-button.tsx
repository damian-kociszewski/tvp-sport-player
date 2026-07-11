import { ScreencastIcon } from '@phosphor-icons/react'
import {
  GoogleCastButton,
  type GoogleCastPromptErrorEvent,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import { useEffect } from 'react'
import { loadCastSdk } from '@/lib/google-cast-sdk'
import { logger } from '@/shared/logger'

export const RemotePlaybackButton = () => {
  const player = useMediaPlayer()
  const canGoogleCast = useMediaState('canGoogleCast')

  useEffect(() => {
    if (!canGoogleCast || !__CAST_AVAILABLE__ || !player) return
    void loadCastSdk()
    const onError = (event: Event) => {
      const { detail } = event as GoogleCastPromptErrorEvent
      logger.warn('player', 'cast prompt error', detail.message)
    }
    player.addEventListener('google-cast-prompt-error', onError)
    return () => player.removeEventListener('google-cast-prompt-error', onError)
  }, [canGoogleCast, player])

  if (!canGoogleCast) return null
  if (!__CAST_AVAILABLE__) return null

  return (
    <GoogleCastButton
      id="tvp-btn-remote"
      title="Przesyłaj na urządzenie (A)"
      aria-label="Przesyłaj na urządzenie (A)"
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <ScreencastIcon className="size-4.5" />
    </GoogleCastButton>
  )
}
