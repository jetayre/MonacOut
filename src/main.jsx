import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'

posthog.init('phc_qfThmficvfkSEgsMLbKiJcgiHRYyAJ5GU2i8pavYYzNU', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only',
})

Sentry.init({
  dsn: 'https://ad492b22c77c633af4e8a1fae43a3e11@o4511416999608320.ingest.de.sentry.io/4511417016516688',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
