import { FaqMenu } from '@/app/components/menus/faq-menu'
import { LogsMenu } from '@/app/components/menus/logs-menu'
import { SettingsMenu } from '@/app/components/menus/settings-menu'
import { ShortcutsMenu } from '@/app/components/menus/shortcuts-menu'
import { LogoMark, LogoWordmark } from '@/app/components/shared/logo'

export const Navbar = () => {
  return (
    <header
      id="tvp-navbar"
      className="relative z-30 border-b bg-background px-[clamp(16px,2vw,40px)]"
    >
      <div className="mx-auto flex h-15 w-[min(1600px,100%,calc((100dvh-60px-110px)*16/9))] items-center gap-4">
        <div id="tvp-navbar-logo" className="flex items-center gap-2">
          <LogoMark className="size-7" />
          <div className="hidden text-base font-bold tracking-[0.04em] sm:block">
            <LogoWordmark />
          </div>
        </div>

        <div
          id="tvp-navbar-actions"
          className="ml-auto flex items-center gap-1"
        >
          <LogsMenu />
          <FaqMenu />
          <ShortcutsMenu />
          <SettingsMenu />
        </div>
      </div>
    </header>
  )
}
