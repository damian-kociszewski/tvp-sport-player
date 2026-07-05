import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MenuHeader } from './MenuHeader'

const PLACEHOLDER = `/* Własne reguły CSS */
.tvp-player {
  border-radius: 12px;
}
`

export function CssModal({
  initial,
  onSave,
  onClose,
}: {
  initial: string
  onSave: (css: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      id="tvp-css-modal"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onPointerDown={onClose}
    >
      <div
        className="flex max-h-[80vh] w-[min(680px,100%)] flex-col overflow-hidden border border-line bg-card shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <MenuHeader title="Własny CSS">
          <button
            type="button"
            title="Zamknij"
            aria-label="Zamknij"
            onClick={onClose}
            className="flex size-7 items-center justify-center text-muted hover:bg-hoverbg hover:text-fg"
          >
            <XIcon className="size-3.5" />
          </button>
        </MenuHeader>

        <textarea
          id="tvp-css-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          autoComplete="off"
          className="min-h-80 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[12px] leading-relaxed text-fg outline-none placeholder:text-muted/50"
        />

        <div className="flex items-center justify-end gap-2 border-line border-t px-3 py-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[13px] text-muted hover:text-fg"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(value)
                onClose()
              }}
              className="flex items-center gap-1.5 bg-accent px-3 py-1.5 text-[13px] font-medium text-accent-ink hover:opacity-90"
            >
              <CheckIcon className="size-3.5" weight="bold" />
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
