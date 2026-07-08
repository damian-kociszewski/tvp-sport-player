import type { ReactNode } from 'react'

export const MenuHeader = ({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) => {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-border border-b px-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  )
}
