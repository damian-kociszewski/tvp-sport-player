export interface StreamCapture {
  src: string
  capturedAt: number
  sourceUrl: string
}

export interface StreamPayload extends StreamCapture {
  title: string
  subtitle: string
}

export const captureKey = (tabId: number) => `capture:${tabId}`
export const playerKey = (id: string) => `player:${id}`
