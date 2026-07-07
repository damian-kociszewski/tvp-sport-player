import { defineManifest } from '@crxjs/vite-plugin'
import { version } from './package.json'

export default defineManifest(({ mode }) => ({
  manifest_version: 3,
  name: 'Odtwarzacz dla TVP SPORT™',
  description:
    'Nieoficjalny odtwarzacz transmisji TVP SPORT™ - z wyborem jakości, języka, obrazem w obrazie i skrótami klawiszowymi.',
  version,
  minimum_chrome_version: '116',
  icons: {
    16: 'icons/active/16.png',
    32: 'icons/active/32.png',
    48: 'icons/active/48.png',
    96: 'icons/active/96.png',
    128: 'icons/active/128.png',
    256: 'icons/active/256.png',
    512: 'icons/active/512.png',
    1024: 'icons/active/1024.png',
  },
  action: {
    default_title: 'Otwórz Odtwarzacz dla TVP SPORT™',
    default_icon: {
      16: 'icons/inactive/16.png',
      32: 'icons/inactive/32.png',
      48: 'icons/inactive/48.png',
      96: 'icons/inactive/96.png',
      128: 'icons/inactive/128.png',
      256: 'icons/inactive/256.png',
      512: 'icons/inactive/512.png',
      1024: 'icons/inactive/1024.png',
    },
  },
  background:
    mode === 'gecko'
      ? {
          scripts: ['src/background.js'],
          type: 'module',
        }
      : {
          service_worker: 'src/background.ts',
          type: 'module',
        },
  commands: {
    _execute_action: {
      suggested_key: { default: 'Ctrl+Shift+Y', mac: 'Command+Shift+Y' },
      description: 'Otwórz Odtwarzacz dla TVP SPORT™',
    },
  },
  permissions: ['webRequest', 'storage', 'declarativeNetRequest'],
  host_permissions: ['*://*.tvp.pl/*', '*://*.redcdn.pl/*'],
  ...(mode === 'gecko'
    ? {
        browser_specific_settings: {
          gecko: {
            id: 'tvp-sport-player@damian-kociszewski',
            strict_min_version: '115.0',
            data_collection_permissions: {
              required: ['none'],
            },
          },
        },
      }
    : {}),
}))
