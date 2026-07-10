import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearLogs,
  getLogs,
  LOGS_KEY,
  type LogEntry,
  logger,
} from '@/shared/logger'
import { createChromeMock } from '@/test/chrome-mock'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

afterEach(async () => {
  await flush()
  vi.unstubAllGlobals()
})

describe('logger', () => {
  it('persists an entry with level, scope and formatted message', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    logger.warn('scope', 'a', { b: 1 }, 2)
    await flush()
    const list = local.data.get(LOGS_KEY) as LogEntry[]
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({
      level: 'warn',
      scope: 'scope',
      msg: 'a {"b":1} 2',
    })
    expect(list[0].ts).toBeTypeOf('number')
  })

  it('stringifies unserializable values with String()', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const circular: Record<string, unknown> = {}
    circular.self = circular
    logger.error('scope', circular)
    await flush()
    const list = local.data.get(LOGS_KEY) as LogEntry[]
    expect(list[0].msg).toBe('[object Object]')
  })

  it('appends entries in order', async () => {
    const { chrome: mock, local } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    logger.info('scope', 'first')
    logger.info('scope', 'second')
    await flush()
    const list = local.data.get(LOGS_KEY) as LogEntry[]
    expect(list.map((e) => e.msg)).toEqual(['first', 'second'])
  })

  it('trims the log to the newest 1000 entries', async () => {
    const { chrome: mock, local } = createChromeMock()
    const existing: LogEntry[] = Array.from({ length: 1000 }, (_, i) => ({
      ts: i,
      level: 'info',
      scope: 's',
      msg: `m${i}`,
    }))
    local.data.set(LOGS_KEY, existing)
    vi.stubGlobal('chrome', mock)
    logger.info('s', 'overflow')
    await flush()
    const list = local.data.get(LOGS_KEY) as LogEntry[]
    expect(list).toHaveLength(1000)
    expect(list[0].msg).toBe('m1')
    expect(list.at(-1)?.msg).toBe('overflow')
  })

  it('does not persist when chrome storage is unavailable', async () => {
    logger.info('scope', 'dropped')
    await flush()
    expect(await getLogs()).toEqual([])
  })
})

describe('getLogs', () => {
  it('returns an empty list when chrome storage is unavailable', async () => {
    expect(await getLogs()).toEqual([])
  })

  it('returns stored entries', async () => {
    const { chrome: mock, local } = createChromeMock()
    const entries: LogEntry[] = [{ ts: 1, level: 'info', scope: 's', msg: 'x' }]
    local.data.set(LOGS_KEY, entries)
    vi.stubGlobal('chrome', mock)
    expect(await getLogs()).toEqual(entries)
  })
})

describe('clearLogs', () => {
  it('removes stored entries', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(LOGS_KEY, [{ ts: 1, level: 'info', scope: 's', msg: 'x' }])
    vi.stubGlobal('chrome', mock)
    await clearLogs()
    expect(local.data.has(LOGS_KEY)).toBe(false)
  })
})
