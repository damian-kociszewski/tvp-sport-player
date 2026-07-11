import { beforeAll, describe, expect, it, vi } from 'vitest'
import { createChromeMock } from '@/test/chrome-mock'

let parseTitle: typeof import('@/background').parseTitle

beforeAll(async () => {
  vi.stubGlobal('chrome', createChromeMock().chrome)
  ;({ parseTitle } = await import('@/background'))
})

const FALLBACK = { title: 'Transmisja TVP SPORT™', subtitle: '' }

describe('parseTitle', () => {
  it('falls back when the title is missing', () => {
    expect(parseTitle(undefined)).toEqual(FALLBACK)
    expect(parseTitle('')).toEqual(FALLBACK)
  })

  it('falls back when only the TVP SPORT suffix remains', () => {
    expect(parseTitle(' | TVP SPORT')).toEqual(FALLBACK)
  })

  it('strips the TVP SPORT suffix', () => {
    expect(parseTitle('Mecz: Polska - Niemcy | TVP SPORT')).toEqual({
      title: 'Mecz: Polska - Niemcy',
      subtitle: '',
    })
  })

  it('cuts everything from the first bracket', () => {
    expect(parseTitle('Skoki narciarskie [NA ŻYWO] | TVP SPORT')).toEqual({
      title: 'Skoki narciarskie',
      subtitle: '',
    })
  })

  it('strips a trailing date', () => {
    expect(parseTitle('Wyścig kolarski (12.05.2026)')).toEqual({
      title: 'Wyścig kolarski',
      subtitle: '',
    })
  })

  it('splits title and subtitle on the first sentence boundary', () => {
    expect(parseTitle('Liga Mistrzów. Finał: Real - City | TVP SPORT')).toEqual(
      {
        title: 'Liga Mistrzów',
        subtitle: 'Finał: Real - City',
      },
    )
  })

  it('ignores sentence boundaries inside parentheses', () => {
    expect(parseTitle('Turniej (St. Moritz). Półfinał')).toEqual({
      title: 'Turniej (St. Moritz)',
      subtitle: 'Półfinał',
    })
  })

  it('keeps a plain title without a subtitle', () => {
    expect(parseTitle('Studio Euro')).toEqual({
      title: 'Studio Euro',
      subtitle: '',
    })
  })
})
