import { vi } from 'vitest'

export interface MemoryStorageArea {
  data: Map<string, unknown>
  get: (key: string) => Promise<Record<string, unknown>>
  set: (items: Record<string, unknown>) => Promise<void>
  remove: (key: string) => Promise<void>
}

export const createStorageArea = (): MemoryStorageArea => {
  const data = new Map<string, unknown>()
  return {
    data,
    get: async (key) => (data.has(key) ? { [key]: data.get(key) } : {}),
    set: async (items) => {
      for (const [k, v] of Object.entries(items)) data.set(k, v)
    },
    remove: async (key) => {
      data.delete(key)
    },
  }
}

type StorageChangeListener = (
  changes: Record<string, chrome.storage.StorageChange>,
  area: string,
) => void

export const createChromeMock = () => {
  const local = createStorageArea()
  const session = createStorageArea()
  const changeListeners = new Set<StorageChangeListener>()
  const mock = {
    storage: {
      local,
      session,
      onChanged: {
        addListener: (listener: StorageChangeListener) => {
          changeListeners.add(listener)
        },
        removeListener: (listener: StorageChangeListener) => {
          changeListeners.delete(listener)
        },
      },
    },
    action: {
      setIcon: vi.fn().mockResolvedValue(undefined),
      enable: vi.fn().mockResolvedValue(undefined),
      disable: vi.fn().mockResolvedValue(undefined),
      onClicked: { addListener: vi.fn() },
    },
    runtime: {
      onInstalled: { addListener: vi.fn() },
      getURL: vi.fn((path: string) => `chrome-extension://test/${path}`),
    },
    webRequest: { onBeforeRequest: { addListener: vi.fn() } },
    tabs: {
      onUpdated: { addListener: vi.fn() },
      onRemoved: { addListener: vi.fn() },
      get: vi.fn(),
      create: vi.fn(),
    },
    declarativeNetRequest: {
      updateDynamicRules: vi.fn().mockResolvedValue(undefined),
    },
  }
  const emitStorageChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => {
    for (const listener of changeListeners) listener(changes, area)
  }
  return {
    chrome: mock as unknown as typeof chrome,
    local,
    session,
    changeListeners,
    emitStorageChange,
  }
}
