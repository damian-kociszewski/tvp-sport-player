import { defineManifest } from '@crxjs/vite-plugin'
import { version } from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: 'Odtwarzacz dla TVP SPORT™',
  description:
    'Nieoficjalny odtwarzacz transmisji TVP SPORT™ - z wyborem jakości, języka, obrazem w obrazie i skrótami klawiszowymi.',
  version,
  minimum_chrome_version: '116',
  icons: {
    16: 'icons/16.png',
    32: 'icons/32.png',
    48: 'icons/48.png',
    96: 'icons/96.png',
    128: 'icons/128.png',
    256: 'icons/256.png',
    512: 'icons/512.png',
    1024: 'icons/1024.png',
  },
  action: {
    default_title: 'Otwórz Odtwarzacz dla TVP SPORT™',
    default_icon: {
      16: 'icons/16.png',
      32: 'icons/32.png',
      48: 'icons/48.png',
      96: 'icons/96.png',
      128: 'icons/128.png',
      256: 'icons/256.png',
      512: 'icons/512.png',
      1024: 'icons/1024.png',
    },
  },
  background: {
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
  host_permissions: ['*://*.tvp.pl/*'],
})
