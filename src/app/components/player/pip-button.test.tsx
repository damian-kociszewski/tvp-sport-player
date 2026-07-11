import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PipButton } from '@/app/components/player/pip-button'

const support = vi.hoisted(() => ({ canPip: true }))

vi.mock('@/app/hooks/useCanPip', () => ({
  useCanPip: () => support.canPip,
}))

vi.mock('@vidstack/react', () => ({
  PIPButton: ({ children, ...props }: ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}))

beforeEach(() => {
  support.canPip = true
})

describe('PipButton', () => {
  it('renders the button when pip is available', () => {
    render(<PipButton />)
    expect(screen.getByTitle('Obraz w obrazie (I)')).toBeTruthy()
  })

  it('renders nothing when pip is unavailable', () => {
    support.canPip = false
    const { container } = render(<PipButton />)
    expect(container.firstChild).toBeNull()
  })

  it('suppresses repeated i-key presses', () => {
    render(<PipButton />)
    expect(fireEvent.keyDown(document, { key: 'i', repeat: true })).toBe(false)
    expect(fireEvent.keyDown(document, { key: 'i', repeat: false })).toBe(true)
  })

  it('stops suppressing after unmount', () => {
    const { unmount } = render(<PipButton />)
    unmount()
    expect(fireEvent.keyDown(document, { key: 'i', repeat: true })).toBe(true)
  })
})
