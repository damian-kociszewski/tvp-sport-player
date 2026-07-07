import { ArrowsInIcon, ArrowsOutIcon } from '@phosphor-icons/react'
import {
  FullscreenButton as MediaFullscreenButton,
  useMediaState,
} from '@vidstack/react'
import { useEffect } from 'react'

const FullscreenIcon = () => {
  const isFullscreen = useMediaState('fullscreen')
  return isFullscreen ? (
    <ArrowsInIcon className="size-4.5" />
  ) : (
    <ArrowsOutIcon className="size-4.5" />
  )
}

export const FullscreenButton = () => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.repeat || e.key.toLowerCase() !== 'f') return
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [])

  return (
    <MediaFullscreenButton
      id="tvp-btn-fullscreen"
      title="Pełny ekran (F)"
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <FullscreenIcon />
    </MediaFullscreenButton>
  )
}
