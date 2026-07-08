import { useEffect, useRef } from 'react'
import { useSettings } from '@/app/hooks/useSettings'

export const CustomCss = () => {
  const { settings } = useSettings()
  const ref = useRef<HTMLStyleElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.textContent = settings.customCss
  }, [settings.customCss])

  return <style ref={ref} />
}
