import { useEffect, useRef } from 'react'
import type { PlayerSettings, Theme } from '../shared/settings'
import { Footer } from './components/core/Footer'
import { Navbar } from './components/core/Navbar'
import { VideoStage } from './components/player/VideoStage'
import { usePayload } from './usePayload'
import { useSettings } from './useSettings'

function MissingPayload() {
  return (
    <div className="stage-stripes relative flex aspect-video w-full flex-col items-center justify-center gap-2.5 overflow-hidden border border-line px-6 text-center">
      <div className="text-lg font-bold tracking-[-0.01em] text-white/85">
        Brak danych transmisji
      </div>
      <div className="font-mono text-xs tracking-widest text-white/40">
        Otwórz odtwarzacz z ikony rozszerzenia na stronie sport.tvp.pl
      </div>
    </div>
  )
}

function useThemeAttribute(theme: Theme) {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const resolved =
        theme === 'system' ? (media.matches ? 'dark' : 'light') : theme
      document.documentElement.dataset.theme = resolved
    }
    apply()
    if (theme === 'system') {
      media.addEventListener('change', apply)
      return () => media.removeEventListener('change', apply)
    }
  }, [theme])
}

export function App() {
  const state = usePayload()
  const { ready, settings, update } = useSettings()

  useThemeAttribute(settings.theme)

  const initialSettings = useRef<PlayerSettings | null>(null)
  if (ready && !initialSettings.current) initialSettings.current = settings

  return (
    <div className="flex min-h-dvh flex-col bg-bg font-sans text-fg">
      <Navbar settings={settings} update={update} />

      <main className="flex flex-1 flex-col items-center justify-start p-[clamp(16px,2vw,40px)]">
        <div className="flex w-[min(1200px,100%,calc((100dvh-60px-110px)*16/9))] flex-col gap-4">
          {state.status === 'missing' && <MissingPayload />}
          {state.status === 'ready' && initialSettings.current && (
            <>
              <VideoStage
                payload={state.payload}
                settings={initialSettings.current}
              />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
