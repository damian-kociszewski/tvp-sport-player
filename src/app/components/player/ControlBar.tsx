import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  ArrowsInIcon,
  ArrowsOutIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
} from '@phosphor-icons/react'
import {
  Controls,
  FullscreenButton,
  PIPButton,
  PlayButton,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import { LiveButton } from '@/app/components/player/LiveButton'
import {
  AudioMenu,
  CaptionsMenu,
  QualityMenu,
} from '@/app/components/player/PlayerMenu'
import { SeekBar } from '@/app/components/player/SeekBar'
import { TimeDisplay } from '@/app/components/player/TimeDisplay'
import { VolumeControl } from '@/app/components/player/VolumeControl'

const iconButton =
  'flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50'

const PlayPauseIcon = () => {
  const paused = useMediaState('paused')
  return paused ? (
    <PlayIcon className="size-4.5" weight="fill" />
  ) : (
    <PauseIcon className="size-4.5" weight="fill" />
  )
}

const FullscreenIcon = () => {
  const isFullscreen = useMediaState('fullscreen')
  return isFullscreen ? (
    <ArrowsInIcon className="size-4.5" />
  ) : (
    <ArrowsOutIcon className="size-4.5" />
  )
}

const SeekButton = ({ step, dir }: { step: number; dir: -1 | 1 }) => {
  const player = useMediaPlayer()
  const label =
    dir < 0 ? `Przewiń o ${step}s do tyłu` : `Przewiń o ${step}s do przodu`
  return (
    <button
      id={dir < 0 ? 'tvp-btn-seek-back' : 'tvp-btn-seek-forward'}
      type="button"
      title={label}
      aria-label={label}
      onClick={() => {
        if (player)
          player.currentTime = Math.max(0, player.currentTime + dir * step)
      }}
      className={iconButton}
    >
      {dir < 0 ? (
        <ArrowCounterClockwiseIcon className="size-4.5" />
      ) : (
        <ArrowClockwiseIcon className="size-4.5" />
      )}
    </button>
  )
}

export const ControlBar = ({ seekStep }: { seekStep: number }) => {
  const canPip = useMediaState('canPictureInPicture')
  const live = useMediaState('live')

  return (
    <Controls.Root
      id="tvp-controls"
      className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-linear-to-t from-black/75 to-transparent px-3.5 pb-3 pt-10 opacity-0 transition-opacity duration-200 data-visible:opacity-100"
    >
      {!live && (
        <Controls.Group id="tvp-controls-seek" className="flex w-full">
          <SeekBar />
        </Controls.Group>
      )}

      <Controls.Group
        id="tvp-controls-main"
        className="flex w-full items-center gap-1.5"
      >
        {!live && <SeekButton step={seekStep} dir={-1} />}
        <PlayButton
          id="tvp-btn-play"
          title="Odtwórz / pauza (spacja)"
          className={iconButton}
        >
          <PlayPauseIcon />
        </PlayButton>
        {!live && <SeekButton step={seekStep} dir={1} />}

        <VolumeControl />
        <LiveButton />
        {!live && <TimeDisplay />}

        <div className="flex-1" />

        <CaptionsMenu />
        <AudioMenu />
        <QualityMenu />

        {canPip && (
          <PIPButton
            id="tvp-btn-pip"
            title="Obraz w obrazie (I)"
            className={iconButton}
          >
            <PictureInPictureIcon className="size-4.5" />
          </PIPButton>
        )}

        <FullscreenButton
          id="tvp-btn-fullscreen"
          title="Pełny ekran (F)"
          className={iconButton}
        >
          <FullscreenIcon />
        </FullscreenButton>
      </Controls.Group>
    </Controls.Root>
  )
}
