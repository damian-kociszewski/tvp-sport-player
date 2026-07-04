import { logger } from './shared/logger'
import { loadSettings } from './shared/settings'
import {
  captureKey,
  playerKey,
  type StreamCapture,
  type StreamPayload,
} from './shared/types'

const M3U8_RE = /\.m3u8($|\?)/i
const COLLECT_WINDOW = 10_000

interface Pending {
  urls: string[]
  timer: ReturnType<typeof setTimeout>
}

const seenUrls = new Map<number, Set<string>>()
const pending = new Map<number, Pending>()

logger.info('bg', 'service worker start')

chrome.runtime.onInstalled.addListener(() => void chrome.action.disable())
chrome.runtime.onStartup.addListener(() => void chrome.action.disable())

const CORS_RULE_ID = 1
void chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [CORS_RULE_ID],
  addRules: [
    {
      id: CORS_RULE_ID,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders: [
          {
            header: 'origin',
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            value: 'https://sport.tvp.pl',
          },
          {
            header: 'referer',
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            value: 'https://sport.tvp.pl/',
          },
        ],
        responseHeaders: [
          {
            header: 'access-control-allow-origin',
            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
            value: '*',
          },
          {
            header: 'access-control-allow-credentials',
            operation: chrome.declarativeNetRequest.HeaderOperation.REMOVE,
          },
        ],
      },
      condition: {
        urlFilter: '||tvp.pl',
        excludedInitiatorDomains: ['tvp.pl'],
        resourceTypes: [
          chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          chrome.declarativeNetRequest.ResourceType.MEDIA,
          chrome.declarativeNetRequest.ResourceType.OTHER,
        ],
      },
    },
  ],
})

function rank(url: string): number {
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
    logger.info('bg', 'wykryto m3u8', tabId, url.slice(0, 90))

    const entry = pending.get(tabId)
    if (entry) {
      entry.urls.push(url)
    } else {
      pending.set(tabId, {
        urls: [url],
        timer: setTimeout(() => void finalize(tabId), COLLECT_WINDOW),
      })
    }
    return undefined
  },
  { urls: ['*://*.tvp.pl/*.m3u8*'] },
)

logger.info('bg', 'webRequest listener zarejestrowany')

async function finalize(tabId: number) {
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
    logger.info('bg', 'pomijam - karta nie jest sport.tvp.pl', host)
    return
  }

  const key = captureKey(tabId)
  const hadCapture = !!(await chrome.storage.session.get(key))[key]
  const candidates = [...entry.urls].sort((a, b) => rank(a) - rank(b))

  for (const url of candidates) {
    if (!(await isPlayablePlaylist(url))) continue
    const capture: StreamCapture = {
      src: url,
      capturedAt: Date.now(),
      sourceUrl,
    }
    await chrome.storage.session.set({ [key]: capture })
    await chrome.action.enable(tabId)
    await chrome.action.setBadgeText({ text: '●', tabId })
    await chrome.action.setBadgeTextColor({ color: '#22c55e', tabId })
    await chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 0], tabId })
    logger.info('bg', 'wybrano strumień', url.slice(0, 90))

    if (!hadCapture && (await loadSettings()).autoOpen) {
      await openPlayer(tab, capture)
    }
    return
  }
  logger.warn('bg', 'brak działającego strumienia', tabId)
}

async function openPlayer(tab: chrome.tabs.Tab, capture: StreamCapture) {
  const { title, subtitle } = parseTitle(tab.title)
  const id = crypto.randomUUID()
  await chrome.storage.session.set({
    [playerKey(id)]: { ...capture, title, subtitle } satisfies StreamPayload,
  })
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`index.html?id=${id}`),
    index: (tab.index ?? 0) + 1,
  })
  logger.info('bg', 'otwarto player', id)
}

async function isPlayablePlaylist(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { credentials: 'omit' })
    const ok = res.ok && (await res.text()).trimStart().startsWith('#EXTM3U')
    logger.info('bg', 'walidacja', res.status, ok ? 'OK' : 'ODRZUCONA')
    return ok
  } catch (e) {
    logger.info('bg', 'walidacja nieudana', String(e))
    return false
  }
}

function clearTab(tabId: number, reason: string) {
  logger.info('bg', 'czyszczę stan karty', tabId, reason)
  const entry = pending.get(tabId)
  if (entry) clearTimeout(entry.timer)
  pending.delete(tabId)
  seenUrls.delete(tabId)
  void chrome.storage.session.remove(captureKey(tabId))
  void chrome.action.setBadgeText({ text: '', tabId }).catch(() => {})
  void chrome.action.disable(tabId).catch(() => {})
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url)
    clearTab(tabId, `nawigacja na ${changeInfo.url.slice(0, 80)}`)
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
      logger.warn('bg', 'klik bez capture - wyłączam ikonkę')
      await chrome.action.setBadgeText({ text: '', tabId: tab.id })
      await chrome.action.disable(tab.id)
      return
    }

    await openPlayer(tab, capture)
  } catch (e) {
    logger.error('bg', 'błąd obsługi kliknięcia', e)
  }
})

export function parseTitle(raw?: string): { title: string; subtitle: string } {
  const fallback = { title: 'Transmisja TVP Sport™', subtitle: '' }
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
