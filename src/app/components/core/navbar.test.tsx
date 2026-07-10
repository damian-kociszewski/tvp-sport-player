import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Navbar } from '@/app/components/core/navbar'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { SettingsProvider } from '@/app/providers/settings-provider'

afterEach(() => {
  cleanup()
})

describe('Navbar', () => {
  it('renders all menu buttons', async () => {
    render(
      <SettingsProvider>
        <TooltipProvider>
          <Navbar />
        </TooltipProvider>
      </SettingsProvider>,
    )
    await act(async () => {})
    for (const label of ['Logi', 'Pomoc', 'Skróty klawiszowe', 'Ustawienia']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy()
    }
  })
})
