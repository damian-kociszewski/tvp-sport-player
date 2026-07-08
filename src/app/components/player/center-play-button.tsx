import { PlayIcon } from '@phosphor-icons/react'
import { PlayButton } from '@vidstack/react'

export const CenterPlayButton = () => {
  return (
    <PlayButton
      id="tvp-center-play"
      className="pointer-events-none absolute inset-0 z-10 m-auto flex size-20 cursor-pointer items-center justify-center bg-primary text-primary-foreground opacity-0 transition-all duration-200 hover:bg-primary/90 group-data-paused:pointer-events-auto group-data-paused:opacity-100"
    >
      <PlayIcon className="size-12" weight="fill" />
    </PlayButton>
  )
}
