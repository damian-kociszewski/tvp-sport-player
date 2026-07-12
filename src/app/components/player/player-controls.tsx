import { Controls } from '@vidstack/react'
import { FullscreenButton } from '@/app/components/player/fullscreen-button'
import { LiveButton } from '@/app/components/player/live-button'
import { PipButton } from '@/app/components/player/pip-button'
import { PlayPauseButton } from '@/app/components/player/play-pause-button'
import {
  AudioMenu,
  CaptionsMenu,
  QualityMenu,
} from '@/app/components/player/player-menu'
import { RemotePlaybackButton } from '@/app/components/player/remote-playback-button'
import { SeekBar } from '@/app/components/player/seek-bar'
import { SeekButton, SeekKeys } from '@/app/components/player/seek-button'
import { TimeDisplay } from '@/app/components/player/time-display'
import { VolumeControl } from '@/app/components/player/volume-control'

export const PlayerControls = () => {
  return (
    <Controls.Root
      id="tvp-controls"
      className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-black/60 px-4 py-3 opacity-0 transition-opacity duration-200 data-visible:opacity-100 group-data-fullscreen:px-4! group-data-fullscreen:py-3!"
    >
      <SeekKeys />

      <SeekBar />

      <Controls.Group
        id="tvp-controls-main"
        className="flex w-full items-center gap-1.5"
      >
        <SeekButton dir={-1} />
        <PlayPauseButton />
        <SeekButton dir={1} />

        <VolumeControl />
        <LiveButton />
        <TimeDisplay />

        <div className="flex-1" />

        <CaptionsMenu />
        <AudioMenu />
        <QualityMenu />

        <RemotePlaybackButton />
        <PipButton />
        <FullscreenButton />
      </Controls.Group>
    </Controls.Root>
  )
}
