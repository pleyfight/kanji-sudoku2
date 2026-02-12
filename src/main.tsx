import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logger } from './lib/logger'

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('init', 'Unhandled window error', { error: String(event.error ?? event.message) });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('init', 'Unhandled promise rejection', { reason: String(event.reason) });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
