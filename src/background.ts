import { logger } from '@/shared/logger'
import { loadSettings } from '@/shared/settings'
import {
  captureKey,
  playerKey,
  type StreamCapture,
  type StreamPayload,
} from '@/shared/stream'

const M3U8_RE = /\.m3u8($|\?)/i
const COLLECT_WINDOW_MS = 10_000

interface Pending {
  urls: string[]
  timer: ReturnType<typeof setTimeout>
}

const seenUrls = new Map<number, Set<string>>()
const pending = new Map<number, Pending>()

const ICON_SIZES = [16, 32, 48, 96, 128, 256, 512, 1024]

const iconSet = (state: 'active' | 'inactive'): Record<number, string> => {
  const set: Record<number, string> = {}
  for (const size of ICON_SIZES) set[size] = `icons/${state}/${size}.png`
  return set
}

const ACTIVE_ICON = iconSet('active')
const INACTIVE_ICON = iconSet('inactive')

const setIconState = (active: boolean, tabId?: number) => {
  const details: chrome.action.TabIconDetails = {
    path: active ? ACTIVE_ICON : INACTIVE_ICON,
  }
  if (tabId != null) details.tabId = tabId
  void chrome.action.setIcon(details).catch(() => {})
  if (tabId != null) {
    const toggle = active
      ? chrome.action.enable(tabId)
      : chrome.action.disable(tabId)
    void toggle.catch(() => {})
  }
}

setIconState(false)
void chrome.action.disable()

const CORS_RULE_ID = 1
const registerCorsRule = () =>
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [CORS_RULE_ID],
    addRules: [
      {
        id: CORS_RULE_ID,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            {
              header: 'origin',
              operation: 'set',
              value: 'https://sport.tvp.pl',
            },
            {
              header: 'referer',
              operation: 'set',
              value: 'https://sport.tvp.pl/',
            },
          ],
          responseHeaders: [
            {
              header: 'access-control-allow-origin',
              operation: 'set',
              value: '*',
            },
            {
              header: 'access-control-allow-credentials',
              operation: 'remove',
            },
          ],
        },
        condition: {
          requestDomains: ['tvp.pl'],
          excludedInitiatorDomains: ['tvp.pl'],
          resourceTypes: ['xmlhttprequest', 'media', 'other'],
        },
      },
    ],
  })

chrome.runtime.onInstalled.addListener(() => void registerCorsRule())

const rankStreamUrl = (url: string): number => {
  try {
    const name = (new URL(url).pathname.split('/').pop() ?? '').toLowerCase()
    return (name.includes('master') ? 0 : 1_000_000) + name.length
  } catch {
    return Number.MAX_SAFE_INTEGER
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { tabId, url } = details
    if (tabId < 0 || !M3U8_RE.test(url)) return undefined

    const seen = seenUrls.get(tabId) ?? new Set<string>()
    seenUrls.set(tabId, seen)
    if (seen.has(url)) return undefined
    seen.add(url)
    logger.info('bg', 'm3u8 detected', tabId, url.slice(0, 90))

    const entry = pending.get(tabId)
    if (entry) {
      entry.urls.push(url)
    } else {
      pending.set(tabId, {
        urls: [url],
        timer: setTimeout(
          () => void captureBestStream(tabId),
          COLLECT_WINDOW_MS,
        ),
      })
    }
    return undefined
  },
  { urls: ['*://*.tvp.pl/*.m3u8*'] },
)

