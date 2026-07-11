import {
  type MediaPlayerInstance,
  type MediaState,
  useMediaState,
} from '@vidstack/react'
import { useSyncExternalStore } from 'react'

let instance: MediaPlayerInstance | null = null
const listeners = new Set<() => void>()

export const setPlayerInstance = (player: MediaPlayerInstance | null) => {
  instance = player
  for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getPlayer = () => instance

export const usePlayerState = <T extends keyof MediaState>(
  prop: T,
): MediaState[T] => {
  const player = useSyncExternalStore(subscribe, getPlayer)
  return useMediaState(prop, { current: player })
}
