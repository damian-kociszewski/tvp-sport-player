import { ScrollIcon, TrashIcon } from '@phosphor-icons/react'
import { cn } from 'cnfast'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearLogs,
  getLogs,
  LOGS_KEY,
  type LogEntry,
} from '../../../shared/logger'
import { MenuHeader } from './MenuHeader'

const LEVEL_COLOR: Record<LogEntry['level'], string> = {
  info: 'text-muted',
  warn: 'text-[oklch(0.8_0.16_85)]',
  error: 'text-live',
}

function time(ts: number): string {
  return new Date(ts).toTimeString().slice(0, 8)
}

export function LogsMenu() {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(() => {
    void getLogs().then(setLogs)
  }, [])

  useEffect(() => {
    if (!open) return
    refresh()
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)

    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'local' && changes[LOGS_KEY]) refresh()
    }
    chrome.storage?.onChanged?.addListener(onChange)

    return () => {
      document.removeEventListener('pointerdown', close)
      chrome.storage?.onChanged?.removeListener(onChange)
    }
  }, [open, refresh])

  const copy = () => {
    const text = logs
      .map(
        (l) => `${time(l.ts)} [${l.scope}] ${l.level.toUpperCase()} ${l.msg}`,
      )
      .join('\n')
    void navigator.clipboard?.writeText(text)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id="tvp-menu-logs"
        type="button"
        title="Logi"
        aria-label="Logi"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex size-9 items-center justify-center text-muted hover:bg-hoverbg hover:text-fg',
          open && 'bg-hoverbg text-fg',
        )}
      >
        <ScrollIcon className="size-4.5" />
      </button>

      {open && (
        <div
          id="tvp-logs-panel"
          className="absolute right-0 top-[calc(100%+8px)] z-40 flex max-h-[70vh] w-110 flex-col overflow-hidden border border-line bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
        >
          <MenuHeader title={`Logi (${logs.length})`}>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copy}
                className="px-2 py-1 font-mono text-[11px] text-muted hover:bg-hoverbg hover:text-fg"
              >
                Kopiuj
              </button>
              <button
                type="button"
                title="Wyczyść logi"
                onClick={() => {
                  void clearLogs().then(refresh)
                }}
                className="flex size-7 items-center justify-center text-muted hover:bg-hoverbg hover:text-live"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </div>
          </MenuHeader>

          <div className="overflow-x-hidden overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
            {logs.length === 0 ? (
              <p className="py-4 text-center text-muted">Brak logów.</p>
            ) : (
              [...logs].reverse().map((l, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: log list is append-only
                <div key={i} className="flex gap-2 py-0.5">
                  <span className="shrink-0 text-muted/70">{time(l.ts)}</span>
                  <span className="shrink-0 text-muted/70">[{l.scope}]</span>
                  <span
                    className={cn(
                      'min-w-0 flex-1 wrap-anywhere',
                      LEVEL_COLOR[l.level],
                    )}
                  >
                    {l.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
