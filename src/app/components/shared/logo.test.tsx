import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LogoMark, LogoWordmark } from '@/app/components/shared/logo'

afterEach(() => {
  cleanup()
})

describe('LogoMark', () => {
  it('renders the logo image as decorative', () => {
    const { container } = render(<LogoMark />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml|logo\.svg/)
    expect(img.getAttribute('alt')).toBe('')
    expect(img.getAttribute('aria-hidden')).toBe('true')
  })

  it('applies a custom class name', () => {
    const { container } = render(<LogoMark className="size-7" />)
    expect(container.querySelector('img')?.className).toBe('size-7')
  })
})

describe('LogoWordmark', () => {
  it('renders the product name', () => {
    render(<LogoWordmark />)
    expect(screen.getByText('Odtwarzacz dla TVP SPORT™')).toBeTruthy()
  })
})
