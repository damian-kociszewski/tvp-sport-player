import { TimeSlider, useMediaState } from '@vidstack/react'

export function SeekBar() {
  const start = useMediaState('seekableStart')
  const end = useMediaState('seekableEnd')
  if (end - start < 5) return null

  return (
    <TimeSlider.Root className="group/slider relative inline-flex h-3.5 w-full cursor-pointer touch-none select-none items-center outline-none">
      <TimeSlider.Track className="relative h-1 w-full bg-white/25">
        <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) bg-accent will-change-[width]" />
      </TimeSlider.Track>
      <TimeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.5)] will-change-[left]" />
    </TimeSlider.Root>
  )
}
