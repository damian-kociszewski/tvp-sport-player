import { PictureInPictureIcon } from '@phosphor-icons/react'
import { PIPButton, useMediaState } from '@vidstack/react'
import { useEffect } from 'react'

export const PipButton = () => {
  const canPip = useMediaState('canPictureInPicture')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.repeat || e.key.toLowerCase() !== 'i') return
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [])

  if (!canPip) return null
  return (
    <PIPButton
      id="tvp-btn-pip"
      title="Obraz w obrazie (I)"
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <PictureInPictureIcon className="size-4.5" />
    </PIPButton>
  )
}
