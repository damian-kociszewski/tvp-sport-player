import { CircleHelp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Widzę czarny ekran zamiast transmisji.',
    a: 'Zamknij kartę z odtwarzaczem, odśwież stronę transmisji na sport.tvp.pl, a następnie kliknij ikonę rozszerzenia jeszcze raz.',
  },
  {
    q: 'Transmisja się nie odtwarza.',
    a: 'Część transmisji jest chroniona (DRM) i nie da się ich odtworzyć poza oficjalnym serwisem. Inne mogą wymagać zalogowania na tvp.pl.',
  },
  {
    q: 'Pojawił się komunikat, że link wygasł.',
    a: 'Adresy transmisji mają krótki czas życia. Wróć na stronę TVP, odśwież ją i otwórz odtwarzacz ponownie.',
  },
  {
    q: 'Czy moje dane są gdzieś wysyłane?',
    a: 'Nie. Wszystko zostaje lokalnie w Twojej przeglądarce - rozszerzenie nie zbiera ani nie wysyła żadnych danych.',
  },
]

export function FaqMenu() {
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
        title="Pomoc (FAQ)"
        aria-label="Pomoc (FAQ)"
        onClick={() => setOpen((v) => !v)}
        className={`flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-hoverbg hover:text-fg ${
          open ? 'bg-hoverbg text-fg' : ''
        }`}
      >
        <CircleHelp size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 max-h-[70vh] w-[340px] overflow-y-auto rounded-2xl border border-line bg-card py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <div className="px-3 pb-1.5 pt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            Najczęstsze pytania
          </div>
          {FAQ.map((item) => (
            <div key={item.q} className="px-3 py-2">
              <p className="text-[13px] font-medium">{item.q}</p>
              <p className="mt-1 text-[11px] leading-snug text-muted">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
