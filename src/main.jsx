import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'

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
  capture_pageview: true,        // compte chaque vue de page
  capture_pageleave: true,       // mesure le temps passé
})

// Compteur fiable en natif : un événement à chaque ouverture de l'app.
// → tableau de bord : eu.posthog.com (utilisateurs uniques, sessions, ouvertures)
posthog.capture('app_opened', { platform: Capacitor.getPlatform() })

Sentry.init({
  dsn: 'https://ad492b22c77c633af4e8a1fae43a3e11@o4511416999608320.ingest.de.sentry.io/4511417016516688',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
})

// Service Worker uniquement en mode web (pas dans l'app native Capacitor)
if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── Mises à jour d'interface à distance (OTA) — app native uniquement ──────────
// Permet de changer l'interface SANS repasser par la review Apple.
// Auto-hébergé : l'app lit public/capgo/latest.json sur le site (git push = publier).
if (Capacitor.isNativePlatform()) {
  // 1) Confirme que le bundle actuel démarre bien — sinon Capgo revient à la version précédente (anti-brique).
  CapacitorUpdater.notifyAppReady().catch(() => {});
  // 2) Cherche une nouvelle interface ; si dispo, la télécharge et l'applique EN DOUCEUR
  //    au prochain lancement (démarrage à froid) — AUCUN rechargement à l'écran (plus de flash).
  const OTA_MANIFEST = 'https://monac-out.vercel.app/capgo/latest.json';
  window.addEventListener('load', () => {
    (async () => {
      try {
        const res = await fetch(`${OTA_MANIFEST}?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const { version, url } = await res.json();
        if (!version || !url) return;                         // rien à publier
        const cur = await CapacitorUpdater.current();
        if (cur?.bundle?.version === version) return;         // déjà à jour
        const bundle = await CapacitorUpdater.download({ version, url });
        // Applique au PROCHAIN lancement → pas de reload() sous les yeux de l'utilisateur.
        await CapacitorUpdater.next({ id: bundle.id });
      } catch { /* hors-ligne ou erreur → on garde la version intégrée */ }
    })();
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
