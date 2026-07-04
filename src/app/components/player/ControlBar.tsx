import {
  Controls,
  FullscreenButton,
  PIPButton,
  PlayButton,
  useMediaPlayer,
  useMediaState,
} from '@vidstack/react'
import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react'
import { LiveButton } from './LiveButton'
import { QualityMenu } from './QualityMenu'
import { SeekBar } from './SeekBar'
import { TimeDisplay } from './TimeDisplay'
import { AudioMenu, CaptionsMenu } from './TrackMenu'
import { VolumeControl } from './VolumeControl'

const iconButton =
  'flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/12'

function PlayPauseIcon() {
  const paused = useMediaState('paused')
  return paused ? (
    <Play size={18} fill="currentColor" />
  ) : (
    <Pause size={18} fill="currentColor" />
  )
}

function FullscreenIcon() {
  const isFullscreen = useMediaState('fullscreen')
  return isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />
}

function SeekButton({ step, dir }: { step: number; dir: -1 | 1 }) {
  const player = useMediaPlayer()
  const label = dir < 0 ? `Cofnij o ${step} s` : `Przewiń o ${step} s do przodu`
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => {
        if (player)
          player.currentTime = Math.max(0, player.currentTime + dir * step)
      }}
      className={iconButton}
    >
      {dir < 0 ? <RotateCcw size={18} /> : <RotateCw size={18} />}
    </button>
  )
}

export function ControlBar({ seekStep }: { seekStep: number }) {
  const canPip = useMediaState('canPictureInPicture')
  const live = useMediaState('live')

  return (
    <Controls.Root className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-linear-to-t from-black/75 to-transparent px-3.5 pb-3 pt-10 opacity-0 transition-opacity data-visible:opacity-100">
      {!live && (
        <Controls.Group className="flex w-full">
          <SeekBar />
        </Controls.Group>
      )}

      <Controls.Group className="flex w-full items-center gap-1.5">
        {!live && <SeekButton step={seekStep} dir={-1} />}
        <PlayButton title="Odtwórz / pauza (spacja)" className={iconButton}>
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
          <PIPButton title="Obraz w obrazie (I)" className={iconButton}>
            <PictureInPicture2 size={18} />
          </PIPButton>
        )}

        <FullscreenButton title="Pełny ekran (F)" className={iconButton}>
          <FullscreenIcon />
        </FullscreenButton>
      </Controls.Group>
    </Controls.Root>
  )
}
