import { useEffect, useRef } from 'react'
import { Footer } from '@/app/components/layout/Footer'
import { Navbar } from '@/app/components/layout/Navbar'
import { ErrorOverlay } from '@/app/components/player/ErrorOverlay'
import { VideoStage } from '@/app/components/player/VideoStage'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { useSettings } from '@/app/hooks/useSettings'
import { useStreamPayload } from '@/app/hooks/useStreamPayload'
import { useTheme } from '@/app/hooks/useTheme'

const CustomCss = ({ css }: { css: string }) => {
  const ref = useRef<HTMLStyleElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.textContent = css
  }, [css])
  return <style ref={ref} />
}

export const App = () => {
  const state = useStreamPayload()
  const { ready, settings } = useSettings()

  useTheme(settings.theme)

  return (
    <TooltipProvider>
      <div
        id="tvp-app"
        className="flex min-h-dvh flex-col bg-background font-sans text-foreground scrollbar-gutter-stable"
      >
        <Navbar />

        <main
          id="tvp-main"
          className="flex flex-1 flex-col items-center justify-start p-[clamp(16px,2vw,40px)]"
        >
          <div
            id="tvp-content"
            className="flex w-[min(1600px,100%,calc((100dvh-60px-110px)*16/9))] flex-col gap-4"
          >
            {state.status === 'missing' && (
              <div
                id="tvp-missing"
                className="relative aspect-video w-full overflow-hidden border"
              >
                <ErrorOverlay error="missing" />
              </div>
            )}
            {state.status === 'ready' && ready && (
              <VideoStage payload={state.payload} />
            )}
          </div>
        </main>

        <Footer />
        <CustomCss css={settings.customCss} />
      </div>
    </TooltipProvider>
  )
}
