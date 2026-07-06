import { CodeIcon, HandCoinsIcon, GlobeIcon } from '@phosphor-icons/react'
import { version as APP_VERSION } from '../../../../package.json'
import { LogoMark, LogoWordmark } from '../shared/Logo'

export function Footer() {
  return (
    <footer
      id="tvp-footer"
      className="border-t border-line px-[clamp(16px,3vw,32px)] py-7"
    >
      <div className="mx-auto flex w-full max-w-300 flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-160 flex-col gap-2.5">
          <div className="flex items-center gap-2">
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
            Rozszerzenie nie zbiera ani nie wysyła żadnych danych - wszystko
            pozostaje w Twojej przeglądarce.
          </p>
          <div
            id="tvp-footer-meta"
            className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted"
          >
            <span>Wersja {APP_VERSION}</span>
            <span aria-hidden>·</span>
            <span>Licencja MIT</span>
            <span aria-hidden>·</span>
            <a
              href="https://github.com/damian-kociszewski/tvp-sport-player/issues"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fg"
            >
              Zgłoś problem
            </a>
          </div>
        </div>
        <div id="tvp-footer-links" className="flex shrink-0 items-center gap-4">
          <a
            id="tvp-link-home"
            href="https://kociszew.ski/"
            target="_blank"
            rel="noreferrer"
            title="Moja strona"
            className="flex items-center text-muted hover:text-white"
          >
            <span className="sr-only">Moja strona</span>
            <GlobeIcon className="size-5" />
          </a>
          <a
            id="tvp-link-coffee"
            href="https://buymeacoffee.com/kociszewski"
            target="_blank"
            rel="noreferrer"
            title="Postaw mi kawę"
            className="flex items-center text-muted hover:text-white"
          >
            <span className="sr-only">Postaw mi kawę</span>
            <HandCoinsIcon className="size-5" />
          </a>
          <a
            id="tvp-link-github"
            href="https://github.com/damian-kociszewski/tvp-sport-player"
            target="_blank"
            rel="noreferrer"
            title="Kod źródłowy"
            className="flex items-center text-muted hover:text-white"
          >
            <span className="sr-only">Kod źródłowy</span>
            <CodeIcon className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
