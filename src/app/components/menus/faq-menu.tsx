import { BugIcon, QuestionIcon } from '@phosphor-icons/react'
import { MenuHeader } from '@/app/components/menus/menu-header'
import { NavMenu, NavMenuContent } from '@/app/components/menus/nav-menu'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'

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

export const FaqMenu = () => {
  return (
    <NavMenu
      id="tvp-menu-faq"
      panelId="tvp-faq-panel"
      label="Pomoc"
      icon={<QuestionIcon className="size-4.5" />}
    >
      <MenuHeader title="Pomoc" />
      <NavMenuContent>
        {FAQ.map((item) => (
          <div key={item.q} className="px-3 py-2">
            <p className="text-[13px] font-medium">{item.q}</p>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {item.a}
            </p>
          </div>
        ))}
        <Separator className="mx-3 my-1 data-[orientation=horizontal]:w-auto" />
        <div className="px-3 py-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full text-[13px] text-muted-foreground hover:text-foreground"
          >
            <a
              href="https://github.com/damian-kociszewski/tvp-sport-player/issues"
              target="_blank"
              rel="noreferrer"
            >
              <BugIcon className="size-3.5" />
              Zgłoś problem
            </a>
          </Button>
        </div>
      </NavMenuContent>
    </NavMenu>
  )
}
