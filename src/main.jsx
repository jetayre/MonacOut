import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'

posthog.init('phc_qfThmficvfkSEgsMLbKiJcgiHRYyAJ5GU2i8pavYYzNU', {
  api_host: 'https://eu.i.posthog.com',
  person_profiles: 'identified_only',
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
