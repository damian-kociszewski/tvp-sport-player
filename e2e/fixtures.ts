import { existsSync } from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  type BrowserContext,
  test as base,
  chromium,
  expect,
  type Page,
  type Worker,
} from '@playwright/test'
import { DEFAULT_SETTINGS, type PlayerSettings } from '../src/shared/settings'
import type { StreamPayload } from '../src/shared/stream'

const CHROMIUM_DIST = new URL('../dist/chromium', import.meta.url).pathname

export interface OpenPlayerOptions {
  src?: string
  title?: string
  subtitle?: string
  sourceUrl?: string
  settings?: Partial<PlayerSettings>
}

interface Fixtures {
  resetState: undefined
  seedSettings: (patch?: Partial<PlayerSettings>) => Promise<void>
  openPlayer: (options?: OpenPlayerOptions) => Promise<Page>
}

interface WorkerFixtures {
  extensionContext: BrowserContext
  serviceWorker: Worker
  extensionId: string
  extensionBaseUrl: string
}

export const test = base.extend<Fixtures, WorkerFixtures>({
  extensionContext: [
    async ({}, use) => {
      if (!existsSync(join(CHROMIUM_DIST, 'manifest.json'))) {
        throw new Error(
          'dist/chromium is missing - run `npm run build:chromium` first',
        )
      }
      const profileDir = await mkdtemp(join(tmpdir(), 'tvp-e2e-'))
      const context = await chromium.launchPersistentContext(profileDir, {
        headless: false,
        viewport: { width: 1280, height: 800 },
        args: [
          `--disable-extensions-except=${CHROMIUM_DIST}`,
          `--load-extension=${CHROMIUM_DIST}`,
          '--autoplay-policy=no-user-gesture-required',
          '--mute-audio',
        ],
      })
      await use(context)
      await context.close()
    },
    { scope: 'worker' },
  ],
  serviceWorker: [
    async ({ extensionContext }, use) => {
      const worker =
        extensionContext.serviceWorkers()[0] ??
        (await extensionContext.waitForEvent('serviceworker'))
      await use(worker)
    },
    { scope: 'worker' },
  ],
  extensionId: [
    async ({ serviceWorker }, use) => {
      await use(new URL(serviceWorker.url()).hostname)
    },
    { scope: 'worker' },
  ],
  extensionBaseUrl: [
    async ({ extensionId }, use) => {
      await use(`chrome-extension://${extensionId}`)
    },
    { scope: 'worker' },
  ],
  context: async ({ extensionContext }, use) => {
    await use(extensionContext)
  },
  resetState: [
    async ({ context, serviceWorker }, use) => {
      const blank = await context.newPage()
      for (const page of context.pages()) {
        if (page !== blank) await page.close()
      }
      await serviceWorker.evaluate(async () => {
        await chrome.storage.local.clear()
        await chrome.storage.session.clear()
      })
      await use(undefined)
    },
    { auto: true },
  ],
  seedSettings: async ({ serviceWorker }, use) => {
    await use(async (patch = {}) => {
      const items = Object.fromEntries(
        Object.entries({ ...DEFAULT_SETTINGS, ...patch }).map(
          ([key, value]) => [`settings.${key}`, value],
        ),
      )
      await serviceWorker.evaluate(
        (entries) => chrome.storage.local.set(entries),
        items,
      )
    })
  },
  openPlayer: async (
    { context, extensionBaseUrl, serviceWorker, seedSettings },
    use,
  ) => {
    await use(async (options = {}) => {
      if (options.settings) await seedSettings(options.settings)
      let search = ''
      if (options.src) {
        const id = crypto.randomUUID()
        const payload: StreamPayload = {
          src: options.src,
          title: options.title ?? 'Test Stream',
          subtitle: options.subtitle ?? '',
          sourceUrl: options.sourceUrl ?? '',
          capturedAt: Date.now(),
        }
        await serviceWorker.evaluate(
          (entry) => chrome.storage.session.set({ [entry.key]: entry.payload }),
          {
            key: `player:${id}`,
            payload,
          },
        )
        search = `?id=${id}`
      }
      const page = await context.newPage()
      await page.goto(`${extensionBaseUrl}/index.html${search}`)
      await expect(page.locator('#tvp-app')).toBeVisible()
      return page
    })
  },
})

export { expect }

export interface VideoState {
  paused: boolean
  muted: boolean
  volume: number
  currentTime: number
  duration: number
  videoHeight: number
}

export const videoState = (page: Page): Promise<VideoState> =>
  page.evaluate(() => {
    const video = document.querySelector('#tvp-player video')
    if (!(video instanceof HTMLVideoElement)) {
      throw new Error('video element not found')
    }
    return {
      paused: video.paused,
      muted: video.muted,
      volume: video.volume,
      currentTime: video.currentTime,
      duration: video.duration,
      videoHeight: video.videoHeight,
    }
  })

export const waitForPlaying = async (page: Page) => {
  await expect(page.locator('#tvp-player')).toHaveAttribute(
    'data-playing',
    '',
    {
      timeout: 20_000,
    },
  )
}

export const expectTimeAdvancing = async (page: Page) => {
  const start = (await videoState(page)).currentTime
  await expect
    .poll(async () => (await videoState(page)).currentTime, {
      timeout: 15_000,
    })
    .toBeGreaterThan(start + 0.5)
}

export const showControls = async (page: Page) => {
  await page.locator('#tvp-player').hover()
  await expect(page.locator('#tvp-controls')).toHaveAttribute(
    'data-visible',
    '',
  )
}

export const readSettings = (host: Worker): Promise<PlayerSettings> =>
  host.evaluate(async (defaults) => {
    const stored = await chrome.storage.local.get(null)
    const settings: Record<string, unknown> = { ...defaults }
    for (const [key, value] of Object.entries(stored)) {
      if (key.startsWith('settings.'))
        settings[key.slice('settings.'.length)] = value
    }
    return settings as unknown as PlayerSettings
  }, DEFAULT_SETTINGS)
