import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react'
import { useMediaPlayer, useMediaState } from '@vidstack/react'
import { useEffect } from 'react'
import { useSettings } from '@/app/hooks/useSettings'
import { isEditableTarget } from '@/lib/utils'

export const SeekKeys = () => {
  const { settings } = useSettings()
  const step = settings.seekStep
  const player = useMediaPlayer()
  const live = useMediaState('live')

  useEffect(() => {
    if (!player || live) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (isEditableTarget()) return
      e.preventDefault()
      e.stopImmediatePropagation()
      const delta = e.key === 'ArrowLeft' ? -step : step
      player.currentTime = Math.max(0, player.currentTime + delta)
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [player, step, live])

  return null
}

export const SeekButton = ({ dir }: { dir: -1 | 1 }) => {
  const { settings } = useSettings()
  const step = settings.seekStep
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
      className="flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {dir < 0 ? (
        <ArrowCounterClockwiseIcon className="size-4.5" />
      ) : (
        <ArrowClockwiseIcon className="size-4.5" />
      )}
    </button>
  )
}
