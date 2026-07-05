import type { PlayerSettings } from '../../../shared/settings'
import { FaqMenu } from '../menus/FaqMenu'
import { LogsMenu } from '../menus/LogsMenu'
import { SettingsMenu } from '../menus/SettingsMenu'
import { ShortcutsMenu } from '../menus/ShortcutsMenu'
import { LogoMark, LogoWordmark } from '../shared/Logo'

export function Navbar({
  settings,
  update,
}: {
  settings: PlayerSettings
  update: (patch: Partial<PlayerSettings>) => void
}) {
  return (
    <header className="relative z-30 border-b border-line bg-bg px-[clamp(16px,3vw,32px)]">
      <div className="mx-auto flex h-15 w-full max-w-300 items-center gap-4">
        <div className="items-center gap-2 flex">
          <LogoMark className="size-7" />
          <div className="hidden sm:block text-base font-bold tracking-[0.04em]">
            <LogoWordmark />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <LogsMenu />
          <FaqMenu />
          <ShortcutsMenu />
          <SettingsMenu settings={settings} update={update} />
        </div>
      </div>
    </header>
  )
}
