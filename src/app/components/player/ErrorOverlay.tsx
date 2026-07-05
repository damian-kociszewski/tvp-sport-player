export type PlayerError = 'drm' | 'expired' | 'network'

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
}

export function ErrorOverlay({
  error,
  sourceUrl,
}: {
  error: PlayerError
  sourceUrl: string
}) {
  const { title, detail } = MESSAGES[error]
  return (
    <div
      id="tvp-error"
      className="stage-stripes absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 px-6 text-center"
    >
      <div className="text-lg font-bold tracking-[-0.01em] text-white/85">
        {title}
      </div>
      <div className="font-mono text-xs tracking-widest text-white/40">
        {detail}
      </div>
      {error !== 'network' && sourceUrl && (
        <a
          href={sourceUrl}
          className="mt-2 border border-line bg-card px-3.5 py-2 font-mono text-xs text-fg hover:border-accent"
        >
          Otwórz stronę transmisji TVP Sport™
        </a>
      )}
    </div>
  )
}
