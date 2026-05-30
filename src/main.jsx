import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { Sentry.captureException(error, { extra: info }); }
  render() {
    if (this.state.error) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100dvh", fontFamily:"sans-serif", color:"#0F1D3A", gap:16 }}>
        <div style={{ fontSize:32 }}>⚠️</div>
        <div style={{ fontWeight:600 }}>Une erreur est survenue</div>
        <button onClick={() => window.location.reload()} style={{ padding:"10px 24px", background:"#C4A241", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" }}>Recharger</button>
      </div>
    );
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
