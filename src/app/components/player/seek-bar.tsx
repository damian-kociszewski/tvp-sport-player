import { Controls, TimeSlider, useMediaState } from '@vidstack/react'

export const SeekBar = () => {
  const live = useMediaState('live')
  const start = useMediaState('seekableStart')
  const end = useMediaState('seekableEnd')
  if (live || end - start < 5) return null

  return (
    <Controls.Group id="tvp-controls-seek" className="flex w-full">
      <TimeSlider.Root
        id="tvp-seekbar"
        className="group/slider relative inline-flex h-3.5 w-full cursor-pointer touch-none select-none items-center outline-none"
      >
        <TimeSlider.Track className="relative h-1.5 w-full bg-white/25">
          <TimeSlider.TrackFill className="absolute h-full w-(--slider-fill) bg-primary will-change-[width]" />
        </TimeSlider.Track>
        <TimeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary-foreground shadow-sm ring-ring/50 transition-[color,box-shadow] will-change-[left] hover:ring-2 focus-visible:ring-4" />
      </TimeSlider.Root>
    </Controls.Group>
  )
}
