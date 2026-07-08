import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-ext-500.css'
import './main.css'
import { App } from '@/app/app'
import { logger } from '@/shared/logger'

window.addEventListener('error', (e) =>
  logger.error('player', 'window error', e.message),
)
window.addEventListener('unhandledrejection', (e) =>
  logger.error('player', 'unhandled rejection', String(e.reason)),
)

logger.info('player', 'player window opened')

const root = document.getElementById('root')
if (root) createRoot(root).render(<App />)
