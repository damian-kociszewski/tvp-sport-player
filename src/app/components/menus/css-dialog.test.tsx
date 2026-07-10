import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CssDialog } from '@/app/components/menus/css-dialog'

const setup = (initial = '.old { margin: 0; }') => {
  const onSave = vi.fn()
  const onOpenChange = vi.fn()
  const view = render(
    <CssDialog
      open
      onOpenChange={onOpenChange}
      initial={initial}
      onSave={onSave}
    />,
  )
  return { onSave, onOpenChange, view }
}

const textarea = () => screen.getByRole('textbox') as HTMLTextAreaElement

afterEach(() => {
  cleanup()
})

describe('CssDialog', () => {
  it('shows the initial css', () => {
    setup()
    expect(textarea().value).toBe('.old { margin: 0; }')
  })

  it('saves the edited css and closes', () => {
    const { onSave, onOpenChange } = setup()
    fireEvent.change(textarea(), { target: { value: '.new { padding: 0; }' } })
    fireEvent.click(screen.getByRole('button', { name: 'Zapisz' }))
    expect(onSave).toHaveBeenCalledWith('.new { padding: 0; }')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('cancels without saving', () => {
    const { onSave, onOpenChange } = setup()
    fireEvent.change(textarea(), { target: { value: '.new {}' } })
    fireEvent.click(screen.getByRole('button', { name: 'Anuluj' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('discards the draft when reopened', () => {
    const { onSave, onOpenChange, view } = setup()
    fireEvent.change(textarea(), { target: { value: '.draft {}' } })
    view.rerender(
      <CssDialog
        open={false}
        onOpenChange={onOpenChange}
        initial=".old { margin: 0; }"
        onSave={onSave}
      />,
    )
    view.rerender(
      <CssDialog
        open
        onOpenChange={onOpenChange}
        initial=".old { margin: 0; }"
        onSave={onSave}
      />,
    )
    expect(textarea().value).toBe('.old { margin: 0; }')
  })
})
