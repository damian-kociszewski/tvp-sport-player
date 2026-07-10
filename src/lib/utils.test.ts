import { afterEach, describe, expect, it } from 'vitest'
import { isEditableTarget } from '@/lib/utils'

afterEach(() => {
  document.body.innerHTML = ''
})

const focusElement = (html: string) => {
  document.body.innerHTML = html
  const el = document.body.firstElementChild as HTMLElement
  el.focus()
  return el
}

describe('isEditableTarget', () => {
  it('returns false when nothing editable is focused', () => {
    expect(isEditableTarget()).toBe(false)
  })

  it('returns true for a focused input', () => {
    focusElement('<input type="text" />')
    expect(isEditableTarget()).toBe(true)
  })

  it('returns true for a focused textarea', () => {
    focusElement('<textarea></textarea>')
    expect(isEditableTarget()).toBe(true)
  })

  it('returns true for a focused contenteditable element', () => {
    focusElement('<div contenteditable="true" tabindex="0"></div>')
    expect(isEditableTarget()).toBe(true)
  })

  it('returns false for a focused button', () => {
    focusElement('<button type="button">ok</button>')
    expect(isEditableTarget()).toBe(false)
  })
})
