import type { ReactNode } from 'react'

export function MenuHeader({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-line border-b px-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
        {title}
      </span>
      {children}
    </div>
  )
}
