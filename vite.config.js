import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Version de l'interface embarquée dans CE build, gravée dans le bundle.
// Sert à savoir dans PostHog quelle version chaque personne utilise réellement :
// sans ça, impossible de mesurer si une correction publiée en OTA arrive vraiment
// (le 11 août 2026, 19 personnes déclenchaient encore un événement supprimé depuis
// des jours — on ne l'a su que par accident).
// `publish-ota.mjs` passe VITE_OTA_VERSION ; sinon on relit le dernier manifeste.
function versionInterface() {
  if (process.env.VITE_OTA_VERSION) return process.env.VITE_OTA_VERSION
  try {
    return JSON.parse(readFileSync(resolve('public/capgo/latest.json'), 'utf8')).version || 'inconnue'
  } catch { return 'inconnue' }
}

export default defineConfig({
  define: {
    __OTA_VERSION__: JSON.stringify(versionInterface()),
  },
  plugins: [
    react(),
    {
      // Injecte un timestamp unique dans sw.js à chaque build.
      // Garantit que l'ancien cache Service Worker est toujours invalidé
      // lors d'un déploiement — évite les événements périmés sur appareils installés.
      name: 'sw-cache-version',
      closeBundle() {
        const swPath = resolve('dist/sw.js')
        try {
          const sw = readFileSync(swPath, 'utf8')
          const build = Date.now()
          writeFileSync(swPath, sw.replace(/monacout-v\d+/, `monacout-${build}`))
          console.log(`[sw-cache-version] Cache version → monacout-${build}`)
        } catch { /* pas de dist/sw.js en mode dev */ }
      }
    }
  ],
  build: {
    chunkSizeWarningLimit: 500,
  },
})
