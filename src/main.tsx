import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logger, LOG_EVENTS } from './lib/logger'

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error(
      'init',
      LOG_EVENTS.APP_UNHANDLED_ERROR,
      'Unhandled window error',
      { error: String(event.error ?? event.message) },
      { source: 'window' },
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error(
      'init',
      LOG_EVENTS.APP_UNHANDLED_REJECTION,
      'Unhandled promise rejection',
      { reason: String(event.reason) },
      { source: 'promise' },
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
