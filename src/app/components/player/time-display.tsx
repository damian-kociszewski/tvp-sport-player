import { Time, useMediaState } from '@vidstack/react'

export const TimeDisplay = () => {
  const start = useMediaState('seekableStart')
  const end = useMediaState('seekableEnd')
  if (end - start < 5) return null

  return (
    <div
      id="tvp-time"
      className="ml-1 flex items-center gap-1 font-mono text-[11px] tracking-[0.04em] text-white/80"
    >
      <Time type="current" />
      <span className="text-white/40">/</span>
      <Time type="duration" />
    </div>
  )
}
