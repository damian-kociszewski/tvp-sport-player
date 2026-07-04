import { PlayButton, useMediaState } from '@vidstack/react'
import { Play } from 'lucide-react'

export function CenterPlayButton() {
  const paused = useMediaState('paused')
  if (!paused) return null

  return (
    <PlayButton className="absolute inset-0 z-10 m-auto flex size-18 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      <Play className="size-8" fill="currentColor" />
    </PlayButton>
  )
}
