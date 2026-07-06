import {
  CheckIcon,
  ClosedCaptioningIcon,
  TranslateIcon,
} from '@phosphor-icons/react'
import {
  useAudioOptions,
  useCaptionOptions,
  useMediaPlayer,
  useVideoQualityOptions,
} from '@vidstack/react'
import { type ReactNode, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { cn } from '@/lib/utils'

export interface PlayerMenuOption {
  label: string
  value: string
  selected: boolean
  select: (trigger?: Event) => void
}

export const PlayerMenu = <T extends PlayerMenuOption>({
  id,
  label,
  trigger,
  triggerClassName,
  panelClassName,
  options,
  isChecked,
}: {
  id: string
  label: string
  trigger: ReactNode
  triggerClassName?: string
  panelClassName?: string
  options: readonly T[]
  isChecked?: (option: T) => boolean
}) => {
  const [open, setOpen] = useState(false)
  const player = useMediaPlayer()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          title={label}
          aria-label={label}
          className={cn(
            'flex size-9 cursor-pointer items-center justify-center text-white transition-all outline-none hover:bg-white/12 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-white/12',
            triggerClassName,
          )}
        >
          {trigger}
        </button>
      </PopoverTrigger>
      <PopoverContent
        container={player?.el}
        side="top"
        align="end"
        sideOffset={10}
        className={cn(
          'z-20 flex w-auto min-w-40 flex-col gap-0.5 border-white/14 bg-[rgba(20,19,17,0.95)] p-1.25 text-white shadow-none backdrop-blur-lg',
          panelClassName,
        )}
      >
        {options.map((option) => {
          const checked = isChecked ? isChecked(option) : option.selected
          return (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                option.select(e.nativeEvent)
                setOpen(false)
              }}
              className={cn(
                'flex cursor-pointer items-center justify-between gap-3 px-2.5 py-2 text-left font-mono text-xs transition-all hover:bg-white/10',
                checked ? 'text-primary' : 'text-white',
              )}
            >
              <span>{option.label}</span>
              {checked && <CheckIcon className="size-3" weight="bold" />}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export const QualityMenu = () => {
  const options = useVideoQualityOptions({ auto: 'Auto', sort: 'descending' })
  if (options.disabled) return null

  const currentLabel =
    options.selectedValue === 'auto' || !options.selectedQuality
      ? 'Auto'
      : `${options.selectedQuality.height}p`

  return (
    <PlayerMenu
      id="tvp-menu-quality"
      label="Jakość"
      trigger={currentLabel}
      triggerClassName="w-auto px-2.5 font-mono text-xs font-medium"
      panelClassName="min-w-32.5"
      options={options}
      isChecked={(option) =>
        option.value === 'auto'
          ? options.selectedValue === 'auto'
          : option.selected && !option.autoSelected
      }
    />
  )
}

export const CaptionsMenu = () => {
  const options = useCaptionOptions({ off: 'Wyłączone' })
  if (options.disabled || options.length === 0) return null

  return (
    <PlayerMenu
      id="tvp-menu-captions"
      label="Napisy"
      trigger={<ClosedCaptioningIcon className="size-4.5" />}
      triggerClassName="size-9"
      options={options}
    />
  )
}

export const AudioMenu = () => {
  const options = useAudioOptions()
  if (options.disabled || options.length === 0) return null

  return (
    <PlayerMenu
      id="tvp-menu-audio"
      label="Ścieżka dźwiękowa"
      trigger={<TranslateIcon className="size-4.5" />}
      triggerClassName="size-9"
      options={options}
    />
  )
}
