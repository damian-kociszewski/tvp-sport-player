import { vi } from 'vitest'
import {
  type PlayerSettings,
  SETTING_KEYS,
  settingKeyOf,
} from '@/shared/settings'

export interface MemoryStorageArea {
  data: Map<string, unknown>
  get: (keys: string | string[]) => Promise<Record<string, unknown>>
  set: (items: Record<string, unknown>) => Promise<void>
  remove: (key: string) => Promise<void>
}

export const createStorageArea = (): MemoryStorageArea => {
  const data = new Map<string, unknown>()
  return {
    data,
    get: async (keys) => {
      const list = Array.isArray(keys) ? keys : [keys]
      const result: Record<string, unknown> = {}
      for (const key of list) {
        if (data.has(key)) result[key] = data.get(key)
      }
      return result
    },
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

export const seedSettings = (
  area: MemoryStorageArea,
  patch: Partial<PlayerSettings>,
): void => {
  for (const key of SETTING_KEYS) {
    if (patch[key] !== undefined) area.data.set(settingKeyOf(key), patch[key])
  }
}

export const storedSettings = (
  area: MemoryStorageArea,
): Partial<PlayerSettings> => {
  const result: Record<string, unknown> = {}
  for (const key of SETTING_KEYS) {
    const value = area.data.get(settingKeyOf(key))
    if (value !== undefined) result[key] = value
  }
  return result as Partial<PlayerSettings>
}

export const createChromeMock = () => {
  const changeListeners = new Set<StorageChangeListener>()
  const emitStorageChange = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => {
    for (const listener of changeListeners) listener(changes, area)
  }
  const withEvents = (
    area: MemoryStorageArea,
    areaName: string,
  ): MemoryStorageArea => ({
    data: area.data,
    get: area.get,
    set: async (items) => {
      const changes: Record<string, chrome.storage.StorageChange> = {}
      for (const [key, newValue] of Object.entries(items)) {
        const oldValue = area.data.get(key)
        if (oldValue !== newValue) changes[key] = { oldValue, newValue }
      }
      await area.set(items)
      if (Object.keys(changes).length > 0) emitStorageChange(changes, areaName)
    },
    remove: async (key) => {
      const oldValue = area.data.get(key)
      await area.remove(key)
      if (oldValue !== undefined)
        emitStorageChange({ [key]: { oldValue } }, areaName)
    },
  })
  const local = withEvents(createStorageArea(), 'local')
  const session = withEvents(createStorageArea(), 'session')
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
  return {
    chrome: mock as unknown as typeof chrome,
    local,
    session,
    changeListeners,
    emitStorageChange,
  }
}
