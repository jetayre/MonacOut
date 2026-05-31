import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
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
