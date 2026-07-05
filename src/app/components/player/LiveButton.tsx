import { useMediaPlayer, useMediaState } from '@vidstack/react'
import { cn } from 'cnfast'

const pill =
  'ml-2 flex items-center gap-1.5 px-2.5 py-[5px] font-mono text-[11px] font-medium tracking-[0.08em]'

const label = 'leading-none translate-y-[0.5px]'

export function LiveButton() {
  const live = useMediaState('live')
  const player = useMediaPlayer()
  const seekableEnd = useMediaState('seekableEnd')

  if (!live) {
    return (
      <span className={cn(pill, 'bg-white/12 text-white/80')}>
        <span className="size-1.5 bg-white/70" />
        <span className={label}>NAGRANIE</span>
      </span>
    )
  }

  return (
    <button
      type="button"
      title="Przejdź na żywo"
      onClick={() => {
        if (player) player.currentTime = seekableEnd
      }}
      className={cn(pill, 'bg-live text-white hover:opacity-90')}
    >
      <span className="size-1.5 bg-white" />
      <span className={label}>NA ŻYWO</span>
    </button>
  )
}
