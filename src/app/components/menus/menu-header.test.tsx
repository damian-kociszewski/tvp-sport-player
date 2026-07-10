import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MenuHeader } from '@/app/components/menus/menu-header'

afterEach(() => {
  cleanup()
})

describe('MenuHeader', () => {
  it('renders the title', () => {
    render(<MenuHeader title="Ustawienia" />)
    expect(screen.getByText('Ustawienia')).toBeTruthy()
  })

  it('renders actions next to the title', () => {
    render(
      <MenuHeader title="Logi">
        <button type="button">Wyczyść</button>
      </MenuHeader>,
    )
    expect(screen.getByRole('button', { name: 'Wyczyść' })).toBeTruthy()
  })
})
