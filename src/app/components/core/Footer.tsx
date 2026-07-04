import { CodeXml, HandCoins, IdCard } from 'lucide-react'
import { version as APP_VERSION } from '../../../../package.json'
import { LogoMark, LogoWordmark } from '../shared/Logo'

export function Footer() {
  return (
    <footer className="border-t border-line px-[clamp(16px,3vw,32px)] py-7">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-140 flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-5" />
            <span className="text-[13px] font-bold tracking-[0.04em]">
              <LogoWordmark />
            </span>
          </div>
          <p className="m-0 text-xs leading-relaxed text-muted">
            Nieoficjalny odtwarzacz transmisji TVP SPORT™ - z wyborem jakości,
            języka, obrazem w obrazie i skrótami klawiszowymi. Transmisje
            pochodzą bezpośrednio z serwerów TVP.
          </p>
          <p className="m-0 text-xs leading-relaxed text-muted">
            Rozszerzenie nie jest powiązane, sponsorowane ani autoryzowane przez
            Telewizję Polską S.A. Nazwa "TVP SPORT", logo oraz treść transmisji
            są własnością ich właścicieli. Narzędzie służy wyłącznie do
            wygodnego oglądania publicznie dostępnych transmisji.
          </p>
          <p className="m-0 text-xs leading-relaxed text-muted">
            Rozszerzenie nie zbiera ani nie wysyła żadnych danych — wszystko
            pozostaje w Twojej przeglądarce.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
            <span>v{APP_VERSION}</span>
            <span aria-hidden>·</span>
            <span>Licencja MIT</span>
            <span aria-hidden>·</span>
            <a
              href="https://github.com/damian-kociszewski/tvp-sport-player/issues"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-fg"
            >
              Zgłoś problem
            </a>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="https://kociszew.ski/"
            target="_blank"
            rel="noreferrer"
            title="Moja strona"
            className="flex items-center text-muted transition-colors hover:text-white"
          >
            <span className="sr-only">Moja strona</span>
            <IdCard size={18} />
          </a>
          <a
            href="https://buymeacoffee.com/kociszewski"
            target="_blank"
            rel="noreferrer"
            title="Postaw mi kawę"
            className="flex items-center text-muted transition-colors hover:text-white"
          >
            <span className="sr-only">Postaw mi kawę</span>
            <HandCoins size={18} />
          </a>
          <a
            href="https://github.com/damian-kociszewski/tvp-sport-player"
            target="_blank"
            rel="noreferrer"
            title="Kod źródłowy"
            className="flex items-center text-muted transition-colors hover:text-white"
          >
            <span className="sr-only">Kod źródłowy</span>
            <CodeXml size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
