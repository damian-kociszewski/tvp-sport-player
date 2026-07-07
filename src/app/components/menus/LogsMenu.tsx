import { CopyIcon, ScrollIcon, TrashIcon } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { MenuHeader } from '@/app/components/menus/MenuHeader'
import { NavMenu, NavMenuContent } from '@/app/components/menus/NavMenu'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import { clearLogs, getLogs, LOGS_KEY, type LogEntry } from '@/shared/logger'

const LEVEL_COLOR: Record<LogEntry['level'], string> = {
  info: 'text-muted-foreground',
  warn: 'text-[oklch(0.8_0.16_85)]',
  error: 'text-destructive',
}

const time = (ts: number): string => {
  return new Date(ts).toTimeString().slice(0, 8)
}

export const LogsMenu = () => {
  const [open, setOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const refresh = useCallback(() => {
    void getLogs().then(setLogs)
  }, [])

  useEffect(() => {
    if (!open) return
    refresh()
    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'local' && changes[LOGS_KEY]) refresh()
    }
    chrome.storage?.onChanged?.addListener(onChange)
    return () => chrome.storage?.onChanged?.removeListener(onChange)
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
    <NavMenu
      id="tvp-menu-logs"
      panelId="tvp-logs-panel"
      label="Logi"
      icon={<ScrollIcon className="size-4.5" />}
      open={open}
      onOpenChange={setOpen}
    >
      <MenuHeader title={`Logi (${logs.length})`}>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={copy}
            className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
          >
            <CopyIcon className="size-3" />
            Kopiuj
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              void clearLogs().then(refresh)
            }}
            className="font-mono text-[11px] text-muted-foreground hover:text-destructive"
          >
            <TrashIcon className="size-3" />
            Wyczyść
          </Button>
        </div>
      </MenuHeader>

      <NavMenuContent>
        <div className="px-3 py-2 font-mono text-[11px] leading-relaxed">
          {logs.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Brak logów.
            </p>
          ) : (
            [...logs].reverse().map((l, i) => (
              <div
                key={`${l.ts}-${logs.length - i}`}
                className="flex gap-2 py-0.5"
              >
                <span className="shrink-0 text-muted-foreground/70">
                  {time(l.ts)}
                </span>
                <span className="shrink-0 text-muted-foreground/70">
                  [{l.scope}]
                </span>
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
      </NavMenuContent>
    </NavMenu>
  )
}
