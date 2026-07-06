export type PlayerError = 'drm' | 'expired' | 'network' | 'missing'

const MESSAGES: Record<PlayerError, { title: string; detail: string }> = {
  drm: {
    title: 'Transmisja chroniona DRM',
    detail: 'Ta transmisja jest zabezpieczona i nie może zostać odtworzona.',
  },
  expired: {
    title: 'Link do transmisji wygasł',
    detail:
      'Wróć na stronę TVP Sport™, odśwież ją i otwórz odtwarzacz ponownie.',
  },
  network: {
    title: 'Nie udało się załadować transmisji',
    detail: 'Sprawdź połączenie z internetem i spróbuj ponownie.',
  },
  missing: {
    title: 'Brak danych transmisji',
    detail: 'Otwórz odtwarzacz z ikony rozszerzenia na stronie sport.tvp.pl',
  },
}

export const ErrorOverlay = ({
  error,
  sourceUrl,
}: {
  error: PlayerError
  sourceUrl?: string
}) => {
  const { title, detail } = MESSAGES[error]
  return (
    <div
      id="tvp-error"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[repeating-linear-gradient(135deg,#171512_0_14px,#131110_14px_28px)] px-6 text-center"
    >
      <div className="text-lg font-bold tracking-[-0.01em] text-white/85">
        {title}
      </div>
      <div className="font-mono text-xs tracking-widest text-white/40">
        {detail}
      </div>
      {error !== 'network' && error !== 'missing' && sourceUrl && (
        <a
          href={sourceUrl}
          className="mt-2 border border-[#2c2925] bg-[#1d1b18] px-3.5 py-2 font-mono text-xs text-[#f2efe9] hover:border-primary"
        >
          Otwórz stronę transmisji TVP Sport™
        </a>
      )}
    </div>
  )
}
