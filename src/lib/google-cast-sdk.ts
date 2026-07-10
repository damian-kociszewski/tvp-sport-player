import { logger } from '@/shared/logger'

const SDK_SCRIPTS = ['/vendor/cast_framework.js', '/vendor/cast_sender.js']
const SDK_TIMEOUT_MS = 10_000

const isCastReady = (): boolean =>
  !!window.cast?.framework && !!window.chrome?.cast?.isAvailable

const injectScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`failed to load ${src}`))
    document.head.append(script)
  })

let sdkPromise: Promise<boolean> | null = null

export const loadCastSdk = (): Promise<boolean> => {
  sdkPromise ??= (async () => {
    if (isCastReady()) return true

    const senderReady = new Promise<boolean>((resolve) => {
      window.__onGCastApiAvailable = (available) => resolve(available)
      setTimeout(() => resolve(false), SDK_TIMEOUT_MS)
    })

    try {
      await Promise.all(SDK_SCRIPTS.map(injectScript))
    } catch (e) {
      logger.warn('player', 'cast sdk load failed', String(e))
      return false
    }

    const ready = (await senderReady) && isCastReady()
    if (ready) logger.info('player', 'cast sdk ready')
    else logger.warn('player', 'cast sdk unavailable')
    return ready
  })()
  return sdkPromise
}
