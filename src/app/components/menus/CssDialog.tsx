import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Textarea } from '@/app/components/ui/textarea'

const PLACEHOLDER = `.tvp-player {
  border-radius: 12px;
}
`

export const CssDialog = ({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: string
  onSave: (css: string) => void
}) => {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    if (open) setValue(initial)
  }, [open, initial])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id="tvp-css-modal"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        className="flex h-[min(600px,80vh)] w-[min(680px,calc(100%-2rem))] flex-col gap-0 p-0 sm:max-w-170"
      >
        <DialogHeader className="h-11 flex-row items-center justify-between border-border border-b py-0 pr-2 pl-4">
          <DialogTitle className="font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-muted-foreground">
            Własny CSS
          </DialogTitle>
          <DialogDescription className="sr-only">
            Dodatkowe reguły CSS wstrzykiwane do odtwarzacza.
          </DialogDescription>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Zamknij"
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Textarea
          id="tvp-css-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          autoComplete="off"
          className="field-sizing-fixed min-h-0 flex-1 resize-none rounded-none border-0 bg-transparent px-4 py-3 font-mono text-[12px] leading-relaxed shadow-none focus-visible:ring-0 dark:bg-transparent"
        />

        <DialogFooter className="border-border border-t px-3 py-2.5">
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Anuluj
            </Button>
          </DialogClose>
          <Button
            size="sm"
            onClick={() => {
              onSave(value)
              onOpenChange(false)
            }}
          >
            <CheckIcon className="size-3.5" weight="bold" />
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
