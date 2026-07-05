import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from '@phosphor-icons/react'
import { MuteButton, useMediaState, VolumeSlider } from '@vidstack/react'

function VolumeIcon() {
  const muted = useMediaState('muted')
  const volume = useMediaState('volume')
  if (muted || volume === 0) return <SpeakerXIcon className="size-4.5" />
  return volume < 0.5 ? (
    <SpeakerLowIcon className="size-4.5" />
  ) : (
    <SpeakerHighIcon className="size-4.5" />
  )
}

export function VolumeControl() {
  return (
    <div id="tvp-volume" className="flex items-center gap-1">
      <MuteButton
        id="tvp-btn-mute"
        title="Wycisz (M)"
        className="mr-1.5 flex size-9 items-center justify-center text-white hover:bg-white/12"
      >
        <VolumeIcon />
      </MuteButton>
      <VolumeSlider.Root
        id="tvp-volume-slider"
        step={0.5}
        keyStep={0.5}
        className="group/vol relative inline-flex h-9 w-25 cursor-pointer touch-none select-none items-center outline-none"
      >
        <VolumeSlider.Track className="relative h-1 w-full bg-white/25">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) bg-white will-change-[width]" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 bg-white will-change-[left]" />
      </VolumeSlider.Root>
    </div>
  )
}