const captureBestStream = async (tabId: number) => {
  const entry = pending.get(tabId)
  pending.delete(tabId)
  if (!entry || entry.urls.length === 0) return

  let tab: chrome.tabs.Tab
  try {
    tab = await chrome.tabs.get(tabId)
  } catch {
    return
  }
  const sourceUrl = tab.url ?? ''

  let host = ''
  try {
    host = new URL(sourceUrl).hostname
  } catch {}
  if (host !== 'sport.tvp.pl' && !host.endsWith('.sport.tvp.pl')) {
    logger.info('bg', 'skipping - tab is not sport.tvp.pl', host)
    return
  }

  const key = captureKey(tabId)
  const hadCapture = !!(await chrome.storage.session.get(key))[key]
  const candidates = [...entry.urls].sort(
    (a, b) => rankStreamUrl(a) - rankStreamUrl(b),
  )

  for (const url of candidates) {
    if (!(await isPlayablePlaylist(url))) continue
    const capture: StreamCapture = {
      src: url,
      capturedAt: Date.now(),
      sourceUrl,
    }
    await chrome.storage.session.set({ [key]: capture })
    setIconState(true, tabId)
    logger.info('bg', 'stream selected', url.slice(0, 90))

    if (!hadCapture && (await loadSettings()).autoOpen) {
      await openPlayer(tab, capture)
    }
    return
  }
  logger.warn('bg', 'no playable stream', tabId)
}

const openPlayer = async (tab: chrome.tabs.Tab, capture: StreamCapture) => {
  const { title, subtitle } = parseTitle(tab.title)
  const id = crypto.randomUUID()
  await chrome.storage.session.set({
    [playerKey(id)]: { ...capture, title, subtitle } satisfies StreamPayload,
  })
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html?id=${id}`),
    index: (tab.index ?? 0) + 1,
  })
  logger.info('bg', 'player opened', id)
}

const isPlayablePlaylist = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { credentials: 'omit' })
    const ok = res.ok && (await res.text()).trimStart().startsWith('#EXTM3U')
    logger.info('bg', 'validation', res.status, ok ? 'OK' : 'REJECTED')
    return ok
  } catch (e) {
    logger.info('bg', 'validation failed', String(e))
    return false
  }
}

const clearTab = (tabId: number, reason: string) => {
  const entry = pending.get(tabId)
  if (entry || seenUrls.has(tabId)) {
    logger.info('bg', 'clearing tab state', tabId, reason)
  }
  if (entry) clearTimeout(entry.timer)
  pending.delete(tabId)
  seenUrls.delete(tabId)
  void chrome.storage.session.remove(captureKey(tabId))
  setIconState(false, tabId)
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url)
    clearTab(tabId, `navigated to ${changeInfo.url.slice(0, 80)}`)
})

chrome.tabs.onRemoved.addListener((tabId) => {
  const entry = pending.get(tabId)
  if (entry) clearTimeout(entry.timer)
  pending.delete(tabId)
  seenUrls.delete(tabId)
  void chrome.storage.session.remove(captureKey(tabId))
})

chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab.id == null) return
    const key = captureKey(tab.id)
    const capture = (await chrome.storage.session.get(key))[key] as
      | StreamCapture
      | undefined
    if (!capture) {
      logger.warn('bg', 'click without capture - disabling icon')
      setIconState(false, tab.id)
      return
    }

    await openPlayer(tab, capture)
  } catch (e) {
    logger.error('bg', 'click handler error', e)
  }
})

export const parseTitle = (
  raw?: string,
): { title: string; subtitle: string } => {
  const fallback = { title: 'Transmisja TVP SPORT™', subtitle: '' }
  if (!raw) return fallback

  let text = raw
    .trim()
    .replace(/\s*\|\s*TVP\s+SPORT.*$/i, '')
    .trim()
  const bracket = text.indexOf('[')
  if (bracket !== -1) text = text.slice(0, bracket).trim()
  text = text.replace(/\s*\(\d{1,2}\.\d{1,2}\.\d{4}\)\s*$/, '').trim()
  if (!text) return fallback

  let depth = 0
  for (let i = 0; i < text.length - 1; i++) {
    const c = text[i]
    if (c === '(') depth++
    else if (c === ')') depth = Math.max(0, depth - 1)
    else if (c === '.' && text[i + 1] === ' ' && depth === 0) {
      return {
        title: text.slice(0, i).trim(),
        subtitle: text.slice(i + 2).trim(),
      }
    }
  }
  return { title: text, subtitle: '' }
}
