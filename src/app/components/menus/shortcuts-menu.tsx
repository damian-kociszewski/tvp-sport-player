import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  KeyboardIcon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { MenuHeader } from '@/app/components/menus/menu-header'
import { NavMenu, NavMenuContent } from '@/app/components/menus/nav-menu'
import { Kbd } from '@/app/components/ui/kbd'

const arrow = (Icon: typeof ArrowLeftIcon) => (
  <Icon className="size-3.25" weight="bold" />
)

const SHORTCUTS: { label: string; keys: { id: string; node: ReactNode }[] }[] =
  [
    {
      label: 'Odtwórz / pauza',
      keys: [
        { id: 'space', node: 'Spacja' },
        { id: 'k', node: 'K' },
      ],
    },
    { label: 'Wycisz / odcisz', keys: [{ id: 'm', node: 'M' }] },
    { label: 'Pełny ekran', keys: [{ id: 'f', node: 'F' }] },
    { label: 'Obraz w obrazie', keys: [{ id: 'i', node: 'I' }] },
    { label: 'Przejdź na żywo', keys: [{ id: 'l', node: 'L' }] },
    { label: 'Przesyłaj na urządzenie', keys: [{ id: 'a', node: 'A' }] },
    {
      label: 'Przewiń w tył / w przód',
      keys: [
        { id: 'left', node: arrow(ArrowLeftIcon) },
        { id: 'right', node: arrow(ArrowRightIcon) },
      ],
    },
    {
      label: 'Głośność',
      keys: [
        { id: 'up', node: arrow(ArrowUpIcon) },
        { id: 'down', node: arrow(ArrowDownIcon) },
      ],
    },
  ]

export const ShortcutsMenu = () => {
  return (
    <NavMenu
      id="tvp-menu-shortcuts"
      panelId="tvp-shortcuts-panel"
      label="Skróty klawiszowe"
      icon={<KeyboardIcon className="size-4.5" />}
    >
      <MenuHeader title="Skróty klawiszowe" />
      <NavMenuContent>
        {SHORTCUTS.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between gap-4 px-3 py-2"
          >
            <span className="text-[13px]">{s.label}</span>
            <div className="flex shrink-0 items-center gap-1">
              {s.keys.map((k, i) => (
                <span key={k.id} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="text-[11px] text-muted-foreground">/</span>
                  )}
                  <Kbd className="border font-mono text-[11px] text-foreground">
                    {k.node}
                  </Kbd>
                </span>
              ))}
            </div>
          </div>
        ))}
      </NavMenuContent>
    </NavMenu>
  )
}
