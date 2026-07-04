import { MuteButton, useMediaState, VolumeSlider } from '@vidstack/react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'

function VolumeIcon() {
  const muted = useMediaState('muted')
  const volume = useMediaState('volume')
  if (muted || volume === 0) return <VolumeX size={18} />
  return volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />
}

export function VolumeControl() {
  return (
    <div className="flex items-center">
      <MuteButton
        title="Wycisz (M)"
        className="mr-1.5 flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/12"
      >
        <VolumeIcon />
      </MuteButton>
      <VolumeSlider.Root className="group/vol relative inline-flex h-9 w-25 cursor-pointer touch-none select-none items-center outline-none">
        <VolumeSlider.Track className="relative h-1 w-full rounded-sm bg-white/25">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) rounded-sm bg-white will-change-[width]" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white will-change-[left]" />
      </VolumeSlider.Root>
    </div>
  )
}
