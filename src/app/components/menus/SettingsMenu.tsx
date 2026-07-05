import { ArrowCounterClockwiseIcon, GearSixIcon } from '@phosphor-icons/react'
import { cn } from 'cnfast'
import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_SETTINGS,
  type PlayerSettings,
  type QualityMode,
  type Theme,
} from '../../../shared/settings'
import { MenuHeader } from './MenuHeader'

function Row({
  label,
  hint,
  children,
  stack,
}: {
  label: string
  hint: string
  children: React.ReactNode
  stack?: boolean
}) {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[13px] font-medium">{label}</span>
        {!stack && children}
      </div>
      <p className="mt-1 max-w-60 text-[11px] leading-snug text-muted">
        {hint}
      </p>
      {stack && <div className="mt-2">{children}</div>}
    </div>
  )
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        'flex h-5 w-9 shrink-0 items-center p-0.5 transition-colors',
        on ? 'bg-accent' : 'bg-white/20',
      )}
    >
      <span
        className={cn(
          'size-4 bg-white shadow transition-transform',
          on ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: [T, string][]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex w-full overflow-hidden border border-line">
      {options.map(([val, label]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={cn(
            'flex-1 px-2 py-1.5 font-mono text-[11px]',
            value === val
              ? 'bg-accent text-accent-ink'
              : 'text-muted hover:bg-hoverbg hover:text-fg',
          )}
        >
          {label}
        </button>
      ))}
    </div>
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

export function SettingsMenu({
  settings,
  update,
}: {
  settings: PlayerSettings
  update: (patch: Partial<PlayerSettings>) => void
}) {
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
        title="Ustawienia"
        aria-label="Ustawienia"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex size-9 items-center justify-center text-muted hover:bg-hoverbg hover:text-fg',
          open && 'bg-hoverbg text-fg',
        )}
      >
        <GearSixIcon className="size-4.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 w-75 overflow-hidden border border-line bg-card pb-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <MenuHeader title="Ustawienia" />
          <Row
            label="Głośność domyślna"
            hint="Poziom głośności, z jakim zaczynają nowe okna odtwarzacza."
          >
            <div className="flex items-center gap-1">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(settings.defaultVolume * 100)}
                onChange={(e) =>
                  update({ defaultVolume: Number(e.target.value) / 100 })
                }
                className="settings-range w-25 cursor-pointer outline-none"
                style={{
                  ['--fill' as string]: `${Math.round(settings.defaultVolume * 100)}%`,
                }}
              />
              <span className="w-6 text-right font-mono text-[11px] text-muted">
                {Math.round(settings.defaultVolume * 100)}
              </span>
            </div>
          </Row>

          <Row
            label="Rozpoczynij wyciszony"
            hint="Nowe okna zaczynają odtwarzanie bez dźwięku."
          >
            <Toggle
              on={settings.startMuted}
              onChange={(v) => update({ startMuted: v })}
            />
          </Row>

          <Row
            label="Zapamiętaj głośność"
            hint="Zmiana głośności w odtwarzaczu staje się domyślną głośnością dla kolejnych okien."
          >
            <Toggle
              on={settings.rememberVolume}
              onChange={(v) => update({ rememberVolume: v })}
            />
          </Row>

          <Row
            label="Autoodtwarzanie"
            hint="Nowe okna od razu rozpoczynają odtwarzanie transmisji."
          >
            <Toggle
              on={settings.autoplay}
              onChange={(v) => update({ autoplay: v })}
            />
          </Row>

          <Row
            label="Otwieraj automatycznie"
            hint="Otwórz odtwarzacz od razu po znalezieniu strumienia na stronie."
          >
            <Toggle
              on={settings.autoOpen}
              onChange={(v) => update({ autoOpen: v })}
            />
          </Row>

          <Row
            label="Przewijanie"
            hint="O ile sekund przewijają strzałki ← / →."
            stack
          >
            <Segment
              value={String(settings.seekStep)}
              options={SEEK_OPTIONS}
              onChange={(v) => update({ seekStep: Number(v) })}
            />
          </Row>

          <Row label="Jakość" hint="Domyślny wybór jakości transmisji." stack>
            <Segment
              value={settings.qualityMode}
              options={QUALITY_OPTIONS}
              onChange={(v) => update({ qualityMode: v })}
            />
          </Row>

          <Row label="Motyw" hint="Wygląd interfejsu odtwarzacza." stack>
            <Segment
              value={settings.theme}
              options={THEME_OPTIONS}
              onChange={(v) => update({ theme: v })}
            />
          </Row>

          <div className="mx-3 my-1 border-t border-line" />

          <div className="px-3 py-1.5">
            <button
              type="button"
              onClick={() => update(DEFAULT_SETTINGS)}
              className="flex w-full items-center justify-center gap-2 border border-line py-2 text-[13px] text-muted hover:bg-hoverbg hover:text-fg"
            >
              <ArrowCounterClockwiseIcon className="size-3.5" />
              Resetuj ustawienia
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
