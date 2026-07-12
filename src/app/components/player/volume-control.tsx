import {
  SpeakerHighIcon,
  SpeakerLowIcon,
  SpeakerXIcon,
} from '@phosphor-icons/react'
import {
  MuteButton,
  useMediaState,
  useMediaStore,
  VolumeSlider,
} from '@vidstack/react'
import { useEffect, useRef } from 'react'
import { useSettings } from '@/app/hooks/useSettings'
import { saveSettings } from '@/shared/settings'

const VolumeMemory = () => {
  const { settings } = useSettings()
  const { volume } = useMediaStore()
  const previous = useRef<number | null>(null)

  useEffect(() => {
    const last = previous.current
    previous.current = volume
    if (last === null || last === volume) return
    if (!settings.rememberVolume) return
    const id = setTimeout(
      () => void saveSettings({ defaultVolume: volume }),
      300,
    )
    return () => clearTimeout(id)
  }, [volume, settings.rememberVolume])

  return null
}

const VolumeIcon = () => {
  const muted = useMediaState('muted')
  const volume = useMediaState('volume')
  if (muted || volume === 0) return <SpeakerXIcon className="size-4.5" />
  return volume < 0.5 ? (
    <SpeakerLowIcon className="size-4.5" />
  ) : (
    <SpeakerHighIcon className="size-4.5" />
  )
}

const VolumeValue = () => {
  const muted = useMediaState('muted')
  const volume = useMediaState('volume')
  const percent = muted ? 0 : Math.round(volume * 100)
  return (
    <span
      id="tvp-volume-value"
      className="ml-1.5 w-8 shrink-0 text-right font-mono text-[11px] tracking-[0.04em] text-white/80"
    >
      {percent}%
    </span>
  )
}

export const VolumeControl = () => {
  return (
    <div id="tvp-volume" className="flex items-center gap-1">
      <VolumeMemory />
      <MuteButton
        id="tvp-btn-mute"
        title="Wycisz / odcisz (M)"
        className="mr-1.5 flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <VolumeIcon />
      </MuteButton>
      <VolumeSlider.Root
        id="tvp-volume-slider"
        step={1}
        keyStep={1}
        className="group/vol relative inline-flex h-9 w-25 cursor-pointer touch-none select-none items-center outline-none"
      >
        <VolumeSlider.Track className="relative h-1.5 w-full bg-white/25">
          <VolumeSlider.TrackFill className="absolute h-full w-(--slider-fill) bg-primary will-change-[width]" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="absolute left-(--slider-fill) top-1/2 z-20 size-3 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary-foreground shadow-sm ring-ring/50 transition-[color,box-shadow] will-change-[left] hover:ring-2 focus-visible:ring-4" />
      </VolumeSlider.Root>
      <VolumeValue />
    </div>
  )
}
