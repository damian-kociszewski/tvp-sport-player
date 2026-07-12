import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useStreamPayload } from '@/app/hooks/useStreamPayload'
import { playerKey, type StreamPayload } from '@/shared/stream'
import { createChromeMock } from '@/test/chrome-mock'

const stubSearch = (params: Record<string, string>) => {
  const search = new URLSearchParams(params).toString()
  vi.stubGlobal('location', { search: search ? `?${search}` : '' })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('useStreamPayload', () => {
  it('builds a payload from url params', async () => {
    stubSearch({
      src: 'https://example.com/stream.m3u8',
      title: 'Mecz',
      subtitle: 'Finał',
    })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('ready')
    expect(result.current).toMatchObject({
      status: 'ready',
      payload: {
        src: 'https://example.com/stream.m3u8',
        title: 'Mecz',
        subtitle: 'Finał',
        sourceUrl: '',
      },
    })
    expect(document.title).toBe('Mecz — Odtwarzacz dla TVP SPORT™')
  })

  it('falls back to a default title for a src param', async () => {
    stubSearch({ src: 'https://example.com/stream.m3u8' })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('ready')
    expect(result.current).toMatchObject({
      payload: { title: 'Transmisja', subtitle: '' },
    })
  })

  it('ignores the src param outside dev builds', async () => {
    vi.stubEnv('DEV', false)
    stubSearch({ src: 'https://example.com/stream.m3u8', title: 'Mecz' })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('missing')
  })

  it('reports missing without src and id params', async () => {
    stubSearch({})
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('missing')
  })

  it('reports missing for an id when chrome storage is unavailable', async () => {
    stubSearch({ id: 'abc' })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('missing')
  })

  it('loads the payload for an id from session storage', async () => {
    const payload: StreamPayload = {
      src: 'https://example.com/stream.m3u8',
      capturedAt: 123,
      sourceUrl: 'https://sport.tvp.pl/x',
      title: 'Mecz',
      subtitle: 'Finał',
    }
    const { chrome: mock, session } = createChromeMock()
    session.data.set(playerKey('abc'), payload)
    vi.stubGlobal('chrome', mock)
    stubSearch({ id: 'abc' })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('ready')
    expect(result.current).toMatchObject({ payload })
    expect(document.title).toBe('Mecz — Odtwarzacz dla TVP SPORT™')
  })

  it('reports missing for an unknown id', async () => {
    const { chrome: mock } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    stubSearch({ id: 'unknown' })
    const { result } = renderHook(() => useStreamPayload())
    await act(async () => {})
    expect(result.current.status).toBe('missing')
  })
})
