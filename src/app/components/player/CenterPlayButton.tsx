import { PlayIcon } from '@phosphor-icons/react'
import { PlayButton, useMediaState } from '@vidstack/react'

export function CenterPlayButton() {
  const paused = useMediaState('paused')
  if (!paused) return null

  return (
    <PlayButton className="absolute inset-0 z-10 m-auto flex size-20 cursor-pointer items-center justify-center bg-accent text-accent-ink">
      <PlayIcon className="size-12" weight="fill" />
    </PlayButton>
  )
}
