import { PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { PlayButton, useMediaState } from '@vidstack/react'

const PlayPauseIcon = () => {
  const paused = useMediaState('paused')
  return paused ? (
    <PlayIcon className="size-4.5" weight="fill" />
  ) : (
    <PauseIcon className="size-4.5" weight="fill" />
  )
}

export const PlayPauseButton = () => {
  return (
    <PlayButton
      id="tvp-btn-play"
      title="Odtwórz / pauza (spacja)"
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <PlayPauseIcon />
    </PlayButton>
  )
}
