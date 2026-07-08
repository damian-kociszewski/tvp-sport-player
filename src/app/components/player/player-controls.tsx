import { Controls, useMediaState } from '@vidstack/react'
import { FullscreenButton } from '@/app/components/player/fullscreen-button'
import { LiveButton } from '@/app/components/player/live-button'
import { PipButton } from '@/app/components/player/pip-button'
import {
  AudioMenu,
  CaptionsMenu,
  QualityMenu,
} from '@/app/components/player/player-menu'
import { PlayPauseButton } from '@/app/components/player/play-pause-button'
import { RemotePlaybackButton } from '@/app/components/player/remote-playback-button'
import { SeekBar } from '@/app/components/player/seek-bar'
import { SeekButton, SeekKeys } from '@/app/components/player/seek-button'
import { TimeDisplay } from '@/app/components/player/time-display'
import { VolumeControl } from '@/app/components/player/volume-control'

export const PlayerControls = () => {
  const live = useMediaState('live')

  return (
    <Controls.Root
      id="tvp-controls"
      className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-linear-to-t from-black/75 to-transparent px-3.5 pb-3 pt-10 opacity-0 transition-opacity duration-200 data-visible:opacity-100"
    >
      <SeekKeys />

      {!live && (
        <Controls.Group id="tvp-controls-seek" className="flex w-full">
          <SeekBar />
        </Controls.Group>
      )}

      <Controls.Group
        id="tvp-controls-main"
        className="flex w-full items-center gap-1.5"
      >
        {!live && <SeekButton dir={-1} />}
        <PlayPauseButton />
        {!live && <SeekButton dir={1} />}

        <VolumeControl />
        <LiveButton />
        {!live && <TimeDisplay />}

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
