import type { StreamPayload } from '../../../shared/types'

export function StreamInfo({ payload }: { payload: StreamPayload }) {
  return (
    <div id="tvp-stream-info" className="flex flex-col gap-1.5">
      <h1
        id="tvp-stream-title"
        className="text-[clamp(18px,2.4vw,24px)] font-bold tracking-[-0.01em]"
      >
        {payload.title}
      </h1>
      {payload.subtitle && (
        <span
          id="tvp-stream-subtitle"
          className="font-mono text-xs tracking-[0.06em] text-muted"
        >
          {payload.subtitle}
        </span>
      )}
    </div>
  )
}
