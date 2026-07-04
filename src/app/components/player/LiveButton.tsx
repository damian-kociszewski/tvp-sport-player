import { useMediaState } from '@vidstack/react'

const pill =
  'ml-2 flex items-center gap-1.5 rounded-[7px] px-2.5 py-[5px] font-mono text-[11px] font-medium tracking-[0.08em]'

const label = 'leading-none translate-y-[0.5px]'

export function LiveButton() {
  const live = useMediaState('live')

  if (!live) {
    return (
      <span className={`${pill} bg-white/12 text-white/80`}>
        <span className="size-1.5 rounded-full bg-white/70" />
        <span className={label}>NAGRANIE</span>
      </span>
    )
  }

  return (
    <span className={`${pill} bg-live text-white`}>
      <span className="size-1.5 rounded-full bg-white" />
      <span className={label}>NA ŻYWO</span>
    </span>
  )
}
