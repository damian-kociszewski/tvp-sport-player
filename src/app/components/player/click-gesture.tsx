import { Gesture } from '@vidstack/react'
import { useSettings } from '@/app/hooks/useSettings'

export const ClickGesture = () => {
  const { settings } = useSettings()
  if (settings.clickAction === 'none') return null
  return (
    <Gesture
      className="absolute inset-0 z-0 block h-full w-full"
      event="pointerup"
      action={
        settings.clickAction === 'playPause' ? 'toggle:paused' : 'toggle:muted'
      }
    />
  )
}
