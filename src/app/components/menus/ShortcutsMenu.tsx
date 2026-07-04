import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Keyboard,
} from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'

const arrow = (Icon: typeof ArrowLeft) => <Icon size={13} strokeWidth={2.5} />

const SHORTCUTS: { label: string; keys: ReactNode[]; combo?: boolean }[] = [
  { label: 'Odtwórz / pauza', keys: ['Spacja', 'K'] },
  { label: 'Wycisz', keys: ['M'] },
  { label: 'Pełny ekran', keys: ['F'] },
  { label: 'Obraz w obrazie', keys: ['I'] },
  {
    label: 'Przewiń w tył / w przód',
    keys: [arrow(ArrowLeft), arrow(ArrowRight)],
  },
  { label: 'Głośność', keys: [arrow(ArrowUp), arrow(ArrowDown)] },
]

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="flex h-5 min-w-5 items-center justify-center rounded-md border border-line bg-hoverbg px-1.5 font-mono text-[11px] text-fg">
      {children}
    </kbd>
  )
}

export function ShortcutsMenu() {
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        title="Skróty klawiszowe"
        aria-label="Skróty klawiszowe"
        onClick={() => setOpen((v) => !v)}
        className={`flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-hoverbg hover:text-fg ${
          open ? 'bg-hoverbg text-fg' : ''
        }`}
      >
        <Keyboard size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-72 overflow-hidden rounded-2xl border border-line bg-card py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <div className="px-3 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            Skróty klawiszowe
          </div>
          {SHORTCUTS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between gap-4 px-3 py-2"
            >
              <span className="text-[13px]">{s.label}</span>
              <div className="flex shrink-0 items-center gap-1">
                {s.keys.map((k, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: keys are static
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-[11px] text-muted">
                        {s.combo ? '+' : '/'}
                      </span>
                    )}
                    <Kbd>{k}</Kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
