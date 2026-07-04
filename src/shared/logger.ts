export type LogLevel = 'info' | 'warn' | 'error'

export interface LogEntry {
  ts: number
  level: LogLevel
  scope: string
  msg: string
}

export const LOGS_KEY = 'logs'
const MAX_ENTRIES = 1000

function hasStorage(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage?.local
}

function format(args: unknown[]): string {
  return args
    .map((a) => {
      if (typeof a === 'string') return a
      try {
        return JSON.stringify(a)
      } catch {
        return String(a)
      }
    })
    .join(' ')
}

let chain: Promise<void> = Promise.resolve()

function persist(entry: LogEntry): void {
  if (!hasStorage()) return
  chain = chain
    .then(async () => {
      const list =
        ((await chrome.storage.local.get(LOGS_KEY))[LOGS_KEY] as
          | LogEntry[]
          | undefined) ?? []
      list.push(entry)
      if (list.length > MAX_ENTRIES) list.splice(0, list.length - MAX_ENTRIES)
      await chrome.storage.local.set({ [LOGS_KEY]: list })
    })
    .catch(() => {})
}

function emit(level: LogLevel, scope: string, args: unknown[]): void {
  persist({ ts: Date.now(), level, scope, msg: format(args) })
}

export const logger = {
  info: (scope: string, ...args: unknown[]) => emit('info', scope, args),
  warn: (scope: string, ...args: unknown[]) => emit('warn', scope, args),
  error: (scope: string, ...args: unknown[]) => emit('error', scope, args),
}

export async function getLogs(): Promise<LogEntry[]> {
  if (!hasStorage()) return []
  return (
    ((await chrome.storage.local.get(LOGS_KEY))[LOGS_KEY] as
      | LogEntry[]
      | undefined) ?? []
  )
}

export async function clearLogs(): Promise<void> {
  if (!hasStorage()) return
  await chrome.storage.local.remove(LOGS_KEY)
}
