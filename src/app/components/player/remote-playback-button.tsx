import { ScreencastIcon } from '@phosphor-icons/react'
import {
  GoogleCastButton,
  type GoogleCastPromptErrorEvent,
  useMediaPlayer,
} from '@vidstack/react'
import { useEffect } from 'react'
import { useCanCast } from '@/app/hooks/useCanCast'
import { loadCastSdk } from '@/lib/google-cast-sdk'
import { logger } from '@/shared/logger'

export const RemotePlaybackButton = () => {
  const player = useMediaPlayer()
  const canCast = useCanCast()

  useEffect(() => {
    if (!canCast || !player) return
    void loadCastSdk()
    const onError = (event: Event) => {
      const { detail } = event as GoogleCastPromptErrorEvent
      logger.warn('player', 'cast prompt error', detail.message)
    }
    player.addEventListener('google-cast-prompt-error', onError)
    return () => player.removeEventListener('google-cast-prompt-error', onError)
  }, [canCast, player])

  if (!canCast) return null

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
