import type { ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const NavMenu = ({
  id,
  panelId,
  label,
  icon,
  className,
  children,
  open,
  onOpenChange,
}: {
  id: string
  panelId: string
  label: string
  icon: ReactNode
  className?: string
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="ghost"
              size="icon"
              aria-label={label}
              className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            >
              {icon}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <PopoverContent
        id={panelId}
        align="end"
        sideOffset={8}
        className={cn(
          'flex max-h-[60vh] w-96 flex-col overflow-hidden p-0',
          className,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
