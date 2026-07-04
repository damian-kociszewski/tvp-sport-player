import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-ext-400.css'
import '@fontsource/jetbrains-mono/latin-ext-500.css'
import './player.css'
import { logger } from '../shared/logger'
import { App } from './App'

window.addEventListener('error', (e) =>
  logger.error('player', 'window error', e.message),
)
window.addEventListener('unhandledrejection', (e) =>
  logger.error('player', 'unhandled rejection', String(e.reason)),
)

logger.info('player', 'okno playera otwarte')

const root = document.getElementById('root')
if (root) createRoot(root).render(<App />)
