import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NavMenu } from '@/app/components/menus/nav-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'

const renderMenu = (props?: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  return render(
    <TooltipProvider>
      <NavMenu
        id="tvp-menu-test"
        panelId="tvp-test-panel"
        label="Testowe menu"
        icon={<span>icon</span>}
        {...props}
      >
        <div>panel content</div>
      </NavMenu>
    </TooltipProvider>,
  )
}

afterEach(() => {
  cleanup()
})

describe('NavMenu', () => {
  it('renders a labelled trigger button', () => {
    renderMenu()
    const trigger = screen.getByRole('button', { name: 'Testowe menu' })
    expect(trigger.id).toBe('tvp-menu-test')
  })

  it('hides the panel until the trigger is clicked', () => {
    renderMenu()
    expect(screen.queryByText('panel content')).toBeNull()
  })

  it('opens the panel on click', () => {
    renderMenu()
    fireEvent.click(screen.getByRole('button', { name: 'Testowe menu' }))
    const panel = screen.getByText('panel content')
    expect(panel.closest('#tvp-test-panel')).toBeTruthy()
  })

  it('reports open changes in controlled mode', () => {
    const onOpenChange = vi.fn()
    renderMenu({ open: false, onOpenChange })
    fireEvent.click(screen.getByRole('button', { name: 'Testowe menu' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByText('panel content')).toBeNull()
  })

  it('shows the panel when controlled open', () => {
    renderMenu({ open: true })
    expect(screen.getByText('panel content')).toBeTruthy()
  })
})
