import { CodeIcon, GlobeIcon, HandCoinsIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { LogoMark, LogoWordmark } from '@/app/components/layout/Logo'
import { Button } from '@/app/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { version as APP_VERSION } from '../../../../package.json'

const FooterLink = ({
  id,
  href,
  label,
  icon,
}: {
  id: string
  href: string
  label: string
  icon: ReactNode
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
        >
          <a id={id} href={href} target="_blank" rel="noreferrer">
            <span className="sr-only">{label}</span>
            {icon}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export const Footer = () => {
  return (
    <footer id="tvp-footer" className="border-t px-[clamp(16px,2vw,40px)] py-7">
      <div className="mx-auto flex w-[min(1600px,100%,calc((100dvh-60px-110px)*16/9))] flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-160 flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <LogoMark className="size-5" />
            <span className="text-[13px] font-bold tracking-[0.04em]">
              <LogoWordmark />
            </span>
          </div>
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">
            Nieoficjalny odtwarzacz transmisji TVP SPORT™ - z wyborem jakości,
            języka, obrazem w obrazie i skrótami klawiszowymi. Transmisje
            pochodzą bezpośrednio z serwerów TVP.
          </p>
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">
            Rozszerzenie nie jest powiązane, sponsorowane ani autoryzowane przez
            Telewizję Polską S.A. Nazwa "TVP SPORT", logo oraz treść transmisji
            są własnością ich właścicieli. Narzędzie służy wyłącznie do
            wygodnego oglądania publicznie dostępnych transmisji.
          </p>
          <p className="m-0 text-xs leading-relaxed text-muted-foreground">
            Rozszerzenie nie zbiera ani nie wysyła żadnych danych - wszystko
            pozostaje w Twojej przeglądarce.
          </p>
          <div
            id="tvp-footer-meta"
            className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground"
          >
            <span>Wersja {APP_VERSION}</span>
            <span aria-hidden>·</span>
            <span>Licencja MIT</span>
          </div>
        </div>
        <div id="tvp-footer-links" className="flex shrink-0 items-center gap-1">
          <FooterLink
            id="tvp-link-home"
            href="https://kociszew.ski/"
            label="Moja strona"
            icon={<GlobeIcon className="size-5" />}
          />
          <FooterLink
            id="tvp-link-coffee"
            href="https://buymeacoffee.com/kociszewski"
            label="Postaw mi kawę"
            icon={<HandCoinsIcon className="size-5" />}
          />
          <FooterLink
            id="tvp-link-github"
            href="https://github.com/damian-kociszewski/tvp-sport-player"
            label="Kod źródłowy"
            icon={<CodeIcon className="size-5" />}
          />
        </div>
      </div>
    </footer>
  )
}
