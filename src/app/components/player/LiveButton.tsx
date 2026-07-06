import { useMediaPlayer, useMediaState } from '@vidstack/react'
import { cn } from '@/lib/utils'

const pill =
  'ml-2 flex items-center gap-1.5 px-2.5 py-[5px] font-mono text-[11px] font-medium tracking-[0.08em] transition-all'

const label = 'leading-none translate-y-[0.5px]'

export const LiveButton = () => {
  const live = useMediaState('live')
  const player = useMediaPlayer()
  const seekableEnd = useMediaState('seekableEnd')

  if (!live) {
    return (
      <span id="tvp-live" className={cn(pill, 'bg-white/12 text-white/80')}>
        <span className={label}>NAGRANIE</span>
      </span>
    )
  }

  return (
    <button
      id="tvp-live"
      type="button"
      title="Przejdź na żywo"
      onClick={() => {
        if (player) player.currentTime = seekableEnd
      }}
      className={cn(
        pill,
        'cursor-pointer bg-destructive text-white hover:opacity-90',
      )}
    >
      <span className="size-1.5 bg-white" />
      <span className={label}>NA ŻYWO</span>
    </button>
  )
}
