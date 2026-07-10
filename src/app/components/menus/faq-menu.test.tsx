import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { FaqMenu } from '@/app/components/menus/faq-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'

beforeEach(() => {
  render(
    <TooltipProvider>
      <FaqMenu />
    </TooltipProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Pomoc' }))
})

afterEach(() => {
  cleanup()
})

describe('FaqMenu', () => {
  it('lists all questions with answers', () => {
    expect(
      screen.getByText('Widzę czarny ekran zamiast transmisji.'),
    ).toBeTruthy()
    expect(
      screen.getByText('Pojawił się komunikat, że transmisja jest chroniona.'),
    ).toBeTruthy()
    expect(
      screen.getByText('Pojawił się komunikat, że link wygasł.'),
    ).toBeTruthy()
    expect(screen.getByText('Czy moje dane są gdzieś wysyłane?')).toBeTruthy()
  })

  it('links to the issue tracker', () => {
    const link = screen.getByRole('link', { name: /Zgłoś problem/ })
    expect(link.getAttribute('href')).toBe(
      'https://github.com/damian-kociszewski/tvp-sport-player/issues',
    )
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noreferrer')
  })
})
