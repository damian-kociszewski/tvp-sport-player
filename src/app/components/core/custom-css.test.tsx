import { act, cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CustomCss } from '@/app/components/core/custom-css'
import { SettingsProvider } from '@/app/providers/settings-provider'
import { settingKeyOf } from '@/shared/settings'
import { createChromeMock, seedSettings } from '@/test/chrome-mock'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('CustomCss', () => {
  it('injects the custom css from settings into a style element', async () => {
    const { chrome: mock, local } = createChromeMock()
    seedSettings(local, { customCss: 'body { color: red; }' })
    vi.stubGlobal('chrome', mock)
    const { container } = render(
      <SettingsProvider>
        <CustomCss />
      </SettingsProvider>,
    )
    await act(async () => {})
    expect(container.querySelector('style')?.textContent).toBe(
      'body { color: red; }',
    )
  })

  it('updates the style when settings change externally', async () => {
    const { chrome: mock, emitStorageChange } = createChromeMock()
    vi.stubGlobal('chrome', mock)
    const { container } = render(
      <SettingsProvider>
        <CustomCss />
      </SettingsProvider>,
    )
    await act(async () => {})
    expect(container.querySelector('style')?.textContent).toBe('')
    act(() =>
      emitStorageChange(
        { [settingKeyOf('customCss')]: { newValue: '.a { opacity: 1; }' } },
        'local',
      ),
    )
    expect(container.querySelector('style')?.textContent).toBe(
      '.a { opacity: 1; }',
    )
  })
})
