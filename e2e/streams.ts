export const TVP_PAGE =
  'https://sport.tvp.pl/93264345/hiszpania-belgia-ms-2026-14-finalu-2-na-zywo-transmisja-meczu-online-live-stream-1072026'

export const STREAMS = {
  vod: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  live: 'https://demo.unified-streaming.com/k8s/live/stable/live.isml/.m3u8',
  unreachable: 'https://invalid.invalid/stream.m3u8',
}

export const VOD_HEIGHTS = [1080, 720, 480, 288, 184]

export const isUnreachable = async (url: string): Promise<boolean> => {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    return !res.ok
  } catch {
    return true
  }
}
