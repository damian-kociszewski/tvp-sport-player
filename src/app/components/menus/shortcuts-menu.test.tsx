import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ShortcutsMenu } from '@/app/components/menus/shortcuts-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'

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

beforeEach(() => {
  render(
    <TooltipProvider>
      <ShortcutsMenu />
    </TooltipProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Skróty klawiszowe' }))
})

afterEach(() => {
  cleanup()
})

describe('ShortcutsMenu', () => {
  it('lists every shortcut action', () => {
    for (const label of LABELS) {
      expect(screen.getByText(label)).toBeTruthy()
    }
  })

  it('shows the key caps', () => {
    for (const key of ['Spacja', 'K', 'M', 'F', 'I', 'L', 'A']) {
      expect(screen.getByText(key)).toBeTruthy()
    }
  })
})
