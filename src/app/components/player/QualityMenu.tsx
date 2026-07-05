import { useVideoQualityOptions } from '@vidstack/react'
import { useEffect, useRef, useState } from 'react'

export function QualityMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const options = useVideoQualityOptions({ auto: 'Auto', sort: 'descending' })

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  if (options.disabled) return null

  const currentLabel =
    options.selectedValue === 'auto' || !options.selectedQuality
      ? 'Auto'
      : `${options.selectedQuality.height}p`

  return (
    <div id="tvp-menu-quality" ref={rootRef} className="relative">
      <button
        type="button"
        title="Jakość"
        onClick={() => setOpen((v) => !v)}
        className="h-9 cursor-pointer px-2.5 font-mono text-xs font-medium text-white hover:bg-white/12"
      >
        {currentLabel}
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+10px)] right-0 z-20 flex min-w-32.5 flex-col gap-0.5 border border-white/14 bg-[rgba(20,19,17,0.95)] p-1.25 backdrop-blur-lg">
          {options.map(({ label, value, select, selected, autoSelected }) => {
            const checked =
              value === 'auto'
                ? options.selectedValue === 'auto'
                : selected && !autoSelected
            return (
              <button
                key={value}
                type="button"
                onClick={(e) => {
                  select(e.nativeEvent)
                  setOpen(false)
                }}
                className={`flex cursor-pointer items-center justify-between gap-3 px-2.5 py-2 text-left font-mono text-xs hover:bg-white/10 ${
                  checked ? 'text-accent' : 'text-white'
                }`}
              >
                <span>{label}</span>
                {checked && <span className="text-[10px]">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
