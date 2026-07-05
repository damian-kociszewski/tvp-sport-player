import { QuestionIcon } from '@phosphor-icons/react'
import { cn } from 'cnfast'
import { useEffect, useRef, useState } from 'react'
import { MenuHeader } from './MenuHeader'

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Widzę czarny ekran zamiast transmisji.',
    a: 'Transmisja mogła niezaładować się poprawnie. Zamknij kartę z odtwarzaczem, odśwież stronę transmisji na sport.tvp.pl, a następnie kliknij ikonę rozszerzenia jeszcze raz.',
  },
  {
    q: 'Pojawił się komunikat, że transmisja jest chroniona.',
    a: 'Część transmisji jest chroniona i nie da się ich odtworzyć poza oficjalnym serwisem.',
  },
  {
    q: 'Pojawił się komunikat, że link wygasł.',
    a: 'Adresy transmisji mogą mieć krótki czas życia. Zamknij kartę z odtwarzaczem, odśwież stronę transmisji na sport.tvp.pl, a następnie kliknij ikonę rozszerzenia jeszcze raz.',
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
        id="tvp-menu-faq"
        type="button"
        title="Pomoc (FAQ)"
        aria-label="Pomoc (FAQ)"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex size-9 items-center justify-center text-muted hover:bg-hoverbg hover:text-fg',
          open && 'bg-hoverbg text-fg',
        )}
      >
        <QuestionIcon className="size-4.5" />
      </button>

      {open && (
        <div
          id="tvp-faq-panel"
          className="absolute right-0 top-[calc(100%+8px)] z-40 flex max-h-[70vh] w-85 flex-col overflow-hidden border border-line bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          <MenuHeader title="Najczęstsze pytania" />
          <div className="overflow-y-auto pb-1.5">
            {FAQ.map((item) => (
              <div key={item.q} className="px-3 py-2">
                <p className="text-[13px] font-medium">{item.q}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
