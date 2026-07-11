import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ShortcutsMenu } from '@/app/components/menus/shortcuts-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'

const support = vi.hoisted(() => ({ canCast: true, canPip: true }))

vi.mock('@/app/hooks/useCanCast', () => ({
  useCanCast: () => support.canCast,
}))

vi.mock('@/app/hooks/useCanPip', () => ({
  useCanPip: () => support.canPip,
}))

const LABELS = [
  'Odtwórz / pauza',
  'Wycisz / odcisz',
  'Pełny ekran',
  'Obraz w obrazie',
  'Przejdź na żywo',
  'Przesyłaj na urządzenie',
  'Przewiń w tył / w przód',
  'Głośność',
]

const openMenu = () => {
  render(
    <TooltipProvider>
      <ShortcutsMenu />
    </TooltipProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Skróty klawiszowe' }))
}

beforeEach(() => {
  support.canCast = true
  support.canPip = true
})

afterEach(() => {
  cleanup()
})

describe('ShortcutsMenu', () => {
  it('lists every shortcut action', () => {
    openMenu()
    for (const label of LABELS) {
      expect(screen.getByText(label)).toBeTruthy()
    }
  })

  it('shows the key caps', () => {
    openMenu()
    for (const key of ['Spacja', 'K', 'M', 'F', 'I', 'L', 'A']) {
      expect(screen.getByText(key)).toBeTruthy()
    }
  })

  it('hides the cast shortcut when casting is unavailable', () => {
    support.canCast = false
    openMenu()
    expect(screen.queryByText('Przesyłaj na urządzenie')).toBeNull()
    expect(screen.queryByText('A')).toBeNull()
  })

  it('hides the pip shortcut when pip is unavailable', () => {
    support.canPip = false
    openMenu()
    expect(screen.queryByText('Obraz w obrazie')).toBeNull()
    expect(screen.queryByText('I')).toBeNull()
  })
})
