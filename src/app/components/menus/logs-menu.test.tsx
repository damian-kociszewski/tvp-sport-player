import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LogsMenu } from '@/app/components/menus/logs-menu'
import { TooltipProvider } from '@/app/components/ui/tooltip'
import { LOGS_KEY, type LogEntry } from '@/shared/logger'
import { createChromeMock } from '@/test/chrome-mock'

const entry = (msg: string, level: LogEntry['level'] = 'info'): LogEntry => ({
  ts: 1_700_000_000_000,
  level,
  scope: 'bg',
  msg,
})

const openMenu = async () => {
  render(
    <TooltipProvider>
      <LogsMenu />
    </TooltipProvider>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Logi' }))
  await act(async () => {})
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('LogsMenu', () => {
  it('shows an empty state', async () => {
    vi.stubGlobal('chrome', createChromeMock().chrome)
    await openMenu()
    expect(screen.getByText('Logi (0)')).toBeTruthy()
    expect(screen.getByText('Brak logów.')).toBeTruthy()
  })

  it('lists stored logs newest first', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(LOGS_KEY, [entry('older'), entry('newer')])
    vi.stubGlobal('chrome', mock)
    await openMenu()
    expect(screen.getByText('Logi (2)')).toBeTruthy()
    const messages = screen
      .getAllByText(/older|newer/)
      .map((el) => el.textContent)
    expect(messages).toEqual(['newer', 'older'])
  })

  it('clears the logs', async () => {
    const { chrome: mock, local } = createChromeMock()
    local.data.set(LOGS_KEY, [entry('stale')])
    vi.stubGlobal('chrome', mock)
    await openMenu()
    fireEvent.click(screen.getByRole('button', { name: /Wyczyść/ }))
    await act(async () => {})
    expect(local.data.has(LOGS_KEY)).toBe(false)
    expect(screen.getByText('Brak logów.')).toBeTruthy()
  })

  it('refreshes when logs change in storage', async () => {
    const { chrome: mock, local, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    await openMenu()
    expect(screen.getByText('Brak logów.')).toBeTruthy()
    local.data.set(LOGS_KEY, [entry('fresh')])
    await act(async () => {
      emitStorageChange({ [LOGS_KEY]: { newValue: [] } }, 'local')
    })
    expect(screen.getByText('fresh')).toBeTruthy()
  })
})
