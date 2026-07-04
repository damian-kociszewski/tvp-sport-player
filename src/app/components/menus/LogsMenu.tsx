import { ScrollText, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  clearLogs,
  getLogs,
  LOGS_KEY,
  type LogEntry,
} from '../../../shared/logger'

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
        type="button"
        title="Logi"
        aria-label="Logi"
        onClick={() => setOpen((v) => !v)}
        className={`flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-hoverbg hover:text-fg ${
          open ? 'bg-hoverbg text-fg' : ''
        }`}
      >
        <ScrollText size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-40 flex max-h-[70vh] w-[440px] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-2 border-line border-b px-3 py-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              Logi ({logs.length})
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copy}
                className="rounded-md px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:bg-hoverbg hover:text-fg"
              >
                Kopiuj
              </button>
              <button
                type="button"
                title="Wyczyść logi"
                onClick={() => {
                  void clearLogs().then(refresh)
                }}
                className="flex size-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-hoverbg hover:text-live"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

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
                    className={`min-w-0 flex-1 wrap-anywhere ${LEVEL_COLOR[l.level]}`}
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
