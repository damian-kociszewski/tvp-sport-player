import { render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CenterPlayButton } from '@/app/components/player/center-play-button'

vi.mock('@vidstack/react', () => ({
  PlayButton: ({ children, ...props }: ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))

describe('CenterPlayButton', () => {
  it('is hidden and unclickable by default', () => {
    render(<CenterPlayButton />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('opacity-0')
    expect(button.className).toContain('pointer-events-none')
  })

  it('becomes visible and clickable when the player is paused', () => {
    render(<CenterPlayButton />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('group-data-paused:opacity-100')
    expect(button.className).toContain('group-data-paused:pointer-events-auto')
  })
})
