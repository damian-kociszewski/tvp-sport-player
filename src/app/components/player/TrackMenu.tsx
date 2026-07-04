import { useAudioOptions, useCaptionOptions } from '@vidstack/react'
import { Captions, Languages } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

interface TrackOption {
  label: string
  value: string
  selected: boolean
  select: (trigger?: Event) => void
}
type TrackOptions = readonly TrackOption[] & { disabled: boolean }

function TrackMenu({
  title,
  icon,
  options,
}: {
  title: string
  icon: ReactNode
  options: TrackOptions
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  if (options.disabled || options.length === 0) return null

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title={title}
        onClick={() => setOpen((v) => !v)}
        className="flex size-9 items-center justify-center rounded-lg text-white hover:bg-white/12"
      >
        {icon}
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+10px)] right-0 z-20 flex min-w-40 flex-col gap-0.5 rounded-xl border border-white/14 bg-[rgba(20,19,17,0.95)] p-1.25 backdrop-blur-lg">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={(e) => {
                o.select(e.nativeEvent)
                setOpen(false)
              }}
              className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left font-mono text-xs hover:bg-white/10 ${
                o.selected ? 'text-accent' : 'text-white'
              }`}
            >
              <span>{o.label}</span>
              {o.selected && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function CaptionsMenu() {
  const options = useCaptionOptions({ off: 'Wyłączone' })
  return (
    <TrackMenu
      title="Napisy"
      icon={<Captions size={18} />}
      options={options as unknown as TrackOptions}
    />
  )
}

export function AudioMenu() {
  const options = useAudioOptions()
  return (
    <TrackMenu
      title="Ścieżka dźwiękowa"
      icon={<Languages size={18} />}
      options={options as unknown as TrackOptions}
    />
  )
}
