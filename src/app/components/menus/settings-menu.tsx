import {
  BracketsCurlyIcon,
  ClockCounterClockwiseIcon,
  GearSixIcon,
} from '@phosphor-icons/react'
import { type ReactNode, useState } from 'react'
import { CssDialog } from '@/app/components/menus/css-dialog'
import { MenuHeader } from '@/app/components/menus/menu-header'
import { NavMenu, NavMenuContent } from '@/app/components/menus/nav-menu'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { Slider } from '@/app/components/ui/slider'
import { Switch } from '@/app/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/app/components/ui/toggle-group'
import { useSettings } from '@/app/hooks/useSettings'
import {
  type ClickAction,
  DEFAULT_SETTINGS,
  type QualityMode,
  type Theme,
} from '@/shared/settings'

const SettingsRow = ({
  label,
  hint,
  children,
  stack,
}: {
  label: string
  hint: string
  children: ReactNode
  stack?: boolean
}) => {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] font-medium">{label}</span>
        {!stack && children}
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {hint}
      </p>
      {stack && <div className="mt-2">{children}</div>}
    </div>
  )
}

const Segment = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: [T, string][]
  onChange: (v: T) => void
}) => {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as T)
      }}
      className="w-full"
    >
      {options.map(([val, label]) => (
        <ToggleGroupItem
          key={val}
          value={val}
          className="h-7 flex-1 px-2 font-mono text-[11px] data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

const THEME_OPTIONS: [Theme, string][] = [
  ['light', 'Jasny'],
  ['dark', 'Ciemny'],
  ['system', 'System'],
]

const QUALITY_OPTIONS: [QualityMode, string][] = [
  ['auto', 'Auto'],
  ['highest', 'Najwyższa'],
  ['lowest', 'Najniższa'],
]

const SEEK_OPTIONS: [string, string][] = [
  ['5', '5s'],
  ['10', '10s'],
  ['15', '15s'],
  ['30', '30s'],
  ['60', '60s'],
]

const CLICK_OPTIONS: [ClickAction, string][] = [
  ['playPause', 'Odtwórz / pauza'],
  ['muteUnmute', 'Wycisz / odcisz'],
  ['none', 'Brak'],
]

export const SettingsMenu = () => {
  const { settings, update } = useSettings()
  const [cssOpen, setCssOpen] = useState(false)
  const [dragVolume, setDragVolume] = useState<number | null>(null)

  const volume = dragVolume ?? settings.defaultVolume * 100

  return (
    <>
      <NavMenu
        id="tvp-menu-settings"
        panelId="tvp-settings-panel"
        label="Ustawienia"
        icon={<GearSixIcon className="size-4.5" />}
      >
        <MenuHeader title="Ustawienia" />
        <NavMenuContent>
          <SettingsRow
            label="Głośność domyślna"
            hint="Poziom głośności, z jakim zaczynają nowe okna odtwarzacza."
          >
            <div className="flex items-center gap-2">
              <Slider
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={([v]) => setDragVolume(v)}
                onValueCommit={([v]) => {
                  setDragVolume(null)
                  update({ defaultVolume: v / 100 })
                }}
                className="w-25"
              />
              <span className="w-7 shrink-0 text-right font-mono text-[11px] text-muted-foreground">
                {Math.round(volume)}%
              </span>
            </div>
          </SettingsRow>

          <SettingsRow
            label="Rozpoczynaj wyciszony"
            hint="Nowe okna zaczynają odtwarzanie bez dźwięku."
          >
            <Switch
              checked={settings.startMuted}
              onCheckedChange={(v) => update({ startMuted: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Zapamiętaj głośność"
            hint="Zmiana głośności w odtwarzaczu staje się domyślną głośnością dla kolejnych okien."
          >
            <Switch
              checked={settings.rememberVolume}
              onCheckedChange={(v) => update({ rememberVolume: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Autoodtwarzanie"
            hint="Nowe okna od razu rozpoczynają odtwarzanie transmisji."
          >
            <Switch
              checked={settings.autoplay}
              onCheckedChange={(v) => update({ autoplay: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Otwieraj automatycznie"
            hint="Otwórz odtwarzacz od razu po znalezieniu strumienia na stronie."
          >
            <Switch
              checked={settings.autoOpen}
              onCheckedChange={(v) => update({ autoOpen: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Kliknięcie w obraz"
            hint="Akcja wykonywana po kliknięciu w obszar wideo podczas odtwarzania."
            stack
          >
            <Segment
              value={settings.clickAction}
              options={CLICK_OPTIONS}
              onChange={(v) => update({ clickAction: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Przewijanie"
            hint="O ile sekund przewijane jest nagranie do tyłu / do przodu."
            stack
          >
            <Segment
              value={String(settings.seekStep)}
              options={SEEK_OPTIONS}
              onChange={(v) => update({ seekStep: Number(v) })}
            />
          </SettingsRow>

          <SettingsRow
            label="Jakość"
            hint="Domyślny wybór jakości transmisji."
            stack
          >
            <Segment
              value={settings.qualityMode}
              options={QUALITY_OPTIONS}
              onChange={(v) => update({ qualityMode: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Motyw"
            hint="Wygląd interfejsu odtwarzacza."
            stack
          >
            <Segment
              value={settings.theme}
              options={THEME_OPTIONS}
              onChange={(v) => update({ theme: v })}
            />
          </SettingsRow>

          <SettingsRow
            label="Własny CSS"
            hint="Dodatkowe reguły CSS wstrzykiwane do strony."
            stack
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCssOpen(true)}
              className="w-full text-[13px] text-muted-foreground hover:text-foreground"
            >
              <BracketsCurlyIcon className="size-3.5" />
              Edytuj CSS
            </Button>
          </SettingsRow>

          <Separator className="mx-3 my-1 data-[orientation=horizontal]:w-auto" />

          <div className="px-3 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => update(DEFAULT_SETTINGS)}
              className="w-full text-[13px] text-muted-foreground hover:text-destructive"
            >
              <ClockCounterClockwiseIcon className="size-3.5" />
              Resetuj ustawienia
            </Button>
          </div>
        </NavMenuContent>
      </NavMenu>

      <CssDialog
        open={cssOpen}
        onOpenChange={setCssOpen}
        initial={settings.customCss}
        onSave={(css) => update({ customCss: css })}
      />
    </>
  )
}
