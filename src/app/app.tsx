import { CustomCss } from '@/app/components/core/custom-css'
import { Footer } from '@/app/components/core/footer'
import { Navbar } from '@/app/components/core/navbar'
import { ErrorOverlay } from '@/app/components/player/error-overlay'
import { VideoStage } from '@/app/components/player/video-stage'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { useStreamPayload } from '@/app/hooks/useStreamPayload'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { ThemeProvider } from '@/app/providers/theme-provider'

export const App = () => {
  const state = useStreamPayload()

  return (
    <SettingsProvider>
      <ThemeProvider>
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
                {state.status === 'ready' && (
                  <VideoStage payload={state.payload} />
                )}
              </div>
            </main>

            <Footer />
            <CustomCss />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </SettingsProvider>
  )
}
