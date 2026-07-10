import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Footer } from '@/app/components/core/footer'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { version } from '../../../../package.json'

beforeEach(() => {
  render(
    <TooltipProvider>
      <Footer />
    </TooltipProvider>,
  )
})

afterEach(() => {
  cleanup()
})

describe('Footer', () => {
  it('shows the app version from package.json', () => {
    expect(screen.getByText(`Wersja ${version}`)).toBeTruthy()
  })

  it('links to the source code repository', () => {
    const link = screen.getByRole('link', { name: 'Kod źródłowy' })
    expect(link.getAttribute('href')).toBe(
      'https://github.com/damian-kociszewski/tvp-sport-player',
    )
  })

  it('opens external links in a new tab safely', () => {
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noreferrer')
    }
  })
})
