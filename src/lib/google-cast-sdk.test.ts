import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const logger = vi.hoisted(() => ({ warn: vi.fn(), info: vi.fn() }))

vi.mock('@/shared/logger', () => ({ logger }))

const importLoader = async () =>
  (await import('@/lib/google-cast-sdk')).loadCastSdk

const castWindow = window as unknown as Record<string, unknown>

const markSdkReady = () => {
  castWindow.cast = { framework: {} }
  castWindow.chrome = { cast: { isAvailable: true } }
}

const senderAvailable = (available: boolean) =>
  (castWindow.__onGCastApiAvailable as (available: boolean) => void)(available)

const captureScripts = () => {
  const scripts: HTMLScriptElement[] = []
  vi.spyOn(document.head, 'append').mockImplementation((node) => {
    scripts.push(node as HTMLScriptElement)
  })
  return scripts
}

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
})

afterEach(() => {
  delete castWindow.cast
  delete castWindow.chrome
  delete castWindow.__onGCastApiAvailable
  for (const script of document.head.querySelectorAll('script')) {
    script.remove()
  }
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('loadCastSdk', () => {
  it('resolves true without injecting scripts when the sdk is ready', async () => {
    markSdkReady()
    const loadCastSdk = await importLoader()
    await expect(loadCastSdk()).resolves.toBe(true)
    expect(document.head.querySelectorAll('script')).toHaveLength(0)
  })

  it('injects the vendored sdk scripts', async () => {
    const scripts = captureScripts()
    const loadCastSdk = await importLoader()
    void loadCastSdk()
    expect(scripts.map((s) => s.getAttribute('src'))).toEqual([
      '/vendor/cast_framework.js',
      '/vendor/cast_sender.js',
    ])
  })

  it('resolves true when the sender reports availability', async () => {
    const scripts = captureScripts()
    const loadCastSdk = await importLoader()
    const promise = loadCastSdk()
    markSdkReady()
    senderAvailable(true)
    for (const script of scripts) script.onload?.call(script, new Event('load'))
    await expect(promise).resolves.toBe(true)
    expect(logger.info).toHaveBeenCalledWith('player', 'cast sdk ready')
  })

  it('resolves false when a script fails to load', async () => {
    const scripts = captureScripts()
    const loadCastSdk = await importLoader()
    const promise = loadCastSdk()
    scripts[0]?.onerror?.call(scripts[0], new Event('error'))
    await expect(promise).resolves.toBe(false)
    expect(logger.warn).toHaveBeenCalledWith(
      'player',
      'cast sdk load failed',
      expect.stringContaining('/vendor/cast_framework.js'),
    )
  })

  it('resolves false when the sender never becomes available', async () => {
    vi.useFakeTimers()
    const scripts = captureScripts()
    const loadCastSdk = await importLoader()
    const promise = loadCastSdk()
    for (const script of scripts) script.onload?.call(script, new Event('load'))
    await vi.advanceTimersByTimeAsync(10_000)
    await expect(promise).resolves.toBe(false)
    expect(logger.warn).toHaveBeenCalledWith('player', 'cast sdk unavailable')
  })

  it('caches the loader promise across calls', async () => {
    const scripts = captureScripts()
    const loadCastSdk = await importLoader()
    const first = loadCastSdk()
    const second = loadCastSdk()
    expect(second).toBe(first)
    expect(scripts).toHaveLength(2)
  })
})
