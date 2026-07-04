import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'Odtwarzacz dla TVP SPORT™',
  description:
    'Nieoficjalny odtwarzacz transmisji TVP SPORT™ - z wyborem jakości, języka, obrazem w obrazie i skrótami klawiszowymi.',
  version: '0.1.0',
  minimum_chrome_version: '116',
  icons: {
    16: 'icons/icon-16.png',
    32: 'icons/icon-32.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },
  action: {
    default_title: 'Otwórz w Odtwarzacz dla TVP SPORT™',
    default_icon: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
    },
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  commands: {
    _execute_action: {
      suggested_key: { default: 'Ctrl+Shift+Y', mac: 'Command+Shift+Y' },
      description: 'Otwórz odtwarzacz',
    },
  },
  permissions: ['webRequest', 'storage', 'declarativeNetRequest'],
  host_permissions: ['*://*.tvp.pl/*'],
})
