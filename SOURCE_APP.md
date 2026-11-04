# MONAC'OUT — LE CODE DE L'APPLICATION

**4 novembre 2026.** 42 fichiers, 596 Ko.
Chaque fichier est reproduit **intégralement et tel quel** : rien n'est coupé,
résumé ni reformaté.

## Ce qui n'est pas ici, et pourquoi

| | |
|---|---|
| `src/data/events.js` | **5,2 Mo** — les 2 400 fiches d'événements. C'est de la **donnée**, pas du code, et elle est refabriquée chaque nuit par les scripts de `scripts/`. L'inclure ferait un document de 5,8 Mo dont 90 % de listes de restaurants. |
| `scripts/` | Les ~60 scripts de collecte et de contrôle. Ils tournent sur GitHub Actions, pas dans l'app. |
| `public/` | Les photos, le paquet OTA et `events.json`. |
| `node_modules/` | Les dépendances. |

## Les fichiers

| Fichier | Taille |
|---|---|
| `index.html` | 3.6 Ko |
| `package.json` | 1.6 Ko |
| `vite.config.js` | 1.7 Ko |
| `capacitor.config.json` | 0.6 Ko |
| `src/App.css` | 0.0 Ko |
| `src/App.jsx` | 72.7 Ko |
| `src/components/AccueilMaquette.jsx` | 40.2 Ko |
| `src/components/BandeauWeb.jsx` | 6.8 Ko |
| `src/components/CalendarPicker.jsx` | 9.1 Ko |
| `src/components/EventCard.jsx` | 51.6 Ko |
| `src/components/MonacOutLogo.jsx` | 2.0 Ko |
| `src/components/SectionTitle.jsx` | 0.7 Ko |
| `src/components/Shell.jsx` | 37.6 Ko |
| `src/components/VueReservation.jsx` | 4.8 Ko |
| `src/components/screens/AdminScreen.jsx` | 10.2 Ko |
| `src/components/screens/AgendaScreen.jsx` | 7.9 Ko |
| `src/components/screens/AuthScreen.jsx` | 17.9 Ko |
| `src/components/screens/DetailScreen.jsx` | 13.2 Ko |
| `src/components/screens/FavoritesScreen.jsx` | 6.2 Ko |
| `src/components/screens/FriendsScreen.jsx` | 23.4 Ko |
| `src/components/screens/HomeScreen.jsx` | 119.2 Ko |
| `src/components/screens/MapScreen.jsx` | 9.2 Ko |
| `src/components/screens/ProfileScreen.jsx` | 9.0 Ko |
| `src/components/screens/WelcomeScreen.jsx` | 3.2 Ko |
| `src/data/liveEvents.js` | 4.8 Ko |
| `src/hooks/useAuth.js` | 6.2 Ko |
| `src/hooks/useSocial.js` | 10.1 Ko |
| `src/i18n.js` | 13.8 Ko |
| `src/index.css` | 1.0 Ko |
| `src/lib/avatar.js` | 5.0 Ko |
| `src/lib/couleurs.js` | 5.9 Ko |
| `src/lib/habillage.js` | 3.7 Ko |
| `src/lib/invite.js` | 4.8 Ko |
| `src/lib/itineraire.js` | 1.6 Ko |
| `src/lib/mediatheque.js` | 50.0 Ko |
| `src/lib/phone.js` | 3.4 Ko |
| `src/lib/prenom.js` | 3.9 Ko |
| `src/lib/reservation.js` | 7.4 Ko |
| `src/lib/supabase.js` | 0.2 Ko |
| `src/lib/theme.js` | 13.5 Ko |
| `src/lib/track.js` | 0.4 Ko |
| `src/main.jsx` | 8.4 Ko |

---

## `index.html`

```html
<!doctype html>
<html lang="fr" style="background:#FFFDF7">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Monac'Out" />
    <!-- Smart App Banner : propose l'installation de l'app depuis l'App Store (App Store ID 6774785049) -->
    <meta name="apple-itunes-app" content="app-id=6774785049" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0F1D3A" />
    <meta name="description" content="MonacOut — Tous les événements de Monaco dans votre poche." />
    <meta property="og:title" content="MonacOut — Sorties à Monaco" />
    <meta property="og:description" content="Tous les événements de la Principauté, triés par thème et par date." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://monacout.vercel.app" />
    <title>MonacOut</title>
  </head>
  <body style="margin:0;background:#FFFDF7">
    <div id="root"></div>
      <!-- Écran de démarrage : logo MonacOut pendant le chargement -->
      <div id="boot" style="position:fixed;inset:0;background:#FFFDF7;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;transition:opacity 0.5s">
        <div style="border:2px solid #C9A96E;padding:6px;display:inline-block">
          <div style="border:1.5px solid #0F1D3A;background:#fff;padding:14px 32px;text-align:center">
            <div style="font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:54px;color:#0F1D3A;line-height:1;letter-spacing:-1px">M</div>
            <div style="margin-top:5px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:4px;color:#0F1D3A">MONAC'<span style="color:#C4A241;font-weight:600;letter-spacing:2px">OUT</span></div>
          </div>
        </div>
        <div style="margin-top:16px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#C4A241">Community &amp; Lifestyle</div>
        <div id="boot-store" style="display:none;margin-top:28px;text-align:center">
          <a id="boot-store-btn" href="https://apps.apple.com/app/id6774785049"
             style="display:inline-block;background:#0F1D3A;color:#C9A96E;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;padding:12px 28px;text-decoration:none;border:1.5px solid #C9A96E">
            OUVRIR L'APP &nbsp;·&nbsp; OPEN THE APP
          </a>
        </div>
      </div>
    <script>
      // Sur iPhone/iPad hors app native : propose l'App Store et redirige automatiquement
      (function () {
        var isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
        var isNative = !!window.Capacitor; // déjà dans l'app Capacitor
        if (!isIOS || isNative) return;
        var storeUrl = 'https://apps.apple.com/app/id6774785049';
        // Affiche le bouton après 600 ms (logo visible)
        setTimeout(function () {
          var el = document.getElementById('boot-store');
          if (el) el.style.display = 'block';
        }, 600);
        // Redirige automatiquement vers l'App Store après 2 s
        setTimeout(function () {
          window.location.href = storeUrl;
        }, 2000);
      })();
    </script>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

## `package.json`

```json
{
  "name": "monacout",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node scripts/gen-widget-data.mjs && node scripts/gen-events-json.mjs && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "validate": "node verify-events.mjs",
    "cleanup": "node cleanup-events.mjs",
    "police": "node police-events.mjs",
    "source-check": "node source-check.mjs",
    "ota": "node scripts/publish-ota.mjs",
    "prepare": "sh scripts/install-hooks.sh"
  },
  "dependencies": {
    "@capacitor/android": "^8.4.0",
    "@capacitor/app": "^8.1.0",
    "@capacitor/cli": "^8.4.0",
    "@capacitor/core": "^8.4.0",
    "@capacitor/haptics": "^8.0.2",
    "@capacitor/ios": "^8.4.0",
    "@capacitor/keyboard": "^8.0.3",
    "@capacitor/local-notifications": "^8.2.0",
    "@capacitor/share": "^8.0.1",
    "@capacitor/splash-screen": "^8.0.2",
    "@capgo/capacitor-updater": "^8.50.2",
    "@fontsource/josefin-sans": "^5.3.0",
    "@fontsource/playfair-display": "^5.3.0",
    "@sentry/react": "^10.53.1",
    "@supabase/supabase-js": "^2.110.0",
    "@vercel/analytics": "^2.0.1",
    "posthog-js": "^1.374.2",
    "qrcode": "^1.5.4",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "playwright": "^1.60.0",
    "vite": "^8.0.12"
  }
}

```

## `vite.config.js`

```js
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

```

## `capacitor.config.json`

```json
{
  "appId": "com.monacout",
  "appName": "Monac'Out",
  "webDir": "dist",
  "ios": {
    "contentInset": "never",
    "allowsLinkPreview": false,
    "scrollEnabled": false
  },
  "plugins": {
    "Keyboard": {
      "resize": "none"
    },
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#C4A241"
    },
    "SplashScreen": {
      "launchShowDuration": 0,
      "launchAutoHide": false,
      "backgroundColor": "#FFFDF7",
      "showSpinner": false
    },
    "CapacitorUpdater": {
      "autoUpdate": false,
      "resetWhenUpdate": true
    }
  }
}

```

## `src/App.css`

```css
/* intentionally empty */

```

## `src/App.jsx`

```jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import { fetchLiveEvents, fetchNotifConfig, BUNDLED_EVENTS } from "./data/liveEvents";
import HomeScreen from "./components/screens/HomeScreen";
import FavoritesScreen from "./components/screens/FavoritesScreen";
import AdminScreen from "./components/screens/AdminScreen";
import FriendsScreen from "./components/screens/FriendsScreen";
import AuthScreen from "./components/screens/AuthScreen";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import { useAuth } from "./hooks/useAuth";
import { useSocial } from "./hooks/useSocial";
import { supabase } from "./lib/supabase";
import { partagerInvitation } from "./lib/invite";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import posthog from "posthog-js";
import { fichierVersAvatar } from "./lib/avatar";

// Capteur de mesure (invisible pour l'utilisateur). Lié à des ACTIONS (clics),
// jamais au défilement → aucune répétition parasite quand on scrolle.
function track(event, props) {
  try { posthog.capture(event, props); } catch { /* analytics indisponible */ }
}

// Le prénom de qui invite, pour la carte « Fiona t'invite ». La personne n'a pas
// encore de compte : c'est la seule lecture de profil autorisée sans connexion.
// ⚠️ DEUX CHEMINS. `profiles` a été fermée le 23 sep 2026 — elle était lisible en
// entier par n'importe qui, codes d'invitation compris. On passe par la fonction
// `prenom_par_code`, qui ne rend QUE le prénom. Le repli sur l'ancienne lecture
// couvre l'intervalle entre la publication de l'OTA et le passage de la migration ;
// une fois celle-ci passée, il ne rend simplement plus rien.
async function prenomParCode(code) {
  const propre = String(code || "").trim().toLowerCase();
  if (!propre || !supabase) return null;
  try {
    const { data, error } = await supabase.rpc("prenom_par_code", { code: propre });
    if (!error && typeof data === "string" && data) return data;
    if (!error && data === null) return null;      // code inconnu : inutile de réessayer
  } catch { /* fonction absente : on tente l'ancienne lecture */ }
  try {
    const { data } = await supabase
      .from("profiles").select("display_name").eq("invite_code", propre).single();
    return data?.display_name || null;
  } catch { return null; }
}

const MOIS_APP = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };


/**
 * 🕐 L'HEURE DE FIN D'UNE FICHE, EN MINUTES DEPUIS MINUIT.
 *
 * Stéphanie, 30 oct 2026 : le rappel du samedi 18 h proposait « Harry Potter en
 * musique », un concert de 15 h — déjà fini. Le classement ne regardait que le
 * JOUR, jamais l'heure : tout ce qui tombait le jour de l'envoi remontait, même
 * terminé. Envoyer quelqu'un vers une porte fermée, c'est pire que ne rien
 * envoyer.
 *
 * ⚠️ DEUX PIÈGES DÉJÀ RENCONTRÉS AILLEURS, repris ici :
 *   · une plage s'écrit avec un tiret cadratin OU une FLÈCHE (« 9h30 → 18h30 »),
 *     et parfois un simple trait ou « à » ;
 *   · beaucoup de fiches n'ont qu'une heure de DÉBUT. On leur accorde alors
 *     deux heures, plutôt que de les déclarer finies à la minute où elles
 *     commencent.
 * Une heure illisible rend `null` : la fiche est gardée. On ne retire jamais
 * une sortie parce qu'on n'a pas su lire son horaire.
 */
function finEnMinutesNotif(e) {
  const t = String(e?.time || "").replace(/\s/g, "");
  if (!t) return null;
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const deb = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const fin = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    // 🌙 UNE FICHE QUI COMMENCE APRÈS MINUIT APPARTIENT À LA NUIT DU JOUR
    // AFFICHÉ, PAS À SON PETIT MATIN. « HALLOWEEN NIGHT TWIGA · 00h30 — 05h00 »
    // datée du samedi, c'est la nuit de samedi à dimanche : à 18 h elle est
    // ENCORE À VENIR. Le premier jet la déclarait finie (fin = 5 h < 18 h) et
    // retirait du rappel la soirée la plus attendue du week-end.
    if (deb < 6 * 60) return 30 * 60;             // au-delà de toute heure d'envoi
    return fin <= deb ? 24 * 60 : fin;            // passe minuit → fin de journée
  }
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "lematin" || mot === "matin") return 12 * 60;
  if (mot === "lemidi" || mot === "amidi" || mot === "midi") return 15 * 60;
  if (mot === "enjournee" || mot === "toutelajournee") return 18 * 60;
  if (mot === "lapresmidi" || mot === "enapresmidi" || mot === "apresmidi") return 19 * 60;
  if (mot === "ensoiree" || mot === "lesoir" || mot === "soir") return 24 * 60;
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) {
    const deb = parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0);
    if (deb < 6 * 60) return 30 * 60;             // même règle pour une heure seule
    return deb + 120;                              // sans fin connue : deux heures
  }
  return null;                                     // illisible → on garde la fiche
}

function parseForNotif(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_APP[parts[2]];
  if (isNaN(day) || month === undefined) return null;
  return new Date(e.year || 2026, month, day);
}

// Cartes « annuaire » Spas & Musées : elles existent en 1 exemplaire PAR JOUR
// (repérables au champ `venues`). Pour éviter de les revoir à chaque jour quand on scrolle,
// on ne garde que l'occurrence la PLUS PROCHE (aujourd'hui) de chaque carte, et on masque le reste.
// ⚠️ Le CINÉMA est exclu : il change chaque semaine avec les nouveaux films → on le laisse tel quel.
function isDailyDirectory(e) {
  return e && Array.isArray(e.venues) && e.cat !== "CINÉMA";
}
function collapseVenueCards(events) {
  if (!Array.isArray(events)) return events;
  // 1) Regroupe : ne garder que l'occurrence la plus proche de chaque carte annuaire.
  const best = new Map();                 // titre → { i, t } = occurrence la plus proche
  events.forEach((e, i) => {
    if (!isDailyDirectory(e)) return;
    const d = parseForNotif(e);
    const t = d ? d.getTime() : Infinity;
    const cur = best.get(e.title);
    if (!cur || t < cur.t) best.set(e.title, { i, t });
  });
  if (!best.size) return events;
  const keep = new Set(Array.from(best.values(), v => v.i));
  const kept = events.filter((e, i) => !isDailyDirectory(e) || keep.has(i));

  // 2) Repositionne : place chaque carte annuaire À LA FIN de sa journée (jamais en haut).
  const dayKey = e => `${e.year || 2026}|${e.date}`;
  const dirs = [], rest = [];
  kept.forEach(e => (isDailyDirectory(e) ? dirs : rest).push(e));
  if (!dirs.length) return kept;
  const byDay = new Map();
  dirs.forEach(e => { const k = dayKey(e); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(e); });
  const out = [];
  const done = new Set();
  for (let i = 0; i < rest.length; i++) {
    out.push(rest[i]);
    const k = dayKey(rest[i]);
    const next = rest[i + 1];
    if (byDay.has(k) && !done.has(k) && (!next || dayKey(next) !== k)) {
      byDay.get(k).forEach(c => out.push(c));   // dernier event du jour → on ajoute les cartes annuaire après
      done.add(k);
    }
  }
  byDay.forEach((cards, k) => { if (!done.has(k)) cards.forEach(c => out.push(c)); });  // filet (jour sans autre event)
  return out;
}

// ── Pop-up automatique : les sorties phares à venir ───────────────────────────
// Par défaut MARDI, JEUDI et SAMEDI en fin de journée (18h) : iOS envoie un résumé
// des 4 plus gros événements des 7 jours à venir, en priorisant les FAVORIS et les
// événements les PLUS PROCHES en date, MÊME app fermée. 8 semaines à l'avance.
// Ces réglages (jours/heure/nombre/semaines) sont PILOTABLES depuis le site via
// public/notif-config.json — les valeurs ci-dessous ne servent que de repli.
const NOTIF_HOUR = 18;           // repli : fin de journée (moment « je cherche une sortie »)
const DIGEST_WEEKS = 8;          // repli : nb de semaines programmées à l'avance
const DIGEST_TOP = 4;            // repli : 3-4 plus gros événements / favoris
const SEND_OFFSETS = [1, 3, 5];  // repli : jours d'envoi depuis lundi (1=mardi, 3=jeudi, 5=samedi)
const MAX_DIGEST_IDS = 120;      // plage d'annulation (couvre toutes les configs possibles)
const DIGEST_ID_BASE = 90000;
const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Catégories par groupe (mêmes que les filtres de l'app) — pour les sujets préférés
const GROUP_CATS = {
  culture: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"],
  foodnight: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"],
  musique: ["CONCERT","JAZZ LIVE","CHANTS","MUSICAL","OPÉRA"],
  sport: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"],
};
function inPreferred(e, topics) {
  return topics && topics.length ? topics.some(t => GROUP_CATS[t]?.includes(e.cat)) : false;
}

function digestScore(e, favorites, refDate, topics) {
  // Bonus « proche en date » : plus l'événement arrive tôt dans la fenêtre de
  // 7 jours, plus il monte (84 pts le jour même → 12 pts au 6e jour).
  let proximity = 0;
  if (refDate) {
    const d = parseForNotif(e);
    if (d) {
      const dayOffset = Math.min(6, Math.max(0, Math.round((d - refDate) / 86400000)));
      proximity = (7 - dayOffset) * 12;
    }
  }
  return (favorites.includes(e.id) ? 1000 : 0)   // favoris d'abord
       + (e.hot ? 100 : 0)                         // puis événements phares
       + proximity                                 // puis les plus proches en date
       + (inPreferred(e, topics) ? 60 : 0)         // puis les sujets préférés choisis au login
       + (e.recurring ? 0 : 20);   // déprioritise les récurrences (apéro/brunch quotidiens)
}

async function scheduleDigest(events, favorites, config, topics) {
  if (!Capacitor.isNativePlatform()) return;
  // On NE demande PLUS l'autorisation ici (à l'ouverture) : on vérifie seulement.
  // La demande se fait au bon moment (1er favori) via le petit message dans App.
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;

  // Réglages pilotés par le site (notif-config.json), avec repli sur les valeurs codées.
  const sendOffsets = config?.offsets?.length ? config.offsets : SEND_OFFSETS;
  const notifHour   = config?.hour != null ? config.hour : NOTIF_HOUR;
  const weeks       = config?.weeks || DIGEST_WEEKS;
  const perDigest   = config?.perDigest || DIGEST_TOP;

  // Annule les anciens pop-up (plage large : couvre toutes les configs et versions précédentes)
  const old = Array.from({ length: MAX_DIGEST_IDS }, (_, i) => ({ id: DIGEST_ID_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }

  const now = new Date();
  // Lundi de la semaine en cours (les envois passés seront ignorés plus bas)
  const monday = new Date(); monday.setHours(0, 0, 0, 0);
  const dow = (monday.getDay() + 6) % 7;          // 0 = lundi
  monday.setDate(monday.getDate() - dow);

  const toSchedule = [];
  for (let w = 0; w < weeks; w++) {
    for (let s = 0; s < sendOffsets.length; s++) {
      const sendDay = new Date(monday); sendDay.setDate(monday.getDate() + 7 * w + sendOffsets[s]);
      const at = new Date(sendDay); at.setHours(notifHour, 0, 0, 0);
      if (at <= now) continue;                     // ne jamais programmer dans le passé
      const winStart = new Date(sendDay); winStart.setHours(0, 0, 0, 0);
      const winEnd = new Date(sendDay); winEnd.setDate(sendDay.getDate() + 6); winEnd.setHours(23, 59, 59, 999);
      const winEvents = events.filter(e => {
        if (e.directory) return false;   // pas les annuaires Musées/Cinéma dans les notifs (seulement de vrais événements)
        if (e.noNotif) return false;     // fiches quotidiennes d'expo : visibles dans l'app, exclues des notifs
        const d = parseForNotif(e);
        if (!(d && d >= winStart && d <= winEnd)) return false;
        // 🕐 CE QUI EST DÉJÀ FINI NE PART PAS DANS LE RAPPEL.
        // Uniquement pour le JOUR DE L'ENVOI : les jours suivants sont entiers.
        if (d.getTime() === sendDay.getTime()) {
          const fin = finEnMinutesNotif(e);
          if (fin !== null && fin <= notifHour * 60) return false;
        }
        return true;
      });
      if (winEvents.length === 0) continue;
      const top = [...winEvents]
        .sort((a, b) => digestScore(b, favorites, winStart, topics) - digestScore(a, favorites, winStart, topics))
        .slice(0, perDigest);
      const body = top.map(e => {
        const titre = e.title.replace(/\n/g, ' ');
        const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
        // Teaser : on affiche seulement le NOM (+ lieu), PAS la date → donne envie d'ouvrir l'app pour voir quand.
        return `• ${titre}${lieu ? ' · ' + lieu : ''}`;
      }).join('\n');
      const id = DIGEST_ID_BASE + w * sendOffsets.length + s;
      toSchedule.push({
        id: id < DIGEST_ID_BASE + MAX_DIGEST_IDS ? id : DIGEST_ID_BASE + MAX_DIGEST_IDS - 1,
        title: 'Vos sorties à venir à Monaco',
        body,
        schedule: { at },
      });
    }
  }
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « veille d'événement » pour chaque favori ──────────────────────────
// La veille à 18h : « Demain : [titre] · [lieu] ». Le levier de rétention le plus fort.
const FAV_ID_BASE = 91000;
const MAX_FAV_IDS = 60;
async function scheduleFavoriteReminders(events, favorites) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  const old = Array.from({ length: MAX_FAV_IDS }, (_, i) => ({ id: FAV_ID_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }
  const now = new Date();
  const favEvents = events.filter(e => favorites.includes(e.id));
  const toSchedule = [];
  let idx = 0;
  for (const e of favEvents) {
    if (idx >= MAX_FAV_IDS) break;
    const d = parseForNotif(e);
    if (!d) continue;
    const at = new Date(d); at.setDate(d.getDate() - 1); at.setHours(18, 0, 0, 0);
    if (at <= now) continue;                       // ne jamais programmer dans le passé
    const titre = e.title.replace(/\n/g, ' ');
    const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
    const heure = (e.time || '').split(/[—–-]/)[0].trim();
    toSchedule.push({
      id: FAV_ID_BASE + idx,
      title: 'Demain à Monaco',
      body: `${titre}${lieu ? ' · ' + lieu : ''}${/\d/.test(heure) ? ' · ' + heure : ''}`,
      schedule: { at },
    });
    idx++;
  }
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « Ajoute tes amis » ────────────────────────────────────────────────
// Pour les personnes connectées SANS ami : petit coup de pouce (J+2 et J+6 à 18h).
// Annulé dès qu'elles ont au moins un ami → on n'embête jamais ceux qui en ont.
const FRIENDS_NUDGE_BASE = 92000;
async function scheduleFriendsNudge(loggedIn, friendCount) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  const old = [0, 1, 2].map(i => ({ id: FRIENDS_NUDGE_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }
  if (!loggedIn) return;
  const now = new Date();
  // 0 ami → 2 rappels (J+2, J+6). A déjà des amis (souvent peu) → 1 seul rappel (J+3) pour en ajouter plus.
  const nudges = friendCount === 0
    ? [
        { days: 2, title: 'Ajoute tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements.' },
        { days: 6, title: 'Vois où sortent tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements à Monaco.' },
      ]
    : [
        { days: 3, title: 'Agrandis ton cercle', body: 'Ajoute plus d\'amis pour vous retrouver aux événements.' },
      ];
  const toSchedule = [];
  nudges.forEach((n, i) => {
    const at = new Date(now); at.setDate(now.getDate() + n.days); at.setHours(18, 0, 0, 0);
    if (at <= now) return;
    toSchedule.push({ id: FRIENDS_NUDGE_BASE + i, title: n.title, body: n.body, schedule: { at } });
  });
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « à ne pas manquer » : les 2 meilleurs événements à venir ──────────
// Se replanifie à chaque ouverture (J+1 à 12h) → ne se déclenche que si la personne ne revient pas.
const HILITE_ID = 93000;
async function scheduleHighlightsReminder(events, favorites) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  try { await LocalNotifications.cancel({ notifications: [{ id: HILITE_ID }] }); } catch { /* rien à annuler */ }
  const now = new Date();
  const winEnd = new Date(now); winEnd.setDate(now.getDate() + 7); winEnd.setHours(23, 59, 59, 999);
  const top = events.filter(e => {
    if (e.directory || e.noNotif) return false;
    const d = parseForNotif(e);
    return d && d >= now && d <= winEnd;
  }).sort((a, b) => digestScore(b, favorites, now) - digestScore(a, favorites, now)).slice(0, 2);
  if (!top.length) return;
  const body = top.map(e => {
    const d = parseForNotif(e);
    const titre = e.title.replace(/\n/g, ' ');
    const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
    return `• ${JOURS_FR[d.getDay()]} ${d.getDate()} — ${titre}${lieu ? ' · ' + lieu : ''}`;
  }).join('\n');
  const at = new Date(now); at.setDate(now.getDate() + 1); at.setHours(12, 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);
  await LocalNotifications.schedule({ notifications: [{ id: HILITE_ID, title: 'À ne pas manquer à Monaco', body, schedule: { at } }] });
}

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "music", "OPÉRA": "music", MUSICAL: "music", "JAZZ LIVE": "music",
  "DJ SET": "music", CHANTS: "music",
  THÉÂTRE: "culture", "CONFÉRENCE": "conference", EXPOSITION: "culture", FESTIVAL: "culture",
  GALA: "culture", "FÊTE NATIONALE": "culture", MARCHÉ: "culture", SALON: "culture",
  SPECTACLE: "culture", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "foody", FOODY: "foody",
  ENCHÈRES: "encheres",
};

// ── Bandeau « mise à jour disponible » ────────────────────────────────────────
// L'app compare sa version à `latestVersion` (piloté depuis notif-config.json).
// Si le serveur annonce une version plus récente → bandeau vers l'App Store.
const APPSTORE_URL = "https://apps.apple.com/fr/app/monacout/id6774785049";
function isNewerVersion(latest, current) {
  const a = String(latest).split(".").map(n => parseInt(n) || 0);
  const b = String(current).split(".").map(n => parseInt(n) || 0);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

export default function App() {
  const auth = useAuth();
  const social = useSocial(auth.user?.id);
  const [pendingInvite, setPendingInvite] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("invite") || null; } catch { return null; }
  });
  const [tab, setTab] = useState(() =>
    new URLSearchParams(window.location.search).get("invite") ? "friends" : "events"
  );
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_favs") || "[]"); }
    catch { return []; }
  });
  const [homeFilter, setHomeFilter] = useState("all");
  const [lang, setLang] = useState(() => {
    // 1) choix manuel mémorisé, sinon 2) langue du téléphone (anglais → en, sinon fr)
    const saved = localStorage.getItem("monacout_lang");
    if (saved === "fr" || saved === "en") return saved;
    return (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  });
  const [catFilters, setCatFilters] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFavNudge, setShowFavNudge] = useState(false);
  const [showPhotoNudge, setShowPhotoNudge] = useState(false);
  const [showInviteNudge, setShowInviteNudge] = useState(false);
  // Instant d'apparition de la carte de partage. Elle s'ouvre TOUTE SEULE au
  // lancement : si le doigt est encore sur l'écran, la fin de ce geste tombe sur
  // le fond assombri et la referme immédiatement. Stéphanie, 31 août 2026 :
  // « le message share s'affiche mais il reste 1 quart de seconde, donc inutile ».
  // On ignore donc les clics sur le fond pendant les 700 premières millisecondes.
  const nudgeOuvertA = useRef(0);
  // eventId sur lequel quelqu'un a touché « J'y vais » sans être connecté
  const [goingEnAttente, setGoingEnAttente] = useState(null);
  const [events, setEvents] = useState(BUNDLED_EVENTS);
  const [notifConfig, setNotifConfig] = useState(null);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [inviteToast, setInviteToast] = useState(null);
  const [inviterName, setInviterName] = useState(null);
  const [showInAppBanner, setShowInAppBanner] = useState(false);
  const [showInstallInvite, setShowInstallInvite] = useState(false);   // invité arrivé sur le SITE, sans l'app
  const [codeInvitation, setCodeInvitation] = useState("");
  const [resumeTick, setResumeTick] = useState(0);  // incrémenté au retour au 1er plan → recalcule « ce soir / demain » sans fermer l'app
  const [deepLinkTick, setDeepLinkTick] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const engageRef = useRef(0);
  const eventLinkRef = useRef(false);
  const promptedThisSessionRef = useRef(false);   // un seul message par session, jamais deux d'affilée
  const authUserRef = useRef(null);               // valeur à jour d'auth.user pour les minuteurs
  const profileRef = useRef(null);                // idem pour le profil (a-t-elle déjà une photo ?)

  useEffect(() => { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleHighlightsReminder(events, favorites); }, [events, favorites, notifConfig, auth.profile]);
  // L'intention retenue quand quelqu'un touche « J'y vais » sans compte est honorée
  // dès que le compte existe : la personne retrouve sa sortie DÉJÀ COCHÉE, au lieu d'un
  // fil où rien n'a bougé. Sans ça, on lui aurait fait créer un compte pour rien.
  useEffect(() => {
    if (!auth.user || !social.myParticipations) return;
    let id = 0;
    try { id = Number(localStorage.getItem('monacout_going_attente')) || 0; } catch { return; }
    if (!id) return;
    try { localStorage.removeItem('monacout_going_attente'); } catch { /* rien */ }
    if (!social.myParticipations.includes(id)) {
      social.toggleParticipation(id);
      track('going_honore_apres_inscription', { eventId: id });
    }
  }, [auth.user, social.myParticipations]);

  // ── Carte « invite tes amies » ───────────────────────────────────────────────
  // 27 personnes sur 42 n'ont AUCUNE amie : elles se sont inscrites et se retrouvent
  // devant un onglet Amies vide. La relance existante est une notification J+2, qui
  // n'atteint que les apps installées ayant autorisé les notifications (~19 personnes).
  //
  // Deux moments, un seul message :
  //  · juste après l'inscription — le seul instant où l'attention est acquise ;
  //  · à l'ouverture, pour les inscrites DÉJÀ là qui n'ont personne (les 27).
  //
  // Mêmes garde-fous que les autres sollicitations : 2 fois maximum, à 14 jours
  // d'écart, et jamais deux messages dans la même visite (canAskAgain s'en charge).
  // ⚠️ Ne concerne QUE les personnes connectées : le lien d'invitation porte le code
  // personnel, donc quelqu'un sans compte n'a rien à partager.
  const avaitUnPrenom = useRef(null);
  useEffect(() => {
    const prenom = auth.profile?.display_name || '';
    const avant = avaitUnPrenom.current;
    avaitUnPrenom.current = prenom;
    if (!prenom) return;                                   // pas encore inscrite
    if ((social.friends || []).length > 0) return;         // elle a déjà des amies
    const vientDeSInscrire = avant !== null && !avant;
    // Après l'inscription : 900 ms, le temps que l'écran se referme (sinon les deux
    // se superposent, l'empilement proscrit le 7 août). Sinon : 12 s, comme les autres
    // messages — on laisse d'abord regarder le fil.
    // 900 ms après l'inscription (le temps que l'écran se referme) ; 3 s sinon —
    // assez pour que le fil soit dessiné, et « à l’ouverture » comme demandé.
    const delai = vientDeSInscrire ? 900 : 3000;
    const t = setTimeout(() => {
      maybeAskInvite(vientDeSInscrire ? 'inscription' : 'ouverture');
    }, delai);
    return () => clearTimeout(t);
  }, [auth.profile, social.friends]);

  useEffect(() => { scheduleFriendsNudge(!!auth.user, (social.friends || []).length); }, [auth.user, social.friends]);
  useEffect(() => { authUserRef.current = auth.user; }, [auth.user]);
  useEffect(() => { profileRef.current = auth.profile; }, [auth.profile]);

  // Au lancement : on compte la visite, puis on sollicite les gens qui reviennent
  // MÊME s'ils n'ouvrent jamais de fiche. C'était le trou : la demande de notifications
  // ne partait qu'après 2 fiches ouvertes, or 85 % des visiteurs n'en ouvrent aucune —
  // on ne posait donc la question qu'à 10 % d'entre eux (et personne ne refusait).
  useEffect(() => {
    // Migration : l'ancien drapeau « déjà demandé » bloquait à vie. On le convertit
    // en « 1 demande sans date » → ces personnes pourront être resollicitées.
    try {
      if (localStorage.getItem("monacout_notif_asked") === "1" && !localStorage.getItem("monacout_notif_asks")) writeNum("monacout_notif_asks", 1);
      if (localStorage.getItem("monacout_fav_nudge_shown") === "1" && !localStorage.getItem("monacout_signup_asks")) writeNum("monacout_signup_asks", 1);
    } catch { /* ignore */ }

    const visites = bumpCount("monacout_sessions");
    // La carte de partage arrive À L'OUVERTURE — 3 s, demande de Stéphanie du
    // 17 août 2026. Elle ne dépend plus du nombre de visites : chacun la voit à sa
    // 1ʳᵉ ouverture puis à sa 3ᵉ (le comptage est dans maybeAskInvite).
    const tPartage = setTimeout(() => {
      if (!authUserRef.current) maybeAskInvite("sans-compte");
    }, 3000);
    // Les autres messages gardent leur rythme : on laisse respirer, jamais à la
    // seconde où l'app s'ouvre. Si la carte de partage est déjà passée, le garde-fou
    // « un seul message par visite » les mettra d'office au tour suivant.
    const t = setTimeout(() => {
      if (maybeAskPhoto()) return;          // connectée mais sans photo → on l'invite (2× max)
      if (visites >= 3) maybeAskNotif();
    }, 12000);
    return () => { clearTimeout(tPartage); clearTimeout(t); };
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { localStorage.setItem("monacout_lang", lang); }, [lang]);

  // Récupère les événements EN DIRECT depuis le site (corrections sans passer par Apple)
  // Délai : attend que l'écran de démarrage ait fini de s'estomper (600ms + 500ms fade = 1100ms)
  // → évite le flash visible quand la liste change d'ordre au premier rendu.
  useEffect(() => {
    let cancelled = false;
    const t0 = Date.now();
    fetchLiveEvents().then(live => {
      if (cancelled || !live?.length) return;
      const elapsed = Date.now() - t0;
      const wait = Math.max(0, 1200 - elapsed);
      setTimeout(() => { if (!cancelled) setEvents(live); }, wait);
    });
    return () => { cancelled = true; };
  }, []);

  // ── L'ANNONCE « CE SOIR » : un carré au centre, plus un bandeau en haut ──────────
  // Le bandeau se plaçait au-dessus du logo et revenait à CHAQUE ouverture même après
  // avoir été fermé — jugé agaçant le 7 août 2026. Désormais c'est le même carré que
  // les autres messages, et il n'apparaît QU'UNE FOIS par phase : une fois la veille
  // (« Demain soir »), une fois le jour même (« Ce soir »). Deux apparitions par
  // événement au maximum, jamais deux fois dans la même visite.

  // Propose les notifications ~3,5 s après l'entrée dans l'app (pour TOUT LE MONDE), une fois l'écran de bienvenue passé.
  // maybeAskNotif est protégé (n'affiche que si la permission est encore demandable → jamais 2 fois).
  useEffect(() => {
    if (showWelcome) return;
    const t = setTimeout(() => { maybeAskNotif(); }, 3500);
    return () => clearTimeout(t);
  }, [showWelcome]);

  // Récupère les réglages EN DIRECT + REFRESH au retour au 1er plan (natif + web) →
  // le bandeau « demain soir » bascule tout seul en « ce soir » le lendemain, sans fermer l'app.
  useEffect(() => {
    const refresh = () => { setResumeTick(t => t + 1); fetchNotifConfig().then(cfg => { if (cfg) setNotifConfig(cfg); }); };
    refresh();
    let sub;
    if (Capacitor.isNativePlatform()) CapApp.addListener("appStateChange", ({ isActive }) => { if (isActive) refresh(); }).then(h => { sub = h; });
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); if (sub) sub.remove(); };
  }, []);

  // Lien partagé « ?event=<id> » → ouvre directement la fiche de l'événement dans l'app/le site
  useEffect(() => {
    if (eventLinkRef.current || !events?.length) return;
    try {
      const eid = new URLSearchParams(window.location.search).get("event");
      if (!eid) { eventLinkRef.current = true; return; }
      const ev = events.find(e => String(e.id) === String(eid));
      if (ev) { setSelectedEvent(ev); eventLinkRef.current = true; }
    } catch { /* ignore */ }
  }, [events]);

  // Bandeau « mise à jour disponible » : compare la version de l'app à latestVersion (config live)
  useEffect(() => {
    const latest = notifConfig?.latestVersion;
    if (!latest || !Capacitor.isNativePlatform()) return;
    CapApp.getInfo().then(info => {
      if (isNewerVersion(latest, info.version) &&
          localStorage.getItem("monacout_update_dismissed") !== String(latest)) {
        setUpdateAvailable(true);
      }
    }).catch(() => { /* getInfo indisponible (web) */ });
  }, [notifConfig]);

  // Après connexion, si la personne n'a pas encore de profil (prénom) → on ouvre l'étape "prénom" automatiquement
  useEffect(() => {
    if (!auth.loading && auth.user && !auth.profile?.display_name) setShowAuth(true);
  }, [auth.loading, auth.user, auth.profile]);

  // Si un code de connexion est en attente (on a quitté l'app pour lire le mail) → on rouvre l'écran (qui s'ouvre pile sur l'écran code)
  useEffect(() => {
    if (auth.loading || auth.user) return;
    try { if (localStorage.getItem("monacout_pending_login_email")) setShowAuth(true); } catch { /* rien */ }
  }, [auth.loading, auth.user]);

  // Écran d'accueil au 1er lancement — invite à se connecter, SANS jamais forcer.
  useEffect(() => {
    if (auth.loading || auth.user) return;
    if (localStorage.getItem("monacout_welcomed") === "1") return;
    if (localStorage.getItem("monacout_pending_invite")) return; // le flux invitation gère déjà l'écran
    setShowWelcome(true);
  }, [auth.loading, auth.user]);

  // Lien d'invitation partagé (?invite=xxx) : on mémorise le code pour l'appliquer après connexion
  useEffect(() => {
    const inv = new URLSearchParams(window.location.search).get("invite");
    if (!inv) return;
    localStorage.setItem("monacout_pending_invite", inv.trim().toLowerCase());
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    // Navigateur intégré WhatsApp/Instagram : session Supabase absente → bannière Safari
    const ua = navigator.userAgent || "";
    const isInApp = !Capacitor.isNativePlatform() && /WhatsApp|Instagram|FBAN|FBAV|Twitter|Line\//.test(ua);
    if (supabase) prenomParCode(inv).then(n => { if (n) setInviterName(n); });
    if (isInApp) { setShowInAppBanner(true); return; }
    // ── LE LIEN D'INVITATION DOIT MENER À L'APP ──────────────────────────────────
    // Relevé du 9 août 2026 : 20 personnes ont ouvert un lien d'invitation, toutes
    // dans un VRAI navigateur (Safari 10, Chrome iOS 7, bureau 3) — pas dans un
    // navigateur intégré. Elles n'avaient donc pas l'app : le lien les déposait sur
    // le site, et RIEN ne leur proposait de l'installer. Le lien de Nadège à lui
    // seul a amené 14 personnes de cette façon, toutes restées sur le web.
    // On leur propose donc l'app, en gardant le code visible : après installation
    // il suffit de le saisir dans Mon Cercle, rien n'est perdu.
    // iPhone/iPad UNIQUEMENT : l'app n'existe pas encore sur Android, y envoyer
    // quelqu'un vers l'App Store d'Apple ne mènerait nulle part.
    if (!Capacitor.isNativePlatform() && /iPhone|iPad|iPod/i.test(ua)) {
      setCodeInvitation(inv.trim().toLowerCase());
      setShowInstallInvite(true);
      track("invite_web_shown", { source: "invitation" });
    }
  }, []);

  // ── TOUS LES VISITEURS DU SITE SUR IPHONE, PAS SEULEMENT LES INVITÉS ────────────
  // Relevé du 9 août 2026 : 42 personnes utilisent Monac'Out depuis leur navigateur
  // sans avoir l'app. Rien ne leur proposait de l'installer. On leur montre donc la
  // même invitation, après quelques secondes, et pas plus de 3 fois espacées de 7
  // jours — on propose, on ne harcèle pas.
  useEffect(() => {
    if (Capacitor.isNativePlatform() || showWelcome) return;
    if (!/iPhone|iPad|iPod/i.test(navigator.userAgent || "")) return;
    if (new URLSearchParams(window.location.search).get("invite")) return;   // déjà géré au-dessus
    if (!canAskAgain("monacout_install_asks", "monacout_install_last_ask", 3, 7)) return;
    const t = setTimeout(() => {
      noteAsked("monacout_install_asks", "monacout_install_last_ask");
      setShowInstallInvite(true);
      track("invite_web_shown", { source: "visite" });
    }, 8000);   // le temps de voir le fil : on propose l'app à quelqu'un qui l'utilise déjà
    return () => clearTimeout(t);
  }, [showWelcome]);

  // App NATIVE ouverte via un lien (Universal Link) : on récupère le ?invite= du lien reçu
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handle = CapApp.addListener("appUrlOpen", ({ url }) => {
      try {
        const u = new URL(url);
        const inv = u.searchParams.get("invite");
        if (inv) {
          localStorage.setItem("monacout_pending_invite", inv.trim().toLowerCase());
          setDeepLinkTick(t => t + 1);
        }
        const eid = u.searchParams.get("event");
        if (eid) {
          localStorage.setItem("monacout_pending_event", eid);
          setDeepLinkTick(t => t + 1);
        }
        // Retour du lien magique (Universal Link) : on établit la session dans l'app native.
        // Flux implicite → jetons dans le hash ; flux PKCE → ?code=.
        const hp = new URLSearchParams(u.hash?.startsWith("#") ? u.hash.slice(1) : "");
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");
        const code = u.searchParams.get("code");
        if (supabase && access_token && refresh_token) {
          supabase.auth.setSession({ access_token, refresh_token });
        } else if (supabase && code) {
          supabase.auth.exchangeCodeForSession(code);
        }
      } catch { /* lien non pertinent */ }
    });
    return () => { handle.then(h => h.remove()); };
  }, []);

  // Deep link natif ?event=<id> → ouvre directement la fiche événement
  useEffect(() => {
    const eid = localStorage.getItem("monacout_pending_event");
    if (!eid || !events?.length) return;
    const ev = events.find(e => String(e.id) === String(eid));
    if (ev) { setSelectedEvent(ev); localStorage.removeItem("monacout_pending_event"); }
  }, [events, deepLinkTick]);

  // Dès que la personne est connectée (avec un profil), on applique l'invitation en attente — SANS code à taper
  useEffect(() => {
    const inv = localStorage.getItem("monacout_pending_invite");
    if (!inv || !auth.user || !auth.profile) return;
    social.addFriendByCode(inv).then(r => {
      localStorage.removeItem("monacout_pending_invite");
      if (r?.name) {
        setInviteToast(lang === "en" ? `✅ Friend request sent to ${r.name}!` : `✅ Invitation envoyée à ${r.name} !`);
        setTab("friends");
      } else if (r?.error && r.error !== "Demande déjà envoyée") {
        setInviteToast(`ℹ️ ${r.error}`);
      }
      setTimeout(() => setInviteToast(null), 4500);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, auth.profile, deepLinkTick]);

  // Invitation en attente + personne pas encore connectée → on propose l'inscription
  // et on affiche le prénom de l'ami qui invite (lu via le code, lecture publique autorisée).
  useEffect(() => {
    if (auth.loading || auth.user) return;
    const inv = localStorage.getItem("monacout_pending_invite");
    if (!inv) return;
    setShowAuth(true);
    if (supabase) prenomParCode(inv).then(n => { if (n) setInviterName(n); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.user, deepLinkTick]);

  function handleTabChange(newTab) {
    const el = document.getElementById("main-scroll");
    if (newTab !== tab) {
      setCatFilters([]);
      setTab(newTab);
      if (el) el.scrollTop = 0;
    }
  }

  function handleCatFilter(catId) {
    setCatFilters(prev => {
      const active = prev.includes(catId);
      if (!active) track("filter_used", { filter: catId });   // seulement à l'activation d'un filtre
      return active ? prev.filter(f => f !== catId) : [...prev, catId];
    });
    const el = document.getElementById("main-scroll");
    if (el) el.scrollTop = 0;
  }

  function toggleFav(id) {
    // Haptic feedback natif iOS
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("monacout_favs", JSON.stringify(next));
      if (!prev.includes(id)) {
        track("favorite_added", { event_id: id });   // ajout d'un favori (jamais au retrait)
        // 1er favori sans compte → on invite (une seule fois) à sauvegarder ses favoris.
        // Sinon (déjà connectée, ou nudge déjà vu) → on propose les notifs au bon moment.
        const nudged = maybeAskSignup("fav_nudge");
        if (!nudged) maybeAskNotif();   // ajout d'un favori = intérêt fort → on propose (au bon moment)
      }
      return next;
    });
  }

  // Compte les signes d'intérêt (ouverture d'un événement).
  // 2 fiches dans la même visite, OU 3 fiches en cumulé → on sollicite.
  function bumpNotifEngagement() {
    engageRef.current += 1;
    const total = bumpCount("monacout_card_opens");
    if (!auth.user && total >= 3 && maybeAskSignup("cartes")) return;   // le compte d'abord
    if (engageRef.current >= 2 || total >= 3) maybeAskNotif();
  }

  function handleCardClick(e) {
    track("event_opened", { event_id: e.id, cat: e.cat });   // ouverture d'une fiche (au clic)
    setSelectedEvent(e);
    bumpNotifEngagement();
  }

  // ── Compteurs d'intérêt conservés d'une visite à l'autre ─────────────────
  // engageRef repart à zéro à chaque lancement ; ces compteurs-là, non.
  function readNum(k) { try { return parseInt(localStorage.getItem(k) || "0", 10) || 0; } catch { return 0; } }
  function writeNum(k, v) { try { localStorage.setItem(k, String(v)); } catch { /* ignore */ } }
  function bumpCount(k) { const v = readNum(k) + 1; writeNum(k, v); return v; }
  const DAY_MS = 86400000;

  // Autorise à reposer la question : au plus `max` fois en tout, espacées de `days` jours,
  // et jamais deux messages dans la même session.
  function canAskAgain(kAsks, kLast, max, days) {
    if (promptedThisSessionRef.current) return false;
    if (readNum(kAsks) >= max) return false;
    const last = readNum(kLast);
    return !last || Date.now() - last > days * DAY_MS;
  }
  function noteAsked(kAsks, kLast) {
    promptedThisSessionRef.current = true;
    writeNum(kAsks, readNum(kAsks) + 1);
    writeNum(kLast, Date.now());
  }

  // Carte de partage : à la 1ʳᵉ ouverture, puis à la 3ᵉ. Demande de Stéphanie,
  // 17 août 2026 — elle veut la voir arriver à l'ouverture, pas au bout de plusieurs
  // jours. On compte donc des OUVERTURES, pas des délais.
  //
  // Une ouverture n'est comptée que si le créneau du jour est libre : si un autre
  // message est déjà passé dans la visite, on ne consomme pas l'occasion, sinon la
  // personne perdrait sa 1ʳᵉ fois sans avoir rien vu.
  const INVITE_OUV = "monacout_invite_ouvertures";
  const INVITE_DERNIER = "monacout_invite_dernier";
  function maybeAskInvite(moment) {
    // ⚠️ SUR LE SITE, LA CARTE NE SERT PLUS À RIEN — le bandeau permanent
    // « Regarde où vont tes amis ce soir » (BandeauWeb) dit déjà la même chose,
    // en haut de la page, sans délai. Les deux ensemble faisaient DEUX
    // sollicitations empilées sur l'écran de bienvenue. La carte reste entière
    // dans l'app installée, où aucun bandeau ne peut proposer l'App Store.
    if (!Capacitor.isNativePlatform() && moment === "sans-compte") return false;
    // ── LA CARTE NE S'ÉTEINT PLUS JAMAIS (10 oct 2026) ──────────────────────────
    // Avant : `if (n > 3) return false` la coupait DÉFINITIVEMENT après la 3ᵉ
    // ouverture, sur cet appareil, pour toujours. La règle supposait un flux de
    // nouveaux venus ; avec une audience fidèle elle se condamne elle-même en
    // quelques jours. Mesuré : carte montrée à 44 personnes la semaine du 16 août,
    // 7 celle du 13 septembre, alors que les ouvertures d'app n'avaient baissé
    // que de moitié. Part des ouvreurs qui la voyaient : 63 % → 18 %.
    //
    // Demande de Stéphanie, 10 oct 2026 : « 2× par mois », sans fin.
    // ⚠️ MAIS PAS une règle purement calendaire : en août, « 2 fois espacées de
    // 14 jours » rendait la carte invisible deux semaines après un seul « Plus
    // tard », et Stéphanie a rouvert l'app quatre fois sans la revoir. On garde
    // donc les OUVERTURES pour le premier contact — c'est ce qu'elle avait
    // demandé le 17 août — et on ne passe au rythme mensuel qu'ensuite.
    const n = readNum(INVITE_OUV) + 1;
    writeNum(INVITE_OUV, n);
    const premierContact = (n === 1 || n === 3);
    if (!premierContact) {
      // Ensuite : deux fois par mois, soit au plus une fois tous les 15 jours.
      const last = readNum(INVITE_DERNIER);
      if (last && Date.now() - last < 15 * DAY_MS) return false;
    }
    if (promptedThisSessionRef.current) return false;                   // créneau pris
    promptedThisSessionRef.current = true;
    writeNum(INVITE_DERNIER, Date.now());
    nudgeOuvertA.current = Date.now();
    setShowInviteNudge(true);
    track("invite_nudge_shown", { moment, ouverture: n, rythme: premierContact ? "premier-contact" : "mensuel" });
    return true;
  }

  // Invitation à ajouter sa photo — uniquement aux personnes CONNECTÉES qui n'en ont
  // pas encore. Sans ça elles ne sauraient pas que c'est possible : le carré du menu
  // ne se remarque pas. 2 fois maximum, à 14 jours d'écart.
  function maybeAskPhoto() {
    const p = authUserRef.current ? profileRef.current : null;
    if (!p || !p.display_name || p.avatar_url) return false;
    if (!canAskAgain("monacout_photo_asks", "monacout_photo_last_ask", 2, 14)) return false;
    noteAsked("monacout_photo_asks", "monacout_photo_last_ask");
    setShowPhotoNudge(true);
    track("photo_prompt_shown");
    return true;
  }

  // Invitation à créer un compte. Renvoie true si le message a été affiché.
  function maybeAskSignup() {
    if (auth.user) return false;
    return maybeAskInvite("sans-compte");
  }

  // Affiche notre petit message maison AVANT la demande iOS.
  // Reposable jusqu'à 3 fois, à 7 jours d'intervalle : « plus tard » ne doit pas
  // valoir « plus jamais » (14 personnes sur 20 avaient répondu « plus tard »).
  async function maybeAskNotif() {
    if (!canAskAgain("monacout_notif_asks", "monacout_notif_last_ask", 3, 7)) return;
    if (Capacitor.isNativePlatform()) {
      try {
        const p = await LocalNotifications.checkPermissions();
        if (p.display === "prompt" || p.display === "prompt-with-rationale") {
          noteAsked("monacout_notif_asks", "monacout_notif_last_ask");
          setShowNotifPrompt(true);
          track("notif_prompt_shown");
        }
      } catch { /* ignore */ }
    } else if ("Notification" in window && Notification.permission === "default") {
      noteAsked("monacout_notif_asks", "monacout_notif_last_ask");
      setShowNotifPrompt(true);
      track("notif_prompt_shown");
    }
  }

  // La personne a dit OUI à notre message → on déclenche la vraie demande iOS puis on programme.
  async function acceptNotif() {
    setShowNotifPrompt(false);
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await LocalNotifications.requestPermissions();
        track("notif_permission", { result: perm.display });   // granted / denied → mesure le taux d'acceptation
        if (perm.display === "granted") { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleFriendsNudge(!!auth.user, (social.friends || []).length); scheduleHighlightsReminder(events, favorites); }
      } catch { /* ignore */ }
    } else if ("Notification" in window) {
      try { const r = await Notification.requestPermission(); track("notif_permission", { result: r }); } catch { /* ignore */ }
    }
  }

  // ── « J'y vais » sur une exposition : UN SEUL jour, pas toute la durée ──────────
  // Une exposition ouverte des mois apparaît désormais chaque jour dans le fil, et
  // toutes ces occurrences partagent le même identifiant. « J'y vais » se retrouvait
  // donc coché sur tous les jours de l'expo, ce qui ne veut rien dire : on y va un
  // jour. On retient donc localement LE jour choisi et on n'affiche la coche que là.
  // La base, elle, ne stocke qu'une ligne par événement — c'est ce qui permet aux
  // amies de voir « elle va à Brauner ». Le jour précis reste sur l'appareil.
  function handleGoingClick(eventId, jour, enCours) {
    // 18 personnes ont touché « J'y vais » depuis juillet, 3 seulement ont une
    // participation enregistrée. Celles qui n'avaient pas de compte tombaient sur
    // l'écran « Se connecter » SANS QU'ON LEUR DISE POURQUOI, et leur geste était
    // perdu même si elles allaient au bout. On explique, et on retient l'intention.
    if (!auth.user) {
      setGoingEnAttente(eventId);
      try { localStorage.setItem("monacout_going_attente", String(eventId)); } catch { /* quota */ }
      track("going_sans_compte", { eventId });
      return;
    }
    if (enCours && jour) {
      const dejaInscrite = (social.myParticipations || []).includes(eventId);
      setJoursParticipation(prev => {
        const suivant = { ...prev };
        if (dejaInscrite) delete suivant[eventId]; else suivant[eventId] = jour;
        try { localStorage.setItem("monacout_jours_participation", JSON.stringify(suivant)); } catch { /* quota */ }
        return suivant;
      });
    }
    social.toggleParticipation(eventId);
  }

  function navigateToCategory(cat) {
    const filterId = CAT_TO_FILTER[cat];
    if (filterId) {
      setCatFilters(prev =>
        prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]
      );
    }
    setHomeFilter("all");
    setTab("events");
    const el = document.getElementById("main-scroll");
    if (el) el.scrollTop = 0;
  }

  // Jour choisi pour chaque exposition marquée « J'y vais » (voir handleGoingClick).
  const [joursParticipation, setJoursParticipation] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_jours_participation") || "{}"); }
    catch { return {}; }
  });

  // Liste pour l'AFFICHAGE : cartes annuaire (spa/musées/cinéma) réduites à une seule occurrence.
  // (Les notifications continuent d'utiliser `events` brut plus haut.)
  const displayEvents = useMemo(() => collapseVenueCards(events), [events]);

  const sharedProps = { favorites, onToggleFav: toggleFav, onCategoryClick: navigateToCategory, lang, onCardClick: handleCardClick, events: displayEvents, social, onGoingClick: handleGoingClick, joursParticipation, loggedIn: !!auth.user, authReady: !auth.loading, onShowAuth: () => setShowAuth(true), inviteCode: auth.profile?.invite_code || "" };

  return (
    <>
    <Shell
      tab={tab}
      setTab={handleTabChange}
      lang={lang}
      setLang={setLang}
      t={T[lang]}
      catFilters={catFilters}
      onCatFilter={handleCatFilter}
      onClearFilters={() => setCatFilters([])}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      selectedEvent={selectedEvent}
      onClosePopup={() => setSelectedEvent(null)}
      onToggleFav={toggleFav}
      favorites={favorites}
      adminOverlay={showAdmin ? <AdminScreen onClose={() => setShowAdmin(false)} /> : null}
      contactEmail={notifConfig?.contactEmail || "contact@monacout.com"}
      auth={auth}
      social={social}
      onShowAuth={() => setShowAuth(true)}
      onGoingSansCompte={(id) => { setGoingEnAttente(id ?? 0); try { localStorage.setItem("monacout_going_attente", String(id ?? 0)); } catch { /* quota */ } track("going_sans_compte", { source: "recap" }); }}
      pendingCount={social.pending?.length || 0}
    >
      {tab === "events" ? (
        <HomeScreen
          {...sharedProps}
          userName={auth.profile?.display_name || ""} avatarUrl={auth.profile?.avatar_url || ""}
          filter={homeFilter}
          onFilterChange={setHomeFilter}
          catFilters={catFilters}
          onCatFilter={handleCatFilter}
          onOpenMenu={() => setShowMenu(true)}
          onNavAgenda={() => handleTabChange("agenda")}
          onNavFriends={() => handleTabChange("friends")}
          pendingFriends={social.pending?.length || 0}
          onAdminOpen={() => setShowAdmin(true)}
          onLangChange={setLang}
        />
      ) : tab === "friends" ? (
        <FriendsScreen
          auth={auth}
          social={social}
          events={events}
          lang={lang}
          onShowAuth={() => setShowAuth(true)}
      onGoingSansCompte={(id) => { setGoingEnAttente(id ?? 0); try { localStorage.setItem("monacout_going_attente", String(id ?? 0)); } catch { /* quota */ } track("going_sans_compte", { source: "recap" }); }}
          onNavEvents={() => handleTabChange("events")}
          initialInviteCode={pendingInvite}
          onInviteConsumed={() => setPendingInvite(null)}
        />
      ) : (
        <FavoritesScreen
          {...sharedProps}
          onNavEvents={() => handleTabChange("events")}
        />
      )}
      {showAuth && (
        <AuthScreen
          onClose={() => setShowAuth(false)}
          auth={auth}
          lang={lang}
          inviterName={inviterName}
        />
      )}
      {showWelcome && (
        <WelcomeScreen
          lang={lang}
          onLogin={() => { localStorage.setItem("monacout_welcomed", "1"); setShowWelcome(false); setShowAuth(true); }}
          onExplore={() => { localStorage.setItem("monacout_welcomed", "1"); setShowWelcome(false); }}
        />
      )}
    </Shell>

    {/* Invitation douce à créer un compte après le 1er favori (conversion, jamais bloquante) */}

    {/* Invitation à ajouter sa photo — uniquement aux personnes connectées qui n'en
        ont pas. Sans ce message elles ne sauraient pas que c'est possible : le petit
        carré du menu passe inaperçu. Sélecteur de photos standard (aucun plugin natif). */}
    {/* ── Invite tes amies — s'ouvre PAR-DESSUS, se ferme ou mène au partage ──────
        Demande de Stéphanie, 16 août 2026. Deux issues seulement, jamais de cul-de-sac
        (leçon de l'écran noir du 7 août) : « Partager » ou « Plus tard ». Le partage
        ouvre la feuille du téléphone — pas une page web, donc aucun risque d'écran noir. */}
    {/* ── « J'y vais » sans compte ────────────────────────────────────────────
        On ne renvoie plus vers un écran de connexion muet : on dit ce que le compte
        APPORTE, avec les mots de Stéphanie. Et l'intention est retenue — la sortie
        sera cochée toute seule une fois le compte créé. */}
    {goingEnAttente !== null && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}
           onClick={() => { setGoingEnAttente(null); track("going_nudge_ferme"); }}>
        <div onClick={e => e.stopPropagation()}
             style={{ position: "relative", background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <button
            aria-label={lang === "en" ? "Close" : "Fermer"}
            onClick={() => { setGoingEnAttente(null); track("going_nudge_ferme"); }}
            style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%",
                     background: "#fff", border: "1px solid #7B2D26", cursor: "pointer",
                     fontSize: 17, color: "#0F1D3A", lineHeight: 1, padding: 0,
                     display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Say you are going" : "Dis que tu y vas"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Create your account and your friends will see it — they can join you there."
              : "Crée ton compte et tes amis le verront : ils pourront t'y rejoindre."}
          </div>
          <button
            onClick={() => { track("going_nudge_vers_inscription"); setGoingEnAttente(null); setShowAuth(true); }}
            style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, boxSizing: "border-box" }}>
            {lang === "en" ? "Create my account" : "Créer mon compte"}
          </button>
        </div>
      </div>
    )}
    {showInviteNudge && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}
           onClick={() => {
             // Fin du geste qui a lancé l'app : on ne referme pas ce qui vient d'apparaître.
             if (Date.now() - nudgeOuvertA.current < 700) return;
             setShowInviteNudge(false); track("invite_nudge_ferme");
           }}>
        <div onClick={e => e.stopPropagation()}
             style={{ position: "relative", background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <button
            aria-label={lang === "en" ? "Close" : "Fermer"}
            onClick={() => { setShowInviteNudge(false); track("invite_nudge_ferme"); }}
            style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: "50%",
                     background: "#fff", border: "1px solid #7B2D26", cursor: "pointer",
                     fontSize: 17, color: "#0F1D3A", lineHeight: 1, padding: 0,
                     display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {auth.user
              ? (lang === "en" ? "See where your friends go" : "Vois où sortent tes amis")
              : (lang === "en" ? "See where your friends go" : "Vois où sortent tes amis")}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {auth.user
              ? (lang === "en"
                ? "Invite your friends: you'll see where they go out, and they'll see where you go."
                : "Invite tes amis : tu verras où ils sortent, et ils verront où tu vas.")
              : (lang === "en"
                ? "Your personal link connects them to you — you'll see where your friends go, and they'll see where you go. Creating your account takes 30 seconds."
                : "Ton lien personnel les connecte à toi : tu verras où sortent tes amis, et eux où tu vas. Créer ton compte prend 30 secondes.")}
          </div>
          <button
            onClick={async () => {
              if (!auth.user) {
                track("invite_nudge_vers_inscription");
                setShowInviteNudge(false);
                setShowAuth(true);
                return;
              }
              const r = await partagerInvitation(auth.profile?.invite_code, lang);
              track("invite_nudge_partage", { resultat: r });
              if (r !== "sans-code") setShowInviteNudge(false);
            }}
            style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, boxSizing: "border-box" }}>
            {auth.user
              ? (lang === "en" ? "Share with my friends" : "Partager à mes amis")
              : (lang === "en" ? "Create my account and share" : "Créer mon compte et partager")}
          </button>
        </div>
      </div>
    )}
    {showPhotoNudge && auth.user && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <label htmlFor="mo-avatar-nudge" style={{ display: "block", width: 72, margin: "0 auto 12px", cursor: "pointer" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", border: "1px solid rgba(15,29,58,0.25)",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#9AA0AE", fontSize: 20, fontFamily: "'Lato', sans-serif",
            }}>＋</div>
          </label>
          <input
            id="mo-avatar-nudge" type="file" accept="image/*" style={{ display: "none" }}
            onChange={async e => {
              const f = e.target.files?.[0]; e.target.value = "";
              if (!f) return;
              try {
                const url = await fichierVersAvatar(f);
                await auth.saveProfile(auth.profile?.display_name || "", undefined, url);
                track("photo_added");
                setShowPhotoNudge(false);
              } catch { /* photo illisible : on laisse le message ouvert */ }
            }}
          />
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Add your photo" : "Ajoute ta photo"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Your friends will recognise you on the outings you're going to."
              : "Tes amis te reconnaîtront sur les sorties où tu vas."}
          </div>
          <label htmlFor="mo-avatar-nudge" style={{ display: "block", width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, boxSizing: "border-box" }}>
            {lang === "en" ? "Choose my photo" : "Choisir ma photo"}
          </label>
          <button onClick={() => { setShowPhotoNudge(false); track("photo_later"); }} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {showFavNudge && !auth.user && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>❤️</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Keep your favourites" : "Garde tes favoris"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Create your account to keep your favourite outings — even on a new phone — and see the ones your friends are going to."
              : "Crée ton compte pour retrouver tes sorties favorites même en changeant de téléphone — et voir celles de tes amis."}
          </div>
          <button onClick={() => { setShowFavNudge(false); setShowAuth(true); }} style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "en" ? "Create my account" : "Créer mon compte"}
          </button>
          <button onClick={() => setShowFavNudge(false)} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {/* Petit message maison AVANT la demande iOS de notifications (meilleure acceptation) */}
    {showNotifPrompt && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, marginTop: 4, letterSpacing: 0.5 }}>
            {lang === "en" ? "Never miss a great outing" : "Ne rate aucune belle sortie"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "A reminder of the outings not to miss, right on your phone."
              : "Un rappel des sorties à ne pas manquer, direct sur ton téléphone."}
          </div>
          <button onClick={acceptNotif} style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "en" ? "Yes, notify me" : "Oui, préviens-moi"}
          </button>
          <button onClick={() => { setShowNotifPrompt(false); track("notif_later"); }} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {/* Bannière in-app browser (WhatsApp/Instagram) : invite reçue mais session absente */}
    {/* Invitation reçue, ouverte dans un vrai navigateur sur téléphone : la personne
        n'a pas l'app. On la lui propose, sans l'y forcer, et on garde son code
        affiché en clair pour qu'elle puisse le saisir après installation. */}
    {showInstallInvite && (
      <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(15,29,58,0.55)", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: "100%", background: "#FFFDF7", borderRadius: "16px 16px 0 0", padding: "26px 24px 34px", textAlign: "center", borderTop: "1px solid #7B2D26" }}>
          <div style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700, fontSize: 40, color: "#0F1D3A", lineHeight: 1 }}>M</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: 1, color: "#0F1D3A", marginTop: 12, marginBottom: 8 }}>
            {inviterName
              ? (lang === "en" ? `${inviterName} invites you to Monac'Out` : `${inviterName} t'invite sur Monac'Out`)
              : (lang === "en" ? "You're invited to Monac'Out" : "Tu es invité·e sur Monac'Out")}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#4A5568", lineHeight: 1.6, marginBottom: 18 }}>
            {lang === "en"
              ? "Everything happening in Monaco, in one app. Free."
              : "Tout ce qui se passe à Monaco, dans une seule appli. Gratuite."}
          </div>
          <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer"
             onClick={() => track("invite_install_clic")}
             style={{ display: "block", width: "100%", padding: 13, background: "#0F1D3A", color: "#fff", borderRadius: 3, textDecoration: "none", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", boxSizing: "border-box" }}>
            {lang === "en" ? "Get the app — free" : "Installer l'app — gratuit"}
          </a>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#6A7080", marginTop: 14, lineHeight: 1.6 }}>
            {lang === "en" ? "Your invite code:" : "Ton code d'invitation :"}{" "}
            <b style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, letterSpacing: 3, color: "#7B2D26" }}>{codeInvitation.toUpperCase()}</b>
            <br />
            {lang === "en" ? "Enter it in My Circle after installing." : "À saisir dans Mon Cercle après l'installation."}
          </div>
          {/* Pas de « continuer sur le site » : décision de Stéphanie le 9 août 2026,
              elle veut que le lien mène à l'app. Une petite croix discrète reste,
              volontairement : un écran sans aucune issue est ce qui a produit la
              page noire du 7 août, et on ne piège personne. */}
          <button onClick={() => { setShowInstallInvite(false); track("invite_web_ferme"); }}
                  aria-label={lang === "en" ? "Close" : "Fermer"}
                  style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", color: "#B8BEC6", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
      </div>
    )}

    {showInAppBanner && (
      <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", background: "#fff", borderRadius: "16px 16px 0 0", padding: "28px 24px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔗</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F1D3A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {inviterName ? `${inviterName} t'invite sur Monac'Out !` : "Invitation Monac'Out"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#4A5568", lineHeight: 1.6, marginBottom: 20 }}>
            {lang === "en"
              ? "Open this link in Safari so you can connect with your friend."
              : "Pour vous connecter, ouvre ce lien dans Safari.\nAppuie sur ⋯ puis « Ouvrir dans Safari »."}
          </div>
          <button
            onClick={() => { window.open(window.location.origin + "?invite=" + (localStorage.getItem("monacout_pending_invite") || ""), "_blank"); }}
            style={{ width: "100%", padding: "14px 0", background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 4, fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
          >
            {lang === "en" ? "Open in Safari" : "Ouvrir dans Safari"}
          </button>
          <button onClick={() => setShowInAppBanner(false)} style={{ background: "none", border: "none", color: "#9AA0A6", fontFamily: "'Lato', sans-serif", fontSize: 13, cursor: "pointer" }}>
            {lang === "en" ? "Dismiss" : "Ignorer"}
          </button>
        </div>
      </div>
    )}

    {/* Confirmation d'ajout d'ami via lien */}
    {inviteToast && (
      <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 3000, background: "#0F1D3A", color: "#fff", padding: "12px 20px", borderRadius: 6, fontFamily: "'Lato', sans-serif", fontSize: 13, boxShadow: "0 6px 24px rgba(0,0,0,0.3)", maxWidth: "85%", textAlign: "center" }}>
        {inviteToast}
      </div>
    )}

    {/* Bandeau discret « mise à jour disponible » (piloté par notif-config.json) */}
    {updateAvailable && (
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 3200, display: "flex", alignItems: "center", gap: 12, background: "#FFFDF7", border: "1px solid #7B2D26", borderRadius: 8, padding: "10px 12px 10px 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.22)", maxWidth: "88%" }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12.5, color: "#0F1D3A", lineHeight: 1.4 }}>
          {lang === "en" ? "A new version is available." : "Une nouvelle version est disponible."}
        </div>
        <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer"
          style={{ flexShrink: 0, background: "#0F1D3A", color: "#fff", textDecoration: "none", padding: "8px 14px", borderRadius: 4, fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          {lang === "en" ? "Update" : "Mettre à jour"}
        </a>
        <button onClick={() => {
          const latest = notifConfig?.latestVersion;
          if (latest) localStorage.setItem("monacout_update_dismissed", String(latest));
          setUpdateAvailable(false);
        }} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6A7080", lineHeight: 1, padding: "0 2px" }}>✕</button>
      </div>
    )}

    </>
  );
}

```

## `src/components/AccueilMaquette.jsx`

```jsx
/**
 * 🎯 L'ACCUEIL REFONDU — composition, pas seulement couleurs et polices.
 *
 * Stéphanie, 28 oct 2026 : « Je ne veux pas seulement une modification des
 * couleurs et des polices. Je veux une vraie refonte de la composition
 * visuelle. » Et son objectif, qui tranche tous les arbitrages de ce fichier :
 *
 *   « Sur un même écran iPhone, on puisse déjà voir une belle photo de Monaco
 *     et deux ou trois propositions de sorties, au lieu d'un seul grand bloc
 *     d'expositions. »
 *
 * ── LE BUDGET VERTICAL, QUI DICTE TOUTES LES HAUTEURS ───────────────────────
 * Écran de référence : 390 × 844 pt. En-tête + deux barres de filtres ≈ 190 pt.
 * Reste 654 pt. Le bandeau éditorial en 16:10 fait (390 − 32) × 10/16 ≈ 224 pt,
 * le titre de section 40 pt : il reste ~390 pt, soit DEUX RANGÉES de cartes
 * illustrées 4:3. L'objectif de Stéphanie est donc tenu par construction, pas
 * par chance.
 *
 * ── CE QUI NE SE NÉGOCIE PAS ────────────────────────────────────────────────
 * · Pas de fausse photo, pas de fausse amie, pas de fausse information.
 * · Une photo de LIEU porte la mention « Photo du lieu ». Sans photo autorisée
 *   pour ce lieu précis, on met un fond graphique — jamais l'image d'un autre
 *   endroit, jamais une image « de catégorie ».
 *   🚨 C'est le défaut que Stéphanie a attrapé le 28 oct : l'ancien système
 *   posait UNE IMAGE PAR CATÉGORIE, donc la photo de l'Opéra atterrissait sur
 *   l'Auditorium Rainier III, et des enfants sur un cours de zumba.
 * · Les regroupements (« 7 expositions », « 6 films ») RESTENT — ils sont
 *   utiles quand il y a beaucoup d'événements — mais sous forme éditoriale
 *   compacte, plus en grand bloc blanc qui mange l'écran.
 * · Espacements 8 / 12 / 16 / 24. Zone tactile ≥ 44 pt.
 */
import { useState, useRef } from "react";
import { NUIT, BORDEAU, BLANC, GRIS_LISIBLE as GRIS, SAUGE, OR, SERIF, SANS, RAYON, OMBRE, GRAIN_PHOTO, VOILE_CHAUD, casseNaturelle } from "../lib/theme";
import { mediaDeLaFiche, mediasSansRepetition, photoEditoriale } from "../lib/mediatheque";
import { fondEvenement, iconeEvenement } from "../lib/habillage";
import { FriendAvatars } from "./EventCard";
import { actionDeReservation } from "../lib/reservation";
import { partagerInvitationEvenement, codeValide } from "../lib/invite";
import { track } from "../lib/track";

const GOUTTIERE = 16;
const ECART = 12;

/**
 * 🔴 LE FILET ROUGE AUTOUR DE CHAQUE FICHE.
 * Stéphanie, 28 oct 2026 : « rajoute une ligne rouge fine autour de chaque
 * fiche ». Un trait d'un pixel, dans le bordeaux de la charte : il détache la
 * carte du fond ivoire sans l'alourdir. C'est le retour du cadre, en beaucoup
 * plus discret que celui retiré le matin.
 */
const FILET = `1px solid ${BORDEAU}`;

/* ── Icônes, trait fin ───────────────────────────────────────────────────── */
const Ic = ({ d, c = GRIS, s = 13 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       style={{ display: "block", flexShrink: 0 }}>{d}</svg>
);
const IcHorloge = p => <Ic {...p} d={<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>} />;
const IcCalendrier = p => <Ic {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />;
const IcLieu = p => <Ic {...p} d={<><path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" /><circle cx="12" cy="10" r="2.6" /></>} />;

/** Le cœur en pastille blanche, posé sur l'image. */
function Coeur({ actif, onClick, taille = 28 }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick?.(); }}
            aria-label={actif ? "Retirer des favoris" : "Ajouter aux favoris"}
            style={{
              width: taille, height: taille, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.94)", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 7px rgba(23,36,60,0.18)",
            }}>
      <svg width={taille * 0.5} height={taille * 0.5} viewBox="0 0 24 24"
           fill={actif ? BORDEAU : "none"} stroke={BORDEAU} strokeWidth="2" strokeLinejoin="round">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}

/**
 * ⓘ LE BOUTON D'INFORMATION, sur chaque carte.
 *
 * Stéphanie, 31 oct 2026 : « rajoute un (i) sur chaque fiche ».
 *
 * ⚠️ CE N'EST PAS LE RETOUR DU « ⓘ » SUPPRIMÉ EN v0.0.134. Celui-là était un
 * CARACTÈRE collé à la fin de chaque titre par `gen-events-json` : il salissait
 * les données, se retrouvait dans les partages et dans la recherche, et on ne
 * pouvait pas le toucher. Ici c'est un vrai bouton d'interface, posé à côté du
 * cœur, et les titres restent propres.
 *
 * Il ouvre la FICHE DÉTAILLÉE. C'est surtout utile sur les cartes à annuaire :
 * depuis le 11 octobre, toucher « 19 TERRASSES » déplie la liste au lieu
 * d'ouvrir la fiche — le détail (description, téléphone, partage) n'était donc
 * plus atteignable du tout. Le (i) rouvre ce chemin sans reprendre le geste du
 * dépliage.
 */
function BoutonInfo({ onClick, taille = 26 }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick?.(); }}
            aria-label="Voir le détail"
            style={{
              width: taille, height: taille, borderRadius: "50%", border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.94)", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 7px rgba(23,36,60,0.18)",
            }}>
      <svg width={taille * 0.62} height={taille * 0.62} viewBox="0 0 24 24"
           fill="none" stroke={BORDEAU} strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9.2" />
        <path d="M12 11v5.4" />
        <path d="M12 7.6v0.1" strokeWidth="2.6" />
      </svg>
    </button>
  );
}

/**
 * La pastille de catégorie.
 *
 * 🎨 UNE SEULE PALETTE POUR TOUTES LES CARTES. Stéphanie, 28 oct 2026 : « les
 * fonds violet vif, vert foncé, rouge et jaune donnent un effet catalogue de
 * catégories, alors que Monac'Out doit avoir une identité beaucoup plus
 * élégante et cohérente ».
 *
 * La couleur par famille (`couleurCat`) ne sort donc plus sur les cartes : la
 * pastille est blanche, le texte en bleu nuit. `src/lib/couleurs.js` reste en
 * place — il sert encore ailleurs — mais il ne pilote plus l'habillage.
 */
function PastilleCat({ cat }) {
  return (
    <span style={{
      // 🔎 11 px ET NON 8,5. Stéphanie, 31 oct 2026 : « je voudrais que les
      // titres ateliers, conférence etc. ressortent plus ».
      // Le contraste n'était pas en cause — bleu nuit sur pastille blanche fait
      // 15,6:1, très au-dessus de la norme. C'était la TAILLE : 8,5 px, le plus
      // petit texte de toute l'interface, plus petit que l'heure (11,5) et que
      // le lieu, et posé sur une photo par-dessus le marché.
      // On ne touche donc ni à la couleur ni à la pastille : juste la taille,
      // et l'interligne qui va avec.
      display: "inline-block", padding: "5px 11px", borderRadius: RAYON.pastille,
      background: "rgba(255,255,255,0.94)", color: NUIT,
      fontFamily: SANS, fontSize: 11, fontWeight: 800, lineHeight: 1,
      letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap",
      boxShadow: "0 2px 7px rgba(21,38,59,0.16)",
    }}>{cat}</span>
  );
}

/**
 * L'ACTION PRINCIPALE d'une carte : « Réserver une place / une table ».
 * ⚠️ Elle n'apparaît QUE si la réservation existe vraiment (règle 30 : pas de
 * bouton sans page vérifiée cadrable, le téléphone restant un vrai moyen de
 * réserver). Une foire ou une messe n'en a pas, et c'est voulu.
 */
function BoutonResa({ event, lang, onReserver, compact = false }) {
  const a = actionDeReservation(event, event?.cat, lang);
  if (!a) return null;
  const toucher = e => {
    e.stopPropagation();
    // 📊 Sans cette ligne le bouton est muet — leçon du 27 oct, où 9 030 boutons
    // avaient été posés sans qu'aucun n'envoie de signal.
    track("reservation_clic", { mode: a.mode, cat: event?.cat, lieu: event?.subtitle });

    // 🚨 LE DÉFAUT DU 29 OCT : « les liens réserver buguent et ramènent au début
    // de l'app ». `actionDeReservation` rend `{ mode:"tel", tel }` — il n'y a
    // PAS de champ `url` dans ce cas. J'écrivais `window.location.href = a.url`,
    // donc `href = undefined`, donc l'app partait sur `/undefined` et se
    // rechargeait à l'accueil. Et le mode `tel` est le plus fréquent : c'est le
    // moyen de réserver dans la moitié des lieux de Monaco.
    // ⚠️ `tel:` est sûr (il ouvre le composeur, pas une page) — contrairement à
    // `target="_blank"`, qui avait produit l'écran noir du 7 août.
    if (a.mode === "tel") { window.location.href = `tel:${a.tel}`; return; }

    if (!a.url) return;          // ceinture : jamais de navigation à vide
    onReserver?.(a.url, event.title?.replace(/\n/g, " "));
  };
  return (
    <button onClick={toucher} style={{
      alignSelf: "flex-start", marginTop: 2,
      background: "none", border: "none", padding: compact ? "2px 0" : "3px 0",
      cursor: "pointer", fontFamily: SANS, fontSize: compact ? 11 : 11.5,
      fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
    }}>{a.mot} →</button>
  );
}


/**
 * 🤝 « INVITE TES AMIS » — à la place des avatars quand personne n'y va encore.
 *
 * Stéphanie, 28 oct 2026 : « quand tu n'as pas d'amis, mets "invite tes amis"
 * et ça partage ton lien d'amitié pour l'event ».
 *
 * Le lien partagé porte l'événement ET le code d'amitié : la personne arrive
 * sur LA bonne fiche, et l'amitié se fait. Un lien d'invitation nu la ferait
 * atterrir sur l'accueil sans savoir de quelle sortie on lui parlait.
 *
 * ⚠️ SANS COMPTE, PAS DE CODE — donc pas d'amitié possible. Le bouton ouvre
 * alors l'inscription plutôt que de partager un lien qui ne relierait personne
 * (le défaut du 7 août, parti en silence avec « … » à la place du code).
 * ⚠️ Rien ne sort de l'app : c'est la feuille de partage du système, pas une
 * page web — aucun risque de l'écran noir du 7 août.
 */
export function InviteTesAmis({ event, lang, inviteCode, onShowAuth, petit = false }) {
  const pret = codeValide(inviteCode);
  const toucher = async (e) => {
    e.stopPropagation();
    if (!pret) { onShowAuth?.(); track("invite_event_sans_compte", { id: event?.id }); return; }
    const r = await partagerInvitationEvenement(inviteCode, event, lang);
    track("invite_event_partage", { id: event?.id, resultat: r });
  };
  return (
    <button onClick={toucher} style={{
      alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 5,
      background: "none", border: "none", padding: petit ? "2px 0" : "3px 0", cursor: "pointer",
      fontFamily: SANS, fontSize: petit ? 11 : 11.5, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BORDEAU}
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
      {lang === "en" ? "Invite your friends" : "Invite tes amis"}
    </button>
  );
}


/**
 * 🏷️ CE QUE DIT UNE PHOTO — désormais dans le TEXTE ALTERNATIF, plus sur l'image.
 *
 * Stéphanie, 28 oct 2026 : « pas besoin de mettre une légende sur la photo ».
 * Le bandeau « Photo du lieu » / « Monte-Carlo — photo du quartier » est donc
 * retiré de l'affichage : il alourdissait chaque vignette et répétait une
 * information que l'on lit déjà sous la carte (le lieu est juste en dessous).
 *
 * ⚠️ MAIS L'INFORMATION N'EST PAS PERDUE. Elle passe dans l'attribut `alt` de
 * l'image : c'est ce que lit VoiceOver, c'est ce qui s'affiche si la photo ne
 * charge pas, et c'est ce qui empêche de faire passer une vue de quartier pour
 * la façade d'un établissement. Une carte de groupe dit toujours que le lieu
 * photographié n'est QU'UN des endroits proposés, et la Foire porte toujours
 * l'année de son édition.
 */
function legendeMedia(media, lang) {
  switch (media.mediaType) {
    case "edition":
      return lang === "en"
        ? `Photo — ${media.edition} edition`
        : `Photo — édition ${media.edition}`;
    case "quartier":
      return lang === "en"
        ? `${media.nomLieu} — area photo`
        : `${media.nomLieu} — photo du quartier`;
    case "theme":
      return lang === "en" ? "Halloween" : "Halloween";
    case "categorie":
      return media.nomLieu
        ? (lang === "en" ? `${media.nomLieu}` : `${media.nomLieu}`)
        : "";
    case "groupe":
      return lang === "en"
        ? `${media.nomLieu} — one of the venues`
        : `${media.nomLieu} — l'un des lieux`;
    default:
      return media.nomLieu
        ? (lang === "en" ? `Venue photo — ${media.nomLieu}` : `Photo du lieu — ${media.nomLieu}`)
        : (lang === "en" ? "Venue photo" : "Photo du lieu");
  }
}

/**
 * Le visuel d'une fiche. Ordre imposé par le brief :
 * photo d'événement → photo du LIEU EXACT (étiquetée) → fond graphique.
 * `ratio` en pourcentage de padding-top : 75 % = 4:3, 62.5 % = 16:10.
 */
function Visuel({ event, ratio = 75, arrondi = 0, lang = "fr", media: fourni = null }) {
  const media = fourni || mediaDeLaFiche(event);
  return (
    <div style={{
      position: "relative", width: "100%", paddingTop: `${ratio}%`,
      background: media ? SAUGE : undefined, borderRadius: arrondi, overflow: "hidden",
      ...(media ? {} : fondEvenement(event)),
    }}>
      {media ? (
        <>
          {/* `loading=lazy` + dimensions déclarées : la place est réservée avant
              l'arrivée de l'image, donc aucun saut de mise en page. */}
          {/* L'`alt` porte la nature exacte de la photo — lieu, l'un des lieux
              d'un groupe, quartier, édition passée — puisque la légende visible
              a été retirée. */}
          {/* 🚑 SI LA PREMIÈRE ADRESSE ÉCHOUE, ON BASCULE SUR LA SECONDE.
              Le 31 oct, un hôte a répondu 403 à tout pendant une heure et les
              photos ont disparu sans que l'app puisse rien y faire. Désormais
              chaque image a un second hôte, et le basculement est silencieux.
              ⚠️ Une seule tentative (`dejaBascule`) : sans ce garde-fou, une
              image vraiment absente ferait boucler les deux adresses à
              l'infini. */}
          <img src={media.src} alt={legendeMedia(media, lang)} loading="lazy" decoding="async"
               onError={e => {
                 const img = e.currentTarget;
                 if (img.dataset.dejaBascule || !media.secours) return;
                 img.dataset.dejaBascule = "1";
                 img.src = media.secours;
               }}
               width={media.width} height={media.height}
               style={{
                 position: "absolute", inset: 0, width: "100%", height: "100%",
                 objectFit: "cover", display: "block",
                 filter: GRAIN_PHOTO,
               }} />
          {/* Le voile champagne : c'est lui qui donne le même ton doré à des
              photos prises par des gens différents, à des saisons différentes. */}
          <span aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", ...VOILE_CHAUD }} />
        </>
      ) : (
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, opacity: 0.28, lineHeight: 1,
        }}>{iconeEvenement(event)}</span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4 · LE BANDEAU ÉDITORIAL — grande photo de Monaco, texte SUR l'image.
   ══════════════════════════════════════════════════════════════════════════ */
export function BandeauEditorial({ lang, nbSorties }) {
  const photo = photoEditoriale();
  if (!photo) return null;
  return (
    <div style={{
      margin: `16px ${GOUTTIERE}px 0`, position: "relative",
      borderRadius: RAYON.md, overflow: "hidden", boxShadow: OMBRE.carte, background: NUIT,
    }}>
      {/* 16:10 — (390 − 32) × 10/16 ≈ 224 pt, assez grand pour être beau, assez
          court pour laisser deux rangées de sorties sur le même écran. */}
      <div style={{ width: "100%", paddingTop: "62.5%", position: "relative" }}>
        <img src={photo.src} alt={photo.alt} loading="eager" decoding="async"
             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(10,16,28,0) 42%, rgba(10,16,28,0.82) 100%)",
      }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
        <div style={{ width: 32, height: 2, background: OR, borderRadius: 2, marginBottom: 9 }} />
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, color: "#FFFFFF", lineHeight: 1.15 }}>
          {lang === "en" ? "Monaco, today" : "Monaco, aujourd'hui"}
        </div>
        {/* ⚠️ Un chiffre RÉEL, compté sur les fiches affichées. Rien d'inventé. */}
        {nbSorties > 0 && (
          <div style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.88)", marginTop: 4 }}>
            {lang === "en"
              ? `${nbSorties} outing${nbSorties > 1 ? "s" : ""} to choose from`
              : `${nbSorties} sortie${nbSorties > 1 ? "s" : ""} à choisir`}
          </div>
        )}
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   5 · LE HERO — téléphone de GAUCHE de la maquette, carte du haut.
   Stéphanie, 28 oct 2026 : « tu peux faire exactement comme ça, à 100 % pareil ».
   Critère n° 3 du brief : « le titre et le CTA sont SUR l'image du hero, pas
   sous un rectangle vide ».
   ══════════════════════════════════════════════════════════════════════════ */
function Hero({ event, lang, favorites, onToggleFav, onCardClick, amis, onReserver, inviteCode, onShowAuth, media = null }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").trim();
  return (
    <div onClick={() => onCardClick?.(event)} style={{
      position: "relative", borderRadius: RAYON.md, overflow: "hidden",
      boxShadow: OMBRE.carte, cursor: "pointer", background: NUIT, border: FILET,
    }}>
      {/* ~272 pt de haut en largeur 358 : la fourchette 270–300 pt du brief. */}
      <Visuel event={event} ratio={76} lang={lang} media={media} />

      {/* Sans ce dégradé, un ciel clair avalerait le titre blanc. */}
      <div style={{
        position: "absolute", inset: 0,
        /* ⚠️ Assombri le 28 oct : sur la photo de la foire — manèges éclairés,
           ciel bleu vif — le titre blanc se perdait dans les couleurs. Le
           dégradé démarre donc plus haut et plus fort. */
        background: "linear-gradient(180deg, rgba(10,16,28,0.34) 0%, rgba(10,16,28,0.08) 24%, rgba(10,16,28,0.62) 50%, rgba(10,16,28,0.95) 100%)",
      }} />

      <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <PastilleCat cat={event.cat} />
        <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={36} />
      </div>

      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
        <div style={{ width: 34, height: 2, background: OR, borderRadius: 2, marginBottom: 10 }} />
        <h2 style={{
          margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 25, lineHeight: 1.16,
          color: "#FFFFFF", letterSpacing: -0.2,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9 }}>
          <IcCalendrier c="rgba(255,255,255,0.9)" s={14} />
          <span style={{
            fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.93)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{event.time ? `${event.time} · ${lieu}` : lieu}</span>
        </div>

        {/* ⚠️ Uniquement si des amies y vont VRAIMENT — rien n'est simulé.
            Sinon on PROPOSE d'en inviter, plutôt que de laisser un vide. */}
        {amis?.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 12.5, color: "rgba(255,255,255,0.93)" }}>
              {amis.length === 1
                ? (lang === "en" ? "1 friend is going" : "1 amie y va")
                : (lang === "en" ? `${amis.length} friends are going` : `${amis.length} amies y vont`)}
            </span>
          </div>
        ) : (
          <div style={{ marginTop: 9 }}>
            {/* Sur la photo, le bordeaux ne se lirait pas : ici le lien est blanc. */}
            <span style={{ display: "inline-block", filter: "brightness(0) invert(1)" }}>
              <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} />
            </span>
          </div>
        )}

        <button onClick={e => { e.stopPropagation(); onCardClick?.(event); }} style={{
          marginTop: 13, width: "100%", minHeight: 46,
          background: BORDEAU, color: "#FFFFFF", border: "none",
          borderRadius: RAYON.pastille, cursor: "pointer",
          fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
        }}>
          {lang === "en" ? "See the event" : "Voir l'événement"}
          <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Le carrousel de heros + ses points.
 * ⚠️ Les points n'apparaissent QUE s'il y a vraiment plusieurs fiches à faire
 * défiler — le brief l'exige (« uniquement si carrousel réel »).
 */
export function CarrouselHero({ fiches, lang, favorites, onToggleFav, onCardClick, social, onReserver, inviteCode, onShowAuth }) {
  const [actif, setActif] = useState(0);
  const ref = useRef(null);
  // On fait défiler quatre heros : deux vues identiques à la suite donneraient
  // l'impression que le carrousel ne bouge pas.
  const medias = mediasSansRepetition(fiches || []);
  if (!fiches?.length) return null;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== actif) setActif(i);
  };
  return (
    <div style={{ marginTop: 16 }}>
      <div ref={ref} onScroll={onScroll} style={{
        display: "flex", overflowX: "auto", scrollSnapType: "x mandatory",
        scrollbarWidth: "none", touchAction: "pan-x", overscrollBehaviorX: "contain",
      }}>
        {fiches.map((e, i) => (
          <div key={e.cleFil || e.id} style={{
            flex: "0 0 100%", scrollSnapAlign: "start",
            padding: `0 ${GOUTTIERE}px`, boxSizing: "border-box",
          }}>
            <Hero event={e} lang={lang} media={medias[i]} favorites={favorites} onToggleFav={onToggleFav}
                  onCardClick={onCardClick} onReserver={onReserver}
                  inviteCode={inviteCode} onShowAuth={onShowAuth}
                  amis={social && !e.ongoing ? social.friendsGoingTo(e.id) : []} />
          </div>
        ))}
      </div>
      {fiches.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 11 }}>
          {fiches.map((_, i) => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: i === actif ? BORDEAU : "rgba(23,36,60,0.18)", transition: "background .2s",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LE TITRE DE SECTION — serif + filet fin + « Tout voir »
   ══════════════════════════════════════════════════════════════════════════ */
export function TitreSection({ titre, onToutVoir, lang }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: `0 ${GOUTTIERE}px`, marginTop: 24, marginBottom: 12 }}>
      <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: NUIT, whiteSpace: "nowrap" }}>{titre}</h3>
      <div style={{ flex: 1, height: 1, background: "rgba(184,156,104,0.5)" }} />
      {onToutVoir && (
        <button onClick={onToutVoir} style={{
          background: "none", border: "none", cursor: "pointer", padding: "4px 0",
          fontFamily: SANS, fontSize: 12, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
        }}>{lang === "en" ? "See all →" : "Tout voir →"}</button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   6 · LA CARTE ILLUSTRÉE — 4:3, deux par rangée (173 pt en largeur 390).
   ══════════════════════════════════════════════════════════════════════════ */
function CarteIllustree({ event, lang, favorites, onToggleFav, onCardClick, amis, onReserver, inviteCode, onShowAuth, media = null, onInfos = null, infosDepliees = false, nbLieux = 0 }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").split("·")[0].trim();
  return (
    /* 🗂️ UNE FICHE À ANNUAIRE SE DÉPLIE, ELLE N'OUVRE PAS DE FENÊTRE.
       Stéphanie, 28 oct 2026 : « quand je clique sur Ateliers 4 thèmes Espace
       Lamartine j'ai une fenêtre qui s'ouvre comme avant, pas en sous-fiche ».
       C'est la règle posée le 11 oct (« INFOS déplie partout ») : toucher la
       carte doit poser ses lieux SOUS elle. J'avais laissé le clic de la carte
       sur `onCardClick`, donc la fenêtre revenait malgré le bouton « Voir les N ». */
    <div onClick={() => (onInfos ? onInfos() : onCardClick?.(event))} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden",
      boxShadow: OMBRE.carte, cursor: "pointer", border: FILET,
      display: "flex", flexDirection: "column", height: "100%",
    }}>
      <div style={{ position: "relative" }}>
        <Visuel event={event} ratio={75} lang={lang} media={media} />
        <div style={{ position: "absolute", top: 7, left: 7, right: 7, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <PastilleCat cat={event.cat} />
          <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={26} />
        </div>
        {/* ⓘ EN BAS À DROITE DE LA PHOTO, ET NON À CÔTÉ DU CŒUR.
            Mesuré avant de poser : la carte fait 173 pt, moins 14 de marges il
            reste 159. Depuis que l'étiquette est à 11 px, « EXPOSITION » —
            385 fiches, le cas courant — occupe environ 102 pt ; deux boutons de
            26 pt et leur écart en prennent 58. 160 pt pour 159 disponibles :
            l'étiquette aurait débordé ou se serait coupée sur la carte la plus
            fréquente de l'app. En bas, le (i) ne gêne personne. */}
        <div style={{ position: "absolute", bottom: 7, right: 7 }}>
          <BoutonInfo onClick={() => onCardClick?.(event)} taille={26} />
        </div>
      </div>
      <div style={{ padding: "9px 10px 11px", display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
        <h4 style={{
          margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: NUIT,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h4>
        {event.time && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IcHorloge s={12} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.time}</span>
          </div>
        )}
        {lieu && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IcLieu s={12} />
            <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lieu}</span>
          </div>
        )}
        {amis?.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 11, color: GRIS }}>
              {amis.length === 1 ? (lang === "en" ? "1 friend" : "1 amie") : `${amis.length} ${lang === "en" ? "friends" : "amies"}`}
            </span>
          </div>
        ) : (
          <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} petit />
        )}
        <div style={{ marginTop: "auto" }}>
          {onInfos ? (
            <button onClick={e => { e.stopPropagation(); onInfos(); }} style={{
              background: "none", border: "none", padding: "2px 0", cursor: "pointer",
              fontFamily: SANS, fontSize: 11, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
            }}>
              {infosDepliees
                ? (lang === "en" ? "Close" : "Replier")
                : (lang === "en" ? `See the ${nbLieux} →` : `Voir les ${nbLieux} →`)}
            </button>
          ) : (
            <BoutonResa event={event} lang={lang} onReserver={onReserver} compact />
          )}
        </div>
      </div>
    </div>
  );
}

/** La grille deux colonnes : gouttière 16, écart 12 → 173 pt par carte. */
export function GrilleDeuxColonnes({ fiches, lang, favorites, onToggleFav, onCardClick, social, onReserver, inviteCode, onShowAuth, recents }) {
  if (!fiches?.length) return null;
  // 🔁 Les photos sont résolues POUR TOUTE LA GRILLE, dans l'ordre d'affichage :
  // c'est la seule façon d'éviter deux fois la même vue côte à côte.
  const medias = mediasSansRepetition(fiches, recents);
  return (
    /* ⚠️ `stretch` ET NON `start`. Stéphanie, 28 oct 2026 : « toutes les fiches
       doivent avoir la même taille ». Avec `start`, une carte sans bouton
       « Réserver » était plus courte que sa voisine et la rangée penchait. Les
       deux colonnes font désormais la hauteur de la plus haute, et le bloc de
       texte pousse son contenu vers le bas. */
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ECART, padding: `0 ${GOUTTIERE}px`, alignItems: "stretch" }}>
      {fiches.map((e, i) => (
        <CarteIllustree key={e.cleFil || e.id} event={e} lang={lang} media={medias[i]}
                        favorites={favorites} onToggleFav={onToggleFav} onCardClick={onCardClick}
                        onReserver={onReserver} inviteCode={inviteCode} onShowAuth={onShowAuth}
                        onInfos={e._onInfos || null} infosDepliees={!!e._deplie} nbLieux={e._nbLieux || 0}
                        amis={social && !e.ongoing ? social.friendsGoingTo(e.id) : []} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5 · LA CARTE COMPACTE EN RANGÉE — ~86 pt de haut, vignette 4:3 à gauche.
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * La carte compacte en rangée. Avec `onInfos`, elle sert aussi de fiche-mère
 * d'annuaire (« MUSÉES · 6 OUVERTS ») : elle porte alors « Voir les N » au lieu
 * d'un bouton de réservation, et se déplie en sous-fiches comme avant.
 * ⚠️ Hauteur visée 120–170 pt comme le demande le brief : la vignette fait 92 pt
 * de large en 4:3, donc 69 pt, et la carte tient autour de 86 pt.
 */
export function CarteRangee({ event, lang, favorites, onToggleFav, onCardClick, social, onReserver, onInfos = null, infosDepliees = false, nbLieux = 0, inviteCode, onShowAuth, recents }) {
  const fav = favorites?.includes(event.id);
  const lieu = String(event.subtitle || "").split("·")[0].trim();
  const amis = social && !event.ongoing ? social.friendsGoingTo(event.id) : [];
  return (
    <div onClick={() => onCardClick?.(event)} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden", boxShadow: OMBRE.carte,
      cursor: "pointer", display: "flex", gap: 11, padding: 8, marginBottom: ECART, border: FILET,
    }}>
      <div style={{ width: 92, flexShrink: 0, position: "relative" }}>
        <Visuel event={event} ratio={75} arrondi={9} lang={lang} media={mediasSansRepetition([event], recents)[0]} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4, paddingRight: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <h4 style={{
            flex: 1, margin: 0, fontFamily: SERIF, fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: NUIT,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{casseNaturelle(event.title?.replace(/\n/g, " "))}</h4>
          <BoutonInfo onClick={() => onCardClick?.(event)} taille={26} />
          <Coeur actif={fav} onClick={() => onToggleFav?.(event.id)} taille={26} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {event.time && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <IcHorloge s={12} />
              <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS }}>{event.time}</span>
            </span>
          )}
          {lieu && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, minWidth: 0 }}>
              <IcLieu s={12} />
              <span style={{ fontFamily: SANS, fontSize: 11.5, color: GRIS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lieu}</span>
            </span>
          )}
        </div>
        {amis.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FriendAvatars friends={amis} />
            <span style={{ fontFamily: SANS, fontSize: 11, color: GRIS }}>
              {amis.length === 1 ? (lang === "en" ? "1 friend is going" : "1 amie y va") : `${amis.length} ${lang === "en" ? "friends are going" : "amies y vont"}`}
            </span>
          </div>
        ) : !onInfos ? (
          /* Une fiche-mère d'annuaire porte déjà « Voir les N » : on ne lui
             ajoute pas un second lien, la bande déborderait. */
          <InviteTesAmis event={event} lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} petit />
        ) : null}
        {onInfos ? (
          <button onClick={e => { e.stopPropagation(); onInfos(); }} style={{
            alignSelf: "flex-start", marginTop: 2, background: "none", border: "none",
            padding: "3px 0", cursor: "pointer", fontFamily: SANS, fontSize: 11.5,
            fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap",
          }}>
            {infosDepliees
              ? (lang === "en" ? "Close" : "Replier")
              : (lang === "en" ? `See the ${nbLieux} →` : `Voir les ${nbLieux} →`)}
          </button>
        ) : (
          <BoutonResa event={event} lang={lang} onReserver={onReserver} />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LE REGROUPEMENT COMPACT — « 7 expositions », « 6 films »…
   Stéphanie : « ne pas les supprimer, ils sont utiles quand tu as beaucoup
   d'événements. Il faut simplement les rendre moins imposants et mieux
   intégrés aux photos. » D'où cette bande basse (~76 pt) où la photo du
   PREMIER lieu reconnu sert de vignette, et où les suivants sont cités.
   ══════════════════════════════════════════════════════════════════════════ */
export function BandeRegroupement({ fiches, cat, lang, deplie, onBasculer, recents }) {
  if (!fiches?.length) return null;
  const n = fiches.length;
  // La vignette vient d'une fiche du groupe qui a VRAIMENT une photo de son
  // lieu ; à défaut, l'habillage de la première. On n'illustre pas un groupe
  // avec la photo d'un lieu qui n'en fait pas partie.
  // 🔁 La bande passe par le MÊME registre que les grilles : sans ça, sa
  // vignette reprenait la photo de la carte juste au-dessus.
  const avecPhoto = fiches.find(f => mediaDeLaFiche(f)) || fiches[0];
  const mediaBande = mediasSansRepetition([avecPhoto], recents)[0];
  const noms = fiches.slice(0, 2).map(f => casseNaturelle(f.title?.replace(/\n/g, " "))).join(" · ");
  return (
    <div onClick={onBasculer} style={{
      background: BLANC, borderRadius: RAYON.sm, overflow: "hidden", boxShadow: OMBRE.carte,
      cursor: "pointer", display: "flex", gap: 11, padding: 8, marginBottom: ECART,
      border: FILET,
      borderLeft: `3px solid ${OR}`,   // champagne : la seule touche de couleur
    }}>
      <div style={{ width: 82, flexShrink: 0 }}>
        <Visuel event={avecPhoto} ratio={75} arrondi={9} lang={lang} media={mediaBande} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
        <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: BORDEAU }}>{cat}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 15.5, color: NUIT, lineHeight: 1.2 }}>
          {lang === "en" ? `${n} to see today` : `${n} à voir aujourd'hui`}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 11, color: GRIS, lineHeight: 1.3,
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{noms}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", paddingRight: 4 }}>
        <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: BORDEAU, whiteSpace: "nowrap" }}>
          {deplie ? (lang === "en" ? "Close" : "Replier") : (lang === "en" ? `See ${n} →` : `Voir les ${n} →`)}
        </span>
      </div>
    </div>
  );
}

```

## `src/components/BandeauWeb.jsx`

```jsx
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { track } from "../lib/track";

// ── BANDEAU DU SITE — « Regarde où vont tes amis ce soir. » ────────────────────
//
// Il ne s'affiche QUE sur le site, jamais dans l'app installée : c'est un lien
// sortant, et un lien sortant dans l'app native produit l'écran noir du 7 août.
//
// Pourquoi il est PERMANENT, sans délai ni compteur. Relevé du 22 août 2026 :
// 53 visiteurs iPhone du site en 30 jours, 31 sont restés plus de 8 secondes,
// et seulement 3 ont vu la proposition d'installer l'app. La carte existante
// attend 8 s ET que l'écran de bienvenue soit passé — les deux conditions se
// cumulaient et personne n'arrivait au bout. Ici : rien à attendre.
//
// La croix ne mémorise rien volontairement : elle referme le bandeau pour la
// visite en cours et il revient à la suivante. On propose, on n'enferme personne.

const NAVY = "#0F1D3A";
const GOLD_FRAME = "#7B2D26";
const IVORY = "#FFFDF7";
const GREY = "#6A7080";
const SLATE = "#4A5568";

// ⚠️ LIEN SUIVI, pas le lien App Store direct. `/site` est réécrit vers
// public/go.html par vercel.json : la page enregistre le canal (événement
// `lien_suivi`, canal « site ») PUIS redirige vers l'App Store. Une redirection
// n'exécute aucun code et ne compterait rien. Voir le journal du 7 août 2026.
const LIEN_SUIVI = "/site";

// QR de la fiche App Store (id6774785049), tracé en dur pour rester hors ligne
// et sans dépendance. Regénérable : node -e "require('qrcode').toString(URL,…)".
const QR_D = "M0 0.5h7m1 0h1m1 0h1m1 0h1m5 0h4m1 0h1m2 0h7M0 1.5h1m5 0h1m1 0h2m1 0h1m2 0h1m2 0h1m3 0h3m2 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h2m2 0h2m1 0h1m1 0h1m1 0h2m1 0h2m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m2 0h1m3 0h1m2 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m3 0h1m2 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m2 0h1m1 0h1m2 0h3m1 0h1m3 0h1m1 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h1m3 0h1m2 0h5m2 0h3M0 8.5h1m1 0h2m1 0h3m2 0h1m1 0h1m1 0h2m1 0h1m3 0h1m4 0h1m2 0h1m1 0h2M4 9.5h1m2 0h2m1 0h2m1 0h1m2 0h5m1 0h3m1 0h2m1 0h2m1 0h1M0 10.5h1m1 0h2m2 0h4m1 0h3m4 0h1m2 0h5m1 0h3m1 0h2M1 11.5h1m2 0h1m7 0h1m3 0h2m3 0h1m1 0h1m2 0h2m1 0h1m1 0h2M0 12.5h1m3 0h4m1 0h1m1 0h1m2 0h3m3 0h2m2 0h2m1 0h3m1 0h2M1 13.5h4m2 0h1m2 0h1m2 0h2m5 0h1m8 0h1m1 0h1M1 14.5h4m1 0h4m2 0h2m3 0h4m1 0h2m2 0h1m1 0h2M0 15.5h1m3 0h2m1 0h2m6 0h1m5 0h1m1 0h4m2 0h2M0 16.5h2m3 0h2m5 0h2m2 0h1m1 0h1m1 0h3m1 0h3m1 0h3M3 17.5h1m1 0h1m1 0h2m2 0h2m2 0h1m4 0h2m1 0h4m1 0h2m1 0h2M1 18.5h6m1 0h1m2 0h2m2 0h2m1 0h1m2 0h1m2 0h1m1 0h3m1 0h2M0 19.5h2m1 0h1m3 0h1m2 0h2m2 0h1m2 0h3m2 0h2m1 0h2m1 0h1m2 0h1M0 20.5h3m1 0h1m1 0h1m2 0h3m2 0h1m1 0h1m5 0h1m4 0h1m1 0h2m1 0h1M0 21.5h1m1 0h2m3 0h2m2 0h1m2 0h3m3 0h2m1 0h2m1 0h1m3 0h1m1 0h1M2 22.5h3m1 0h3m3 0h1m1 0h2m2 0h3m2 0h1m2 0h2m2 0h3M1 23.5h1m3 0h1m2 0h1m1 0h4m1 0h1m4 0h1m1 0h1m4 0h3M0 24.5h1m1 0h1m3 0h2m3 0h1m2 0h1m2 0h1m1 0h1m2 0h1m1 0h5m3 0h1M8 25.5h2m5 0h2m1 0h4m2 0h1m3 0h2M0 26.5h7m1 0h1m4 0h2m2 0h5m1 0h2m1 0h1m1 0h1M0 27.5h1m5 0h1m1 0h2m3 0h2m1 0h3m1 0h1m2 0h2m3 0h4M0 28.5h1m1 0h3m1 0h1m2 0h1m1 0h8m3 0h7m1 0h2M0 29.5h1m1 0h3m1 0h1m1 0h2m6 0h1m2 0h1m1 0h2m4 0h1m1 0h4M0 30.5h1m1 0h3m1 0h1m1 0h3m3 0h5m1 0h3m1 0h4m1 0h1M0 31.5h1m5 0h1m4 0h1m2 0h1m2 0h1m2 0h1m4 0h4m3 0h1M0 32.5h7m1 0h4m1 0h1m2 0h2m1 0h1m1 0h1m3 0h1m2 0h3";

function QrAppStore({ taille = 46 }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 33 33" shapeRendering="crispEdges"
         role="img" aria-label="QR code vers l'App Store">
      <path fill={IVORY} d="M0 0h33v33H0z" />
      <path stroke={NAVY} d={QR_D} />
    </svg>
  );
}

export default function BandeauWeb({ lang = "fr" }) {
  const [ferme, setFerme] = useState(false);
  const natif = Capacitor.isNativePlatform();
  const ua = typeof navigator === "undefined" ? "" : (navigator.userAgent || "");
  const iOS = /iPhone|iPad|iPod/i.test(ua);
  // ⚠️ Android EXCLU tant que l'app Android n'est pas publiée : envoyer quelqu'un
  // vers l'App Store d'Apple depuis un Android ne mène nulle part.
  const android = /Android/i.test(ua);
  const visible = !natif && !ferme && !android;

  useEffect(() => {
    if (visible) track("bandeau_web_vu", { support: iOS ? "iphone" : "bureau" });
  }, [visible, iOS]);

  if (!visible) return null;

  const titre = lang === "en"
    ? "See where your friends are going tonight."
    : "Regarde où vont tes amis ce soir.";
  const sousTitre = iOS
    ? (lang === "en" ? "The Monac'Out app · free" : "L'app Monac'Out · gratuite")
    : (lang === "en" ? "Scan the code to install the app — free" : "Scanne le code pour installer l'app — gratuite");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 5000,
      background: IVORY,
      borderBottom: `1px solid ${GOLD_FRAME}`,
      boxShadow: "0 1px 8px rgba(15,29,58,0.06)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
      padding: "9px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 620 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700,
            fontSize: 15, color: NAVY, lineHeight: 1.25,
          }}>{titre}</div>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: GREY,
            lineHeight: 1.35, marginTop: 2,
          }}>{sousTitre}</div>
        </div>

        {iOS ? (
          <a href={LIEN_SUIVI}
             onClick={() => track("bandeau_web_clic", { support: "iphone" })}
             style={{
               flexShrink: 0, background: NAVY, color: "#fff", textDecoration: "none",
               fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
               letterSpacing: 1.4, textTransform: "uppercase",
               padding: "9px 14px", borderRadius: 3, whiteSpace: "nowrap",
             }}>
            {lang === "en" ? "Get it" : "Installer"}
          </a>
        ) : (
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <QrAppStore />
            <div style={{
              fontFamily: "'Lato', sans-serif", fontSize: 10.5, color: SLATE,
              lineHeight: 1.35, maxWidth: 88,
            }}>{lang === "en" ? "Scan with your iPhone" : "Scanne avec ton iPhone"}</div>
          </div>
        )}

        <button onClick={() => { setFerme(true); track("bandeau_web_ferme"); }}
                aria-label={lang === "en" ? "Close" : "Fermer"}
                style={{
                  flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                  color: "#B8BEC6", fontSize: 18, lineHeight: 1, padding: 4,
                }}>✕</button>
      </div>
    </div>
  );
}

```

## `src/components/CalendarPicker.jsx`

```jsx
import { useState } from "react";

const GOLD = "#1A2A5A";
const NAVY = "#1A2A4A";
const WHITE = "#FFFFFF";
const GREY = "#6A7A9A";

const JOURS_FR = ["L", "M", "M", "J", "V", "S", "D"];
const JOURS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MOIS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

// inline=true: compact panel with no full-screen wrapper, calls onChange(start, end) immediately on each selection
// inline=false (default): full-screen with header + confirm button, calls onConfirm(start, end) on button click
export default function CalendarPicker({ onClose, onConfirm, onChange, inline = false, lang = "fr", initialStart = null, initialEnd = null }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  const JOURS = lang === "en" ? JOURS_EN : JOURS_FR;
  const MOIS_NOM = lang === "en" ? MOIS_EN : MOIS_FR;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const firstMon = firstDow === 0 ? 6 : firstDow - 1;

  const cells = [];
  for (let i = 0; i < firstMon; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDay(day) {
    if (!day) return;
    const clicked = new Date(year, month, day);

    // Re-cliquer sur le jour déjà choisi l'enlève — demande de Stéphanie,
    // 31 août 2026 : « ça serait mieux de juste recliquer sur la date pour
    // l'enlever ». Elle s'était retrouvée bloquée sur le 11 septembre sans
    // voir le petit « Réinit. » en haut à droite. Une sélection doit toujours
    // se défaire là où elle s'est faite.
    const memeJour = (a, b) => a && b && a.toDateString() === b.toDateString();
    if (memeJour(clicked, start) && !end) {
      setStart(null);
      setEnd(null);
      if (inline) onChange?.(null, null);
      return;
    }

    let newStart, newEnd;
    if (!start || (start && end)) {
      newStart = clicked;
      newEnd = null;
    } else {
      if (clicked < start) {
        newStart = clicked; newEnd = start;
      } else {
        newStart = start; newEnd = clicked;
      }
    }
    setStart(newStart);
    setEnd(newEnd);
    if (inline) onChange?.(newStart, newEnd);
  }

  function handleReset() {
    setStart(null);
    setEnd(null);
    if (inline) onChange?.(null, null);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const grid = (
    <>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15, color: NAVY, fontWeight: "bold" }}>
          {MOIS_NOM[month]} {year}
        </div>
        <button onClick={nextMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {JOURS.map((j, i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: GREY, paddingBottom: 4 }}>{j}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((day, i) => {
          const col = i % 7;
          const isToday = day && sameDay(new Date(year, month, day), today);
          const isStart = day && sameDay(new Date(year, month, day), start);
          const isEnd = day && sameDay(new Date(year, month, day), end);
          const inRange = day && start && end && new Date(year, month, day) > start && new Date(year, month, day) < end;
          return (
            <div
              key={i}
              onClick={() => handleDay(day)}
              style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: day ? "pointer" : "default", position: "relative" }}
            >
              {/* Range strip */}
              {inRange && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: col === 0 ? "50%" : 0, right: col === 6 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* Start strip right */}
              {isStart && end && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "50%", right: col === 6 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* End strip left */}
              {isEnd && start && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "50%", left: col === 0 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* Day circle */}
              {day && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: isStart || isEnd ? GOLD : "transparent",
                  color: isStart || isEnd ? WHITE : NAVY,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "-apple-system, sans-serif", fontSize: 12,
                  fontWeight: isToday ? 700 : 400,
                  zIndex: 1, position: "relative",
                  boxShadow: isToday && !isStart && !isEnd ? `inset 0 -2px 0 ${GOLD}` : "none",
                }}>
                  {day}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  // Inline mode: compact panel, no full-screen
  if (inline) {
    const resetLabel = lang === "en" ? "Reset" : "Réinit.";
    return (
      <div style={{ background: WHITE, borderBottom: "1px solid #E8E0D4", padding: "12px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 14, color: NAVY }}>
            {lang === "en" ? "Select dates" : "Sélectionner des dates"}
          </div>
          <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 11, color: GREY, padding: 0 }}>{resetLabel}</button>
        </div>
        {grid}
      </div>
    );
  }

  // Standalone full-screen mode
  const calTitle = lang === "en" ? "Calendar" : "Agenda";
  const resetLabel = lang === "en" ? "Reset" : "Réinit.";
  const confirmLabel = start
    ? (lang === "en" ? "See events →" : "Voir les événements →")
    : (lang === "en" ? "Select a date" : "Sélectionnez une date");

  return (
    <div style={{ background: WHITE, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: WHITE, borderBottom: "1px solid #E8E0D4", padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NAVY, padding: 0, lineHeight: 1 }}>←</button>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 20, color: NAVY }}>{calTitle}</div>
        <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 11, color: GREY, padding: 0 }}>{resetLabel}</button>
      </div>
      <div style={{ padding: "20px 16px", flex: 1 }}>{grid}</div>
      <div style={{ padding: "12px 20px 28px", background: WHITE, borderTop: "1px solid #E8E0D4" }}>
        <button
          onClick={() => start && onConfirm(start, end || start)}
          style={{ width: "100%", padding: "14px", background: start ? GOLD : "#D8D0C8", color: WHITE, border: "none", borderRadius: 24, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16, cursor: start ? "pointer" : "default", letterSpacing: 0.5 }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

```

## `src/components/EventCard.jsx`

```jsx
import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { ouvrirItineraire } from "../lib/itineraire";
import { actionDeReservation } from "../lib/reservation";
import { track } from "../lib/track";
import { Share } from "@capacitor/share";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { localizeCat, localizeDate, localizeTime, localizeTitle } from "../i18n";

import { ROUGE_H, couleurCat } from "../lib/couleurs";
import { NUIT, CREME, BLANC, OR, GRIS, SAUGE, RAYON, OMBRE, SERIF, SANS, casseNaturelle } from "../lib/theme";
import { fondEvenement, traitsEvenement, iconeEvenement } from "../lib/habillage";
// 🖼️ LA MÉDIATHÈQUE REMPLACE LES VISUELS DE CATÉGORIE (28 oct 2026, au soir).
// `lib/photos.js` posait UNE IMAGE PAR CATÉGORIE, générée par IA : la photo de
// l'Opéra atterrissait sur l'Auditorium Rainier III, des enfants sur un cours
// de zumba. Stéphanie l'a vu le matin même. On passe par `mediaDeLaFiche`, qui
// rattache par LIEU et sert ses fichiers hors du paquet OTA.
import { mediaDeLaFiche } from "../lib/mediatheque";
// Refonte du 10 oct 2026 : l'or disparaît (3,45:1 sur l'ivoire, sous la norme).
// Le Rouge H tient toute l'ossature ; la couleur de la famille ne porte QUE le
// mot de catégorie. Voir src/lib/couleurs.js pour le pourquoi de chaque teinte.
const GOLD = ROUGE_H;
const GOLD_FRAME = ROUGE_H;
const MOIS_ICS = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

// Le partage, extrait pour que les sous-fiches s'en servent aussi.
// ⚠️ L'hôte reste `monac-out.vercel.app` ET C'EST VOULU (voir le commentaire du
// bouton Partager) : c'est le seul déclaré dans `applinks:` côté iOS, donc le
// seul qui ouvre vraiment l'app. `idPartage` permet à une sous-fiche de partager
// SON lieu plutôt que la fiche-annuaire qui la contient.
export async function partagerEvenement(event, lang, idPartage = null) {
  const titre = (event.title || "").replace(/\n/g, " ");
  const id = idPartage ?? event.id;
  try { Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}); } catch {}
  await Share.share({
    title: titre,
    text: lang === "en"
      ? `${titre} — ${event.subtitle}. See it on Monac'Out:`
      : `${titre} — ${event.subtitle}. À voir sur Monac'Out :`,
    url: `https://monac-out.vercel.app/?event=${id}`,
    dialogTitle: lang === "en" ? "Share event" : "Partager",
  }).catch(() => {});
}

export function addToCalendar(event) {
  const parts = (event.date || '').split(' ');
  const day   = parseInt(parts[1]);
  const month = MOIS_ICS[parts[2]];
  const year  = event.year || new Date().getFullYear();
  if (isNaN(day) || month === undefined) return;
  const t     = (event.time || '').match(/(\d{1,2})h(\d{2})/);
  const h     = t ? parseInt(t[1]) : 12;
  const m     = t ? parseInt(t[2]) : 0;
  const pad   = n => String(n).padStart(2, '0');
  const stamp = (hh, mm) => `${year}${pad(month+1)}${pad(day)}T${pad(hh)}${pad(mm)}00`;
  const title = (event.title || '').replace(/\n/g, ' ');
  const desc  = (event.desc || '').replace(/\n/g, ' ');

  // App native (iOS/Android) : le téléchargement .ics via data-URI est ignoré par la
  // WebView → on ouvre le modèle Google Agenda dans le navigateur externe (revenir via "‹ Monac'Out").
  if (Capacitor.isNativePlatform()) {
    const url = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(title)
      + '&dates=' + stamp(h, m) + '/' + stamp(h + 2, m)
      + '&details=' + encodeURIComponent(desc + (event.link ? '\n' + event.link : ''))
      + '&location=' + encodeURIComponent(event.subtitle || '');
    window.open(url, '_blank');
    return;
  }

  // Web : téléchargement d'un fichier .ics (via Blob, plus fiable que data-URI).
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${stamp(h, m)}`,
    `DTEND:${stamp(h + 2, m)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${event.subtitle || ''}`,
    event.link ? `URL:${event.link}` : '',
    'END:VEVENT','END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = 'monacout-event.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

const VENUE_PHOTOS = {
  // Grandes salles
  grimaldi:        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg/960px-Grimaldi_Forum_Monaco_-_photographe_Olivia_Marocco.jpg",
  opera:           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg/960px-Casino_de_Montecarlo%2C_M%C3%B3naco%2C_2016-06-23%2C_DD_04.jpg",
  stade:           "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Monaco_Stade_Louis-II_1.jpg/960px-Monaco_Stade_Louis-II_1.jpg",
  ocean:           "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Monaco_BW_2011-06-07_17-50-43.jpg/960px-Monaco_BW_2011-06-07_17-50-43.jpg",
  palais:          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Princely_Palace_of_Monaco.jpg/960px-Princely_Palace_of_Monaco.jpg",
  cathedrale:      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Monaco_BW_2011-06-07_16-07-20.jpg/960px-Monaco_BW_2011-06-07_16-07-20.jpg",
  tpg:             "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg/960px-Entr%C3%A9e_du_th%C3%A9%C3%A2tre_Princesse_Grace_et_du_cin%C3%A9ma_des_Beaux-Arts_%28Monaco%29.jpg",
  fort_antoine:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Fort_Antoine_Monaco.JPG/960px-Fort_Antoine_Monaco.JPG",
  sporting:        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Monte_Carlo_Sporting_Club_in_2023.jpg/960px-Monte_Carlo_Sporting_Club_in_2023.jpg",
  collection:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/La_Collection_de_Voitures_de_S.A.S._le_Prince_de_Monaco_%2851430786795%29.jpg/960px-La_Collection_de_Voitures_de_S.A.S._le_Prince_de_Monaco_%2851430786795%29.jpg",
  // Hôtels
  hotel_paris:     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/H%C3%B4tel_de_Paris_-_panoramio.jpg/960px-H%C3%B4tel_de_Paris_-_panoramio.jpg",
  hermitage:       "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/H%C3%B4tel_Hermitage_Monte_Carlo_%2860029384%29.jpeg/960px-H%C3%B4tel_Hermitage_Monte_Carlo_%2860029384%29.jpeg",
  fairmont:        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/MONACO_LE_FAIRMONT_HOTEL_5_-_panoramio.jpg/960px-MONACO_LE_FAIRMONT_HOTEL_5_-_panoramio.jpg",
  mcbay:           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Monte-Carlo_Bay_Hotel_-_panoramio.jpg/960px-Monte-Carlo_Bay_Hotel_-_panoramio.jpg",
  // Monaco-Ville / Rocher
  rocher:          "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/View_on_Monacoville.JPG/960px-View_on_Monacoville.JPG",
  villa_sauber:    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Villa_Sauber_-_panoramio.jpg/960px-Villa_Sauber_-_panoramio.jpg",
  jardins_stmartin:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Jardins_Saint-Martin%2C_Monaco_-_panoramio.jpg/960px-Jardins_Saint-Martin%2C_Monaco_-_panoramio.jpg",
  roseraie:        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Roseraie_Princesse_Grace_-_panoramio.jpg/960px-Roseraie_Princesse_Grace_-_panoramio.jpg",
  // Monte-Carlo place / casino
  casino:          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Le_casino_de_Monte-Carlo.JPG/960px-Le_casino_de_Monte-Carlo.JPG",
  place_casino:    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Monaco_Place_du_Casino_1.jpg/960px-Monaco_Place_du_Casino_1.jpg",
  // Port & bord de mer
  yacht_club:      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Yacht_Club_de_Monaco_%2851429816991%29.jpg/960px-Yacht_Club_de_Monaco_%2851429816991%29.jpg",
  port:            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/MonacoView.jpg/960px-MonacoView.jpg",
  larvotto_beach:  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Plage_du_Larvotto_MONACO_-_panoramio.jpg/960px-Plage_du_Larvotto_MONACO_-_panoramio.jpg",
  country_club:    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Halte_de_Monte-Carlo-Country-Club.JPG/960px-Halte_de_Monte-Carlo-Country-Club.JPG",
  // Fontvieille
  fontvieille:     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Fontvieille_and_yachts.jpg/960px-Fontvieille_and_yachts.jpg",
  parc_antoinette: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Princess_Antoinette_Park.jpg/960px-Princess_Antoinette_Park.jpg",
  // La Condamine
  condamine:       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/March%C3%A9_de_la_Condamine_depuis_la_Place_d%27Armes_%28Monaco%29.jpg/960px-March%C3%A9_de_la_Condamine_depuis_la_Place_d%27Armes_%28Monaco%29.jpg",
  // Jardins & parcs
  jardin_exotique: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jardin_exotique_de_Monaco_D190408_a.jpg/960px-Jardin_exotique_de_Monaco_D190408_a.jpg",
  jardin_japonais: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Jardin_Japonais_de_Monaco_-_panoramio.jpg/960px-Jardin_Japonais_de_Monaco_-_panoramio.jpg",
  // Divers
  odeon:           "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Tour_Od%C3%A9on_Monaco_2022_%28cropped%29.jpg/960px-Tour_Od%C3%A9on_Monaco_2022_%28cropped%29.jpg",
  aerial:          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Aerial_view_of_Monaco_%2801%29.jpg/960px-Aerial_view_of_Monaco_%2801%29.jpg",
};

function getVenuePhoto(event) {
  const s = (event.subtitle || "").toLowerCase();
  const t = (event.title || "").toLowerCase();
  const c = s + " " + t;

  // Grandes salles — du plus spécifique au plus général
  if (c.includes("grimaldi forum") || c.includes("salle des princes") || c.includes("ravel hall") || c.includes("espace indigo") || c.includes("one monte-carlo") || c.includes("one monte carlo")) return VENUE_PHOTOS.grimaldi;
  if (c.includes("salle garnier") || c.includes("opéra de monte") || c.includes("opera de monte")) return VENUE_PHOTOS.opera;
  if (c.includes("stade louis") || c.includes("gaston médecin") || c.includes("gaston medecin")) return VENUE_PHOTOS.stade;
  if (c.includes("océanographique") || c.includes("oceanographique")) return VENUE_PHOTOS.ocean;
  if (c.includes("palais princier") || c.includes("cour d") || c.includes("place du palais")) return VENUE_PHOTOS.palais;
  if (c.includes("fort antoine")) return VENUE_PHOTOS.fort_antoine;
  if (c.includes("cathédrale") || c.includes("cathedrale") || c.includes("saint-nicolas") || c.includes("sacré-cœur") || c.includes("sacre-coeur") || c.includes("chapelle") || c.includes("paroisse") || c.includes("église") || c.includes("eglise") || c.includes("paroisses") || c.includes("églises")) return VENUE_PHOTOS.cathedrale;
  if (c.includes("collection de voitures")) return VENUE_PHOTOS.collection;
  if (c.includes("parc princesse antoinette")) return VENUE_PHOTOS.parc_antoinette;
  // Théâtre Princesse Grace / Cinéma des Beaux-Arts (même bâtiment) — avant le check "princesse" générique
  if (c.includes("théâtre princesse grace") || c.includes("theatre princesse grace") || c.includes("salle princesse grace") || c.includes("beaux-arts") || c.includes("cinéma des beaux") || c.includes("cinema des beaux")) return VENUE_PHOTOS.tpg;
  // Sporting Monte-Carlo + académies associées (Jimmy'z, Étoiles, Lilly's)
  if (c.includes("sporting monte") || c.includes("salle des étoiles") || c.includes("salle des etoiles") || c.includes("salle du sporting") || c.includes("jimmy") || c.includes("lilly") || c.includes("académie princesse grace") || c.includes("academie princesse grace") || c.includes("académie de danse") || c.includes("academie de danse") || c.includes("mc dance") || c.includes("ballet de monte")) return VENUE_PHOTOS.sporting;
  // Hôtels de luxe
  if (c.includes("hôtel de paris") || c.includes("hotel de paris") || c.includes("bar américain") || c.includes("bar americain") || c.includes("cave du louis") || c.includes("café llorca") || c.includes("cafe llorca") || c.includes("robuchon")) return VENUE_PHOTOS.hotel_paris;
  if (c.includes("hermitage") || c.includes("thermes marins") || c.includes("vistamar")) return VENUE_PHOTOS.hermitage;
  if (c.includes("fairmont") || c.includes("nobu") || c.includes("buddha-bar") || c.includes("buddha bar") || c.includes("horizon rooftop")) return VENUE_PHOTOS.fairmont;
  if (c.includes("monte-carlo bay") || c.includes("monte carlo bay") || c.includes("blue gin") || c.includes("azzurra") || c.includes("clarins") || c.includes("novotel")) return VENUE_PHOTOS.mcbay;
  // Casino et Place du Casino
  if (c.includes("casino de monte") || c.includes("new moods") || c.includes("new mood") || c.includes("bar du casino")) return VENUE_PHOTOS.casino;
  if (c.includes("place du casino") || c.includes("café de paris") || c.includes("cafe de paris") || c.includes("hôtel des ventes") || c.includes("hotel des ventes") || c.includes("sass café") || c.includes("sass cafe") || c.includes("panino club") || c.includes("trinity monaco") || c.includes("amu monte") || c.includes("equivoque") || c.includes("twiga")) return VENUE_PHOTOS.place_casino;
  // Yacht Club avant Port Hercule (plus spécifique)
  if (c.includes("yacht club") || c.includes("wine palace")) return VENUE_PHOTOS.yacht_club;
  // Tour Odéon / Odéon Spa
  if (c.includes("odéon") || c.includes("odeon")) return VENUE_PHOTOS.odeon;
  // Villa Sauber / NMNM
  if (c.includes("villa sauber") || (c.includes("nmnm") && !c.includes("paloma"))) return VENUE_PHOTOS.villa_sauber;
  // Monte-Carlo Country Club
  if (c.includes("country club")) return VENUE_PHOTOS.country_club;
  // Jardins Saint-Martin (spécifique avant Monaco-Ville générique)
  if (c.includes("jardins saint-martin") || c.includes("jardins saint martin")) return VENUE_PHOTOS.jardins_stmartin;
  // Roseraie
  if (c.includes("roseraie")) return VENUE_PHOTOS.roseraie;
  // Jardin Exotique
  if (c.includes("jardin exotique")) return VENUE_PHOTOS.jardin_exotique;
  // Jardin Japonais
  if (c.includes("jardin japonais")) return VENUE_PHOTOS.jardin_japonais;
  // Monaco-Ville / Rocher (générique)
  if (c.includes("monaco-ville") || c.includes("rocher") || c.includes("place de la visitation") || c.includes("jardins de la petite") || c.includes("pavillon bosio") || c.includes("le petit bar") || c.includes("monaco tours") || c.includes("villa paloma") || c.includes("fondation prince pierre") || c.includes("castelroc")) return VENUE_PHOTOS.rocher;
  // Port Hercule et bord de mer (avant check larvotto)
  if (c.includes("port hercule") || c.includes("quai des artistes") || c.includes("digue du port") || c.includes("au marius") || c.includes("caffè milano") || c.includes("caffe milano") || c.includes("jack monaco") || c.includes("monaco brewery") || c.includes("rascasse") || c.includes("ship & castle") || c.includes("ship and castle") || c.includes("slammers") || c.includes("marlow") || c.includes("mareterra") || c.includes("quai albert") || c.includes("port de monaco") || c.includes("amber lounge") || c.includes("aritual")) return VENUE_PHOTOS.port;
  // Larvotto / plages (Note Bleue, Méridien, Nikki Beach, clubs de sport)
  if (c.includes("larvotto") || c.includes("note bleue") || c.includes("nikki beach") || c.includes("méridien beach") || c.includes("meridien beach") || c.includes("sea club") || c.includes("yoga monte") || c.includes("monaco wellness") || c.includes("plage du") || c.includes("la môme") || c.includes("la mome")) return VENUE_PHOTOS.larvotto_beach;
  // Fontvieille (générique — après les plus spécifiques)
  if (c.includes("fontvieille") || c.includes("léo ferré") || c.includes("leo ferre") || c.includes("espace léo") || c.includes("salle léo") || c.includes("chapiteau") || c.includes("terrasses de") || c.includes("jenna lifestyle") || c.includes("brasserie de monaco") || c.includes("cercle bouliste")) return VENUE_PHOTOS.fontvieille;
  // La Condamine / Marché
  if (c.includes("condamine") || c.includes("woo monaco") || c.includes("gran caffè") || c.includes("gran caffe") || c.includes("limùn") || c.includes("limun") || c.includes("mairie de monaco") || c.includes("médiathèque") || c.includes("mediatheque") || c.includes("théâtre des muses") || c.includes("theatre des muses") || c.includes("u tapu") || c.includes("auditorium rainier") || c.includes("académie de musique") || c.includes("academie de musique")) return VENUE_PHOTOS.condamine;
  // Circuit F1 / Formule
  if (c.includes("circuit") || c.includes("formule")) return VENUE_PHOTOS.aerial;
  // Fallback : vue aérienne Monaco
  return VENUE_PHOTOS.aerial;
}

function generateICS(event) {
  const parts = event.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_ICS[parts[2]];
  const year = event.year || 2026;
  const tm = (event.time || '').replace(/\s/g,'').match(/^(\d{1,2})h(\d{2})?/);
  const h = tm ? parseInt(tm[1]) : 20;
  const m = tm && tm[2] ? parseInt(tm[2]) : 0;
  const p = n => String(n).padStart(2,'0');
  const dt  = `${year}${p(month+1)}${p(day)}T${p(h)}${p(m)}00`;
  const dt2 = `${year}${p(month+1)}${p(day)}T${p(Math.min(h+2,23))}${p(m)}00`;
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${dt}`,`DTEND:${dt2}`,
    `SUMMARY:${event.title.replace(/\n/g,' ')}`,
    `LOCATION:${event.subtitle||''}`,
    event.link ? `URL:${event.link}` : null,
    `DESCRIPTION:${(event.desc||'').replace(/\n/g,'\\n')}`,
    'END:VEVENT','END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

const NAVY = "#0F1D3A";
const BLUE = "#9FC3DC";
const GREY = "#4f4b4b";
const WHITE = "#FFFFFF";
const CREAM = "#FFFFFF";

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
    </svg>
  );
}

const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function todayFrDate() {
  const d = new Date();
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

const AVATAR_COLORS = ['#0F1D3A','#882830','#1A4A5A','#3A1870','#1A4A2A','#4A2010','#1A2A4A']
function avatarColor(id=''){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))&0xFFFFFF;return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]}

export function FriendAvatars({ friends = [] }) {
  if (!friends.length) return null
  const shown = friends.slice(0, 3)
  const extra = friends.length - 3
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, marginLeft:4 }}>
      {shown.map(f => (
        // Carré à coins arrondis (et non un rond) pour rester dans l'esprit des
        // cadres droits de l'app. Photo si la personne en a mis une, sinon l'initiale.
        <div key={f.id} title={f.display_name} style={{
          width:20, height:20, borderRadius:'50%', flexShrink:0,
          background: f.avatar_url ? `center/cover no-repeat url("${f.avatar_url}")` : avatarColor(f.id),
          color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Josefin Sans',sans-serif", fontSize:8, fontWeight:600,
          border:'1.5px solid #fff',
        }}>{f.avatar_url ? '' : (f.display_name?.[0]||'?').toUpperCase()}</div>
      ))}
      {extra > 0 && <span style={{ fontSize:9, color:GREY, fontFamily:"'Lato',sans-serif" }}>+{extra}</span>}
    </div>
  )
}

export default function EventCard({ event, favorites, onToggleFav, onCategoryClick, onCardClick, lang = "fr", onGoingClick, isGoing = false, friendsGoing = [], loggedIn = false, onShowAuth, jourAffiche = null, sansDate = false, compact = false, onInfos = null, infosDepliees = false, onReserver = null }) {
  // 🚨 UNE FICHE-ANNUAIRE N'EST PAS UN ÉVÉNEMENT où l'on se rend.
  // Stéphanie, 13 oct 2026 : « retire j'y vais calendrier sur la fiche petit déj
  // 12 adresses ; met mon calendrier et cœur sur les sous-fiches ». On ne va pas
  // à « 12 adresses » et on ne met pas « 12 adresses » à son agenda : on choisit
  // UNE adresse. Ces deux gestes descendent donc sur les sous-fiches.
  const estAnnuaire = Array.isArray(event.directory) && event.directory.length > 0;
  // 📍 UN ANNUAIRE D'UN SEUL LIEU GARDE SON « DIRECTION ». Stéphanie, 26 oct
  // 2026 : « rajoute sur la fiche première du cinéma direction ». Depuis
  // v0.0.134 une fiche-annuaire se vide au profit de ses sous-fiches, parce
  // qu'on ne sait pas lequel des 12 lieux la personne vise. Le cinéma est
  // l'exception : les 6 films sont dans LA MÊME salle, donc l'itinéraire de la
  // fiche-mère n'a aucune ambiguïté. Même raisonnement pour toute famille
  // dont les sous-fiches n'ont pas d'adresse propre.
  const annuaireDUnSeulLieu = estAnnuaire && !!event.weeklyFilms;
  // ── MODE COMPACT ────────────────────────────────────────────────────────────
  // Demandé par Stéphanie le 10 oct 2026 : quand on déplie « Voir les 7 », les
  // expositions arrivent toutes d'un coup et se confondent avec le reste du fil.
  // En plus petit, on voit d'un coup d'œil qu'elles appartiennent au groupe
  // qu'on vient d'ouvrir. Rien n'est retiré : les boutons restent tous là.
  // ⚠️ Premier essai : on avait tout rapetissé — textes, boutons, marges. Mauvaise
  // lecture. Stéphanie, 10 oct 2026 : « pas en épaisseur mais plutôt moins large
  // sur les côtés ». Le contenu garde donc EXACTEMENT sa taille habituelle ; seule
  // la largeur se resserre, pour que les expositions dépliées se lisent comme les
  // filles de la carte qu'on vient d'ouvrir, et non comme des cartes du fil.
  const C = { trait: 3, padding: "18px 22px 20px", cat: 20, catLs: 3, catBas: 13,
              titre: 20, titreHaut: 15, titreBas: 12, lieu: 16, lieuBas: 18, marge: 14,
              bouton: "6px 12px", boutonTexte: 9, coeur: 21, dateTxt: 15, heureTxt: 13,
              // le seul effet du mode compact : un retrait de 22 px de chaque côté
              retrait: compact ? 22 : 0 };
  const isFav = favorites?.includes(event.id);
  const [showPhone, setShowPhone] = useState(false);
  // ⚠️ Une fiche `ongoing` ne porte QU'UNE date : celle du jour, réécrite chaque nuit.
  // Quand on consulte une autre journée (calendrier, « ce week-end »), elle s'affichait
  // quand même « AUJOURD'HUI » — Stéphanie, 31 août 2026 : elle a cliqué sur le 11
  // septembre, a vu « AUJOURD'HUI » en tête de liste et en a conclu que le calendrier
  // était cassé. Il ne l'était pas : c'est l'étiquette qui mentait.
  // `jourAffiche` porte la journée réellement consultée ; on l'affiche à la place.
  const dateDuJour = jourAffiche || event.date;
  const isToday = dateDuJour === todayFrDate() && (event.year || 2026) === new Date().getFullYear();
  const dateLabel = isToday
    ? (lang === "en" ? "Today" : "Aujourd'hui")
    : localizeDate(dateDuJour, lang);

  return (
    <div
      // 🚨 UNE FICHE-ANNUAIRE NE S'OUVRE PAS EN FENÊTRE. Stéphanie, 20 oct 2026 :
      // « le dépliage est ok mais quand je clique au hasard sur la fiche il y a
      // tout qui s'affiche… comme avec le i d'avant ». Le bouton dépliait bien,
      // mais le cadre entier restait cliquable et rouvrait l'ancienne fenêtre —
      // on avait donc DEUX façons de voir la même liste, ce que la refonte du
      // 11 octobre voulait justement supprimer. Sur ces fiches, seul le bouton
      // agit ; `onInfos` absent (écran sans dépliage), on garde l'ancien geste
      // plutôt que de rendre la liste inaccessible.
      onClick={() => { if (estAnnuaire && onInfos) return; onCardClick?.(event); }}
      style={{
        // 🎨 REFONTE DU 28 OCT 2026 — LA CARTE N'A PLUS DE CADRE COLORÉ.
        // Le brief : « supprimer les épais encadrements sur toutes les cartes ».
        // Les 28 couleurs de catégorie faites la veille ne disparaissent pas
        // pour autant : elles vivent désormais dans la PASTILLE de catégorie,
        // en haut de la carte. Le repère reste, l'encadrement part.
        // Décision prise par Stéphanie le 28 oct, après que je lui ai signalé
        // que le brief contredisait le travail de la veille.
        border: "1px solid rgba(23,36,60,0.06)",
        borderRadius: RAYON.lg,
        boxShadow: OMBRE.carte,
        padding: 0,
        marginBottom: C.marge,
        marginLeft: C.retrait, marginRight: C.retrait,
        background: BLANC,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inner blue frame */}
      {/* Le filet bleu intérieur est retiré : un seul trait, demandé par Stéphanie. */}
      {/* 🖼️ L'HABILLAGE, EN HAUT DE CARTE. Il tient la place qu'une photo
          occuperait sur la maquette — mais il est GÉNÉRÉ, pas photographié :
          dégradé de la catégorie, icône en filigrane, cercles et filets, le
          tout décalé par `event.id` pour qu'aucune carte ne ressemble à sa
          voisine. 0 octet ajouté à l'OTA, et rien qui puisse passer pour une
          scène réelle. Le jour où une vraie photo existera dans les données,
          elle prendra simplement sa place ici. */}
      {!compact && (() => { const ph = mediaDeLaFiche(event); return ph ? (
        /* 📷 LE VISUEL DE CATÉGORIE. Décision de Stéphanie, 28 oct 2026.
           ⚠️ CE N'EST PAS LA PHOTO DU LIEU : une même image illustre toutes les
           fiches de sa catégorie, et aucune n'a été prise à Monaco. D'où la
           mention portée dessus, que le kit impose. Une vraie photo dans les
           données passerait automatiquement devant. */
        <div style={{ position: "relative", height: 132, overflow: "hidden", background: "#1A1F2E" }}>
          <img src={ph.src} alt="" loading="lazy" decoding="async" style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(18,22,34,0) 52%, rgba(18,22,34,0.55) 100%)",
          }} />

        </div>
      ) : (
        <div style={{
          position: "relative", height: 112, overflow: "hidden",
          ...fondEvenement(event),
        }}>
          {(() => { const t = traitsEvenement(event); return (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"
                 style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <circle cx={t.cx} cy={t.cy} r={t.r1} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="0.5" />
              <circle cx={t.cx} cy={t.cy} r={t.r2} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
              <line x1="0" y1={78 + t.incline / 4} x2="100" y2={70 + t.incline / 3}
                    stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" />
            </svg>
          ); })()}
          {/* ⚠️ L'EMOJI EN FILIGRANE, PAS EN AUTOCOLLANT. Affiché tel quel, il
              ressortait en couleurs pleines — un clap de cinéma rouge et blanc,
              une tasse marron — et la carte avait l'air d'un sticker collé sur
              un fond. Désaturé puis éclairci, il redevient ce que montrent les
              76 fonds de référence : une silhouette claire, presque absente. */}
          <div aria-hidden="true" style={{
            position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
            fontSize: 46, lineHeight: 1,
            filter: "grayscale(1) brightness(2.4) contrast(0.6)",
            opacity: 0.22,
          }}>{iconeEvenement(event)}</div>
          {/* Le mot reste — il faut qu'on sache que ce n'est pas une photo —
              mais discret : il était écrit en gros sur chaque carte du fil. */}
          <div style={{
            position: "absolute", right: 12, bottom: 9,
            fontFamily: SANS, fontSize: 8, letterSpacing: 0.9,
            textTransform: "uppercase", color: "rgba(255,255,255,0.34)",
          }}>{lang === "en" ? "Illustration" : "Habillage"}</div>
        </div>
      ); })()}

      <div style={{ background: BLANC }}>

        <div style={{ padding: C.padding, textAlign: "left" }}>

          {/* 🏷️ LA CATÉGORIE DEVIENT UNE PASTILLE. Refonte du 28 oct 2026 :
              le cadre coloré a disparu des cartes, mais la couleur de catégorie
              reste le repère qui permet de trier le fil d'un coup d'œil. Elle
              se replie donc ici, sur un fond très pâle de sa propre teinte —
              assez pour la reconnaître, assez discret pour ne pas crier. */}
          <div style={{ marginBottom: C.catBas }}>
            <span style={{
              display: "inline-block", padding: "5px 12px",
              borderRadius: RAYON.pastille,
              background: `${couleurCat(event.cat)}14`,
              fontFamily: SANS, fontSize: 10.5, fontWeight: 700,
              letterSpacing: 1.1, textTransform: "uppercase",
              color: couleurCat(event.cat), lineHeight: 1.2,
            }}>{localizeCat(event.cat, lang)}</span>
          </div>

          {/* Date + heure */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: sansDate ? "flex-start" : "space-between",
            marginBottom: 14,
          }}>
            {/* Quand le fil range les cartes sous un intertitre de jour, la date
                est déjà écrite au-dessus : la répéter sur chaque carte donnait
                « AUJOURD'HUI » vingt fois d'affilée. Il ne reste que l'heure,
                qui elle change d'une carte à l'autre. */}
            {!sansDate && (
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: C.dateTxt, fontWeight: 700, letterSpacing: 1.2,
                textTransform: "uppercase", color: GREY,
              }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
            )}
            {event.time && (
              <span style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: sansDate ? C.dateTxt : C.heureTxt,
                fontWeight: 700,
                letterSpacing: sansDate ? 1.2 : 0.4,
                color: GREY,
              }}>{localizeTime(event.time, lang)}</span>
            )}
          </div>

          {/* Titre */}
          {/* ✒️ LE TITRE EN SERIF. Le brief demande « titres soignés (serif
              premium si la police est déjà disponible) » : Playfair Display est
              DÉJÀ chargée par l'app, on n'ajoute donc aucune police — ce qui
              aurait alourdi le bundle OTA et risqué un chargement fragile.
              Les capitales disparaissent : le brief demande de « réduire les
              capitales longues », et un titre de film en capitales sur trois
              lignes était illisible. */}
          <div style={{
            fontFamily: SERIF,
            fontWeight: 600, fontSize: C.titre + 2, letterSpacing: 0,
            textTransform: "none",
            color: NUIT, lineHeight: 1.25,
            marginTop: C.titreHaut, marginBottom: C.titreBas,
          }}>{casseNaturelle(localizeTitle(event.title.replace(/\n/g, " "), lang))}</div>

          {/* 📍 LE BOUTON « INFOS » EST SOUS LE TITRE, ET PLUS GRAND.
              Stéphanie, 13 oct 2026 : « laisse le rectangle info et les sous-fiches.
              Met ce rectangle en plus gros sous le titre de chaque fiche ». Il était
              perdu en bas, dans la rangée de « J'y vais » / « Appeler » / « Mon
              agenda », à la même taille qu'eux — alors que c'est lui qui ouvre le
              contenu de la fiche. Le petit « ⓘ » collé au titre, qui tenait ce rôle
              sur les vieux iPhone, est supprimé : il était posé sur TOUS les titres,
              y compris ceux qui n'ont rien à déplier. */}
          {Array.isArray(event.directory) && event.directory.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); onInfos ? onInfos(event) : onCardClick?.(event); }}
              style={{
                alignSelf: "flex-start",
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "11px 20px", marginBottom: 12,
                // 🎨 La famille, comme le cadre — sinon un cadre Havane
                // encadrait un bouton Rouge H.
                border: `2px solid ${couleurCat(event.cat)}`,
                borderRadius: 2, background: "#FBF2F0", cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 14, fontWeight: 700, letterSpacing: 1.8,
                textTransform: "uppercase", color: couleurCat(event.cat),
              }}
            >
              {infosDepliees
                ? (lang === "en" ? "Close" : "Replier")
                : event.cat === "CINÉMA"
                ? (lang === "en" ? `See the ${event.directory.length} films` : `Voir les ${event.directory.length} films`)
                : (lang === "en" ? `See the ${event.directory.length}` : `Voir les ${event.directory.length}`)}
            </button>
          )}

          {/* Lieu */}
          {event.subtitle && (
            <div style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: C.lieu, fontWeight: 400,
              color: NAVY, marginBottom: C.lieuBas, letterSpacing: 0.2,
            }}>{event.subtitle}</div>
          )}

          {/* Organisation (fondations) */}
          {/fondation|fdtn|fight aids|croix.rouge|amade|association|mission enfance|anges gardiens|amapei|jewish|caritas|jcc/i.test(event.source || "") && (
            <div style={{
              fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600,
              fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
              color: GOLD, marginBottom: 12,
            }}>{event.source}</div>
          )}

          {/* Entrée libre */}
          {event.free && (
            <div style={{ marginBottom: 14 }}>
              <span style={{
                border: "1px solid #0F1D3A", padding: "3px 14px",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 10, fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: "#0F1D3A",
              }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</span>
            </div>
          )}

          {/* Bas de carte */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
          {event.venues && (
            <div style={{ width: "100%", marginBottom: 4 }}>
              {event.venues.map((v, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: i < event.venues.length - 1 ? "1px solid rgba(201,169,110,0.2)" : "none",
                }}>
                  {/* 🎯 Stéphanie, 27 oct 2026 : « tous les titres des sous-fiches
                      doivent être centrés ». Ce bloc `venues` est l'ancien format,
                      mais il reste affiché sur quelques fiches : il suit la même
                      règle que CarteLieu, sinon deux sous-fiches voisines ne se
                      ressembleraient pas. */}
                  <span style={{
                    fontFamily: "'Lato', sans-serif", fontSize: 12, color: NAVY, flex: 1,
                    textAlign: "center", paddingRight: 8,
                  }}>{v.name}</span>
                  <div style={{ display: "inline-flex", gap: 4, flexShrink: 0 }}>
                    {/* ⚠️ PLUS DE target="_blank" : sur iPhone il ouvre un onglet vide
                        et l'app affiche un écran noir (voir « Rester dans l'app »).
                        Ce bloc `venues` est de toute façon le dernier d'un ancien
                        affichage : depuis le 11 oct 2026 les annuaires passent par
                        `directory`, qui se déplie en sous-fiches sans lien sortant.
                        On le laisse en repli, corrigé, plutôt qu'armé. */}
                    {v.link && (
                      <a href={v.link} rel="noopener noreferrer"
                         onClick={e => e.stopPropagation()}
                         style={{
                           display: "flex", alignItems: "center", justifyContent: "center",
                           width: 28, height: 28, border: `1px solid ${GOLD_FRAME}`, borderRadius: 1,
                           color: GOLD, textDecoration: "none",
                         }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </a>
                    )}
                    {/* 🗑️ Plus d'icône téléphone : « Réserver » compose déjà le
                        numéro quand c'est le seul moyen. Stéphanie, 27 oct 2026 :
                        « retire tous les appeler, qui sont du coup inutiles ». */}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* 🎟️ UN SEUL BOUTON, SUR TOUTES LES FICHES. Stéphanie, 26 oct 2026.
              Il dit toujours « Réserver » et fait le mieux disponible : le vrai
              formulaire, sinon le site du lieu, sinon le téléphone. Le téléphone
              n'est pas un pis-aller — pour la moitié des lieux de Monaco c'est
              LE moyen de réserver. Voir lib/reservation.js. */}
          {!estAnnuaire && (() => {
            const a = actionDeReservation(event, event.cat, lang);
            if (!a) return null;
            // 🎨 Voir HomeScreen : le bouton reste uniforme, c'est le cadre
            // de la carte qui porte la couleur de la famille.
            // Même geste, même aspect : la barre est pleine dans les trois cas.
            const plein = true;
            return (
              <button
                onClick={e => { e.stopPropagation();
                  // 📊 Voir HomeScreen : sans cette mesure, on ne sait pas si
                  // le bouton sert à quelque chose.
                  track("reservation_clic", { mode: a.mode, cat: event.cat,
                                              lieu: event.source || event.subtitle });
                  if (a.mode === "tel") window.location.href = `tel:${a.tel}`;
                  else onReserver?.(a.url, (event.title || "").replace(/\n/g, " ")); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  width: "100%", height: plein ? 38 : 36, marginBottom: 10, cursor: "pointer",
                  border: "1px solid #7B2D26", borderRadius: 1,
                  background: plein ? "#7B2D26" : "#FFF6F4",
                  fontFamily: "'Josefin Sans', sans-serif", fontSize: plein ? 11 : 10,
                  fontWeight: 700, letterSpacing: plein ? 2 : 1.6,
                  textTransform: "uppercase", color: plein ? "#FFFDF8" : "#7B2D26",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                     stroke={plein ? "#FFFDF8" : "#7B2D26"} strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
                  {a.mode === "tel"
                    ? <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
                    : <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"/>}
                </svg>
                {a.mot}
              </button>
            );
          })()}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* 🚫 Sur une fiche-annuaire, le site et le téléphone ne veulent rien dire :
                lequel des 12 lieux appelle-t-on ? Stéphanie, 13 oct 2026 : « enlève
                les icônes et mets-les sur chaque sous-fiche ». Chaque sous-fiche
                porte désormais SON site et SON numéro. */}
            {(event.subtitle || event.phone) && !event.venues && (!estAnnuaire || annuaireDUnSeulLieu) ? (
              <div style={{
                display: "inline-flex",
                alignItems: "stretch",
                border: `1px solid ${GOLD_FRAME}`,
                borderRadius: 1,
                height: 34,
                overflow: "hidden",
              }}>
                {event.subtitle ? (
                  <button
                    onClick={e => { e.stopPropagation(); ouvrirItineraire(event.subtitle); }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "0 16px", background: "none", border: "none", cursor: "pointer",
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: 10, fontWeight: 600, letterSpacing: 2,
                      textTransform: "uppercase", color: "#000000",
                    }}
                    aria-label={lang === "en" ? "Directions" : "Itinéraire"}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {lang === "en" ? "Directions" : "Direction"}
                  </button>
                ) : (
                  /* 🗑️ Plus de bouton téléphone ici non plus : « Réserver »
                     compose le numéro quand c'est le seul moyen. */
                  <span />
                )}
              </div>
            ) : (
              <span />
            )}

            {/* Groupe droite : amis + cœur côte à côte */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            {/* Amis qui y vont — à côté du cœur : gris si personne, doré + avatars si des amis */}
            {friendsGoing.length > 0 ? (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#FBF2F0", border: `1px solid ${GOLD_FRAME}`,
                borderRadius: 20, padding: "3px 10px 3px 5px",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#7B2D26" style={{ flexShrink: 0 }} aria-hidden="true">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <FriendAvatars friends={friendsGoing} />
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, color: NAVY, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                  {friendsGoing.length === 1
                    ? (lang === "en" ? `${friendsGoing[0].display_name}` : `${friendsGoing[0].display_name}`)
                    : (lang === "en" ? `${friendsGoing.length} friends` : `${friendsGoing.length} amis`)}
                </span>
              </div>
            ) : !loggedIn ? (
              <button
                onClick={e => { e.stopPropagation(); onShowAuth && onShowAuth(); }}
                title={lang === "en" ? "See which friends are going" : "Vois quels amis y vont"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "#FBF2F0", border: `1px solid ${GOLD_FRAME}`,
                  borderRadius: 20, padding: "3px 10px 3px 7px", cursor: "pointer",
                }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#7B2D26" style={{ flexShrink: 0 }} aria-hidden="true">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, color: "#7B2D26", letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                  {lang === "en" ? "Friends?" : "Amis ?"}
                </span>
              </button>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center" }}
                title={lang === "en" ? "No friends going yet" : "Aucun ami inscrit pour l'instant"}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#C7C1B4" style={{ flexShrink: 0 }} aria-hidden="true">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
            )}

            {!estAnnuaire && (
            <button
              onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
              style={{
                background: "none", border: "none",
                cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0, flexShrink: 0,
              }}
              aria-label={isFav ? (lang === "en" ? "Remove from favourites" : "Retirer des favoris")
                                : (lang === "en" ? "Add to favourites" : "Ajouter aux favoris")}
            >
              {/* Contour Rouge H, rempli quand c'est un favori. L'émoji 🤍 ne se
                  teintait pas et s'affichait différemment selon les iPhone. */}
              <svg width={C.coeur} height={C.coeur} viewBox="0 0 24 24" aria-hidden="true"
                   fill={isFav ? ROUGE_H : "none"} stroke={ROUGE_H} strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
            </button>
            )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
          {/* J'y vais */}
          {onGoingClick && !estAnnuaire && (
            <button
              onClick={e => { e.stopPropagation(); onGoingClick(event.id, event.date, !!event.ongoing); }}
              style={{
                alignSelf: "flex-start",
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: C.bouton,
                border: `1px solid ${GOLD_FRAME}`,
                borderRadius: 1, cursor: "pointer",
                background: isGoing ? "#FBF2F0" : "none",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: C.boutonTexte, fontWeight: 600, letterSpacing: 1.5,
                textTransform: "uppercase", color: isGoing ? GOLD_FRAME : "#0F1D3A",
              }}
            >
              {isGoing ? "✓ " : ""}{lang === "en" ? "Going" : "J'y vais"}
            </button>
          )}
          {/* Fiche récapitulative (« ce soir : n terrasses ») : rien n'indiquait qu'il
              fallait la toucher pour voir les lieux. On le dit explicitement.
              ⚠️ DEPUIS LE 11 OCT 2026, CE BOUTON DÉPLIE AU LIEU D'OUVRIR une
              fenêtre. Stéphanie : « garde pour toute l'app quand on clique sur
              infos on a le système de sous-fiche qui apparaît dessous comme pour
              apéro et expo, je veux que cela soit cohérent partout ». Le fil ne
              doit avoir qu'UNE façon de montrer un annuaire.
              `onInfos` absent (écran Agenda, Favoris…) → ancien comportement. */}
          {!estAnnuaire && (
          <button
            onClick={e => { e.stopPropagation(); addToCalendar(event); }}
            style={{
              alignSelf: "flex-start", marginLeft: -1,
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: C.bouton,
              border: `1px solid ${GOLD_FRAME}`,
              borderRadius: 1, background: "none", cursor: "pointer",
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: C.boutonTexte, fontWeight: 600, letterSpacing: 1.5,
              textTransform: "uppercase", color: "#0F1D3A",
            }}
          >
            {lang === "en" ? "My calendar" : "Mon calendrier"}
          </button>
          )}
          {Capacitor.isNativePlatform() && !estAnnuaire && (
            <button
              onClick={async e => {
                e.stopPropagation();
                Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
                await Share.share({
                  title: event.title.replace(/\n/g, ' '),
                  text: lang === 'en'
                    ? `${event.title.replace(/\n/g, ' ')} — ${event.subtitle}. See it on Monac'Out:`
                    : `${event.title.replace(/\n/g, ' ')} — ${event.subtitle}. À voir sur Monac'Out :`,
                  // ⚠️ `monac-out.vercel.app` ET NON `monacout.com`, ET C'EST VOULU —
                  // décision de Stéphanie le 23 août 2026 : « je préfère que tu mettes
                  // le lien de l'app ». C'est le SEUL hôte déclaré dans les
                  // entitlements iOS (`applinks:`), donc le seul qui ouvre vraiment
                  // l'app chez quelqu'un qui l'a installée. Un lien monacout.com
                  // ouvrirait Safari à la place. L'adresse est moins jolie, mais un
                  // événement partagé doit atterrir DANS l'app.
                  // ➜ Le jour où une nouvelle build App Store embarquera
                  //   `applinks:monacout.com` (déjà dans App.entitlements), on pourra
                  //   repasser au joli domaine sans rien perdre.
                  url: `https://monac-out.vercel.app/?event=${event.id}`,
                  dialogTitle: lang === 'en' ? 'Share event' : 'Partager',
                }).catch(() => {});
              }}
              style={{
                alignSelf: "flex-start",
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: C.bouton,
                border: `1px solid ${GOLD_FRAME}`,
                borderRadius: 1, background: "none", cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: C.boutonTexte, fontWeight: 600, letterSpacing: 1.5,
                textTransform: "uppercase", color: "#0F1D3A",
              }}
            >
              {lang === "en" ? "Share" : "Partager"}
            </button>
          )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## `src/components/MonacOutLogo.jsx`

```jsx
import { ROUGE_H, NAVY } from "../lib/couleurs";

// MonacOut — LE LOGO, REFAIT LE 10 OCT 2026
//
// Avant : un grand M en Playfair dans un double cadre or + navy, posé sur un fond
// de rayures bleues. Stéphanie a tranché sur maquette, en trois temps :
//   1. « le logo c'est pas du tout cela » — le M et son cadre sont retirés ;
//   2. « ou on enlève les rayures on met juste le nom » — plus de rayures ;
//   3. l'or disparaît partout (3,45:1 sur l'ivoire, sous la norme de lisibilité).
// Il ne reste donc que le NOM : MONAC' en navy, OUT en Rouge H, la signature
// « Monaco Ensemble » en navy atténué, et un trait Rouge H dessous.
//
// ⚠️ La signature n'est plus en bleu #3E7EA8. Ce bleu venait des rayures ; sans
// elles il devenait la seule note froide de l'écran, orpheline.
export default function MonacOutLogo({ width = 220, compact = false, lang = "fr" }) {
  const signature = lang === "en" ? "Monaco Together" : "Monaco Ensemble";
  const t = compact ? 15 : 26;

  return (
    <div style={{ width: compact ? "auto" : width, textAlign: "center", display: "inline-block" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 400, fontSize: t, letterSpacing: t * 0.42,
          color: NAVY, textTransform: "uppercase",
        }}>MONAC'</span>
        <span style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 600, fontSize: t, letterSpacing: t * 0.26,
          color: ROUGE_H, textTransform: "uppercase",
        }}>OUT</span>
      </div>
      <div style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 700, fontSize: compact ? 8 : 10, letterSpacing: compact ? 2.2 : 3,
        color: NAVY, textTransform: "uppercase", marginTop: compact ? 2 : 5, opacity: 0.62,
      }}>{signature}</div>
      {!compact && (
        <div style={{ height: 2, background: ROUGE_H, width: 120, margin: "11px auto 0" }} />
      )}
    </div>
  );
}

```

## `src/components/SectionTitle.jsx`

```jsx
const GOLD = "#B8966E";
const DARK = "#1C1612";

export default function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 11,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: GOLD,
        marginBottom: 2,
      }}>
        {sub}
      </div>
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 22,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: DARK,
        lineHeight: 1.1,
      }}>
        {children}
      </div>
    </div>
  );
}

```

## `src/components/Shell.jsx`

```jsx
import { useState } from "react";
import { fichierVersAvatar } from '../lib/avatar';
import { Capacitor } from "@capacitor/core";
import { ouvrirItineraire } from "../lib/itineraire";
import { localizeCat, localizeTitle } from "../i18n";
import { couleurCat } from "../lib/couleurs";
import BandeauWeb from "./BandeauWeb";
import VueReservation from "./VueReservation";
import { actionDeReservation } from "../lib/reservation";
import { track } from "../lib/track";
import { BORDEAU, NUIT, SERIF, SANS, RAYON, casseNaturelle } from "../lib/theme";

const IS_NATIVE = Capacitor.isNativePlatform();

const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const GOLD_FRAME = "#7B2D26";
const BLUE = "#9FC3DC";
const GREY = "#6A7080";
const WHITE = "#FFFFFF";
const CREAM = "#FFFFFF";

const CAT_FILTERS = [
  { id: "ateliers",   label: "Ateliers",    labelEn: "Workshops" },
  { id: "bienetre",   label: "Bien-être",   labelEn: "Wellness" },
  { id: "cinema",     label: "Cinéma",      labelEn: "Cinema" },
  { id: "concert",    label: "Concert",     labelEn: "Concert" },
  { id: "conference", label: "Conférences", labelEn: "Talks" },
  { id: "encheres",   label: "Enchères",    labelEn: "Auctions" },
  { id: "famille",    label: "Famille",     labelEn: "Family" },
  { id: "foody",      label: "Brunch · Apéro", labelEn: "Brunch · Apéro" },
  // Stéphanie, 11 oct 2026 : « on va créer un filtre breakfast café ».
  // Le menu latéral doit proposer les mêmes entrées que la barre du haut.
  { id: "petitdej",   label: "Petit-déj · Café", labelEn: "Breakfast · Coffee" },
  { id: "messe",      label: "Messe",       labelEn: "Mass" },
  { id: "musee",      label: "Musée",       labelEn: "Museum" },
  { id: "soiree",     label: "Soirée",      labelEn: "Nightlife" },
  { id: "sport",      label: "Sport",       labelEn: "Sport" },
  { id: "theatre",    label: "Théâtre",     labelEn: "Theatre" },
];

function addToCalendar(event) {
  const MONTHS = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
  const parts = event.date.split(' ');
  const day   = parseInt(parts[1]);
  const month = MONTHS[parts[2]];
  const year  = event.year || new Date().getFullYear();
  const t     = event.time.match(/(\d{1,2})h(\d{2})/);
  const h     = t ? parseInt(t[1]) : 12;
  const m     = t ? parseInt(t[2]) : 0;
  const pad   = n => String(n).padStart(2, '0');
  const fmt   = (y, mo, d, hh, mm) => `${y}${pad(mo+1)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(year, month, day, h, m)}`,
    `DTEND:${fmt(year, month, day, h + 2, m)}`,
    `SUMMARY:${event.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${event.desc.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.subtitle}`,
    event.link ? `URL:${event.link}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  const a = document.createElement('a');
  a.href = 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
  a.download = 'event.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function Shell({ onGoingSansCompte, tab, setTab, children, lang = "fr", catFilters = [], onCatFilter, onClearFilters, showMenu, setShowMenu, selectedEvent, onClosePopup, onToggleFav, favorites = [], adminOverlay = null, contactEmail = "contact@monacout.com", auth, social, onShowAuth, pendingCount = 0 }) {
  // 🎟️ LA FICHE OUVERTE N'AVAIT AUCUN BOUTON « RÉSERVER ».
  // Stéphanie, 29 oct 2026 : « les liens réserver buguent », « quand je vais
  // voir l'événement ça ne s'affiche pas correctement ». Les cartes du fil en
  // avaient un, la fiche détaillée non : on ouvrait la fiche et on ne pouvait
  // plus rien réserver. La vue s'affiche DANS l'app, jamais dans un onglet
  // (écran noir du 7 août).
  const [resaOuverte, setResaOuverte] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#FFFFFF",
      ...(IS_NATIVE ? {} : {
        display: "flex",
        // `flex-start` et non `center` : le bandeau du site ajoute ~62 px en haut,
        // et un contenu plus haut que la fenêtre se fait COUPER par le haut quand
        // il est centré — le cadre iPhone fait déjà 852 px.
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "78px 0 20px",
      }),
    }}>
      {/* Bandeau du site — ne s'affiche jamais dans l'app native (voir BandeauWeb) */}
      <BandeauWeb lang={lang} />
      <div style={IS_NATIVE ? {
        width: "100%",
        height: "100dvh",
        background: WHITE,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      } : {
        width: 393,
        height: 852,
        background: WHITE,
        borderRadius: 54,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 80px rgba(15,29,58,0.22)",
        position: "relative",
      }}>
        {/* Barre haute : zone sûre sous l'encoche réelle (natif) ou fausse encoche (aperçu web) */}
        <div style={{
          flexShrink: 0,
          height: IS_NATIVE ? "env(safe-area-inset-top, 44px)" : 46,
          background: WHITE,
          position: "relative",
          zIndex: 10,
        }}>
          {!IS_NATIVE && (
            <div style={{
              position: "absolute",
              top: 10, left: "50%",
              transform: "translateX(-50%)",
              width: 120, height: 34,
              background: "#000",
              borderRadius: 20,
              zIndex: 5,
            }} />
          )}
        </div>

        {/* Contenu scrollable */}
        {/* `overflowX/overscrollBehaviorX` : l'app se laissait tirer de gauche à droite
            au doigt. La règle est aussi dans index.css, mais on la pose ICI en style
            inline parce que c'est CE conteneur qui reçoit réellement le geste. */}
        <div id="main-scroll" style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehaviorX: "none",
          touchAction: "pan-y",
          maxWidth: "100%",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} className="hide-scrollbar">
          {children}
        </div>

        {/* Overlay sombre */}
        <div
          onClick={() => setShowMenu?.(false)}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 400,
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "auto" : "none",
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Overlay admin */}
        {adminOverlay}

        {/* Popup événement */}
        {selectedEvent && (
          <>
            <div onClick={onClosePopup} style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 600,
            }} />
            <div style={{
              // 🚨 LA FICHE DÉBORDAIT DE L'ÉCRAN. Stéphanie, 29 oct 2026 :
              // « quand je vais voir l'événement ça ne s'affiche pas
              // correctement ». Centrée par `translate(-50%, -50%)` sans
              // hauteur maximale, une fiche à longue description dépassait en
              // HAUT comme en BAS — et le haut, coupé, emportait la catégorie
              // et le bouton de fermeture. On la borne à 86 % de la hauteur et
              // on la rend défilante.
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 318, maxHeight: "86%",
              overflowY: "auto", WebkitOverflowScrolling: "touch",
              zIndex: 601,
              border: `1px solid ${BORDEAU}`,
              borderRadius: RAYON.md,
              padding: 0,
              background: WHITE,
            }}>
              <div style={{
                position: "relative",
                borderRadius: 1,
                background: CREAM,
                padding: "22px 20px 20px",
              }}>
                {/* Fermer */}
                <button onClick={onClosePopup} style={{
                  position: "absolute", top: 10, right: 12,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 16, color: GREY, lineHeight: 1, padding: 0,
                }}>✕</button>

                {/* Catégorie */}
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 13, fontWeight: 700, letterSpacing: 3,
                  textTransform: "uppercase", color: BORDEAU,
                  marginBottom: 6, textAlign: "center",
                }}>{localizeCat(selectedEvent.cat, lang)}</div>

                {/* Titre — en casse de phrase, comme dans le fil. Les données
                    arrivent en capitales parce que les sources les publient
                    ainsi ; `casseNaturelle` les abaisse SANS toucher aux noms
                    propres, appris sur les sous-titres. */}
                <div style={{
                  fontFamily: SERIF,
                  fontWeight: 600, fontSize: 21, color: NUIT,
                  textAlign: "center", lineHeight: 1.22, marginBottom: 14,
                }}>{casseNaturelle(localizeTitle(selectedEvent.title.replace(/\n/g, " "), lang))}</div>

                {selectedEvent.directory ? (
                  <div style={{ marginBottom: 4 }}>
                    {selectedEvent.directory.map((d, i) => {
                      const mapUrl = d.map || `https://www.google.com/maps/search/${encodeURIComponent(d.name + " Monaco")}`;
                      const isMapLink = d.link && /google\.[^/]*\/maps/.test(d.link);
                      return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                        padding: "11px 2px",
                        borderBottom: i < selectedEvent.directory.length - 1 ? "1px solid rgba(15,29,58,0.08)" : "none",
                      }}>
                        <span style={{ textAlign: "left", minWidth: 0 }}>
                          <span style={{ display: "block", fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY, fontWeight: 600 }}>{d.name}</span>
                          {d.info && <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 2 }}>{d.info}</span>}
                          {/* Le film : genre, durée, note, puis le résumé. Stéphanie,
                              11 oct 2026 : « met plutôt dans la fiche ». Un titre et une
                              heure ne disent pas si le film vous tente. Ces champs
                              n'existent que pour la carte cinéma — ailleurs, rien ne
                              s'affiche, donc rien ne bouge. */}
                          {(d.genre || d.duree || typeof d.rt === "number") && (
                            <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 3 }}>
                              {[d.genre, d.duree].filter(Boolean).join(" · ")}
                              {typeof d.rt === "number" && (
                                // 🍅 au-dessus de 60 %, 🤢 en dessous : la convention
                                // de Rotten Tomatoes lui-même (« fresh » / « rotten »).
                                <span style={{ fontWeight: 700, marginLeft: (d.genre || d.duree) ? 6 : 0,
                                               color: d.rt >= 60 ? "#44581C" : "#7B2D26" }}>
                                  {d.rt >= 60 ? "🍅" : "🤢"} {d.rt} %
                                </span>
                              )}
                            </span>
                          )}
                          {d.desc && (
                            <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 12,
                                           color: "#555", lineHeight: 1.55, marginTop: 6, maxWidth: 420 }}>{d.desc}</span>
                          )}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          {/* « J'y vais » lieu par lieu, VISIBLE PAR LES AMIES.
                              L'identifiant écrit en base est composé : identifiant de la
                              fiche du jour (déduit de la DATE) × 1000 + numéro définitif
                              du lieu. Il désigne donc « ce lieu, ce soir-là » sans
                              ambiguïté et sans toucher au schéma de la base.
                              Voir scripts/lib-lieux.mjs pour le raisonnement complet. */}
                          {d.vid > 0 && (() => {
                            const idLieu = selectedEvent.id * 1000 + d.vid;
                            const jyVais = (social?.myParticipations || []).includes(idLieu);
                            const amies = social?.friendsGoingTo?.(idLieu) || [];
                            return (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              {amies.length > 0 && (
                                <span title={amies.map(f => f.display_name).filter(Boolean).join(", ")}
                                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9,
                                               fontWeight: 600, color: GOLD, whiteSpace: "nowrap" }}>
                                  {amies.map(f => (f.display_name || "").split(" ")[0]).filter(Boolean).slice(0, 2).join(", ")}
                                  {amies.length > 2 ? ` +${amies.length - 2}` : ""}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  // Sans compte : la carte qui EXPLIQUE, pas l'écran muet.
                                  if (!auth?.user) { (onGoingSansCompte || onShowAuth)?.(idLieu); return; }
                                  social?.toggleParticipation?.(idLieu);
                                }}
                                aria-pressed={jyVais}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  padding: "4px 8px", cursor: "pointer",
                                  border: `1px solid ${jyVais ? GOLD : "rgba(15,29,58,0.18)"}`,
                                  borderRadius: 1, background: jyVais ? "#FFF8EC" : "none",
                                  fontFamily: "'Josefin Sans', sans-serif",
                                  fontSize: 8.5, fontWeight: 600, letterSpacing: 1,
                                  textTransform: "uppercase",
                                  color: jyVais ? GOLD : NAVY, whiteSpace: "nowrap",
                                }}
                              >
                                {jyVais ? "✓ " : ""}{lang === "en" ? "Going" : "J'y vais"}
                              </button>
                              </span>
                            );
                          })()}
                          {/* Téléphone cliquable. `tel:` ouvre le composeur du téléphone,
                              ce n'est PAS une page web : aucun risque d'écran noir comme
                              avec target="_blank". Demande de Stéphanie : une icône à
                              toucher plutôt que le numéro écrit en clair. */}
                          {d.tel && (
                            <a href={`tel:${d.tel.replace(/[^+0-9]/g, "")}`}
                               title={lang === "en" ? `Call ${d.name}` : `Appeler ${d.name}`}
                               aria-label={lang === "en" ? `Call ${d.name}` : `Appeler ${d.name}`}
                               style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", lineHeight: 1 }}>
                              <svg width="17" height="17" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                              </svg>
                            </a>
                          )}
                          {/* Une épingle de carte n'a de sens que pour un LIEU. Sur la
                              fiche cinéma, les entrées sont des FILMS : chercher
                              « Pressure Monaco » sur une carte ne mène nulle part. */}
                          {selectedEvent.cat !== "CINÉMA" && (
                            <button onClick={() => ouvrirItineraire(d.name)}
                              title={lang === "en" ? "Directions" : "Itinéraire"}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                                       fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600,
                                       color: GOLD, letterSpacing: 1 }}>
                              {lang === "en" ? "Directions →" : "Direction →"}
                            </button>
                          )}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                <>
                {/* Description */}
                <div style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13, color: "#333", lineHeight: 1.65,
                  marginBottom: 18, textAlign: "left",
                }}>{lang === "en" ? (selectedEvent.descEn || selectedEvent.desc) : selectedEvent.desc}</div>

                {/* Amis qui y vont */}
                {(() => {
                  const going = social?.friendsGoingTo?.(selectedEvent.id) || [];
                  if (!going.length) return null;
                  const n = going.map(f => f.display_name).filter(Boolean);
                  // 🚨 SUR UNE FICHE « EN COURS », LE PRESENT MENT.
                  // La table participations ne stocke PAS de date : sur une expo ouverte
                  // des mois, on sait qu'une amie y est allee, jamais QUAND. Ecrire « y va »
                  // affirme « aujourd'hui » — Stephanie a vu deux fois Nadege et Toma
                  // annonces sur le Mariage du siecle du jour alors qu'elles y etaient
                  // allees la semaine d'avant. Le passe, lui, reste vrai quel que soit le jour.
                  // ➜ Le vrai correctif reste la colonne `jour` (voir CLAUDE.md, § A FAIRE).
                  const enCours = !!selectedEvent.ongoing;
                  const label = n.length === 1
                    ? (lang === "en" ? `${n[0]} ${enCours ? "has been" : "is going"}` : `${n[0]} ${enCours ? "y est allée" : "y va"}`)
                    : n.length === 2
                      ? (lang === "en" ? `${n[0]} and ${n[1]} ${enCours ? "have been" : "are going"}` : `${n[0]} et ${n[1]} ${enCours ? "y sont allées" : "y vont"}`)
                      : (lang === "en" ? `${n[0]}, ${n[1]} +${n.length - 2} more are going` : `${n[0]}, ${n[1]} +${n.length - 2} autres y vont`);
                  return (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#FFF8EC", border: `1px solid ${GOLD_FRAME}`, borderRadius: 20,
                      padding: "7px 14px", marginBottom: 16,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD} style={{ flexShrink: 0 }} aria-hidden="true">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, color: NAVY, letterSpacing: 0.3 }}>{label}</span>
                    </div>
                  );
                })()}

                {/* Coeur */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <button
                    onClick={() => onToggleFav?.(selectedEvent.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, lineHeight: 1 }}
                  >{favorites.includes(selectedEvent.id) ? "❤️" : "🤍"}</button>
                </div>

                {/* 🎟️ RÉSERVER — le bouton qui manquait sur la fiche ouverte.
                    Même règle que partout : un seul mot, « Réserver une place »
                    ou « une table » selon la catégorie, et il fait le mieux
                    disponible — formulaire, site, ou téléphone.
                    ⚠️ En mode `tel`, l'objet rendu porte `tel` et PAS `url` :
                    c'est l'oubli qui, sur les cartes, envoyait l'app sur
                    `/undefined` et la rechargeait à l'accueil (29 oct). */}
                {(() => {
                  const a = actionDeReservation(selectedEvent, selectedEvent.cat, lang);
                  if (!a) return null;
                  return (
                    <button
                      onClick={() => {
                        track("reservation_clic", { mode: a.mode, cat: selectedEvent.cat,
                                                    lieu: selectedEvent.source || selectedEvent.subtitle });
                        if (a.mode === "tel") { window.location.href = `tel:${a.tel}`; return; }
                        if (!a.url) return;
                        setResaOuverte({ url: a.url, nom: (selectedEvent.title || "").replace(/\n/g, " ") });
                      }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", minHeight: 44, marginBottom: 10, cursor: "pointer",
                        border: "none", borderRadius: RAYON.pastille, background: BORDEAU,
                        fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
                        color: "#FFFCF8",
                      }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFCF8"
                           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                        {a.mode === "tel"
                          ? <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
                          : <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"/>}
                      </svg>
                      {a.mot}
                    </button>
                  );
                })()}

                {/* Itinéraire */}
                {(selectedEvent.subtitle || selectedEvent.phone) && (
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch", justifyContent: "center" }}>
                    {selectedEvent.subtitle && (
                      <button
                        onClick={() => ouvrirItineraire(selectedEvent.subtitle)}
                        style={{
                          flex: selectedEvent.phone ? 1 : "0 0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: 11, fontWeight: 600, letterSpacing: 2,
                          textTransform: "uppercase", color: WHITE,
                          background: NAVY, padding: "11px 24px", border: "none",
                          cursor: "pointer", borderRadius: 1,
                        }}
                      ><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {lang === "en" ? "Directions" : "Direction"}
                      </span></button>
                    )}
                    {/* 🗑️ Bouton téléphone retiré : « Réserver » s'en charge. */}
                  </div>
                )}

                {/* Ajouter au calendrier */}
                <button
                  onClick={() => addToCalendar(selectedEvent)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    width: "100%", marginTop: 10, padding: "10px 0",
                    border: `1.5px solid ${GOLD_FRAME}`,
                    borderRadius: 1, background: "none", cursor: "pointer",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                    textTransform: "uppercase", color: NAVY,
                  }}
                >
                  {lang === "en" ? "Add to calendar" : "Ajouter au calendrier"}
                </button>
                </>
                )}
              </div>
            </div>
          </>
        )}

        {/* 🎟️ La vue de réservation, par-dessus la fiche ouverte. */}
        {resaOuverte && (
          <VueReservation
            url={resaOuverte.url}
            titre={resaOuverte.nom}
            lang={lang}
            onFermer={() => setResaOuverte(null)}
          />
        )}

        {/* Menu panneau */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 46, right: 0,
            width: 250, height: "calc(100% - 46px)",
            background: WHITE,
            zIndex: 1001,
            transform: showMenu ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            paddingBottom: 40,
            borderLeft: "1px solid rgba(196,162,65,0.3)",
            borderTop: "1px solid rgba(196,162,65,0.3)",
          }}
        >
          {/* Header menu */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px 10px",
            borderBottom: "1px solid rgba(196,162,65,0.2)",
            marginBottom: 8,
          }}>
            {auth?.profile?.display_name ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                {/* Photo de profil, modifiable ICI : l'écran d'inscription ne se rouvre
                    jamais, donc c'est le seul endroit où les comptes déjà créés
                    peuvent ajouter ou changer leur photo. Carré 24 px, coins 4. */}
                <label htmlFor="mo-avatar-menu" title={lang === "en" ? "Change photo" : "Changer ma photo"} style={{ cursor: "pointer", flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                    border: `1px solid ${auth.profile.avatar_url ? GOLD : "rgba(15,29,58,0.25)"}`,
                    background: auth.profile.avatar_url
                      ? `center/cover no-repeat url("${auth.profile.avatar_url}")`
                      : "#FFFDF7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: GREY, fontSize: 11, fontFamily: "'Lato', sans-serif",
                  }}>{auth.profile.avatar_url ? "" : "＋"}</div>
                </label>
                <input
                  id="mo-avatar-menu" type="file" accept="image/*" style={{ display: "none" }}
                  onChange={async e => {
                    const f = e.target.files?.[0]; e.target.value = "";
                    if (!f) return;
                    try {
                      const url = await fichierVersAvatar(f);
                      await auth.saveProfile(auth.profile.display_name, undefined, url);
                    } catch { /* photo illisible : on ne change rien */ }
                  }}
                />
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif", fontSize: 13,
                  color: NAVY, letterSpacing: 0.5, minWidth: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {lang === "en" ? "Hi, " : "Bonjour, "}
                  <span style={{ color: GOLD, fontWeight: 600 }}>{auth.profile.display_name}</span>
                </div>
              </div>
            ) : <span />}
            <button
              onClick={() => setShowMenu?.(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 20, color: GREY, padding: 4, lineHeight: 1, flexShrink: 0,
              }}
            >✕</button>
          </div>

          {/* My Agenda */}
          <button onClick={() => { setTab?.("agenda"); setShowMenu?.(false); }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: tab === "agenda" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <HeartIcon color={tab === "agenda" ? GOLD : GREY} active={tab === "agenda"} />
            {lang === "en" ? "My Agenda" : "Mon Agenda"}
          </button>

          {/* Mon Cercle */}
          <button onClick={() => { setTab?.("friends"); setShowMenu?.(false); }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: tab === "friends" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tab === "friends" ? GOLD : GREY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {lang === "en" ? "My Circle" : "Mon Cercle"}
            {pendingCount > 0 && (
              <span style={{
                marginLeft: "auto", background: GOLD, color: WHITE,
                borderRadius: 10, padding: "1px 7px",
                fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700,
              }}>{pendingCount}</span>
            )}
          </button>

          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* Catégories */}
          {CAT_FILTERS.map(f => {
            const active = catFilters.includes(f.id);
            return (
              <button key={f.id} onClick={() => onCatFilter?.(f.id)} style={{
                width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                padding: "11px 24px", fontFamily: "'Jost', sans-serif",
                fontSize: 14, fontWeight: active ? 600 : 400, color: active ? NAVY : GREY,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${active ? GOLD : "rgba(15,29,58,0.3)"}`,
                  background: active ? GOLD : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {lang === "en" ? f.labelEn : f.label}
              </button>
            );
          })}

          {catFilters.length > 0 && (
            <button onClick={() => onClearFilters?.()} style={{
              width: "100%", textAlign: "center", background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px", fontFamily: "'Jost', sans-serif",
              fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase",
              marginTop: 8,
            }}>{lang === "en" ? "Clear all" : "Tout effacer"}</button>
          )}

          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "12px 24px" }} />

          {/* Proposer un événement (contact organisateurs) */}
          <button onClick={() => {
            const subject = lang === "en" ? "Event submission — Monac'Out" : "Proposition d'événement — Monac'Out";
            const body = lang === "en"
              ? "Hello,\n\nI'd like to submit an event for Monac'Out:\n\n• Event name:\n• Date & time:\n• Venue (hall + district):\n• Short description:\n• Ticket / info link:\n• Venue phone:\n\nThank you!"
              : "Bonjour,\n\nJe souhaite proposer un événement pour Monac'Out :\n\n• Nom de l'événement :\n• Date & heure :\n• Lieu (salle + quartier) :\n• Courte description :\n• Lien billetterie / infos :\n• Téléphone du lieu :\n\nMerci !";
            window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke={GOLD} strokeWidth="1.4"/>
              <path d="M2.5 5L9 9.5L15.5 5" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {lang === "en" ? "Submit an event" : "Proposer un événement"}
          </button>

          {/* Section connexion */}
          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "12px 24px" }} />
          {auth?.user ? (
            <div style={{ padding: "4px 24px 16px" }}>
              <div style={{
                fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY,
                marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {auth.profile?.display_name
                  ? `${auth.profile.display_name} · ${auth.user.email}`
                  : auth.user.email}
              </div>
              <button onClick={() => { auth.signOut(); setShowMenu?.(false); }} style={{
                width: "100%", padding: "10px 0", background: "none",
                border: `1px solid rgba(15,29,58,0.2)`, borderRadius: 1, cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase", color: GREY,
              }}>{lang === "en" ? "Sign out" : "Se déconnecter"}</button>
            </div>
          ) : (
            <button onClick={() => { onShowAuth?.(); setShowMenu?.(false); }} style={{
              width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px 20px", fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: 400, color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {lang === "en" ? "Sign in" : "Se connecter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

```

## `src/components/VueReservation.jsx`

```jsx
/**
 * La vue de réservation : la page du lieu, affichée DANS Monac'Out.
 *
 * Stéphanie, 26 oct 2026 : « en ouvrant une vue dans l'app de leur système ».
 * On ne quitte donc jamais l'app — voir src/lib/reservation.js pour pourquoi un
 * lien classique est exclu (écran noir iPhone) et pourquoi le plugin natif
 * n'est pas disponible (il demanderait une build App Store).
 *
 * ⚠️ UN CADRE REFUSÉ RESTE BLANC, SANS ERREUR. On ne peut pas le détecter ici.
 * La protection est en amont, dans les données : `resa` n'existe que pour une
 * page vérifiée cadrable. Mais on laisse quand même une porte de sortie visible
 * — « Ça ne s'affiche pas ? » — pour qui tomberait malgré tout sur du blanc.
 */
import { useEffect, useState } from "react";
import { track } from "../lib/track";

export default function VueReservation({ url, titre, lang, onFermer }) {
  const [charge, setCharge] = useState(false);

  // La touche Échap et le bouton retour d'Android ferment la vue.
  useEffect(() => {
    const auClavier = (e) => { if (e.key === "Escape") onFermer(); };
    window.addEventListener("keydown", auClavier);
    return () => window.removeEventListener("keydown", auClavier);
  }, [onFermer]);

  // Tant que la vue est ouverte, le fil derrière ne défile pas.
  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = avant; };
  }, []);

  // 📊 COMBIEN DE TEMPS LA VUE RESTE OUVERTE. Un clic ne dit pas grand-chose :
  // une page de réservation refermée en deux secondes, c'est un échec (cadre
  // blanc, page illisible sur petit écran). Quelques dizaines de secondes, c'est
  // quelqu'un qui remplit vraiment un formulaire. Stéphanie, 27 oct 2026.
  useEffect(() => {
    const debut = Date.now();
    const hote = (() => { try { return new URL(url).hostname; } catch { return "?"; } })();
    track("reservation_vue_ouverte", { hote });
    return () => track("reservation_vue_fermee", {
      hote, secondes: Math.round((Date.now() - debut) / 1000),
    });
  }, [url]);

  if (!url) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "#FFFDF8", display: "flex", flexDirection: "column",
      }}
    >
      {/* Barre du haut : on sait toujours où l'on est et comment revenir. */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px",
        borderBottom: "1px solid #E8E0D4", background: "#FFFDF8", flexShrink: 0,
      }}>
        <button
          onClick={onFermer}
          aria-label={lang === "en" ? "Close" : "Fermer"}
          style={{
            border: "none", background: "#7B2D26", color: "#fff",
            width: 34, height: 34, borderRadius: 17, fontSize: 19,
            lineHeight: 1, cursor: "pointer", flexShrink: 0, fontWeight: 700,
          }}
        >×</button>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: ".08em", color: "#7B2D26", textTransform: "uppercase",
          }}>{lang === "en" ? "Booking" : "Réservation"}</div>
          <div style={{
            fontFamily: "'Lato', sans-serif", fontSize: 14, fontWeight: 700,
            color: "#2A2520", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>{titre}</div>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {!charge && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#8A8378",
          }}>{lang === "en" ? "Loading…" : "Chargement…"}</div>
        )}
        <iframe
          src={url}
          title={lang === "en" ? "Booking" : "Réservation"}
          onLoad={() => setCharge(true)}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>

      {/* La réservation se fait chez le lieu, pas chez nous : il faut le dire. */}
      <div style={{
        padding: "10px 16px calc(env(safe-area-inset-bottom, 0px) + 10px)",
        borderTop: "1px solid #E8E0D4", background: "#FFFDF8", flexShrink: 0,
        fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: "#8A8378",
        textAlign: "center", lineHeight: 1.5,
      }}>
        {lang === "en"
          ? "Booking is handled by the venue's own system. Monac'Out does not take the booking."
          : "La réservation est faite par le système du lieu. Monac'Out ne réserve pas à votre place."}
      </div>
    </div>
  );
}

```

## `src/components/screens/AdminScreen.jsx`

```jsx
import { useState, useEffect } from "react";

const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const IVORY = "#FDFAF5";
const PROJECT_ID = "182674";
const STORAGE_KEY = "monacout_admin_key";

async function hogql(key, sql) {
  const res = await fetch(`https://eu.posthog.com/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql } }),
  });
  if (!res.ok) throw new Error(res.status);
  const d = await res.json();
  return d.results ?? [];
}

export default function AdminScreen({ onClose }) {
  const [key, setKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (key) load(key); }, [key]);

  async function load(k) {
    setLoading(true); setError(null);
    try {
      const [d1, d7, d30, countries, devices] = await Promise.all([
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND toDate(timestamp)=today()"),
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND timestamp>=now()-interval 7 day"),
        hogql(k, "SELECT uniq(distinct_id) FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day"),
        hogql(k, "SELECT coalesce(properties.$geoip_country_name,'Inconnu') as c, count() n FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day GROUP BY c ORDER BY n DESC LIMIT 7"),
        hogql(k, "SELECT multiIf(properties.$os IN ('iOS','Android'),'Mobile','Desktop') d, count() n FROM events WHERE event='$pageview' AND timestamp>=now()-interval 30 day GROUP BY d ORDER BY n DESC"),
      ]);
      setStats({
        today: d1[0]?.[0] ?? 0,
        week:  d7[0]?.[0]  ?? 0,
        month: d30[0]?.[0] ?? 0,
        countries,
        devices,
      });
    } catch {
      setError("Clé invalide ou erreur réseau.");
    }
    setLoading(false);
  }

  function saveKey() {
    const k = input.trim();
    if (!k.startsWith("phx_")) return setError("La clé doit commencer par phx_");
    localStorage.setItem(STORAGE_KEY, k);
    setKey(k); setInput(""); setError(null);
  }

  function resetKey() {
    localStorage.removeItem(STORAGE_KEY);
    setKey(""); setStats(null); setError(null);
  }

  const maxCountry = stats?.countries?.[0]?.[1] || 1;
  const totalDevices = stats?.devices?.reduce((s, r) => s + r[1], 0) || 1;

  if (!key) {
    return (
      <div style={{ position: "absolute", inset: 0, background: IVORY, zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <button onClick={onClose} style={{ position: "absolute", top: 60, right: 20, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: NAVY, lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: NAVY, letterSpacing: 3, marginBottom: 4 }}>ANALYTICS</div>
        <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GOLD, letterSpacing: 4, marginBottom: 36 }}>MONAC'OUT</div>
        <div style={{ width: "100%", background: "white", borderRadius: 12, border: `1px solid ${GOLD}`, padding: 22 }}>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: NAVY, letterSpacing: 1, marginBottom: 14 }}>Clé personnelle PostHog :</div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && saveKey()}
            placeholder="phx_..."
            autoComplete="off"
            style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${GOLD}`, borderRadius: 8, fontSize: 13, fontFamily: "monospace", boxSizing: "border-box", outline: "none", color: NAVY }}
          />
          {error && <div style={{ fontSize: 11, color: "#C0392B", marginTop: 8 }}>{error}</div>}
          <button onClick={saveKey} style={{ marginTop: 14, width: "100%", background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: 3, cursor: "pointer" }}>
            VALIDER
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: IVORY, zIndex: 2000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ flexShrink: 0, background: NAVY, padding: "54px 20px 16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 20, letterSpacing: 3 }}>ANALYTICS</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", color: GOLD, fontSize: 9, letterSpacing: 3, marginTop: 3 }}>MONAC'OUT</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 26, cursor: "pointer", lineHeight: 1, paddingBottom: 2 }}>×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 24px" }}>
        {loading && (
          <div style={{ textAlign: "center", paddingTop: 60, fontFamily: "'Josefin Sans', sans-serif", color: GOLD, fontSize: 11, letterSpacing: 3 }}>
            CHARGEMENT…
          </div>
        )}

        {error && !loading && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#7F1D1D", marginBottom: 10 }}>{error}</div>
            <button onClick={resetKey} style={{ background: "none", border: "none", color: NAVY, textDecoration: "underline", fontSize: 12, cursor: "pointer", padding: 0 }}>
              Changer la clé
            </button>
          </div>
        )}

        {stats && !loading && (
          <>
            {/* 3 stat boxes */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[
                { label: "Aujourd'hui", value: stats.today },
                { label: "7 jours",     value: stats.week  },
                { label: "30 jours",    value: stats.month },
              ].map(({ label, value }) => (
                <div key={label} style={{ flex: 1, background: "white", borderRadius: 10, border: `1px solid ${GOLD}`, padding: "14px 6px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: NAVY, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 8, color: GOLD, letterSpacing: 2, marginTop: 5 }}>VISITEURS</div>
                  <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "#999", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Pays */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(15,29,58,0.1)", padding: "14px 14px", marginBottom: 14 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: NAVY, letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>LOCALISATION · 30 JOURS</div>
              {stats.countries.filter(r => r[0] !== "Inconnu").slice(0, 6).map(([country, n]) => (
                <div key={country} style={{ marginBottom: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: NAVY, marginBottom: 4 }}>
                    <span>{country}</span>
                    <span style={{ color: GOLD, fontWeight: 600 }}>{n}</span>
                  </div>
                  <div style={{ height: 3, background: "#F0EDE8", borderRadius: 2 }}>
                    <div style={{ height: 3, background: GOLD, borderRadius: 2, width: `${Math.round((n / maxCountry) * 100)}%`, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Appareils */}
            <div style={{ background: "white", borderRadius: 10, border: "1px solid rgba(15,29,58,0.1)", padding: "14px 14px", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: NAVY, letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>APPAREILS · 30 JOURS</div>
              {stats.devices.map(([device, n]) => {
                const pct = Math.round((n / totalDevices) * 100);
                return (
                  <div key={device} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: NAVY, width: 70 }}>
                      {device === "Mobile" ? "📱 Mobile" : "🖥 Desktop"}
                    </div>
                    <div style={{ flex: 1, height: 3, background: "#F0EDE8", borderRadius: 2 }}>
                      <div style={{ height: 3, background: NAVY, borderRadius: 2, width: `${pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "#999", width: 32, textAlign: "right" }}>{pct}%</div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => load(key)} style={{ flex: 1, background: NAVY, color: "white", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, letterSpacing: 3, cursor: "pointer" }}>
                ACTUALISER
              </button>
              <button onClick={resetKey} style={{ background: "none", border: "1px solid rgba(15,29,58,0.2)", color: "#999", borderRadius: 8, padding: "13px 16px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, cursor: "pointer" }}>
                Clé
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

```

## `src/components/screens/AgendaScreen.jsx`

```jsx
import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const GREY = "#6A7A9A";
const LIGHT = "#F5F5FA";
const BORDER = "#DDE0F0";
const WHITE = "#FFFFFF";

const JOURS_FR  = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MOIS_MATCH = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const DAY_HEADERS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function getEventDaySet(year, month) {
  const match = MOIS_MATCH[month];
  const set = new Set();
  ALL_EVENTS.forEach(e => {
    const parts = e.date.trim().split(" ");
    if (parts[2] === match && (e.year || 2026) === year) set.add(parseInt(parts[1]));
  });
  return set;
}

function getEventsForDay(year, month, dayNum) {
  const match = MOIS_MATCH[month];
  const weekday = new Date(year, month, dayNum).getDay();
  const dayStr = `${JOURS_FR[weekday]} ${dayNum} ${match}`;
  return ALL_EVENTS.filter(e => e.date === dayStr && (e.year || 2026) === year);
}

export default function AgendaScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const now = new Date();
  const [year, setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDays, setSelectedDays] = useState(() => {
    const s = new Set();
    if (getEventDaySet(now.getFullYear(), now.getMonth()).has(now.getDate()))
      s.add(now.getDate());
    return s;
  });

  function goPrev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else { setMonth(m => m - 1); }
    setSelectedDays(new Set());
  }
  function goNext() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else { setMonth(m => m + 1); }
    setSelectedDays(new Set());
  }
  const canPrev = !(year === now.getFullYear() && month === now.getMonth());
  const canNext = !(year === 2027 && month === 4);

  const eventDays = getEventDaySet(year, month);

  function toggleDay(day) {
    setSelectedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  const events = [...selectedDays]
    .sort((a, b) => a - b)
    .flatMap(d => getEventsForDay(year, month, d));
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) =>
    d !== null && new Date().getFullYear() === year &&
    new Date().getMonth() === month && new Date().getDate() === d;

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "18px 20px 14px",
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 22, color: WHITE }}>
          {lang === "en" ? "Calendar" : "Agenda"}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 12, color: "#D4B896", marginTop: 2 }}>
          Monaco · {year}
        </div>
      </div>

      {/* Calendar card */}
      <div style={{ background: WHITE, margin: "12px 12px 0", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: `1px solid ${BORDER}` }}>
          <button
            onClick={goPrev}
            disabled={!canPrev}
            style={{ background: "none", border: "none", cursor: canPrev ? "pointer" : "default", fontSize: 18, color: canPrev ? GOLD : BORDER, padding: "0 8px" }}
          >‹</button>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 17, color: NAVY, letterSpacing: 0.5 }}>
            {MOIS_FULL[month]} {year}
          </div>
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{ background: "none", border: "none", cursor: canNext ? "pointer" : "default", fontSize: 18, color: canNext ? GOLD : BORDER, padding: "0 8px" }}
          >›</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "8px 10px 4px" }}>
          {DAY_HEADERS.map(d => (
            <div key={d} style={{ textAlign: "center", fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 700, color: GREY, letterSpacing: 0.5 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "4px 10px 12px" }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const hasEvent = eventDays.has(day);
            const isSelected = selectedDays.has(day);
            const today = isToday(day);
            return (
              <button
                key={i}
                onClick={() => hasEvent && toggleDay(day)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  border: today ? `2px solid ${GOLD}` : isSelected ? `2px solid ${NAVY}` : "2px solid transparent",
                  background: isSelected ? NAVY : hasEvent ? `rgba(184,150,110,0.12)` : "transparent",
                  color: isSelected ? WHITE : hasEvent ? NAVY : "#C0C8D8",
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 13,
                  fontWeight: hasEvent ? 700 : 400,
                  cursor: hasEvent ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: 2,
                  position: "relative",
                }}
              >
                {day}
                {hasEvent && (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? WHITE : GOLD }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      <div style={{ padding: "14px 12px 20px" }}>
        {selectedDays.size > 0 ? (
          <>
            <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>
              {selectedDays.size === 1
                ? `${JOURS_FR[new Date(year, month, [...selectedDays][0]).getDay()]} ${[...selectedDays][0]} ${MOIS_MATCH[month]} 2026`
                : `${selectedDays.size} dates · ${MOIS_FULL[month]} 2026`
              } · {events.length} {lang === "en" ? `event${events.length !== 1 ? "s" : ""}` : `événement${events.length !== 1 ? "s" : ""}`}
            </div>
            {events.map(e => (
              <EventCard key={e.id} event={e} onClick={onSelectEvent} favorites={favorites} onToggleFav={onToggleFav} onCategoryClick={onCategoryClick} lang={lang} />
            ))}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 20px", fontFamily: "Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 14 }}>
            {lang === "en" ? "Select a highlighted date to see events." : "Sélectionnez une date pour voir les événements."}
          </div>
        )}
      </div>
    </div>
  );
}

```

## `src/components/screens/AuthScreen.jsx`

```jsx
import { useState, useEffect } from 'react'
import { fichierVersAvatar, avatarMonogramme, MONOGRAMMES } from '../../lib/avatar'
import { prenomDepuisEmail } from '../../lib/prenom'

const NAVY = "#0F1D3A"
const GOLD = "#7B2D26"
const GOLD_FRAME = "#7B2D26"
const BLUE = "#9FC3DC"

const PENDING_KEY = 'monacout_pending_login_email'

export default function AuthScreen({ onClose, auth, lang = "fr", inviterName = null }) {
  // Si un code est déjà en attente (on a quitté l'app pour lire le mail) → on rouvre PILE sur l'écran code.
  const pending = (typeof localStorage !== 'undefined' && !auth.user) ? localStorage.getItem(PENDING_KEY) : null
  const [step, setStep]         = useState(pending ? 'code' : 'email') // email | code | name
  const [email, setEmail]       = useState(pending || '')
  const [code, setCode]         = useState('')
  const [nameSaisi, setNameSaisi] = useState('')
  const [nameTouche, setNameTouche] = useState(false)  // la personne a-t-elle touche au champ ?
  const [topics, setTopics]     = useState([])
  const [photo, setPhoto]       = useState('')      // photo choisie, en data URL
  const [mono, setMono]         = useState(null)    // index de l'avatar monogramme, ou null
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const clearPending = () => { try { localStorage.removeItem(PENDING_KEY) } catch { /* rien */ } }
  // Fermer = on abandonne la connexion en cours → on oublie le code en attente.
  const handleClose = () => { clearPending(); onClose?.() }

  // Referme automatiquement dès que la personne est connectée avec un prénom.
  useEffect(() => { if (auth.user && auth.profile?.display_name) { clearPending(); onClose() } }, [auth.user, auth.profile])

  // Le prénom deviné est une valeur DÉRIVÉE, pas un état posé dans un effet :
  // écrire dans le state depuis un useEffect déclenche des rendus en cascade (eslint le
  // refuse) et rend le champ difficile à effacer. Ici, tant que personne n'a touché au
  // champ, il AFFICHE la suggestion ; au premier caractère tapé, la saisie prend la main
  // — y compris pour tout effacer.
  const suggere = prenomDepuisEmail(auth.user?.email)
  const name = nameTouche ? nameSaisi : suggere

  const TOPICS = [
    { id: 'culture',   fr: 'Musée / Ciné / Atelier', en: 'Museum / Cinema / Workshop' },
    { id: 'foodnight', fr: 'Food / Nightlife',   en: 'Food / Nightlife' },
    { id: 'musique',   fr: 'Musique',            en: 'Music' },
    { id: 'sport',     fr: 'Sport',              en: 'Sport' },
  ]

  // La photo l'emporte si elle existe ; sinon le monogramme, RECALCULÉ à chaque frappe
  // pour qu'il porte toujours la bonne initiale (on stocke l'index, pas l'image figée —
  // sinon quelqu'un qui choisit son avatar avant de taper son prénom garderait un point).
  const avatar = photo || (mono !== null ? avatarMonogramme(name, mono) : '')

  // ── Étape prénom (nouveau compte) ──
  if (auth.user && !auth.profile?.display_name) {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={handleClose} style={closeBtn}>✕</button>
            <div style={title}>{lang === 'en' ? "Welcome!" : "Bienvenue !"}</div>
            <div style={sub}>{lang === 'en' ? "How should we call you?" : "Comment tu t'appelles ?"}</div>

            {/* Photo — carré à coins arrondis, 44 px, entièrement optionnelle.
                Sélecteur de photos standard : aucun plugin natif, donc aucune
                nouvelle validation Apple nécessaire. */}
            <label htmlFor="mo-avatar" style={{ display: 'block', width: 64, margin: '0 auto 6px', cursor: 'pointer' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
                border: `1px solid ${avatar ? GOLD_FRAME : 'rgba(15,29,58,0.25)'}`,
                // Guillemets autour de l'URL : la photo est un JPEG sans caractère
                // gênant, mais un avatar monogramme est un SVG — mieux vaut ne pas
                // dépendre de son encodage exact.
                background: avatar ? `center/cover no-repeat url("${avatar}")` : '#FFFDF7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9AA0AE', fontSize: 22, fontFamily: "'Lato', sans-serif",
              }}>{avatar ? '' : '＋'}</div>
            </label>
            <input
              id="mo-avatar" type="file" accept="image/*" style={{ display: 'none' }}
              onChange={async e => {
                const f = e.target.files?.[0]; e.target.value = ''
                if (!f) return
                try { setPhoto(await fichierVersAvatar(f)); setMono(null); setError('') }
                catch { setError(lang === 'en' ? "Couldn't read that photo" : "Photo illisible") }
              }}
            />
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: '#9AA0AE', marginBottom: 10 }}>
              {photo
                ? (lang === 'en' ? "Tap to change" : "Touche pour changer")
                : (lang === 'en' ? "Photo (optional)" : "Photo (optionnel)")}
            </div>

            {/* ── Ou un avatar, sans photo ──────────────────────────────────────
                8 personnes sur 44 seulement avaient mis une photo. Un monogramme
                ne demande qu'un geste et donne quand même un visage à la liste
                d'amies. Il porte l'initiale du prénom, qui se met à jour à mesure
                qu'on tape. Rien n'est imposé : on peut continuer sans rien choisir. */}
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: '#9AA0AE', marginBottom: 7 }}>
              {lang === 'en' ? "or pick an avatar" : "ou choisis un avatar"}
            </div>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 14 }}>
              {MONOGRAMMES.map((_, i) => {
                const actif = mono === i && !photo
                return (
                  <button
                    key={i} type="button"
                    aria-label={(lang === 'en' ? 'Avatar ' : 'Avatar ') + (i + 1)}
                    aria-pressed={actif}
                    onClick={() => { setMono(mono === i && !photo ? null : i); setPhoto(''); setError('') }}
                    style={{
                      width: 34, height: 34, padding: 0, borderRadius: '50%', cursor: 'pointer',
                      // Le cercle choisi est cerclé d'or ET légèrement agrandi : sur un
                      // écran au soleil, la couleur seule ne suffit pas à voir sa sélection.
                      border: `2px solid ${actif ? GOLD : 'rgba(15,29,58,0.18)'}`,
                      transform: actif ? 'scale(1.12)' : 'none',
                      transition: 'transform .12s ease, border-color .12s ease',
                      background: `center/cover no-repeat url("${avatarMonogramme(name, i)}")`,
                    }}
                  />
                )
              })}
            </div>

            <input
              value={name}
              onChange={e => { setNameTouche(true); setNameSaisi(e.target.value) }}
              placeholder={lang === 'en' ? "Your first name" : "Ton prénom"}
              style={input}
              autoFocus
            />
            {/* ⚠️ Le dire à voix haute est INDISPENSABLE. L'adresse ne porte pas toujours
                la bonne orthographe : « letiziacogoni@… » appartient à une Laetizia,
                « valerieallonge@… » à une Valeria. Sans cette phrase, quelqu'un valide
                sans regarder et se retrouve affiché sous un prénom faux auprès de ses
                amies. On propose pour épargner la frappe, jamais pour décider à sa place. */}
            {suggere && name === suggere && (
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10.5, color: '#9AA0AE', marginTop: -6, marginBottom: 10 }}>
                {lang === 'en'
                  ? "Guessed from your email — correct it if needed"
                  : "Deviné d'après ton adresse — corrige si besoin"}
              </div>
            )}
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: '#888', marginBottom: 8 }}>
              {lang === 'en' ? "What interests you? (optional)" : "Ce qui t'intéresse ? (optionnel)"}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
              {TOPICS.map(t => {
                const on = topics.includes(t.id)
                return (
                  <button key={t.id} type="button" onClick={() => setTopics(p => on ? p.filter(x => x !== t.id) : [...p, t.id])} style={{
                    padding: '6px 12px', borderRadius: 16, cursor: 'pointer',
                    border: `1.5px solid ${on ? GOLD : 'rgba(15,29,58,0.2)'}`,
                    background: on ? GOLD : '#fff', color: on ? '#fff' : NAVY,
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600,
                  }}>{lang === 'en' ? t.en : t.fr}</button>
                )
              })}
            </div>
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (!name.trim()) return setError(lang === 'en' ? 'Required' : 'Requis')
                setLoading(true)
                await auth.saveProfile(name.trim(), topics, avatar)
                setLoading(false)
                onClose()
              }}
              disabled={loading}
              style={btn}
            >{loading ? '…' : (lang === 'en' ? "Continue" : "Continuer")}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Étape code (champ visible directement + garde l'écran au retour du mail) ──
  if (step === 'code') {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={inner}>
            <button onClick={handleClose} style={closeBtn}>✕</button>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📩</div>
            <div style={title}>{lang === 'en' ? "Enter your code" : "Entre ton code"}</div>
            <div style={sub}>
              {lang === 'en'
                ? <>Open your email <b style={{ color: NAVY }}>{email}</b>, come back here and type the code.</>
                : <>Va lire ton email <b style={{ color: NAVY }}>{email}</b>, reviens ici et tape le code.</>}
            </div>
            {/* 36 % des personnes qui demandent un code n'arrivent jamais au bout (58
                comptes créés, 37 profils, relevé du 5 août 2026). La première cause
                probable est le mail classé en indésirable : on donne donc l'expéditeur
                exact, pour qu'il soit cherchable, AVANT que la personne renonce. */}
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11.5, color: '#8A8A8A', lineHeight: 1.5, marginTop: -6, marginBottom: 12 }}>
              {lang === 'en'
                ? <>Not in your inbox? Look in <b style={{ color: '#666' }}>spam</b> — it comes from <b style={{ color: '#666' }}>bonjour@monacout.com</b></>
                : <>Rien dans ta boîte ? Regarde dans les <b style={{ color: '#666' }}>indésirables</b> — l'email vient de <b style={{ color: '#666' }}>bonjour@monacout.com</b></>}
            </div>
            <input
              value={code}
              onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
              placeholder="– – – – – –"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={10}
              style={{ ...input, textAlign: 'center', letterSpacing: 8, fontSize: 26, fontWeight: 700, marginBottom: 6 }}
              autoFocus
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const t = await navigator.clipboard.readText()
                  const digits = (t || '').replace(/\D/g, '').slice(0, 10)
                  if (digits) { setCode(digits); setError('') }
                } catch { /* presse-papier indisponible */ }
              }}
              style={{ width: '100%', padding: 8, marginBottom: 6, background: 'none', color: GOLD, border: 'none', cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}
            >{lang === 'en' ? "📋 Paste the code" : "📋 Coller le code"}</button>
            {error && <div style={err}>{error}</div>}
            <button
              onClick={async () => {
                if (code.length < 4) return setError(lang === 'en' ? 'Enter your code' : 'Saisis ton code')
                setLoading(true)
                const { error: e } = await auth.verifyCode(email.trim(), code)
                setLoading(false)
                if (e) setError(lang === 'en' ? 'Wrong or expired code' : 'Code incorrect ou expiré')
                else clearPending()
                // succès → auth.user se met à jour, l'écran passe au prénom ou se referme
              }}
              disabled={loading}
              style={btn}
            >{loading ? '…' : (lang === 'en' ? "Confirm" : "Confirmer")}</button>
            <button
              onClick={async () => { setLoading(true); await auth.sendCode(email.trim()); setLoading(false); setError(lang === 'en' ? 'New code sent ✓' : 'Nouveau code envoyé ✓') }}
              style={{ width: '100%', padding: 8, background: 'none', color: '#888', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontSize: 12, marginTop: 2 }}
            >{lang === 'en' ? "Resend the code" : "Renvoyer le code"}</button>
            <button
              onClick={() => { clearPending(); setStep('email'); setCode(''); setError('') }}
              style={{ width: '100%', padding: 6, background: 'none', color: '#aaa', border: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontSize: 11 }}
            >{lang === 'en' ? "‹ Change email" : "‹ Changer d'email"}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── Étape email (départ) ──
  return (
    <div style={overlay}>
      <div style={card}>
        <div style={inner}>
          <button onClick={handleClose} style={closeBtn}>✕</button>
          <div style={{ fontSize: 36, marginBottom: 14 }}>{inviterName ? '💌' : '👥'}</div>
          <div style={title}>
            {inviterName
              ? (lang === 'en' ? `Join ${inviterName} on Monac'Out` : `Rejoins ${inviterName} sur Monac'Out`)
              : (lang === 'en' ? "Connect with friends" : "Rejoins tes amis")}
          </div>
          <div style={sub}>
            {inviterName
              ? (lang === 'en'
                  ? `${inviterName} invited you. Create your account to become friends and see each other's outings.`
                  : `${inviterName} t'invite. Crée ton compte pour devenir amis et voir vos sorties respectives.`)
              : (lang === 'en'
                  ? "See which friends are going to the same events."
                  : "Vois quels amis vont aux mêmes sorties que toi.")}
          </div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="ton@email.com"
            style={input}
            autoFocus
          />
          {error && <div style={err}>{error}</div>}
          <button
            onClick={async () => {
              if (!email.trim()) return setError(lang === 'en' ? 'Required' : 'Requis')
              setLoading(true)
              const { error: e } = await auth.sendCode(email.trim())
              setLoading(false)
              if (e) setError(e.message || 'Erreur')
              else { try { localStorage.setItem(PENDING_KEY, email.trim()) } catch { /* rien */ } setStep('code') }
            }}
            disabled={loading}
            style={btn}
          >{loading ? '…' : (lang === 'en' ? "Get my code" : "Recevoir mon code")}</button>
          <div style={{ fontSize: 11, color: '#888', fontFamily: "'Lato', sans-serif", textAlign: 'center', marginTop: 12 }}>
            {lang === 'en' ? "A 6-digit code will be sent to your email." : "Un code à 6 chiffres sera envoyé par email."}
          </div>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'absolute', inset: 0,
  background: 'rgba(0,0,0,0.55)',
  zIndex: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const card = {
  width: 300,
  border: `3px solid ${GOLD_FRAME}`,
  borderRadius: 2, padding: 0,
  background: '#fff',
}
// Plus de filet bleu intérieur : un seul trait.
const inner = {
  position: 'relative',
  borderRadius: 1,
  padding: '28px 24px 24px',
  textAlign: 'center',
}
const closeBtn = {
  position: 'absolute', top: 8, right: 8,
  width: 30, height: 30, borderRadius: '50%',
  background: '#fff', border: `1px solid ${GOLD_FRAME}`, cursor: 'pointer',
  fontSize: 17, color: NAVY, lineHeight: 1, padding: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
const title = {
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: 18, fontWeight: 600, color: NAVY,
  marginBottom: 8,
}
const sub = {
  fontFamily: "'Lato', sans-serif",
  fontSize: 13, color: '#555', lineHeight: 1.5,
  marginBottom: 20,
}
const input = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 14px', marginBottom: 12,
  border: `1px solid ${GOLD_FRAME}`,
  borderRadius: 2, outline: 'none',
  fontFamily: "'Lato', sans-serif", fontSize: 14, color: NAVY,
  background: '#fafafa',
}
const btn = {
  width: '100%', padding: '12px 0',
  background: NAVY, color: '#fff', border: 'none',
  borderRadius: 2, cursor: 'pointer',
  fontFamily: "'Josefin Sans', sans-serif",
  fontSize: 12, fontWeight: 600, letterSpacing: 2,
  textTransform: 'uppercase',
}
const err = {
  fontFamily: "'Lato', sans-serif",
  fontSize: 12, color: '#c00', marginBottom: 8,
}

```

## `src/components/screens/DetailScreen.jsx`

```jsx
import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import VueReservation from "../VueReservation";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
    </svg>
  );
}

const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const GOLD2 = "#FFFFFF";
const GREY = "#6A6860";
const WHITE = "#FFFFFF";
const LIGHT = "#FFFFFF";
const BORDER = "rgba(15,29,58,0.12)";

function addToCalendar(event) {
  const MONTHS = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
  const parts = event.date.split(' ');
  const day   = parseInt(parts[1]);
  const month = MONTHS[parts[2]];
  const year  = event.year || 2026;
  const t     = event.time.match(/(\d{1,2})h(\d{2})/);
  const h     = t ? parseInt(t[1]) : 12;
  const m     = t ? parseInt(t[2]) : 0;
  const pad   = n => String(n).padStart(2, '0');
  const fmt   = (y, mo, d, hh, mm) => `${y}${pad(mo+1)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const start = fmt(year, month, day, h, m);
  const end   = fmt(year, month, day, h + 2, m);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${event.desc.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.subtitle}`,
    event.link ? `URL:${event.link}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  const url = 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'event.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function handleShare(event, lang) {
  if (navigator.share) {
    navigator.share({
      title: event.title.replace(/\n/g, " "),
      text: `${event.subtitle} · ${event.date} · ${event.time}`,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  }
}

export default function DetailScreen({ event, onBack, favorites, onToggleFav, onSelectEvent, onCategoryClick, lang = "fr" }) {
  const [showPhone, setShowPhone] = useState(false);
  // La vue intégrée qui remplace le lien sortant (voir plus bas).
  const [siteOuvert, setSiteOuvert] = useState(null);
  if (!event) return null;
  const isFav = favorites?.includes(event.id);

  const related = ALL_EVENTS
    .filter(e => e.id !== event.id && e.cat === event.cat)
    .slice(0, 3);

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Hero */}
      <div style={{
        background: event.fallback,
        minHeight: 220,
        padding: "60px 20px 24px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            color: WHITE,
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >{lang === "en" ? "← Back" : "← Retour"}</button>

        <button
          onClick={() => handleShare(event, lang)}
          style={{
            position: "absolute",
            top: 14,
            right: 62,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >🔗</button>

        <button
          onClick={() => onToggleFav(event.id)}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >{isFav ? "❤️" : "🤍"}</button>

        {/* Clickable cat badge */}
        <button
          onClick={() => onCategoryClick?.(event.cat)}
          style={{
            alignSelf: "flex-start",
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: WHITE,
            marginBottom: 10,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >{event.emoji} {event.cat}</button>

        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 32,
          color: WHITE,
          textTransform: "uppercase",
          lineHeight: 1.1,
          whiteSpace: "pre-line",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          letterSpacing: 0.3,
        }}>{event.title}</div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GREY,
          marginBottom: 4,
        }}>{event.subtitle}</div>

        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: NAVY,
          marginBottom: 16,
        }}>{event.date} · {event.time}</div>

        <button
          onClick={() => addToCalendar(event)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            width: "100%", padding: "11px 0", marginBottom: 16,
            border: `1.5px solid ${GOLD}`,
            borderRadius: 16, background: "none", cursor: "pointer",
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
            textTransform: "uppercase", color: NAVY,
          }}
        >
          <span>📅</span>
          <span>{lang === "en" ? "Add to calendar" : "Ajouter au calendrier"}</span>
        </button>

        <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />

        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          color: NAVY,
          lineHeight: 1.85,
          marginBottom: 20,
        }}>{event.desc}</div>

        {event.free && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#E8F4EC",
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <span style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#2A7A3A",
            }}>{lang === "en" ? "Free entry" : "Entrée libre"}</span>
          </div>
        )}

        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 11,
          color: GREY,
          marginBottom: 20,
        }}>{lang === "en" ? "Source: " : "Source : "}{event.source}</div>

        <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
          {/* 🚨 ON NE SORT PLUS DE L'APP. Stéphanie, 26 oct 2026 : « en restant
              sur l'app, je ne veux pas qu'ils partent sur les sites ». Ce bouton
              était le DERNIER `target="_blank"` encore actif sur une fiche : il
              envoyait sur le site du lieu, hors de Monac'Out — et sur iPhone,
              dans l'écran noir du 7 août. Le site s'ouvre désormais dans la même
              vue intégrée que les réservations, avec une croix pour revenir. */}
          {event.link && (
            <button
              onClick={() => setSiteOuvert(event.link)}
              style={{
                border: "none", cursor: "pointer",
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${NAVY}, #1A2D4A)`,
                borderRadius: 16,
                padding: "14px 20px",
                textAlign: "center",
                textDecoration: "none",
                color: GOLD2,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 0.3,
              }}
            >
              {event.free
                ? (lang === "en" ? "More info →" : "Plus d'infos →")
                : (lang === "en" ? "Book →" : "Réserver →")}
            </button>
          )}
          {/* 🗑️ Bouton téléphone retiré : « Réserver » s'en charge. */}
        </div>

      </div>

      {/* Voir aussi */}
      {related.length > 0 && (
        <div style={{ padding: "24px 20px 30px" }}>
          <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: NAVY,
            }}>{lang === "en" ? "See also · " : "Voir aussi · "}{event.cat}</div>
            <button
              onClick={() => onCategoryClick?.(event.cat)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: NAVY,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >{lang === "en" ? "See all →" : "Tout voir →"}</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {related.map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e)}
                style={{
                  background: WHITE,
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{
                  width: 70,
                  background: e.fallback,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}>{e.emoji}</div>
                <div style={{ padding: "10px 12px", flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 600,
                    fontSize: 13,
                    color: NAVY,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    marginBottom: 3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{e.title.replace(/\n/g, " ")}</div>
                  <div style={{
                    fontFamily: "'Jost', -apple-system, sans-serif",
                    fontSize: 11,
                    color: GREY,
                  }}>{e.date}</div>
                </div>
                {e.hot && (
                  <div style={{
                    alignSelf: "center",
                    marginRight: 12,
                    fontSize: 12,
                  }}>🔥</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌐 Le site du lieu, DANS l'app. Même vue que les réservations. */}
      {siteOuvert && (
        <VueReservation
          url={siteOuvert}
          titre={(event.title || "").replace(/\n/g, " ")}
          lang={lang}
          onFermer={() => setSiteOuvert(null)}
        />
      )}
    </div>
  );
}

```

## `src/components/screens/FavoritesScreen.jsx`

```jsx
import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";
import { CarteLieu } from "./HomeScreen";

const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const GREY = "#6A7080";
const WHITE = "#FDFAF5";

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill={WHITE}/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill={WHITE}/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill={WHITE}/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

export default function FavoritesScreen({ favorites, onToggleFav, onCategoryClick, lang = "fr", onNavEvents, onCardClick, events = ALL_EVENTS, loggedIn = false, onShowAuth, social, onGoingClick }) {
  const favEvents = events.filter(e => favorites.includes(e.id));

  // 🚨 ICI AUSSI « INFOS » DÉPLIE. Stéphanie, 19 oct 2026 : « si on clique sur la
  // fiche la liste s'affiche comme avant et pas en sous-fiche ». C'était vrai sur
  // cet écran : faute de recevoir `onInfos`, le bouton retombait sur l'ancien
  // comportement et rouvrait la fenêtre. Le fil et les favoris se comportent
  // maintenant pareil — c'est la demande du 11 octobre, « je veux que cela soit
  // cohérent partout », qui n'avait été appliquée qu'au fil.
  const [deplie, setDeplie] = useState({});
  const estAnnuaire = e => Array.isArray(e.directory) && e.directory.length > 0;

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #162040 100%)`,
        padding: "16px 20px 18px",
        display: "flex", alignItems: "center", gap: 14,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <button
          onClick={onNavEvents}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <ArrowLeft />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600, fontSize: 22, color: WHITE, letterSpacing: 0.5,
          }}>{lang === "en" ? "My Agenda" : "Mon Agenda"}</div>
          <div style={{
            fontFamily: "'Jost', sans-serif", fontSize: 12, color: GOLD, marginTop: 1,
          }}>
            {lang === "en"
              ? `${favEvents.length} saved event${favEvents.length !== 1 ? "s" : ""}`
              : `${favEvents.length} événement${favEvents.length !== 1 ? "s" : ""} sauvegardé${favEvents.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        <span style={{ fontSize: 22 }}>❤️</span>
      </div>

      <div style={{ padding: "16px 16px 20px" }}>
        {/* Ligne discrète : sauvegarder ses favoris (visible seulement si pas connectée et au moins un favori) */}
        {!loggedIn && favEvents.length > 0 && onShowAuth && (
          <button
            onClick={onShowAuth}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: "#FFFDF7", border: `1px solid ${GOLD}`, borderRadius: 6,
              padding: "10px 14px", marginBottom: 14, cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>☁️</span>
            <span style={{ flex: 1, fontFamily: "'Jost', sans-serif", fontSize: 13, color: NAVY, lineHeight: 1.35 }}>
              {lang === "en" ? "Save my favourites" : "Sauvegarder mes favoris"}
              <span style={{ display: "block", fontSize: 11, color: GREY, marginTop: 1 }}>
                {lang === "en" ? "Keep them even on a new phone" : "Les garder même en changeant de téléphone"}
              </span>
            </span>
            <span style={{ flexShrink: 0, color: GOLD, fontSize: 18, lineHeight: 1 }}>›</span>
          </button>
        )}
        {favEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600, fontSize: 20, color: NAVY, marginBottom: 8,
            }}>{lang === "en" ? "No favorites yet" : "Aucun favori pour l'instant"}</div>
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: 14, color: GREY, lineHeight: 1.6,
            }}>
              {lang === "en" ? "Tap ❤️ on any event to save it here." : "Appuyez sur ❤️ sur un événement pour le retrouver ici."}
            </div>
          </div>
        ) : (
          favEvents.map(e => {
            const cle = `${e.id}-${e.date}`;
            const ouvert = estAnnuaire(e) && !!deplie[cle];
            return (
              <div key={e.id}>
                <EventCard
                  event={e}
                  favorites={favorites}
                  onToggleFav={onToggleFav}
                  onCategoryClick={onCategoryClick}
                  onCardClick={onCardClick}
                  lang={lang}
                  social={social}
                  onGoingClick={onGoingClick}
                  loggedIn={loggedIn}
                  onShowAuth={onShowAuth}
                  onInfos={estAnnuaire(e) ? () => setDeplie(d => ({ ...d, [cle]: !d[cle] })) : null}
                  infosDepliees={ouvert}
                />
                {ouvert && e.directory.map((d, k) => (
                  <CarteLieu
                    key={`lieu-${cle}-${k}`}
                    lieu={d}
                    fiche={e}
                    lang={lang}
                    social={social}
                    loggedIn={loggedIn}
                    onGoingClick={onGoingClick}
                    onOuvrir={() => onCardClick?.(e)}
                    favorites={favorites}
                    onToggleFav={onToggleFav}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

```

## `src/components/screens/FriendsScreen.jsx`

```jsx
import { useState, useEffect, useRef } from 'react'
import { lienInvitation } from '../../lib/invite'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import AuthScreen from './AuthScreen'

const NAVY = "#0F1D3A"
const GOLD = "#7B2D26"
const GOLD_FRAME = "#7B2D26"
const BLUE = "#9FC3DC"
const GREY = "#6A7080"

const MOIS_IDX = { jan:0,'fév':1,mar:2,avr:3,mai:4,juin:5,juil:6,'août':7,sep:8,oct:9,nov:10,'déc':11 }
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const JOURS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MOIS_FR  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc']

function avatarColor(id = '') {
  const colors = ['#0F1D3A','#882830','#1A4A5A','#3A1870','#1A4A2A','#4A2010','#1A2A4A']
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF
  return colors[Math.abs(h) % colors.length]
}

function Avatar({ name = '?', id = '', size = 28, photo = '' }) {
  // Photo de profil si la personne en a mis une, sinon son initiale sur fond coloré.
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: photo ? `center/cover no-repeat url("${photo}")` : avatarColor(id), color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Josefin Sans', sans-serif", fontSize: size * 0.38,
      fontWeight: 600, flexShrink: 0,
      border: '1.5px solid #fff',
    }}>
      {photo ? '' : (name[0] || '?').toUpperCase()}
    </div>
  )
}

function eventDate(e) {
  if (!e?.date) return null
  const p = e.date.trim().split(' ')
  const mi = MOIS_IDX[p[2]]
  if (mi === undefined) return null
  return new Date(e.year || 2026, mi, parseInt(p[1]))
}

export default function FriendsScreen({ auth, social, events = [], lang = "fr", onNavEvents, initialInviteCode = null, onInviteConsumed }) {
  const [tab, setTab]           = useState(initialInviteCode ? 'amis' : 'sorties')
  const [code, setCode]         = useState(initialInviteCode || '')
  const [codeMsg, setCodeMsg]   = useState('')
  const [showAuth, setShowAuth] = useState(false)

  // Auto-connexion : dès qu'on est connecté avec un profil, le lien d'invitation crée l'amitié SANS clic.
  const inviteDoneRef = useRef(false)
  useEffect(() => {
    if (inviteDoneRef.current) return
    if (!initialInviteCode || !auth.user || !auth.profile?.invite_code) return
    if (String(initialInviteCode).trim().toLowerCase() === String(auth.profile.invite_code).toLowerCase()) return
    inviteDoneRef.current = true
    Promise.resolve(social.addFriendByCode(initialInviteCode)).then(() => onInviteConsumed?.())
  }, [initialInviteCode, auth.user, auth.profile])

  if (!auth.user) {
    const STRIPE_BG_LOGIN = "repeating-linear-gradient(-45deg, #9FC3DC 0px, #9FC3DC 40px, #FFFFFF 40px, #FFFFFF 80px)"
    return (
      <div>
        {/* Header rayures nautiques avec retour vers l'app */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 999,
          background: STRIPE_BG_LOGIN,
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderBottom: '1px solid rgba(15,29,58,0.12)',
        }}>
          <button onClick={onNavEvents} aria-label={lang === 'en' ? 'Back to Monac\'Out' : "Retour à Monac'Out"} style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            background: '#fff', border: `1px solid ${GOLD_FRAME}`, borderRadius: 20,
            cursor: 'pointer', padding: '4px 12px 4px 8px',
            display: 'flex', alignItems: 'center', gap: 3, color: NAVY,
          }}>
            <span style={{ fontSize: 17, lineHeight: 1, marginTop: -1 }}>‹</span>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: NAVY }}>M</span>
          </button>
          <div style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 15, fontWeight: 600, letterSpacing: 5,
            textTransform: 'uppercase', color: NAVY,
          }}>
            {lang === 'en' ? "MY CIRCLE" : "MON CERCLE"}
          </div>
        </div>

        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 20, color: NAVY, marginBottom: 10 }}>
            {lang === 'en' ? "See friends' plans" : "Les sorties de tes amis"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: GREY, lineHeight: 1.6, marginBottom: 28 }}>
            {lang === 'en'
              ? "Sign in to see which friends are going to the same events — and let them see yours."
              : "Connecte-toi pour voir quels amis vont aux mêmes sorties — et partage les tiennes."}
          </div>
          <button onClick={() => setShowAuth(true)} style={{
            padding: '15px 36px', background: NAVY, color: '#fff', border: 'none',
            borderRadius: 2, cursor: 'pointer',
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>{lang === 'en' ? "Sign in / Sign up" : "Se connecter / S'inscrire"}</button>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: GREY, marginTop: 12 }}>
            {lang === 'en' ? "By email — no password needed." : "Par email — pas de mot de passe."}
          </div>

          {/* Retour bien visible vers les événements */}
          <div style={{ marginTop: 32 }}>
            <button onClick={onNavEvents} style={{
              background: 'none', border: `1px solid ${GOLD_FRAME}`, borderRadius: 2,
              padding: '10px 22px', cursor: 'pointer', color: NAVY,
              fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}>{lang === 'en' ? "‹ Back to events" : "‹ Retour aux événements"}</button>
          </div>
        </div>
        {showAuth && <AuthScreen auth={auth} lang={lang} onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  // ⚠️ Le code peut ne pas être encore chargé (profil en cours de lecture, ou compte
  //    tout juste créé). Avant le 7 août 2026 on partageait alors un lien contenant
  //    « … » : la personne qui le recevait voyait « Code introuvable » et l'amitié
  //    était perdue en silence. C'est arrivé à Samantha, inscrite à 11h54 et qui a
  //    partagé son lien dans la foulée. On ne partage plus tant qu'il n'est pas prêt.
  const codePret    = /^[a-z0-9]{4,}$/i.test(auth.profile?.invite_code || '')
  const inviteCode  = codePret ? auth.profile.invite_code : '…'
  // Une seule source pour le lien : src/lib/invite.js (voir le pourquoi de monacout.com)
  const inviteLink  = lienInvitation(inviteCode)
  // Phrase SANS le lien : le lien est passé dans le champ `url` pour rester cliquable.
  const inviteMsg   = lang === 'en'
    ? `Join me on Monac'Out — the app for going out in Monaco! Tap the link and we'll be connected 👇`
    : `Rejoins-moi sur Monac'Out, l'appli des sorties à Monaco ! Clique sur le lien et on sera connectés 👇`
  // Repli copie/collage : phrase + lien réunis.
  const inviteText  = `${inviteMsg}\n${inviteLink}`

  async function shareInvite() {
    if (!codePret) {
      setCodeMsg(lang === 'en' ? 'One moment, your code is loading…' : 'Un instant, ton code arrive…')
      setTimeout(() => setCodeMsg(''), 2500)
      return
    }
    // On passe le lien dans `url` (champ dédié) → les apps le rendent cliquable avec aperçu.
    const payload = { title: "Monac'Out", text: inviteMsg, url: inviteLink }
    if (Capacitor.isNativePlatform()) {
      await Share.share(payload).catch(() => {})
    } else if (navigator.share) {
      await navigator.share(payload).catch(() => {})
    } else {
      navigator.clipboard?.writeText(inviteText)
      setCodeMsg(lang === 'en' ? 'Message copied!' : 'Message copié !')
      setTimeout(() => setCodeMsg(''), 2000)
    }
  }

  // Sorties des amis — triées par date
  const today = new Date(); today.setHours(0,0,0,0)
  const friendsEvents = []
  for (const friend of social.friends) {
    for (const eid of friend.participations) {
      let ev = events.find(e => e.id === eid)
      let lieu = null
      // Participation à UN LIEU d'une fiche récapitulative (« ce soir », « musées ») :
      // l'identifiant est composé — fiche du jour × 1000 + numéro du lieu. Sans cette
      // décomposition, la sortie n'apparaissait pas ici du tout.
      if (!ev && eid > 900000000) {
        const carte = events.find(e => e.id === Math.floor(eid / 1000))
        const vid = eid % 1000
        const entree = carte?.directory?.find(d => d.vid === vid)
        if (carte && entree) { ev = carte; lieu = entree.name }
      }
      if (!ev) continue
      // 🚨 PAS D'EXPO « EN COURS » DANS LES SORTIES A VENIR.
      // Une fiche ongoing porte la date DU JOUR, reecrite chaque nuit : une amie allee
      // voir le Mariage du siecle en juillet reapparaissait donc ici tous les jours, en
      // tete de liste, comme si elle y allait aujourd'hui. Signale trois fois par
      // Stephanie. La table participations ne stocke aucune date, on ne peut donc pas
      // savoir QUAND — et une date fausse repetee chaque jour est pire que rien.
      // L'information reste visible sur la fiche elle-meme, au passe (« y est allee »).
      // ➜ Reversible des que la colonne `jour` existera (CLAUDE.md, § A FAIRE).
      if (ev.ongoing) continue
      const d = eventDate(ev)
      if (!d || d < today) continue
      friendsEvents.push({ event: ev, friend, date: d, lieu })
    }
  }
  friendsEvents.sort((a, b) => a.date - b.date)

  const jours = lang === 'en' ? JOURS_EN : JOURS_FR

  const STRIPE_BG = "repeating-linear-gradient(-45deg, #9FC3DC 0px, #9FC3DC 40px, #FFFFFF 40px, #FFFFFF 80px)"

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header rayures nautiques */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 999,
        background: STRIPE_BG,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid rgba(15,29,58,0.12)',
      }}>
        {/* Retour vers Monac'Out */}
        <button onClick={onNavEvents} aria-label={lang === 'en' ? 'Back to Monac\'Out' : "Retour à Monac'Out"} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          background: '#fff', border: `1px solid ${GOLD_FRAME}`, borderRadius: 20,
          cursor: 'pointer', padding: '4px 12px 4px 8px',
          display: 'flex', alignItems: 'center', gap: 3,
          color: NAVY,
        }}>
          <span style={{ fontSize: 17, lineHeight: 1, marginTop: -1 }}>‹</span>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: NAVY }}>M</span>
        </button>
        <div style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontSize: 15, fontWeight: 600, letterSpacing: 5,
          textTransform: 'uppercase', color: NAVY,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {lang === 'en' ? "MY CIRCLE" : "MON CERCLE"}
          {social.pending.length > 0 && (
            <span style={{
              background: GOLD, color: '#fff',
              borderRadius: 10, padding: '1px 7px',
              fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700,
            }}>{social.pending.length}</span>
          )}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>

          {/* Inviter un ami (par lien) */}
          <div style={{
            border: `1px solid ${GOLD_FRAME}`, borderRadius: 2,
            padding: '16px 18px', marginBottom: 20,
          }}>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>
              {lang === 'en' ? "Invite a friend" : "Inviter un ami"}
            </div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: GREY, lineHeight: 1.5, marginBottom: 12 }}>
              {lang === 'en'
                ? "Send the link — your friend just taps it and you're connected. No code to type."
                : "Envoie le lien — ton ami clique dessus et vous êtes connectés. Aucun code à taper."}
            </div>
            <button onClick={shareInvite} style={{
              width: '100%', padding: '12px', background: NAVY, color: '#fff', border: 'none',
              borderRadius: 2, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
            }}>
              {(Capacitor.isNativePlatform() || navigator.share) ? (lang === 'en' ? "Share my link" : "Partager mon lien") : (lang === 'en' ? "Copy my link" : "Copier mon lien")}
            </button>
            {codeMsg && <div style={{ fontSize: 11, color: GOLD, fontFamily: "'Lato', sans-serif" }}>{codeMsg}</div>}
          </div>

          {/* Ajouter un ami */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GREY, marginBottom: 8 }}>
              {lang === 'en' ? "Add a friend" : "Ajouter un ami"}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={code}
                onChange={e => { setCode(e.target.value); setCodeMsg('') }}
                placeholder={lang === 'en' ? "Friend's code" : "Code de ton ami"}
                style={{
                  flex: 1, padding: '9px 12px',
                  border: `1px solid ${GOLD_FRAME}`, borderRadius: 2,
                  fontFamily: "'Josefin Sans', sans-serif", fontSize: 13,
                  color: NAVY, outline: 'none', letterSpacing: 2, textTransform: 'uppercase',
                  background: '#fafafa',
                }}
              />
              <button onClick={async () => {
                if (!code.trim()) return
                const r = await social.addFriendByCode(code)
                if (r.error) setCodeMsg('❌ ' + r.error)
                else { setCodeMsg(lang === 'en' ? `✓ Request sent to ${r.name}` : `✓ Demande envoyée à ${r.name}`); setCode(''); onInviteConsumed?.() }
              }} style={{
                padding: '9px 16px', background: GOLD, color: '#fff', border: 'none',
                borderRadius: 2, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0,
              }}>{lang === 'en' ? "Add" : "Ajouter"}</button>
            </div>
            {codeMsg && <div style={{ fontSize: 12, color: codeMsg.startsWith('❌') ? '#c00' : '#2a6', fontFamily: "'Lato', sans-serif", marginTop: 6 }}>{codeMsg}</div>}
          </div>


          {/* Demandes en attente */}
          {social.pending.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#c00', marginBottom: 10 }}>
                {lang === 'en' ? "Pending requests" : "Demandes reçues"}
              </div>
              {social.pending.map(p => (
                <div key={p.friendshipId} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar name={p.display_name} id={p.id} size={56} photo={p.avatar_url} />
                  <div style={{ flex: 1, fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY }}>{p.display_name}</div>
                  <button onClick={() => social.acceptFriend(p.friendshipId)} style={{
                    padding: '6px 10px', background: NAVY, color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer',
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                  }}>{lang === 'en' ? "Accept" : "Accepter"}</button>
                  <button onClick={() => social.declineFriend(p.friendshipId)} style={{
                    padding: '6px 10px', background: 'none', color: GREY, border: `1px solid ${GREY}`, borderRadius: 2, cursor: 'pointer',
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                  }}>{lang === 'en' ? "Decline" : "Refuser"}</button>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(15,29,58,0.08)', margin: '14px 0' }} />
            </div>
          )}

          {/* Les sorties de mes amis */}
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GOLD, marginBottom: 10 }}>
            {lang === 'en' ? "My friends' outings" : "Les sorties de mes amis"}
          </div>
          {friendsEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4px 0 8px', color: GREY, fontFamily: "'Lato', sans-serif", fontSize: 13 }}>
              {/* Tant que la base n'a pas répondu, on ne dit rien : `friends` vaut []
                  au départ, et affirmer « ajoute des amis » à quelqu'un qui en a
                  est faux pendant une fraction de seconde. */}
              {social.charge !== true
                ? ''
                : social.friends.length === 0
                ? (lang === 'en' ? "Add friends to see their plans." : "Ajoute des amis pour voir leurs sorties.")
                : (lang === 'en' ? "None of your friends have marked events yet." : "Aucun ami n'a encore marqué de sortie.")}
            </div>
          ) : friendsEvents.map(({ event: ev, friend, date, lieu }, i) => (
            <div key={`${ev.id}-${friend.id}-${i}`} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: i < friendsEvents.length - 1 ? `1px solid rgba(15,29,58,0.07)` : 'none',
            }}>
              <Avatar name={friend.display_name} id={friend.id} size={64} photo={friend.avatar_url} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: NAVY, fontWeight: 600, marginBottom: 2 }}>
                  {friend.display_name}
                </div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {/* Participation à un lieu précis d'une fiche récapitulative : on
                      affiche LE LIEU, pas « ce soir : 6 terrasses ouvertes ». */}
                  {lieu || ev.title.replace(/\n/g, ' ')}
                </div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 1 }}>
                  {jours[date.getDay()]} {date.getDate()} {MOIS_FR[date.getMonth()]} · {lieu ? (ev.cat === 'EXPOSITION' ? (lang === 'en' ? 'Museum' : 'Musée') : (lang === 'en' ? 'Drinks' : 'Apéro')) : ev.subtitle?.split(' · ')[0]}
                </div>
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(15,29,58,0.08)', margin: '18px 0' }} />

          {/* Liste des amis avec toggle visibilité */}
          {social.charge !== true ? (
            <div style={{ height: 40 }} />
          ) : social.friends.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: GREY, fontFamily: "'Lato', sans-serif", fontSize: 13 }}>
              {lang === 'en' ? "No friends yet. Share your link!" : "Pas encore d'amis. Partage ton lien !"}
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: GREY, marginBottom: 10 }}>
                {lang === 'en' ? "Who can see me" : "Qui peut me voir"}
              </div>
              {social.friends.map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Avatar name={f.display_name} id={f.id} size={56} photo={f.avatar_url} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY, fontWeight: 600 }}>{f.display_name}</div>
                  </div>
                  {/* Toggle visibilité */}
                  <button onClick={() => social.toggleVisibility(f.id)} style={{
                    padding: '5px 10px', borderRadius: 20,
                    border: `1.5px solid ${social.visibility.includes(f.id) ? GOLD : 'rgba(15,29,58,0.2)'}`,
                    background: social.visibility.includes(f.id) ? GOLD : 'transparent',
                    color: social.visibility.includes(f.id) ? '#fff' : GREY,
                    fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
                    letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
                  }}>
                    {social.visibility.includes(f.id)
                      ? (lang === 'en' ? "✓ Visible" : "✓ Me voit")
                      : (lang === 'en' ? "Hidden" : "Masqué")}
                  </button>
                </div>
              ))}
            </>
          )}

          {/* Déconnexion */}
          <div style={{ height: 1, background: 'rgba(15,29,58,0.08)', margin: '24px 0 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: GREY }}>
              {auth.user?.email}
            </div>
            <button onClick={auth.signOut} style={{
              background: 'none', border: `1px solid rgba(15,29,58,0.2)`, borderRadius: 2,
              padding: '6px 12px', cursor: 'pointer', color: GREY,
              fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
              letterSpacing: 1, textTransform: 'uppercase',
            }}>{lang === 'en' ? "Sign out" : "Déconnexion"}</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button onClick={async () => {
              const ok = window.confirm(lang === 'en'
                ? 'Delete your account and all your data? This cannot be undone.'
                : 'Supprimer ton compte et toutes tes données ? Cette action est définitive.')
              if (!ok) return
              const res = await auth.deleteAccount()
              if (res?.error) window.alert(lang === 'en'
                ? 'Could not delete your account. Please try again or contact contact@monacout.com.'
                : 'Impossible de supprimer ton compte. Réessaie ou écris à contact@monacout.com.')
            }} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#c00',
              fontFamily: "'Lato', sans-serif", fontSize: 11, textDecoration: 'underline',
            }}>{lang === 'en' ? "Delete my account" : "Supprimer mon compte"}</button>
          </div>
        </div>
    </div>
  )
}

```

## `src/components/screens/HomeScreen.jsx`

```jsx
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ALL_EVENTS } from "../../data/events";
import { localizeTitle, localizeCat } from "../../i18n";
import MonacOutLogo from "../MonacOutLogo";
import EventCard, { addToCalendar, partagerEvenement, FriendAvatars } from "../EventCard";
import CalendarPicker from "../CalendarPicker";
import { track } from "../../lib/track";
import { couleurCat } from "../../lib/couleurs";
import { NUIT, BORDEAU, CREME, FOND_PAGE, BLANC, OR, GRIS, GRIS_LISIBLE, BORDURE, SAUGE, RAYON, OMBRE, SERIF, SANS, casseNaturelle, apprendreLesNomsPropres } from "../../lib/theme";
import { Capacitor } from "@capacitor/core";
import { ouvrirItineraire } from "../../lib/itineraire";
import { lienDeReservation, lienDuSite, actionDeReservation } from "../../lib/reservation";
import { CarrouselHero, TitreSection, GrilleDeuxColonnes, InviteTesAmis } from "../AccueilMaquette";
import { mediaDeLaFiche } from "../../lib/mediatheque";
import VueReservation from "../VueReservation";
import { partagerInvitation } from "../../lib/invite";

/**
 * 🔄 LA GRAINE DE LA VISITE — ce qui fait tourner la mise en avant.
 *
 * Stéphanie, 31 oct 2026 : « change les fiches régulièrement en haut, pas que
 * la 1ʳᵉ, sinon c'est ennuyant et on ne rouvre plus l'appli ».
 *
 * Elle a raison, et les chiffres le disent : 64 % des gens n'ouvrent l'app
 * qu'une seule fois, et la rétention tient à ce qu'on trouve du neuf en
 * revenant. Un classement figé donne deux fois le même écran dans la journée.
 *
 * ⚠️ MAIS PAS À CHAQUE RENDU. La graine est calculée UNE FOIS au chargement du
 * module : elle ne bouge pas tant qu'on est dans l'app. Sinon la carte qu'on
 * s'apprête à toucher se déroberait sous le doigt — et un fil qui se réordonne
 * pendant qu'on le lit est pire qu'un fil ennuyeux.
 *
 * Deux composantes : le JOUR (pour que le contenu suive l'actualité) et le
 * NUMÉRO D'OUVERTURE (pour que deux visites d'affilée ne se ressemblent pas).
 * `monacout_sessions` existe déjà, incrémenté à chaque ouverture par App.jsx.
 */
const GRAINE_VISITE = (() => {
  const n = new Date();
  const jour = Math.floor((new Date(n.getFullYear(), n.getMonth(), n.getDate())
                           - new Date(n.getFullYear(), 0, 0)) / 86400000);
  let ouvertures = 0;
  try { ouvertures = parseInt(localStorage.getItem("monacout_sessions") || "0", 10) || 0; } catch { /* navigation privée */ }
  return jour * 7919 + ouvertures * 104729;
})();

/** Un rang pseudo-aléatoire mais STABLE pendant toute la visite. */
function rangDeVisite(id) {
  let x = ((Number(id) || 0) + GRAINE_VISITE) * 2654435761 % 4294967296;
  x ^= x >>> 13; x = (x * 1274126177) % 4294967296; x ^= x >>> 16;
  return Math.abs(x) % 100000;
}

const NAVY = NUIT;            // charte du 28 oct 2026 : bleu nuit #15263B
const GOLD = BORDEAU;         // le « doré » historique est en fait le bordeaux d'action
const GREY = GRIS_LISIBLE;    // gris doux assombri d'un cran pour rester lisible
const WHITE = "#FFFFFF";
const CREAM = FOND_PAGE;      // fond de page blanc (28 oct 2026)
const BORDER = BORDURE;       // bordures légères #E8E2DA
// Les rayures bleues sont retirées (10 oct 2026, décision de Stéphanie sur
// maquette : « on enlève les rayures on met juste le nom »). Le bleu #9FC3DC
// était la dernière note froide de l'écran, orpheline depuis le passage au
// Rouge H. L'en-tête est maintenant blanc, le nom porte seul.
const STRIPE_BG = "#FFFFFF";

// Met un texte à plat pour la recherche : minuscules, sans accents, et toute
// ponctuation (tirets, points médians, apostrophes…) remplacée par une espace.
// « Monte-Carlo Summer Festival » et « monte carlo summer festival » deviennent
// alors le même texte.
function normalizeForSearch(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Boutons de catégories groupées (barre sous les filtres temps, à la place des quartiers)
const EVENT_GROUPS = [
  { id: "culture",   label: "Musée/Ciné/Atelier", labelEn: "Museum/Cinema/Workshop", cats: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"] },
  { id: "foodnight", label: "Food/Nightlife", labelEn: "Food/Nightlife", cats: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"] },
  { id: "musique",   label: "Concert/Ballet/Opéra", labelEn: "Concert/Ballet/Opera", cats: ["CONCERT","OPÉRA","MUSICAL","DANSE","JAZZ LIVE","CHANTS"] },
  { id: "sport",     label: "Sport",     labelEn: "Sport",     cats: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"] },
  // Stéphanie, 11 oct 2026 : « on va créer un filtre breakfast café ».
  { id: "petitdej",  label: "Petit-déj & café", labelEn: "Breakfast & coffee", cats: ["PETIT-DÉJ"] },
];

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "concert", "OPÉRA": "concert", MUSICAL: "theatre", "JAZZ LIVE": "concert",
  "DJ SET": "soiree", CHANTS: "messe", "PETIT-DÉJ": "petitdej",
  THÉÂTRE: "theatre", "CONFÉRENCE": "conference", EXPOSITION: "musee", FESTIVAL: "theatre",
  GALA: "theatre", "FÊTE NATIONALE": "theatre", MARCHÉ: "musee", SALON: "conference",
  SPECTACLE: "theatre", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "soiree", FOODY: "foody",
  ENCHÈRES: "encheres",
};

const TIME_FILTERS = [
  { id: "today",    label: "Aujourd'hui" },
  { id: "week",     label: "Semaine" },
  { id: "weekend",  label: "Week-end" },
  { id: "calendar", label: "Agenda" },
];

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_IDX = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
const MOIS_NOM_COURT = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function toFrDate(d) { return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`; }

function getWeekendDates() {
  const today = new Date(); const day = today.getDay();
  const daysToSat = day === 0 ? 6 : day === 6 ? 0 : 6 - day;
  const daysToSun = day === 0 ? 0 : 7 - day;
  const sat = new Date(today); sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(today); sun.setDate(today.getDate() + daysToSun);
  return [toFrDate(sat), toFrDate(sun)];
}

function parseEventDate(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]); const month = MOIS_IDX[parts[2]];
  if (isNaN(day) || month === undefined) {
    if (import.meta.env.DEV) console.warn("[MonacOut] malformed date:", e.id, e.date);
    return null;
  }
  return new Date(e.year || new Date().getFullYear(), month, day);
}

// Une expo « en cours » (ongoing:true) ne porte qu'UNE seule date — celle du jour,
// remise à jour chaque nuit. Elle disparaissait donc dès qu'on demandait le week-end
// ou une date de septembre au calendrier, alors qu'elle est ouverte jusqu'en janvier.
// On la fait apparaître sur toute sa durée : elle a commencé (sa date ≤ fin demandée)
// et elle n'est pas terminée (son `until` ≥ début demandé).
function couvreLaPeriode(e, debut, fin) {
  if (!e.ongoing || !e.until) return false;
  const finExpo = new Date(e.until + "T00:00:00");
  if (isNaN(finExpo)) return false;
  const d = parseEventDate(e);
  return !!d && finExpo >= debut && d <= fin;
}

// ── LES EXPOS DANS LE DÉFILEMENT ────────────────────────────────────────────────
// Le fil est une liste continue : chaque fiche y apparaît UNE fois, à sa date. Une
// exposition « en cours » n'a qu'une date — celle du jour — donc en descendant le fil
// on la voyait aujourd'hui puis plus jamais, alors qu'elle est ouverte tous les jours
// jusqu'en janvier. On la répète donc sur chacun de ses jours d'ouverture.
//
// La répétition est faite À L'AFFICHAGE, pas dans les données : aucune fiche n'est
// dupliquée dans events.js, aucun id n'est réutilisé, les favoris continuent de
// fonctionner (même id ⇒ mettre l'expo en favori la met partout, ce qui est voulu).
// Chaque copie reçoit une `cleFil` unique pour la clé React.
//
// Horizon : 120 jours. Au-delà, le fil deviendrait illisible pour un gain nul —
// personne ne fait défiler quatre mois. Les dates plus lointaines restent
// accessibles par le calendrier, qui applique `couvreLaPeriode` sans limite.
const HORIZON_EN_COURS = 120;

function etaleLesEnCours(liste) {
  const aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
  const horizon = new Date(aujourdhui);
  horizon.setDate(horizon.getDate() + HORIZON_EN_COURS);

  const sortie = [];
  for (const e of liste) {
    const debut = e.ongoing && e.until ? parseEventDate(e) : null;
    const fin = e.ongoing && e.until ? new Date(e.until + "T00:00:00") : null;
    if (!debut || !fin || isNaN(fin)) { sortie.push(e); continue; }

    // Première occurrence : aujourd'hui au plus tôt (une expo commencée en juin ne
    // doit pas réapparaître dans le passé). Dernière : sa fermeture, dans l'horizon.
    const d = new Date(Math.max(debut.getTime(), aujourdhui.getTime()));
    const derniere = new Date(Math.min(fin.getTime(), horizon.getTime()));
    if (d > derniere) { sortie.push(e); continue; }

    let premier = true;
    for (let j = new Date(d); j <= derniere; j.setDate(j.getDate() + 1)) {
      sortie.push({
        ...e,
        date: toFrDate(j),
        year: j.getFullYear(),
        cleFil: `${e.id}-${j.getFullYear()}-${j.getMonth() + 1}-${j.getDate()}`,
        // Repli quand aucun jour n'a été retenu (coche posée avant cette version, ou
        // sur un autre appareil) : on l'affiche sur la PREMIÈRE occurrence seulement,
        // jamais sur toutes — sinon on retombe sur le défaut signalé le 11 août 2026.
        premierJour: premier,
      });
      premier = false;
    }
  }
  // Indispensable : les copies sont créées à la place de l'originale, donc groupées.
  // Sans ce tri, 120 fiches « Victor Brauner » s'empilaient au milieu du fil au lieu
  // d'apparaître une par une, chacune à son jour.
  return sortie.sort((a, b) => {
    const da = parseEventDate(a), db = parseEventDate(b);
    if (!da || !db) return 0;
    return (da - db) || (heureDeTri(a) - heureDeTri(b));
  });
}

// Heure en minutes, pour trier à l'intérieur d'une même journée. Reprend la
// convention de src/data/events.js : « En journée » → 11h, « En soirée » → 21h.
function heureDeTri(e) {
  const t = (e.time || "").replace(/\s/g, "");
  const m = t.match(/^(\d{1,2})h(\d{2})?/);
  if (m) return parseInt(m[1]) * 60 + (m[2] ? parseInt(m[2]) : 0);
  const mot = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // 🚨 LE VOCABULAIRE DOIT SUIVRE LES FICHES. Stéphanie, 11 oct 2026 : « y a un
  // bug dans liste petit déj ». La fiche « PETIT-DÉJ & CAFÉ » porte l'heure
  // « Le matin » — un mot que cette fonction ne connaissait pas. Elle retombait
  // donc sur 9999, et 9999 vaut « après 18h » : un petit-déjeuner était annoncé
  // sous « CE SOIR », puis trié en dernier. Toute heure écrite en toutes lettres
  // doit avoir sa minute, sinon elle finit à la nuit.
  if (mot === "lematin" || mot === "matin") return 8 * 60;
  if (mot === "enjournee" || mot === "toutelajournee") return 11 * 60;
  if (mot === "lemidi" || mot === "amidi" || mot === "midi") return 12 * 60;
  if (mot === "lapresmidi" || mot === "enapresmidi" || mot === "apresmidi") return 15 * 60;
  if (mot === "ensoiree" || mot === "lesoir" || mot === "soir") return 21 * 60;
  return SANS_HEURE;
}

// ⚠️ La valeur de repli n'est PAS une heure : c'est l'absence d'heure. Elle sert
// à trier en dernier, jamais à décider d'un moment de la journée.
const SANS_HEURE = 9999;

// 🚨 DEUX FINS DIFFÉRENTES, ET IL FAUT LES DISTINGUER. Stéphanie, 11 oct 2026,
// 21h45 : « j'ai la fiche petit déj or il est 21.45 », rangée sous MAINTENANT.
// `finEnMinutes` rend 24h pour les annuaires et les fiches « en cours », et c'est
// VOULU : elles doivent rester visibles le soir, quand on prépare sa sortie du
// lendemain (les sept expositions avaient disparu à 19h41, Stéphanie l'avait
// signalé). Mais cette même valeur servait aussi à décider « ça a lieu en ce
// moment » — et un petit-déjeuner n'a pas lieu à 21h45.
// `finReelle` ne sert QU'À ÇA : dire si c'est en cours. Elle ignore le 24h
// d'affichage et se fie à ce que la fiche annonce vraiment.
function finReelle(e) {
  const t = (e.time || "").replace(/\s/g, "");
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const d = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const f = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    return f <= d ? 24 * 60 : f;
  }
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "lematin" || mot === "matin") return 12 * 60;
  if (mot === "lemidi" || mot === "amidi" || mot === "midi") return 15 * 60;
  if (mot === "enjournee" || mot === "toutelajournee") return 18 * 60;
  if (mot === "lapresmidi" || mot === "enapresmidi" || mot === "apresmidi") return 19 * 60;
  if (mot === "ensoiree" || mot === "lesoir" || mot === "soir") return 24 * 60;
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) return parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0) + 120;
  return 24 * 60;
}

// Une fiche du jour dont l'heure est passée n'a plus rien à proposer : à 15h48 on ne
// veut plus voir le cours de 07h00. On se fie à l'heure de FIN quand la fiche la donne
// (« 07h00 — 09h00 ») ; sinon au début plus deux heures, le temps qu'un concert ou un
// dîner déjà commencé reste rejoignable.
function finEnMinutes(e) {
  // Les récapitulatifs (« 6 musées ouverts », « 8 brunchs ») et les annuaires ne
  // portent qu'une heure d'ouverture : ils restent utiles toute la journée.
  //
  // 🚨 LES FICHES « EN COURS » AUSSI (ajouté le 10 oct 2026, Stéphanie : « il
  // manque les expositions »). Une exposition ouverte jusqu'en janvier n'est pas
  // TERMINÉE à 18h : elle est FERMÉE POUR LA NUIT, et elle rouvre demain. La règle
  // de la v0.0.106 — ne plus montrer ce qui est fini — vaut pour un concert, qui
  // n'aura pas lieu deux fois ; pas pour une expo. Résultat constaté un samedi à
  // 19h41 : les SEPT expositions du jour avaient disparu du fil, au moment précis
  // où l'on prépare sa sortie du lendemain. Leurs horaires restent écrits sur la
  // carte (« 09h00 — 18h00 ») : la personne voit bien que c'est fermé maintenant.
  if (e.recap === true || e.pinLast === true || e.ongoing === true) return 24 * 60;
  const t = (e.time || "").replace(/\s/g, "");
  // Le fil écrit les plages avec un tiret cadratin OU une flèche : « 09h — 18h »,
  // « 9h30 → 18h30 ». Oublier la flèche masquait la messe du dimanche dès 11h30.
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const debut = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const fin   = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    return fin <= debut ? 24 * 60 : fin;   // « 23h00 — 04h00 » se termine le lendemain
  }
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) return parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0) + 120;
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "enjournee") return 18 * 60;
  return 24 * 60;   // « En soirée » ou horaire absent : on garde jusqu'au bout de la nuit
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date()); const weekendDates = getWeekendDates();
  const maintenant = new Date().getHours() * 60 + new Date().getMinutes();
  const base = (() => {
  switch (filterId) {
    // Les fiches « en cours » sont déjà étalées jour par jour en amont
    // (etaleLesEnCours) : ces filtres n'ont donc rien de spécial à faire.
    case "today": { const y = new Date().getFullYear(); return events.filter(e => e.date === todayStr && (e.year || y) === y); }
    case "weekend": { const y = new Date().getFullYear(); return events.filter(e => weekendDates.includes(e.date) && (e.year || y) === y); }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
  })();
  // Le fil est une proposition de sortie, pas un journal : on masque ce qui est
  // terminé. Les autres jours ne sont pas concernés.
  return base.filter(e => e.date !== todayStr || finEnMinutes(e) > maintenant);
}

// ── LE FIL EN SECTIONS ───────────────────────────────────────────────────────
// Stéphanie, 6 septembre 2026 : « lorsque l'on scrolle il y a une sensation de
// répétition ». Elle avait raison, et c'était mesurable : « AUJOURD'HUI » écrit
// vingt fois, une fois par carte, et treize expositions qui se suivaient sans
// rien entre elles. Trois gestes y répondent — la date passe en intertitre au
// lieu d'être répétée, la journée en cours se découpe en moments, et les
// expositions d'une même section se réunissent sur une seule carte.

const JOURS_LONGS_FR = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const MOIS_LONGS_FR  = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const JOURS_LONGS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MOIS_LONGS_EN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// « Dim 6 sep » → « DIMANCHE 6 SEPTEMBRE »
function titreDeJour(dateStr, lang) {
  const p = (dateStr || "").split(" ");
  const j = JOURS.indexOf(p[0]), m = MOIS_IDX[p[2]];
  if (j < 0 || m === undefined) return dateStr || "";
  return lang === "en"
    ? `${JOURS_LONGS_EN[j]} ${p[1]} ${MOIS_LONGS_EN[m]}`
    : `${JOURS_LONGS_FR[j]} ${p[1]} ${MOIS_LONGS_FR[m]}`;
}

// ⚠️ `jourConsulte` : la journée réellement demandée au calendrier. Sans lui, le
// découpage raisonnait toujours sur AUJOURD'HUI — Stéphanie, 15 septembre 2026 :
// elle clique sur le 18, et le fil titre « Maintenant ». C'est le même mensonge
// d'étiquette que « AUJOURD'HUI » sur les expositions, corrigé le 31 août : les
// fiches `ongoing` ne portent que la date du jour, et le calendrier les laisse
// passer pour toute date qu'elles couvrent.

/**
 * 🕐 LE MOMENT D'UNE FICHE — la MÊME règle que les intertitres du fil.
 *
 * Stéphanie, 28 oct 2026 : « la section "Ce matin" contient actuellement des
 * événements à 19h et 19h30. Ce n'est pas correct. »
 *
 * 🚨 D'OÙ VENAIT LA FAUTE, ET ELLE ÉTAIT À MOI. La vitrine classait ses fiches
 * en mettant d'abord CELLES QUI ONT UNE PHOTO, pour que le hero soit beau. Le
 * titre, lui, lisait l'heure de la PREMIÈRE fiche de ce classement — donc une
 * fiche choisie pour sa photo, pas pour son heure. Un cours de 9 h en tête, et
 * « Ce matin » se retrouvait au-dessus de concerts de 19 h 30.
 *
 * La règle est maintenant la même partout : le moment se lit sur l'HEURE, la
 * vitrine ne mélange plus deux moments, et son titre décrit ce qu'elle montre.
 * Les heures sont celles des fiches, à l'heure de Monaco — on ne touche pas aux
 * données pour arranger l'affichage.
 */
function momentDeLaFiche(e, lang, min) {
  const debut = heureDeTri(e);
  const sansHeure = !(e.time && String(e.time).trim()) || debut === SANS_HEURE;
  if (sansHeure) return { cle: "apresmidi", titre: lang === "en" ? "This afternoon" : "Cet après-midi" };
  // En cours : commencé et pas encore fini. C'est le seul « Maintenant » honnête.
  if (typeof min === "number" && debut <= min && finReelle(e) > min) {
    return { cle: "maintenant", titre: lang === "en" ? "Right now" : "Maintenant" };
  }
  // 🖼️ CE QUI DURE TOUTE LA JOURNÉE N'EST PAS « CE MATIN ».
  // Une exposition « 09h00 — 18h00 » commence le matin, mais l'annoncer sous
  // « Ce matin » est faux : on peut y aller à 15 h. Et à 18 h 18, c'était même
  // absurde — Stéphanie l'a vu. Une plage qui dépasse quatre heures et franchit
  // midi s'annonce donc simplement « Aujourd'hui ».
  const fin = finReelle(e);
  if (fin - debut >= 4 * 60 && debut < 13 * 60 && fin > 14 * 60) {
    return { cle: "journee", titre: lang === "en" ? "Today" : "Aujourd'hui" };
  }

  // Le brunch ferme la matinée (règle 28), même arbitrage que dans le fil.
  if (e.cat === "BRUNCH" && debut < 14 * 60) return { cle: "matin", titre: lang === "en" ? "This morning" : "Ce matin" };
  if (debut < 12 * 60) return { cle: "matin",      titre: lang === "en" ? "This morning"   : "Ce matin" };
  if (debut < 18 * 60) return { cle: "apresmidi",  titre: lang === "en" ? "This afternoon" : "Cet après-midi" };
  return { cle: "soir", titre: lang === "en" ? "Tonight" : "Ce soir" };
}

function decouperEnSections(liste, lang, jourConsulte = null) {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  const aujourdhui = toFrDate(now);
  const d = new Date(now); d.setDate(d.getDate() + 1);
  const demain = toFrDate(d);

  const sections = [];
  let courante = null;
  // `jour` s'affiche en gros doré, une seule fois ; `moment` en dessous, plus discret.
  // Aujourd'hui n'a pas de jour : ses moments (Maintenant, Ce soir) tiennent la
  // place du titre, c'est ce qu'on lit en ouvrant l'app.
  const poser = (cle, jour, moment, e) => {
    if (!courante || courante.cle !== cle) { courante = { cle, jour, moment, items: [] }; sections.push(courante); }
    courante.items.push(e);
  };

  // Matin / après-midi / soir, d'après l'heure de DÉBUT. La liste étant triée par
  // cette même heure, les trois se suivent toujours dans l'ordre.
  const momentDuJour = (e) => {
    if (!(e.time && String(e.time).trim())) return lang === "en" ? "Afternoon" : "Après-midi";
    const debut = heureDeTri(e);
    // Une heure illisible ne dit rien du moment : on la traite comme une fiche
    // sans heure plutôt que de l'annoncer « ce soir ».
    if (debut === SANS_HEURE) return lang === "en" ? "Afternoon" : "Après-midi";
    // 🥐 LE BRUNCH FERME LA MATINÉE. Stéphanie, 24 oct 2026 : « la fiche brunch
    // doit apparaître juste avant l'après-midi ». Un brunch commence à midi, donc
    // il tombait dans « Après-midi », au milieu des apéros. Or c'est le repas du
    // matin : on le range en fin de matinée, où le tri par heure le place
    // naturellement en dernier — juste avant l'après-midi. L'heure affichée ne
    // change pas, c'est la SECTION qui change.
    if (e.cat === "BRUNCH" && debut < 14 * 60) return lang === "en" ? "Morning" : "Matin";
    if (debut < 12 * 60)      return lang === "en" ? "Morning" : "Matin";
    if (debut < 18 * 60)      return lang === "en" ? "Afternoon" : "Après-midi";
    return lang === "en" ? "Evening" : "Soir";
  };

  // En consultant une date, tout s'affiche sous CETTE journée : le tri par date
  // n'a plus de sens et cassait l'ordre des moments — les expositions « en cours »
  // portent la date du JOUR, pas celle qu'on consulte, donc elles passaient devant
  // et « Matin » réapparaissait après « Soir ». On retrie par heure.
  // Rang du moment, pour que les sections se suivent toujours dans l'ordre : une
  // fiche « en cours » commencée ce matin ne doit pas ramener « Maintenant » après
  // « Ce soir ».
  // 🚨 « Cette fiche a fini sa journée ». CE PRÉDICAT DOIT SERVIR AU TRI ET AU
  // PLACEMENT, sinon les deux se contredisent : le placement rangeait la fiche
  // sous « Demain » pendant que le tri la laissait avec aujourd'hui, et on
  // obtenait DEUX blocs « Demain », le second avec « Après-midi » avant
  // « Matin ». Stéphanie, 11 oct 2026 : « vérifie les sous fiches des
  // expositions y a un bug ».
  // 🚨 UNE FICHE À ANNUAIRE FINIT QUAND SA DERNIÈRE SÉANCE FINIT.
  // Stéphanie, 31 oct 2026, 20h40 : « aujourd'hui y a pas la fiche cinéma ».
  // Elle avait disparu de PARTOUT, et par un enchaînement de trois règles qui
  // se tenaient chacune debout :
  //   1. `filterByTime` la GARDE — `pinLast` vaut « ferme pour la nuit », pas
  //      « terminé » (règle du 10 oct, celle qui sauve les expositions) ;
  //   2. `finie` la déclarait TERMINÉE, parce que « En journée » se lit 18h00 ;
  //      elle partait donc sous DEMAIN ;
  //   3. demain a DÉJÀ sa fiche cinéma — même sous-titre, refabriquée chaque
  //      nuit — alors la règle anti-doublon la laissait tomber.
  // Gardée par la première, bannie par la troisième : plus nulle part.
  //
  // Le vrai défaut est au point 2, et il est factuel : la fiche N'ÉTAIT PAS
  // terminée. Le Fantôme de l'Opéra passait à 20h50 ce soir-là. « En journée »
  // est un mot vague posé sur la fiche-mère, alors que l'heure juste est écrite
  // dans ses SOUS-FICHES — « VF 16:00 · VF 20:50 ».
  // On lit donc la dernière séance quand il y en a une. Et le petit-déjeuner de
  // 22h, lui, reste bien terminé : ses adresses ont fermé (règle du 11 oct).
  // ⚠️ SEULEMENT LE CINÉMA (`weeklyFilms`), et la restriction est essentielle :
  //    là, `info` liste de VRAIES SÉANCES (« VF 16:00 · VF 20:50 »). Ailleurs —
  //    terrasses, wellness bars, petit-déj — `info` donne les HEURES D'OUVERTURE
  //    du lieu. Prendre la plus tardive et y ajouter deux heures faisait tenir
  //    le petit-déjeuner jusqu'à 20h30 sous « Plus tard aujourd'hui », soit très
  //    exactement ce dont Stéphanie se plaignait le 11 oct. Une heure de
  //    fermeture n'est pas une heure de rendez-vous.
  const finDesSousFiches = (e) => {
    if (e.weeklyFilms !== true) return null;
    if (!Array.isArray(e.directory) || !e.directory.length) return null;
    let derniere = null;
    for (const d of e.directory) {
      for (const m of String(d?.info || "").matchAll(/(\d{1,2})[h:](\d{2})/g)) {
        const t = parseInt(m[1]) * 60 + parseInt(m[2]);
        if (derniere === null || t > derniere) derniere = t;
      }
    }
    return derniere === null ? null : derniere + 120;   // le temps de la séance
  };
  const finie = (e) => {
    if (jourConsulte || e.date !== aujourdhui) return false;
    if (!(e.time && String(e.time).trim())) return false;
    const sousFiches = finDesSousFiches(e);
    return (sousFiches === null ? finReelle(e) : sousFiches) <= min;
  };
  // ⚠️ Et si DEMAIN A DÉJÀ SA FICHE, on ne remonte pas celle d'aujourd'hui :
  // une fiche « en cours » (petit-déj, musées, expositions) existe à toutes les
  // dates de sa période, donc la rattacher à demain la ferait apparaître DEUX
  // FOIS dans le même bloc. Constaté en vérifiant le fil le 11 oct 2026.
  // La comparaison se fait sur le TITRE, pas sur l'identifiant : la fiche cinéma
  // et les fiches d'annuaire sont REFABRIQUÉES chaque jour avec un id différent,
  // donc « même id » laissait passer deux fois « Les films au cinéma cette
  // semaine ». Deux fiches de même catégorie et de même titre, à deux dates,
  // sont la même chose répétée.
  // ⚠️ POUR UNE FICHE QUI SE REFABRIQUE CHAQUE JOUR, LE TITRE NE VA PAS NON PLUS :
  // il porte un COMPTE qui change. « MUSÉES 6 OUVERTS À MONACO » aujourd'hui et
  // « MUSÉES 4 OUVERTS À MONACO » demain sont la même fiche, et les deux se
  // retrouvaient dans la même journée — quatre musées affichés en double au
  // dépliage des expositions, et un total annoncé trop gros. Stéphanie, 11 oct
  // 2026 : « corrige les expo il y a des doublons il n'y a en vrai pas 26 expo ».
  // Le SOUS-TITRE, lui, ne bouge pas : c'est lui qui identifie ces fiches-là.
  const signature = e => (e.recap === true || e.ongoing === true) && e.subtitle
    ? `${e.cat}|${String(e.subtitle).replace(/\s+/g, " ").trim()}`
    : `${e.cat}|${(e.title || "").replace(/\s+/g, " ").trim()}`;
  const dejaApresAujourdhui = new Set(
    liste.filter(e => e.date !== aujourdhui).map(signature));
  const aDejaSaFicheDemain = (e) => dejaApresAujourdhui.has(signature(e));
  const rang = (e) => {
    if (jourConsulte) return 0;
    // Une fiche terminée a quitté l'échelle d'aujourd'hui : elle est affichée
    // sous DEMAIN. Lui laisser un rang de « plus tard » / « ce soir » la plaçait
    // APRÈS les vraies fiches de demain, et la journée affichait deux fois ses
    // moments — matin, après-midi, soir, puis matin à nouveau.
    if (finie(e)) return 0;
    if (e.date !== aujourdhui) return 0;
    const sansHeure = !(e.time && String(e.time).trim());
    const debut = heureDeTri(e), fin = finReelle(e);
    if (!sansHeure && debut <= min && min < fin) return 0;   // maintenant
    if (!sansHeure && debut >= 18 * 60) return 2;            // ce soir
    return 1;                                               // plus tard aujourd'hui
  };
  // Comparateur COHÉRENT : la date d'abord (sauf quand tout est ramené à la même
  // journée), puis le moment, puis l'heure. Un comparateur qui renvoie 0 pour des
  // paires incomparables laisse Array.sort libre de rendre n'importe quel ordre.
  // On trie sur la journée RÉELLEMENT AFFICHÉE — celle qui sert d'intertitre —
  // et non sur la date du fichier. Une fiche « en cours » porte la date du jour ;
  // rattachée au 18 septembre, elle doit se ranger avec le 18, pas avant tout le
  // monde. Puis le moment, puis l'heure.
  const jourAffiche = e => (jourConsulte && e.ongoing) ? jourConsulte : (finie(e) ? demain : e.date);
  const aRanger = liste.slice().sort((a, b) => {
    const da = parseEventDate({ ...a, date: jourAffiche(a) });
    const db = parseEventDate({ ...b, date: jourAffiche(b) });
    if (da && db && da - db !== 0) return da - db;
    return (rang(a) - rang(b)) || (heureDeTri(a) - heureDeTri(b));
  });

  for (const e of aRanger) {
    // En consultant une autre journée, « Maintenant » et « Ce soir » ne veulent
    // rien dire : on range sous la date demandée, découpée en moments.
    if (jourConsulte) {
      const jour = titreDeJour(e.ongoing ? jourConsulte : e.date, lang);   // en cours → jour consulté
      const moment = momentDuJour(e);
      poser(`${jour}|${moment}`, jour, moment, e);
      continue;
    }
    if (e.date === aujourdhui) {
      const sansHeure = !(e.time && String(e.time).trim());
      // ⚠️ `finReelle` et NON `finEnMinutes` : la seconde rend 24h pour les
      // annuaires afin qu'ils restent affichés le soir, ce qui faisait annoncer
      // « MAINTENANT » un petit-déjeuner à 21h45.
      const debut = heureDeTri(e), fin = finReelle(e);
      // Une fiche sans horaire ne dit rien de son moment : l'annoncer « ce soir »
      // serait affirmer un horaire qu'elle ne donne pas.
      // 🚨 UNE FICHE TERMINÉE N'EST PAS « PLUS TARD AUJOURD'HUI ». Stéphanie,
      // 11 oct 2026, 22h : « mais j'ai plus tard aujourd'hui petit déj..ça va pas ».
      // Les fiches « en cours » (petit-déj, musées, expositions) restent
      // volontairement affichées le soir — c'est le moment où l'on prépare sa
      // sortie — mais leur journée est finie. Ce n'est donc pas d'aujourd'hui
      // qu'elles parlent, c'est de DEMAIN, et c'est ce qu'elles doivent annoncer.
      if (!sansHeure && debut <= min && min < fin) poser("maintenant", null, lang === "en" ? "Right now" : "Maintenant", e);
      else if (finie(e)) {
        // Sa journée est faite. Si la même fiche existe déjà pour un jour suivant,
        // on la laisse tomber — c'est l'autre qui parle de demain.
        if (aDejaSaFicheDemain(e)) continue;
        // ⚠️ LA MÊME CLÉ que les vraies fiches de demain (`${demain}|${moment}`).
        // Une clé à part (`demain|…`) ouvrait un SECOND bloc « Demain ».
        const moment = momentDuJour(e);
        poser(`${demain}|${moment}`, lang === "en" ? "Tomorrow" : "Demain", moment, e);
      }
      else if (!sansHeure && debut >= 18 * 60)     poser("cesoir",     null, lang === "en" ? "Tonight" : "Ce soir", e);
      else                                         poser("plustard",   null, lang === "en" ? "Later today" : "Plus tard aujourd'hui", e);
    } else {
      const jour = e.date === demain ? (lang === "en" ? "Tomorrow" : "Demain") : titreDeJour(e.date, lang);
      const moment = momentDuJour(e);
      poser(`${e.date}|${moment}`, jour, moment, e);
    }
  }
  // ⚠️ CLÉS UNIQUES. Deux sections pouvaient porter la même clé — « Maintenant »
  // revenait plus bas dès que l'ordre des moments s'inversait — et React, incapable
  // de les distinguer, laissait en place le DOM de l'affichage précédent : on
  // voyait les intertitres d'AUJOURD'HUI au-dessus de la date consultée au
  // calendrier, alors que la liste calculée ne contenait qu'elle.
  return sections.map((sec, i) => ({ ...sec, cle: `${sec.cle}#${i}` }));
}

// Les familles qu'on réunit sur UNE carte, et à partir de combien de fiches ça
// vaut la peine. En dessous du seuil, la carte de regroupement coûterait plus de
// place qu'elle n'en fait gagner.
//
// 🚨 LA FICHE RECAP FAIT PARTIE DU GROUPE, et c'est tout le correctif du 11 octobre
// 2026. L'ancien prédicat l'écartait (`e.recap !== true`) : elle restait donc POSÉE
// À CÔTÉ de la carte de regroupement, et la même journée annonçait deux fois ses
// sorties. Stéphanie l'a signalé trois fois, sans qu'on voie que c'était le même
// défaut : « il y a une fiche qui dit 7 expo et une fiche qui dit musées ouverts »,
// puis « il y a 1ère fiche brunch dj live robuchon et une autre brunch 8 adresses »,
// puis « idem pour apéro y a hermitage et en dessous 10 terrasses ouvertes ».
// Une famille, un jour, UNE carte.
const FAMILLES_REUNIES = [
  { cat: "EXPOSITION", seuil: 3,
    fr: "Expositions", en: "Exhibitions",
    nomFr: n => `${n} expositions à voir`,  nomEn: n => `${n} exhibitions on view` },
  { cat: "BRUNCH", seuil: 2,
    fr: "Brunchs", en: "Brunch",
    nomFr: n => `${n} brunchs ce jour-là`,  nomEn: n => `${n} brunches that day` },
  // ⚠️ « ce jour-là », pas « ce soir-là » : depuis le 11 oct 2026 la famille APÉRO
  // contient AUSSI la fiche du midi (Stéphanie : « met apéro du midi »), et
  // annoncer le soir au-dessus d'adresses de midi était faux.
  { cat: "APÉRO", seuil: 2,
    fr: "Apéro", en: "Drinks",
    nomFr: n => `${n} adresses ce jour-là`, nomEn: n => `${n} places that day` },
  // ⚠️ PAS DE FAMILLE « CINÉMA ». Elle a existé une heure, le 11 oct 2026, puis
  // a été retirée : depuis que le bouton « Infos » déplie partout, la carte
  // cinéma déplie ses films toute seule. En faire un groupe la REMPLAÇAIT par
  // une carte de regroupement, et lui faisait perdre son téléphone et son
  // « Mon agenda » pour rien.
];
const FAMILLE_DE = Object.fromEntries(FAMILLES_REUNIES.map(f => [f.cat, f]));

// ⚠️ `pinLast` reste DEHORS par défaut : cette fiche-là demande expressément à
// finir la journée, l'absorber dans un groupe lui ferait perdre sa place. Une
// famille peut lever la règle (`pinLastOk`) quand sa carte de groupe prend
// exactement la place de la fiche — c'est le cas du cinéma, seul de son jour.
// 🍸 ET UNE FICHE PEUT DEMANDER À RESTER SEULE. Stéphanie, 1er nov 2026 :
// « l'apéro des Frenchy, c'est un apéro séparé, pas un spectacle, mais un
// event séparé des listes des apéros ».
// La nuance est juste : les autres membres du groupe APÉRO sont des ADRESSES
// ouvertes ce soir-là — une terrasse, un bar d'hôtel. L'apéro des Frenchy est
// un RENDEZ-VOUS auquel on se rend, à une heure, avec des gens : le noyer
// dans « 23 adresses ce jour-là » le ferait disparaître en tant qu'événement.
// ⚠️ `horsGroupe` ET NON `pinLast` : `pinLast` veut dire « finit la journée »
//    et, pour tout ce qui n'est pas le cinéma, `estAnnuairePermanent` RETIRE
//    la fiche du fil tant qu'on n'a pas demandé sa catégorie. On l'aurait
//    sortie du groupe en la faisant disparaître.
const estGroupable = (e, fam) =>
  e.horsGroupe !== true && (fam?.pinLastOk === true || e.pinLast !== true);

// Une fiche qui n'est qu'un annuaire : elle ne se déplie pas en elle-même, mais
// en ses entrées. Les terrasses du soir, les brunchs, les films de la semaine.
const estAnnuaire = e =>
  (e.recap === true || e.weeklyFilms === true) && Array.isArray(e.directory) && e.directory.length > 0;

// Ce qu'une fiche représente VRAIMENT. Une fiche recap tient à elle seule tout un
// annuaire : la compter pour 1 donnerait « Voir les 2 » au-dessus de huit brunchs.
const poidsFiche = e => (estAnnuaire(e) && e.directory.length) || 1;

// ⚠️ LE REGROUPEMENT SE FAIT PAR JOUR, PAS PAR MOMENT. Stéphanie, 11 septembre
// 2026 : « il y a 1 fois la fiche 6 expo puis après la fiche 5 expo qui apparaît
// le même jour ». Depuis que les journées se découpent en matin / après-midi /
// soir, les expositions tombaient dans deux moments différents — celles qui
// ouvrent à 9h le matin, celles de 14h l'après-midi — et chaque moment
// fabriquait SA carte de regroupement. Un jour, une carte.
function reunirLesFamillesParJour(sections, estDeplie) {
  const parJour = new Map();
  for (const sec of sections) {
    const cle = sec.jour || "aujourdhui";
    if (!parJour.has(cle)) parJour.set(cle, []);
    parJour.get(cle).push(sec);
  }

  const sortie = [];
  for (const [cleJour, groupe] of parJour) {
    // Ce qui se réunit ce jour-là, famille par famille.
    const aReunir = new Map();
    for (const fam of FAMILLES_REUNIES) {
      const fiches = groupe.flatMap(sec =>
        sec.items.filter(e => e.cat === fam.cat && estGroupable(e, fam)));
      if (fiches.length >= fam.seuil) aReunir.set(fam.cat, fiches);
    }
    if (!aReunir.size) { sortie.push(...groupe); continue; }

    // 🚨 OÙ POSER LA CARTE DE GROUPE : SUR SA FICHE LA PLUS LOURDE, pas sur la
    // première. Stéphanie, 11 oct 2026 : « castel roc apparaît petit puis une
    // fiche apéro après-midi… plusieurs fois ». En ajoutant le Castel Roc —
    // UNE adresse, à 16h — toute la famille APÉRO remontait dans « PLUS TARD
    // AUJOURD'HUI », et les dix terrasses du soir étaient annoncées avant
    // « CE SOIR », qui se retrouvait sans apéro. Une seule petite fiche tirait
    // le groupe entier hors de son moment.
    // La fiche la plus lourde (son annuaire le plus fourni) décide du moment ;
    // en cas d'égalité, la première l'emporte, donc rien ne bouge pour les
    // familles dont les fiches se valent.
    const ancre = new Map();
    for (const [cat, fiches] of aReunir) {
      let meilleure = null, poidsMax = -1;
      for (const f of fiches) {
        const w = poidsFiche(f);
        if (w > poidsMax) { poidsMax = w; meilleure = f; }
      }
      ancre.set(cat, meilleure);
    }

    const posees = new Set();
    for (const sec of groupe) {
      const items = [];
      for (const e of sec.items) {
        const fiches = aReunir.get(e.cat);
        if (!fiches || !estGroupable(e, FAMILLE_DE[e.cat])) { items.push(e); continue; }
        // Les autres fiches de la famille disparaissent du fil : elles ne
        // reviennent qu'au dépliage, sous la carte.
        if (posees.has(e.cat) || e !== ancre.get(e.cat)) continue;
        posees.add(e.cat);
        const cleGroupe = `${cleJour}|${e.cat}`;
        items.push({ groupeFamille: fiches, catGroupe: e.cat, cleGroupe });
        if (estDeplie(cleGroupe)) {
          for (const x of fiches) {
            // 🚨 UNE FICHE RECAP SE DÉPLIE EN SES LIEUX, PAS EN ELLE-MÊME.
            // Stéphanie, 11 octobre 2026 : « quand je clique sur apéro les fiches
            // se déclinent mais il y a la 2e qui dit les ce soir 10 terrasses…
            // elle doit disparaître celle-là car justement les terrasses
            // apparaissent dans ces sous-fiches ». Elle a raison : rouvrir la
            // fiche-annuaire au milieu de son propre dépliage, c'est répéter le
            // titre du chapitre au milieu du chapitre.
            if (estAnnuaire(x)) {
              items.push(...x.directory.map((d, i) => ({ _lieu: d, _fiche: x, _rang: i })));
            } else {
              // 🚨 UN VRAI RENDEZ-VOUS DEVIENT UNE SOUS-FICHE COMME LES AUTRES.
              // Stéphanie, 11 oct 2026 : « y a toujours la fiche robuchon
              // différente des autres », puis « pareil pour apéro met la fiche
              // hermitage comme les autres ». Avant, le Sunday Brunch de Robuchon
              // et le Jardin Belle Époque sortaient en carte pleine au milieu de
              // sous-fiches sobres : on ne comprenait pas qu'ils étaient du même
              // ensemble. Ils gardent leur « J'y vais » — sur LEUR identifiant,
              // pas un identifiant composé, puisque ce sont de vrais événements.
              items.push({
                _lieu: {
                  name: (x.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim(),
                  // L'heure seule : le lieu est déjà dans l'adresse juste en
                  // dessous, l'écrire deux fois ne renseigne personne.
                  info: x.time,
                  adr: x.subtitle,
                  desc: x.desc,
                  tel: x.phone,
                },
                _fiche: x, _rang: `ev-${x.id}`, _evenement: true,
              });
            }
          }
        }
      }
      // Un moment vidé de ses fiches n'a plus rien à annoncer : on ne laisse pas
      // un intertitre « Matin » suivi de rien.
      if (items.length) sortie.push({ ...sec, items });
    }
  }
  return sortie;
}

// Le moment, sous le jour : plus petit, sans filet, dans le bleu du cadre —
// il précise, il n'annonce pas.
function IntertitreMoment({ titre }) {
  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: 12, fontWeight: 700, letterSpacing: 1.6,
      textTransform: "uppercase", color: GREY,
      margin: "14px 2px 8px",
    }}>{titre}</div>
  );
}

function IntertitreSection({ titre }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 2px 12px" }}>
      <span style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 15, fontWeight: 700, letterSpacing: 2.4,
        textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap",
      }}>{titre}</span>
      <span style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.45)" }} />
    </div>
  );
}

// La carte qui remplace la pile du jour. Elle ne prétend pas être un événement :
// ni cœur, ni « J'y vais », ni téléphone. On la touche, la famille se déplie et les
// fiches reviennent une par une, ENTIÈRES — avec tous leurs « J'y vais » et leurs
// annuaires, puisque ce sont les mêmes fiches qu'avant.
function CarteGroupeFamille({ fiches, cat, lang, deplie, onOuvrir }) {
  const fam = FAMILLE_DE[cat] || FAMILLES_REUNIES[0];
  const total = fiches.reduce((n, e) => n + poidsFiche(e), 0);

  // On annonce les sorties elles-mêmes : le premier morceau du sous-titre est
  // tantôt une salle, tantôt une adresse (« 62 bd du Jardin Exotique »), et lister
  // des rues ne donne envie de rien. Pour une fiche recap, son titre à elle ne dit
  // rien non plus (« MUSÉES 6 ADRESSES À MONACO ») : ce sont les noms de son
  // annuaire qui renseignent.
  const noms = [];
  for (const e of fiches) {
    if (e.recap === true && Array.isArray(e.directory)) {
      for (const d of e.directory) if (d?.name) noms.push(d.name);
    } else {
      const t = localizeTitle((e.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim(), lang);
      if (t) noms.push(t);
    }
  }
  const titres = [...new Set(noms)];

  return (
    <div
      onClick={onOuvrir}
      style={{
        // 🎨 REFONTE DU 28 OCT : même traitement que les cartes ordinaires —
        // plus de cadre épais, une ombre douce et des coins arrondis. Cette
        // carte-ci avait été oubliée à la première passe : elle gardait son
        // trait de 3 px au milieu de voisines devenues lisses, et ça se voyait
        // tout de suite sur la capture.
        border: "1px solid rgba(23,36,60,0.06)", borderRadius: RAYON.lg,
        boxShadow: OMBRE.carte, padding: 0,
        marginBottom: 14, background: BLANC, cursor: "pointer",
      }}
    >
      {/* Un seul trait, comme toutes les autres cartes depuis le 10 oct 2026.
          Le filet bleu intérieur avait été oublié ici : les expositions
          affichaient deux couleurs de ligne. */}
      <div style={{ background: BLANC }}>
        <div style={{ padding: "18px 22px 20px", textAlign: "center" }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: "inline-block", padding: "5px 12px",
              borderRadius: RAYON.pastille, background: "rgba(135,55,47,0.08)",
              fontFamily: SANS, fontSize: 10.5, fontWeight: 700,
              letterSpacing: 1.1, textTransform: "uppercase",
              color: BORDEAU, lineHeight: 1.2,
            }}>{lang === "en" ? fam.en : fam.fr}</span>
          </div>

          {/* Les titres des fiches arrivent en capitales depuis les données ; celui-ci
              est écrit ici, donc c'est la feuille de style qui doit s'en charger —
              sans quoi la carte de regroupement détonnait au milieu des autres. */}
          <div style={{
            fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: 0,
            textTransform: "none",
            color: NUIT, lineHeight: 1.25, marginBottom: 12,
          }}>{casseNaturelle(lang === "en" ? fam.nomEn(total) : fam.nomFr(total))}</div>

          {/* Les titres arrivent déjà en capitales : en serif ils pèsent autant que
              le titre de la carte. En Lato fin, ils redeviennent ce qu'ils sont —
              un index discret de ce qu'on trouvera dessous. */}
          <div style={{
            fontFamily: SANS,
            fontSize: 12.5, fontWeight: 400, letterSpacing: 0,
            textTransform: "none",
            color: GRIS, lineHeight: 1.6, marginBottom: 18,
          }}>{titres.slice(0, 3).join(" · ")}{titres.length > 3 ? " …" : ""}</div>

          {/* 🔘 LE MÊME BOUTON QUE SUR LES AUTRES CARTES. Stéphanie, 27 oct
              2026 : « expo voir les 13 n'est pas comme les autres ». Elle avait
              raison, et sur cinq points à la fois : cette carte-ci écrivait son
              bouton en Lato 12 avec un trait de 1 px et aucun fond, quand toutes
              les autres l'écrivent en Josefin Sans 14, trait de 2 px, fond
              #FBF2F0. Il reprend donc le style commun — et la couleur de la
              famille, comme le cadre, au lieu du Rouge H codé en dur. */}
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "11px 22px", borderRadius: RAYON.pastille,
            border: "none", background: BORDEAU,
            fontFamily: SANS, fontSize: 13,
            fontWeight: 700, letterSpacing: 0.4,
            textTransform: "none", color: "#FFFFFF",
          }}>{deplie
            ? (lang === "en" ? "Close" : "Replier")
            : (lang === "en" ? `See all ${total}` : `Voir les ${total}`)}</span>
        </div>
      </div>
    </div>
  );
}

// Un lieu d'annuaire, devenu une fiche à part entière dans le fil quand on
// déplie sa famille. Il garde TOUT ce que la fiche-annuaire lui donnait :
// « J'y vais » nominatif, les amies qui y vont, et le téléphone.
//
// ⚠️ L'IDENTIFIANT « J'y vais » EST COMPOSÉ : id de la fiche du jour × 1000 +
// numéro du lieu. C'est exactement le calcul de Shell.jsx — il DOIT rester
// identique, sinon un « J'y vais » posé ici n'est pas celui posé dans la fiche.
export function CarteLieu({ lieu, fiche, lang, social, loggedIn, onGoingClick, onOuvrir, onReserver, evenement = false, inviteCode, onShowAuth,
                     favorites = [], onToggleFav }) {
  // Un vrai événement répond de son propre identifiant ; un lieu d'annuaire, de
  // l'identifiant composé. Les confondre ferait pointer deux « J'y vais »
  // différents sur la même ligne de la base.
  const idLieu = evenement ? fiche.id : (lieu.vid > 0 ? fiche.id * 1000 + lieu.vid : null);
  const jyVais = idLieu ? (social?.myParticipations || []).includes(idLieu) : false;
  const amies  = idLieu ? (social?.friendsGoingTo?.(idLieu) || []) : [];

  // ❤️📅 LE CŒUR ET « MON CALENDRIER » VIVENT ICI, PAS SUR LA FICHE DU DESSUS.
  // Stéphanie, 13 oct 2026 : « met mon calendrier et cœur sur les sous-fiches,
  // idem pour expo ». On ne met pas « 12 adresses » à son agenda ni en favori :
  // on choisit UNE adresse. Un vrai événement répond de son propre identifiant,
  // un lieu d'annuaire de l'identifiant composé — le même que « J'y vais », pour
  // que le favori et la participation désignent bien la même chose.
  // Une sous-fiche de cinéma ne rouvre pas sa fiche-mère : voir plus bas.
  const ouvrableDepuisLaSousFiche = !!onOuvrir && fiche.cat !== "CINÉMA" && !fiche.weeklyFilms;

  const estFav = idLieu ? favorites.includes(idLieu) : false;
  const pourAgenda = evenement ? fiche : {
    ...fiche,
    id: idLieu,
    title: lieu.name,
    subtitle: lieu.adr || fiche.subtitle,
    time: lieu.info || fiche.time,
    desc: (lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc) || fiche.desc,
  };

  return (
    <div style={{
      // 🎨 PALETTE UNIQUE (28 oct 2026). La sous-fiche portait la couleur de la
      // famille de sa mère — d'où un cadre VERT de 3 px au milieu d'un écran
      // ivoire et bordeaux. Stéphanie : « les fonds violet vif, vert foncé,
      // rouge et jaune donnent un effet catalogue de catégories ». Elle prend
      // maintenant le même filet bordeaux fin que toutes les autres cartes.
      border: `1px solid ${BORDEAU}`, borderRadius: RAYON.sm, background: BLANC,
      // 📏 RESSERRÉE LE 28 OCT AU SOIR. Stéphanie : « loisirs créatifs, c'est
      // énorme, non ? ». Elle avait raison : titre de 18 px centré, 16-20 px de
      // marge intérieure, interligne 1,6 — une sous-fiche prenait plus de place
      // que la carte qui la contient. Tout est ramené à l'échelle des autres
      // cartes du fil.
      // Le retrait latéral de 16 px reste : on voit d'un coup d'œil que ces
      // fiches appartiennent à celle du dessus.
      margin: "0 16px 8px", padding: "10px 13px 12px",
      display: "flex", flexDirection: "column",
    }}>
      {/* 🎬 PAS DE CLIC SUR UNE SOUS-FICHE DE CINÉMA. Stéphanie, 24 oct 2026 :
          « supprime sur les sous-fiches cinéma le clic sur la fiche qui donne
          tous les films ». Toucher le titre d'un film rouvrait la fiche-mère,
          c'est-à-dire la liste des douze films — on croyait ouvrir CE film et
          on se retrouvait au point de départ. Ailleurs le geste a du sens : la
          fiche-mère d'un annuaire de terrasses dit quelque chose de plus. */}
      <div
        onClick={ouvrableDepuisLaSousFiche ? onOuvrir : undefined}
        style={{
          fontFamily: SERIF,
          fontWeight: 600, fontSize: 15, letterSpacing: 0,
          color: NUIT,
          lineHeight: 1.25, cursor: ouvrableDepuisLaSousFiche ? "pointer" : "default",
          // 🎯 Stéphanie, 27 oct 2026 : « met les noms des cafés au centre des
          // sous-fiches ». Le nom du lieu est ce qu'on cherche en faisant
          // défiler : centré, il se repère d'un coup d'œil, et il s'aligne avec
          // la barre « Réserver » qui occupe toute la largeur juste en dessous.
          textAlign: "center",
        }}>{lieu.name}</div>

      {lieu.info && (
        <div style={{
          fontFamily: SANS, fontSize: 11.5,
          color: GREY, marginTop: 3,
        textAlign: "center",
        }}>{lieu.info}</div>
      )}

      {/* L'adresse, quand on la connaît : une sous-fiche doit suffire à s'y rendre. */}
      {lieu.adr && lieu.adr !== lieu.info && (
        <div style={{
          fontFamily: SANS, fontSize: 11,
          color: GREY, marginTop: 2,
        textAlign: "center",
        }}>{lieu.adr}</div>
      )}

      {/* Un film, lui, a un genre, une durée, une note et un résumé. Ces champs
          n'existent que dans l'annuaire du cinéma : pour une terrasse ou un
          brunch, rien ne s'affiche et la fiche est exactement la même qu'avant. */}
      {(lieu.genre || lieu.duree || typeof lieu.rt === "number") && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: 12,
          color: GREY, marginTop: 5,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          {[lieu.genre, lieu.duree].filter(Boolean).map((x, i) => <span key={i}>{x}</span>)}
          {typeof lieu.rt === "number" && (
            // 🍅 au-dessus de 60 %, 🤢 en dessous : la convention de Rotten
            // Tomatoes lui-même (« fresh » / « rotten »).
            <span style={{ fontWeight: 700, color: lieu.rt >= 60 ? "#44581C" : GOLD }}>
              {lieu.rt >= 60 ? "🍅" : "🤢"} {lieu.rt} %
            </span>
          )}
        </div>
      )}

      {/* 🇬🇧 En anglais on prend descEn, et on retombe sur le français s'il
           n'existe pas — un texte français vaut mieux que pas de texte, mais on
           ne le met JAMAIS dans descEn côté données (règle de la maison). */}
      {(lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc) && (
        <div style={{
          fontFamily: SANS, fontSize: 11.5,
          color: GREY, lineHeight: 1.45, marginTop: 6,
          // Trois lignes suffisent : le détail complet est dans la fiche.
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc}</div>
      )}

      {/* 🎟️ UN SEUL BOUTON, SUR TOUTES LES FICHES. Stéphanie, 26 oct 2026 :
          « au lieu du téléphone et site il faudrait en fait ce bouton réserver
          sur toutes les fiches ». Il dit toujours « Réserver » et fait le mieux
          disponible : le vrai formulaire, sinon le site, sinon le téléphone.
          Voir lib/reservation.js — le mot reste honnête dans les trois cas. */}
      {(() => {
        const a = actionDeReservation(lieu, fiche.cat, lang);
        if (!a) return null;
        // 🎨 LE BOUTON RESTE UNIFORME, C'EST LE CADRE QUI PORTE LA FAMILLE.
        // Stéphanie, 27 oct 2026 : « nous avions prévu des couleurs différentes,
        // là tout semble identique », puis « le bouton doit rester comme ça,
        // mais les cadres ». J'avais d'abord teinté la barre : erreur. Le geste
        // « Réserver » est le même partout, il garde donc le Rouge H, fil
        // conducteur de la maison. La couleur de famille vit dans le CADRE.
        // Même geste, même aspect : la barre est pleine dans les trois cas.
            const plein = true;
        return (
          <button onClick={e => { e.stopPropagation();
                    // 📊 SANS CETTE LIGNE, LE BOUTON EST MUET. Stéphanie, 27 oct
                    // 2026 : « dis-moi s'ils utilisent les nouveaux boutons
                    // réserver ». 9 030 boutons posés la veille, et AUCUN
                    // n'envoyait de signal — impossible de répondre. Le mode
                    // (formulaire, site ou téléphone) est enregistré : c'est lui
                    // qui dira si un vrai formulaire convertit mieux qu'un appel.
                    track("reservation_clic", { mode: a.mode, cat: fiche.cat,
                                                lieu: lieu.nom || lieu.name });
                    if (a.mode === "tel") window.location.href = `tel:${a.tel}`;
                    else onReserver?.(a.url, lieu.nom || lieu.name); }}
            style={{
              // 📏 RESSERRÉ LE 28 OCT AU SOIR (« loisirs créatifs, c'est énorme,
              // non ? »). La barre faisait 38 px de haut sur toute la largeur,
              // avec 2 px d'interlettrage : elle pesait plus lourd que le nom du
              // lieu. Elle passe à 32 px, s'arrête à sa propre largeur et prend
              // les coins arrondis de la maison.
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              height: 32, marginTop: 9, cursor: "pointer", alignSelf: "center",
              padding: "0 16px",
              border: `1px solid ${BORDEAU}`, borderRadius: RAYON.pastille,
              background: BORDEAU,
              fontFamily: SANS, fontSize: 11,
              fontWeight: 700, letterSpacing: 0.4,
              color: "#FFFCF8",
            }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                 stroke="#FFFCF8" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
              {a.mode === "tel"
                ? <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
                : <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"/>}
            </svg>
            {a.mot}
          </button>
        );
      })()}

      {/* 🚨 LA RANGÉE NE DOIT PAS DÉPENDRE DU SEUL `vid`. Stéphanie, 26 oct 2026 :
          « toujours pas je réserve sur les fiches de cinéma ». Une sous-fiche de
          FILM n'a ni `vid` ni `tel` — elle porte un titre, des horaires et un
          résumé. `idLieu` était donc nul, et toute la rangée (Réserver ET
          Direction) disparaissait en silence. Un bouton doit suffire à faire
          exister la rangée qui le porte. */}
      {(idLieu || lieu.tel || lienDeReservation(lieu) || lienDuSite(lieu)) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {/* 👥 L'INDICATEUR D'AMIS, comme sur une fiche normale. Stéphanie,
              13 oct 2026 : « rajoute indicateur amis ». Les prénoms en toutes
              lettres restent en infobulle ; ce sont les visages qu'on repère
              en faisant défiler. */}
          {amies.length > 0 ? (
            <span title={amies.map(f => f.display_name).filter(Boolean).join(", ")}
                  style={{ display: "inline-flex", alignItems: "center" }}>
              <FriendAvatars friends={amies} />
            </span>
          ) : (
            /* 🤝 « INVITE TES AMIS » SUR CHAQUE SOUS-FICHE. Stéphanie, 28 oct
               2026. À la place de la silhouette grise, qui ne disait que
               « personne » sans rien proposer.
               ⚠️ LE LIEN PORTE L'IDENTIFIANT DE LA FICHE-MÈRE, pas celui du
               lieu. Un identifiant composé (`id × 1000 + vid`) n'ouvre aucune
               fiche dans l'app : l'amie serait tombée sur une page vide. Le
               titre du message, lui, nomme bien le LIEU — on arrive donc sur la
               bonne carte, en sachant de quoi on parle. */
            <InviteTesAmis
              event={{ id: fiche.id, title: lieu.name }}
              lang={lang} inviteCode={inviteCode} onShowAuth={onShowAuth} petit />
          )}
          {idLieu && (
            <button
              onClick={() => onGoingClick?.({ ...fiche, id: idLieu })}
              aria-pressed={jyVais}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "6px 12px", cursor: "pointer",
                border: `1px solid ${jyVais ? GOLD : "rgba(15,29,58,0.18)"}`,
                borderRadius: 1, background: jyVais ? "#FFF8EC" : "none",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase",
                color: jyVais ? GOLD : NAVY, whiteSpace: "nowrap",
              }}
            >{jyVais ? "✓ " : ""}{lang === "en" ? "Going" : "J'y vais"}</button>
          )}
          {/* 🗑️ « APPELER » ET « AGENDA » RETIRÉS. Stéphanie, 27 oct 2026 :
              « et retire appeler et agenda ». « Appeler » faisait double emploi
              avec « Réserver », qui compose déjà le numéro quand c'est le seul
              moyen — et nommer le moyen est précisément ce qu'elle ne veut pas.
              La rangée n'a plus que ce qui sert : J'y vais, Direction, Partager. */}
          {/* 📍 DIRECTION. Stéphanie, 23 oct 2026 : « au lieu de mettre le site
              du lieu, mets le lien Google Maps partout, mets le mot Direction ».
              Le site d'un restaurant n'aide pas à y aller ; l'itinéraire, si.
              Pas d'icône téléphone à côté : « Appeler » est déjà écrit en toutes
              lettres. Ouverture SANS target="_blank" — voir lib/itineraire.js. */}
          {(lieu.nom || fiche.subtitle) && (
            <button onClick={e => { e.stopPropagation(); ouvrirItineraire(lieu.nom || fiche.subtitle); }}
               aria-label={lang === "en" ? "Directions" : "Itinéraire"}
               style={{
                 display: "inline-flex", alignItems: "center", gap: 4,
                 padding: "5px 11px", background: "none", cursor: "pointer",
                 border: "1px solid rgba(15,29,58,0.18)", borderRadius: 1,
                 fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
                 letterSpacing: 1, textTransform: "uppercase", color: NAVY, whiteSpace: "nowrap",
               }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY}
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {lang === "en" ? "Directions" : "Direction"}
            </button>
          )}
          {idLieu && Capacitor.isNativePlatform() && (
            <button
              onClick={e => { e.stopPropagation(); partagerEvenement(pourAgenda, lang, idLieu); }}
              style={{
                padding: "6px 12px", cursor: "pointer",
                border: "1px solid rgba(15,29,58,0.18)", borderRadius: 1, background: "none",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase", color: NAVY, whiteSpace: "nowrap",
              }}>{lang === "en" ? "Share" : "Partager"}</button>
          )}
          {idLieu && onToggleFav && (
            <button
              onClick={e => { e.stopPropagation(); onToggleFav(idLieu); }}
              aria-label={estFav
                ? (lang === "en" ? "Remove from favourites" : "Retirer des favoris")
                : (lang === "en" ? "Add to favourites" : "Ajouter aux favoris")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
                   fill={estFav ? GOLD : "none"} stroke={GOLD} strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function matchesCatFilter(e, catId) {
  switch (catId) {
    case "sport":      return ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat);
    case "theatre":    return ["THÉÂTRE","SPECTACLE","DANSE","FESTIVAL","GALA","FÊTE NATIONALE","MUSICAL"].includes(e.cat);
    case "concert":    return ["CONCERT","JAZZ LIVE","OPÉRA"].includes(e.cat);
    case "musee":      return ["EXPOSITION","MARCHÉ","SALON"].includes(e.cat);
    case "conference": return e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true;
    case "cinema":     return e.cat === "CINÉMA";
    case "petitdej":   return e.cat === "PETIT-DÉJ";
    case "famille": {
      // 🚨 La règle commençait par `e.free === true ||` : TOUT événement gratuit
      // devenait « Famille ». Mesuré le 10 oct 2026 : 152 fiches sur 362 passaient
      // le filtre, dont 30 récapitulatifs « CE SOIR N TERRASSES OUVERTES », 10
      // brunchs et 10 messes. Une mère qui cherchait quoi faire avec ses enfants
      // tombait sur des terrasses de bars. La gratuité n'a jamais voulu dire
      // « pour les enfants » — c'est le filtre Famille, pas le filtre Gratuit.
      const txt = `${e.title} ${e.subtitle} ${e.desc || ""}`;
      // 1. Ce qui se dit explicitement l'emporte, quelle que soit la catégorie.
      if (/enfant|famille|junior|jeune public|jeunesse|parent|kid|b[ée]b[ée]|d[èe]s \d+\s*ans/i.test(txt)) return true;
      // 2. Ce qui n'est jamais pour les enfants, même gratuit.
      if (["APÉRO","SOIRÉE","DJ SET","JAZZ LIVE","BRUNCH","ENCHÈRES","CHANTS","BIEN-ÊTRE","PETIT-DÉJ"].includes(e.cat)) return false;
      // 3. Le reste : les catégories où une famille a sa place.
      return ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat);
    }
    case "ateliers":   return ["ATELIER","DANSE"].includes(e.cat);
    case "bienetre":   return ["BIEN-ÊTRE"].includes(e.cat);
    case "foody":      return ["FOODY","BRUNCH","APÉRO"].includes(e.cat);
    case "soiree":     return ["SOIRÉE","DJ SET"].includes(e.cat);
    case "encheres":   return ["ENCHÈRES"].includes(e.cat);
    case "messe":      return e.cat === "CHANTS";
    default: return false;
  }
}

function filterByCats(events, catFilters) {
  if (!catFilters || catFilters.length === 0) return events;
  return events.filter(e => catFilters.some(id => matchesCatFilter(e, id)));
}

function SearchIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={active ? BORDEAU : NUIT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill={NUIT}/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill={NUIT}/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill={NUIT}/>
    </svg>
  );
}

function HeartIcon({ active, hasFavs }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={hasFavs ? BORDEAU : "none"}
      stroke={hasFavs ? BORDEAU : NUIT}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function HomeScreen({ favorites = [], onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilters = [], onCatFilter, onOpenMenu, onNavAgenda, onNavFriends, onCardClick, onAdminOpen, onLangChange, events = ALL_EVENTS, social, onGoingClick, joursParticipation = {}, pendingFriends = 0, userName = "", avatarUrl = "", loggedIn = false, authReady = false, onShowAuth, inviteCode = "" }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? { tagline: "Monaco Together", filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" }, empty: "No events for this period." }
    : { tagline: "Monaco Ensemble", filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" }, empty: "Aucun événement pour cette période." };

  // 🎟️ LA VUE DE RÉSERVATION. Stéphanie, 26 oct 2026 : « en ouvrant une vue
  // dans l'app de leur système ». On garde l'adresse et le nom du lieu ; la vue
  // s'affiche par-dessus le fil et se referme sur la croix. Voir
  // components/VueReservation.jsx et lib/reservation.js.
  const [resaOuverte, setResaOuverte] = useState(null);
  const ouvrirReservation = (url, nom) => setResaOuverte({ url, nom });

  // ✒️ Le dictionnaire des noms propres se construit UNE FOIS, à partir des
  // sous-titres : c'est lui qui empêche « Monaco » de devenir « monaco » quand
  // on remet les titres en casse de phrase. Voir lib/theme.js.
  useEffect(() => { apprendreLesNomsPropres(events); }, [events]);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  // Bandeau « Partage ton lien » : refermé pour la visite en cours seulement.
  const [bandeauAmisFerme, setBandeauAmisFerme] = useState(false);
  // Quelles sections ont déplié leur pile d'expositions. Une par jour, indépendantes.
  const [exposDepliees, setExposDepliees] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const tapTimer = useRef(null);

  function handleLogoTap() {
    const next = logoTaps + 1;
    if (next >= 5) {
      setLogoTaps(0);
      clearTimeout(tapTimer.current);
      onAdminOpen?.();
      return;
    }
    setLogoTaps(next);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
  }

  // Combien de fiches sont affichées à l'instant. Mis à jour à chaque rendu, lu par
  // le capteur de défilement ci-dessous (qui, lui, n'est installé qu'une seule fois).
  const nbAffichees = useRef(0);
  // Nombre de cartes réellement posées dans le DOM (rendu progressif, voir plus bas).
  const [nbRendues, setNbRendues] = useState(40);
  // Jalons de profondeur déjà envoyés pendant cette visite : on ne mesure que la
  // descente la plus profonde, pas chaque va-et-vient. 4 mesures par visite maximum.
  const jalonsEnvoyes = useRef(new Set());

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    let enAttente = false;

    // 🚨 L'EN-TÊTE S'OUVRAIT ET SE REFERMAIT SANS FIN. Stéphanie, 27 oct 2026 :
    // « quand je scrolle et que je laisse, avec Monac'Out en petit, ça bouge
    // non stop ». C'était une boucle, et elle se referme toute seule :
    //   1. on descend → l'en-tête se replie et ~96 px disparaissent
    //      (filtres 52 px + catégories 44 px, plus le logo qui rétrécit) ;
    //   2. le contenu remonte donc TOUT SEUL : scrollTop change sans que
    //      personne n'ait bougé le doigt ;
    //   3. l'app lit ce déplacement comme « elle remonte » et ROUVRE l'en-tête ;
    //   4. ce qui redescend le contenu, et on repart à l'étape 1.
    // Le seuil de 6 px ne pouvait rien contre un saut de 96 px.
    //
    // On verrouille donc le basculement pendant 320 ms après chaque changement —
    // un peu plus que la transition CSS de 0,22 s — et on reprend la mesure à
    // partir de la NOUVELLE position. Un geste volontaire dure bien plus
    // longtemps que ça : rien n'est perdu pour la personne.
    let verrouJusqua = 0;
    const basculer = (ouvert) => {
      verrouJusqua = Date.now() + 320;
      setFiltersVisible(ouvert);
    };

    const handler = () => {
      const y = el.scrollTop;
      // 🚨 LE FIL SAUTAIT À CHAQUE HÉSITATION DU DOIGT.
      // Stéphanie, 31 oct 2026 : « ça saute un peu quand on scrolle ».
      // Mesuré : l'en-tête passe de 83 à 180 px quand les deux rangées de
      // filtres reviennent — le contenu se décale donc de 97 px d'un coup.
      //
      // 🚨 ET C'ÉTAIT UNE BOUCLE, PAS UN SIMPLE SEUIL TROP BAS. Replier
      // l'en-tête remonte le contenu, ce qui produit un NOUVEL événement de
      // défilement, qui déclenche le dépliage, qui redescend le contenu… Mes
      // deux premiers essais (seuil de 6 px, puis ancre relative à 24/56 px)
      // mesuraient tous deux un ÉCART — et l'écart était fabriqué par le saut
      // lui-même. Résultat : 6 bascules sur 12 petits gestes.
      //
      // On ne regarde donc plus l'écart mais la POSITION ABSOLUE, avec une
      // large zone morte entre les deux seuils : entre 60 et 200 px, rien ne
      // bouge, quel que soit le sens. Un aller-retour du pouce ne peut plus
      // traverser les deux bornes.
      const CACHER_AU_DELA = 200;
      const MONTRER_EN_DECA = 60;
      if (Date.now() >= verrouJusqua) {
        if (y <= MONTRER_EN_DECA) basculer(true);
        else if (y >= CACHER_AU_DELA) basculer(false);
        // entre les deux : on ne touche à rien.
      }
      lastY = y;

      // Rendu progressif : on pose 40 cartes de plus dès qu'on arrive à deux écrans
      // du bas, pour que le fil paraisse infini sans jamais tout poser d'un coup.
      if (el.scrollHeight - (y + el.clientHeight) < el.clientHeight * 2) {
        setNbRendues(n => (n >= nbAffichees.current ? n : n + 40));
      }

      // ── Mesure de la profondeur de lecture ──────────────────────────────────
      // Ce qui compte pour Monac'Out, c'est que les gens PARCOURENT le fil : la
      // carte donne déjà le nom, la date et le lieu, ouvrir la fiche n'est utile
      // que pour réserver. On mesure donc jusqu'où ils descendent, en NOMBRE DE
      // FICHES vues (pas en pourcentage : le fil n'a pas la même longueur selon
      // le filtre, et « 50 % » ne veut rien dire quand il ne reste que 6 fiches).
      // Calcul différé d'une frame : le scroll doit rester parfaitement fluide.
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        const total = nbAffichees.current;
        const hauteur = el.scrollHeight;
        if (total < 1 || hauteur <= el.clientHeight) return;   // rien à faire défiler
        const vues = Math.round(total * Math.min(1, (y + el.clientHeight) / hauteur));
        for (const jalon of [5, 10, 20, 40]) {
          if (vues >= jalon && !jalonsEnvoyes.current.has(jalon)) {
            jalonsEnvoyes.current.add(jalon);
            track("scroll_depth", { fiches: jalon, affichees: total });
          }
        }
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Repartir du haut du fil (40 cartes) à chaque changement de vue : sinon on gardait
  // les centaines de cartes déjà posées pour la vue précédente.
  // ⚠️ `catFilters.join()` et non `catFilters` : le parent recrée le tableau à chaque
  // rendu, donc la dépendance changerait sans arrêt et remettrait le fil à 40 cartes
  // en boucle — le défilement infini n'avancerait jamais.
  useEffect(() => { setNbRendues(40); }, [filter, searchQuery, groupFilter, rangeStart, rangeEnd, catFilters.join(",")]);

  // ── MESURER LA RECHERCHE ────────────────────────────────────────────────────
  // Elle ne l'était PAS. Le 10 oct 2026, à la question « les gens utilisent-ils
  // les filtres et la recherche ? », PostHog répondait « 0 personne » pour la
  // recherche — non parce que personne ne cherche, mais parce que rien n'était
  // envoyé. Une absence de mesure se lit comme une absence d'usage : c'est le
  // pire des deux mondes, on en tire une conclusion fausse.
  // On attend 1,2 s après la dernière frappe pour n'envoyer que la requête
  // terminée, et non une mesure par lettre tapée.
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => track("search_used", { longueur: q.length, resultats: filtered.length }), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  function handleFilterChange(newFilter) {
    const el = document.getElementById("main-scroll");
    // Re-cliquer sur le filtre actif le retire — y compris le CALENDRIER, qui en
    // était exclu : le bouton l'ouvrait mais rien ne le refermait. Stéphanie,
    // 3 septembre 2026 : « quand j'appuie sur calendrier 1×, il apparaît, et la
    // 2ᵉ fois il ne s'en va pas ». Un bouton qui ouvre doit refermer.
    if (filter === newFilter) {
      setFilter("all");
      if (newFilter === "calendar") { setRangeStart(null); setRangeEnd(null); }
      if (el) el.scrollTop = 0;
      return;
    }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter); setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  // Fil continu : les fiches « en cours » y sont répétées sur chacun de leurs jours
  // d'ouverture. La RECHERCHE et le CALENDRIER travaillent sur la liste d'origine :
  // la recherche ne doit pas renvoyer 120 fois la même exposition, et le calendrier
  // gère lui-même les dates lointaines (au-delà de l'horizon) via `couvreLaPeriode`.
  const evenementsEtales = useMemo(() => etaleLesEnCours(events), [events]);

  let filtered;
  if (searchQuery.trim()) {
    // Recherche tolérante : on ignore accents, tirets et ponctuation, et on
    // cherche TOUS les mots (dans n'importe quel ordre) plutôt que la suite
    // exacte de caractères. Sans ça « monte carlo summer festival » ne trouvait
    // rien, parce que les fiches écrivent « Monte-Carlo Summer Festival ».
    const words = normalizeForSearch(searchQuery).split(" ").filter(Boolean);
    filtered = filterByCats(events, catFilters).filter(e => {
      // Recherche dans TOUS les champs, en français ET en anglais
      const hay = normalizeForSearch([
        e.title, localizeTitle((e.title || "").replace(/\n/g, " "), "en"),
        e.subtitle, e.quarter,
        e.cat, localizeCat(e.cat, "en"),
        e.desc, e.descEn, e.source, e.time,
      ].join(" "));
      return words.every(w => hay.includes(w));
    });
  } else if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    // Le tri est indispensable : sans lui les fiches arrivent dans l'ordre du
    // fichier, les clés de section alternent, et « Maintenant » réapparaissait
    // plus bas sur d'autres cartes.
    filtered = filterByCats(events.filter(e => {
      const d = parseEventDate(e);
      return (d && d >= rangeStart && d <= endBound) || couvreLaPeriode(e, rangeStart, endBound);
    }), catFilters).slice().sort((a, b) => {
      const da = parseEventDate(a), db = parseEventDate(b);
      if (!da || !db) return 0;
      return (da - db) || (heureDeTri(a) - heureDeTri(b));
    });
  } else if (filter === "calendar") {
    filtered = filterByCats(events, catFilters);
  } else {
    filtered = filterByCats(filterByTime(evenementsEtales, filter), catFilters);
  }
  if (groupFilter) { const g = EVENT_GROUPS.find(x => x.id === groupFilter); if (g) filtered = filtered.filter(e => g.cats.includes(e.cat)); }

  // Le fil ne montre que de VRAIS événements. Les deux fiches d'annuaire permanentes
  // — « Musées de Monaco ouverts » et « Bien-être : spas & studios » — sont là tous
  // les jours et encombraient la liste : on ne les affiche plus que lorsqu'on
  // demande explicitement leur catégorie (Musée / Bien-être), ou en recherche.
  // La carte cinéma, elle, reste dans le fil : c'est un programme qui change.
  const estAnnuairePermanent = e => e.pinLast === true && e.cat !== "CINÉMA";
  const filtreCatActif = (catFilters && catFilters.length > 0) || !!groupFilter;
  if (!filtreCatActif && !searchQuery.trim()) filtered = filtered.filter(e => !estAnnuairePermanent(e));

  // On tient la longueur du fil à jour pour le capteur de profondeur : celui-ci est
  // installé une fois pour toutes et ne verrait pas la variable `filtered` changer.
  nbAffichees.current = filtered.length;

  // Rendu progressif. Le fil posait déjà toutes ses cartes d'un coup ; en répétant
  // les expositions jour par jour il en compte ~900 de plus, ce qui se sentirait au
  // démarrage sur iPhone. On en pose 40, puis 40 de plus dès qu'on approche du bas.
  // Purement visuel : `filtered.length` reste la vraie longueur pour la mesure.
  // 🌟 LA VITRINE — les premières sorties, en DEUX COLONNES, juste sous la photo
  // de Monaco. Stéphanie, 28 oct 2026 : « sur un même écran iPhone, on puisse
  // déjà voir une belle photo de Monaco et deux ou trois propositions de
  // sorties, au lieu d'un seul grand bloc d'expositions ».
  //
  // ⚠️ Les fiches de la vitrine RESTENT dans le fil en dessous (31 oct 2026) :
  //    le haut de l'écran met en avant, il ne retire pas de la journée.
  // ⚠️ La vitrine ne s'affiche QUE dans le fil ordinaire. Dès qu'une catégorie,
  //    une recherche ou le calendrier est demandé, on rend la liste telle quelle :
  //    le brief interdit de toucher au comportement des filtres.
  // ⚠️ Les fiches à annuaire en sont exclues : un regroupement se déplie, il n'a
  //    rien à faire dans une case de 173 pt.
  const vitrineActive = !searchQuery.trim() && !filtreCatActif && filter !== "calendar";
  // Les fiches à annuaire sont écartées de la vitrine : un regroupement se
  // déplie, il n'a rien à faire dans un hero ni dans une case de 173 pt.
  const candidats = vitrineActive
    ? filtered.filter(e => !(Array.isArray(e.directory) && e.directory.length > 0))
    : [];
  // 🚨 DÉDOUBLONNER PAR `id`, PAS PAR `cleFil`. Une fiche `ongoing` — la Foire,
  // une exposition — est répétée JOUR PAR JOUR : même `id`, `cleFil` différent.
  // En dédoublonnant par `cleFil`, la Foire s'affichait en hero ET dans la
  // grille juste en dessous, avec un jour d'écart invisible à l'œil. Même
  // famille que les doublons d'annuaire du 11 oct.
  const vus = new Set();
  const uniques = candidats.filter(e => (vus.has(e.id) ? false : (vus.add(e.id), true)));

  // 📷 LE HERO CHANGE TOUS LES JOURS.
  //
  // Stéphanie, 31 oct 2026 : « change régulièrement les photos du haut, qu'on
  // ne tombe pas tous les jours sur le musée d'Anthropologie — aujourd'hui on
  // pourrait tomber sur un event Halloween par exemple ».
  //
  // 🚨 POURQUOI C'ÉTAIT TOUJOURS LA MÊME. Le classement était « celles qui ont
  // une photo d'abord, puis l'ordre chronologique » — strictement déterministe.
  // Tant que les données ne bougeaient pas, le même hero revenait matin et
  // soir, jour après jour.
  //
  // Trois critères maintenant, dans cet ordre :
  //   1. **un événement phare** (`hot`) passe devant — c'est ce qui fait
  //      remonter Halloween aujourd'hui, les Ballets demain ;
  //   2. une fiche qui a une VRAIE photo passe devant un habillage graphique ;
  //   3. à égalité, un tirage STABLE DANS LA JOURNÉE mais différent chaque jour.
  //
  // ⚠️ « Stable dans la journée » n'est pas un détail : la graine est le NUMÉRO
  // DU JOUR, pas l'horloge. Sans ça le hero changerait à chaque rendu, et la
  // carte qu'on s'apprêtait à toucher se déroberait sous le doigt.
  const tirage = rangDeVisite;
  // 🚨 ET LE HERO RESTE PROCHE. Premier essai : « les phares d'abord », tous
  // jours confondus — l'accueil du 31 octobre montrait la Ligue 1 d'avril, Star
  // Wars et le feu d'artifice de la Fête Nationale, et pas un seul Halloween.
  // Un hero sert à faire sortir CE SOIR, pas dans six mois. La proximité passe
  // donc en premier, et le reste départage à l'intérieur de la journée.
  const aujourd8 = (() => { const n = new Date(); n.setHours(0,0,0,0); return n; })();
  const joursAvant = (e) => {
    const d = parseEventDate(e);
    if (!d) return 9;
    return Math.min(9, Math.max(0, Math.round((d - aujourd8) / 86400000)));
  };
  const heros = vitrineActive
    ? uniques
        .map(e => ({
          e,
          // 📌 ÉPINGLÉ : passe devant tout le reste. Stéphanie, 31 oct 2026 :
          // « mets l'event du Castel Roc en 1er ». Plutôt que de coder un
          // identifiant en dur, la fiche porte `epingle: true` dans les
          // données — n'importe quelle sortie peut être mise en avant, et
          // l'épingle disparaît avec la fiche quand sa date est passée.
          // ⚠️ Toujours soumis à la proximité : on n'épingle pas en haut de
          //    l'accueil un événement du mois prochain.
          epingle: e.epingle ? 0 : 1,
          jours: joursAvant(e),
          phare: e.hot ? 0 : 1,
          photo: mediaDeLaFiche(e) ? 0 : 1,
          melange: tirage(e.id),
        }))
        .sort((a, b) => (a.jours - b.jours) || (a.epingle - b.epingle)
                     || (a.phare - b.phare)
                     || (a.photo - b.photo) || (a.melange - b.melange))
        .slice(0, 4).map(x => x.e)
    : [];
  const idsHero = new Set(heros.map(e => e.id));

  // 🕐 LA GRILLE RESTE CHRONOLOGIQUE ET NE MÉLANGE PAS DEUX MOMENTS.
  // C'est ce qui garantit que son titre dit vrai : « Ce soir » ne chapeaute que
  // des fiches du soir. Sans cette règle, une fiche de 9 h et un concert de
  // 19 h 30 se retrouvaient sous le même intertitre.
  const maintenantDate = new Date();
  const minMaintenant = maintenantDate.getHours() * 60 + maintenantDate.getMinutes();
  const jourAujourdhui = toFrDate(maintenantDate);
  const jourDemain = (() => { const d = new Date(maintenantDate); d.setDate(d.getDate() + 1); return toFrDate(d); })();
  const restants = uniques.filter(e => !idsHero.has(e.id));

  // 🚨 LA VITRINE NE MÉLANGE NI DEUX MOMENTS NI DEUX JOURS.
  // Stéphanie, 28 oct 2026 : « la section "Ce matin" contient actuellement des
  // événements à 19h et 19h30 ». Deux fautes se cumulaient :
  //   1. le titre lisait l'heure d'une fiche choisie pour sa PHOTO, pas pour son
  //      heure (corrigé plus haut, la grille reste chronologique) ;
  //   2. la grille piochait dans TOUTE la liste, jours suivants compris — à
  //      18h18, l'exposition de 9h-18h du LENDEMAIN remontait sous « Ce matin ».
  //      Une fiche `ongoing` existe en une copie par jour, le piège était donc
  //      permanent.
  // On fixe donc d'abord le JOUR (celui de la première fiche restante), puis le
  // moment à l'intérieur de ce jour. Les données ne sont pas touchées.
  const jourVitrine = restants.length ? restants[0].date : null;
  const duJour = jourVitrine ? restants.filter(e => e.date === jourVitrine) : [];
  const momentVitrine = vitrineActive && duJour.length
    ? momentDeLaFiche(duJour[0], lang, jourVitrine === jourAujourdhui ? minMaintenant : null)
    : null;
  // 🔄 LA VITRINE TOURNE ELLE AUSSI, pas seulement le hero.
  // Stéphanie, 31 oct : « pas que la 1ère, sinon c'est ennuyant ». Quand le
  // moment compte plus de quatre sorties, on en montre quatre AUTRES à la
  // visite suivante — tirées avec la même graine que le hero, donc stables
  // pendant toute la visite.
  // ⚠️ MAIS L'AFFICHAGE RESTE CHRONOLOGIQUE : on tire QUI apparaît, jamais
  //    dans quel ordre. Une grille de sorties qui désordonne les heures ne
  //    sert plus à rien — c'est la règle depuis le tri du 3 août.
  const duMoment = momentVitrine
    ? duJour.filter(e => momentDeLaFiche(e, lang, jourVitrine === jourAujourdhui ? minMaintenant : null).cle === momentVitrine.cle)
    : [];
  const misEnAvant = duMoment.length <= 4
    ? duMoment
    : duMoment
        .map((e, index) => ({ e, index, rang: rangDeVisite(e.id) }))
        .sort((a, b) => a.rang - b.rang)          // on tire les quatre…
        .slice(0, 4)
        .sort((a, b) => a.index - b.index)        // …puis on rétablit l'heure
        .map(x => x.e);

  // 🚨 RIEN DE CE QUI EST EN HAUT N'EST RETIRÉ DU FIL — ni le hero, ni la grille.
  // Stéphanie, 31 oct 2026 : « le Castel Roc tu le laisses en haut, mais tout ce
  // qui est en haut doit réapparaître dans le fil ».
  // C'était un défaut que j'avais introduit : je retirais du fil tout ce que la
  // vitrine montrait, pour éviter les doublons. Mais le haut de l'écran est une
  // BANNIÈRE DE MISE EN AVANT, pas une place dans la journée — quelqu'un qui
  // déroule « ce soir » doit retrouver la sortie à son heure, même s'il vient de
  // la voir en grand. Un même événement peut donc apparaître deux fois, et c'est
  // voulu : la mise en avant ne vole pas sa place au programme.

  // 🏷️ LE TITRE DIT CE QUE LA GRILLE CONTIENT, puisqu'elle ne contient qu'un
  // seul moment. Sur « Semaine » ou « Week-end », parler de « ce soir » n'aurait
  // aucun sens : on annonce simplement ce qui est à l'affiche.
  // Le moment (« Ce soir ») ne vaut que pour AUJOURD'HUI. Demain, on dit
  // « Demain soir » ; au-delà, on nomme le jour — « Ce matin » au-dessus d'une
  // fiche de jeudi n'aurait aucun sens.
  const titreVitrine = (() => {
    const repli = lang === "en" ? "Coming up" : "À l'affiche";
    if (filter === "week" || filter === "weekend") return repli;
    if (!momentVitrine) return repli;
    if (jourVitrine === jourAujourdhui) return momentVitrine.titre;
    if (jourVitrine === jourDemain) {
      return momentVitrine.cle === "soir"
        ? (lang === "en" ? "Tomorrow evening" : "Demain soir")
        : (lang === "en" ? "Tomorrow" : "Demain");
    }
    return jourVitrine || repli;
  })();

  const aAfficher = filtered.slice(0, nbRendues);

  // Le fil se range sous des intertitres de jour (et de moment, pour aujourd'hui).
  // En recherche on garde la liste à plat : les résultats sautent d'un mois à
  // l'autre, un intertitre par carte n'aiderait personne.
  const enSections = !searchQuery.trim();

  // Le jour réellement consulté, quand le calendrier ne porte QU'UNE date.
  // Sert à corriger l'étiquette des fiches `ongoing`, qui portent toujours la date
  // du jour et affichaient « AUJOURD'HUI » même en consultant le 11 septembre.
  const jourConsulte =
    filter === "calendar" && rangeStart && (!rangeEnd || rangeEnd.toDateString() === rangeStart.toDateString())
      ? `${JOURS[rangeStart.getDay()]} ${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
      : null;

  // Pour les SECTIONS, une plage de dates compte autant qu'une date seule : dès
  // qu'on consulte le calendrier, « Maintenant » et « Ce soir » n'ont plus de sens.
  // Les fiches « en cours » ne portent que la date du jour ; on les rattache au
  // premier jour de la période consultée.
  const jourCalendrier =
    filter === "calendar" && rangeStart
      ? `${JOURS[rangeStart.getDay()]} ${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
      : null;

  // On ne réunit les expositions que dans le fil ordinaire : dès qu'on demande
  // explicitement la catégorie, on veut les voir une par une.
  const sections = enSections
    ? (filtreCatActif
        ? decouperEnSections(aAfficher, lang, jourCalendrier)
        : reunirLesFamillesParJour(decouperEnSections(aAfficher, lang, jourCalendrier), cle => !!exposDepliees[cle]))
    : null;

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  const hasFavs = favorites.length > 0;

  // ── BANDEAU « PARTAGE TON LIEN » ─────────────────────────────────────────────
  // Uniquement pour quelqu'un de CONNECTÉ dont le cercle est VIDE. Il s'éteint
  // tout seul à la première amie : pas de compteur, pas de délai, pas de « 3 fois
  // espacées de 7 jours ». Il s'arrête en réussissant, pas en lassant.
  //
  // Pourquoi il fallait le faire (PostHog, 17→22 août 2026) : la carte de partage
  // a été montrée 38 fois, dont 32 à des gens SANS COMPTE — elle demandait de
  // partager un lien à des gens qui n'en avaient pas encore. Zéro partage lancé.
  // ⚠️ `social.charge` est indispensable : sans lui, « aucune amie » est vrai pendant
  // le chargement et le bandeau clignote chez tout le monde (corrigé le 3 sept 2026).
  const cercleVide = loggedIn && social?.charge === true && Array.isArray(social.friends) && social.friends.length === 0;
  const conditionsReunies = authReady && cercleVide && !!inviteCode;

  // 🔒 UNE FOIS AFFICHÉ, IL RESTE. Stéphanie, 4 septembre 2026, après deux tentatives
  // de correction : « laisse-le, et les personnes le ferment en appuyant sur une croix
  // évidente ». Elle a raison : tant que l'affichage dépend d'un état qui peut changer
  // sous nos pieds (chargement de la base, rafraîchissement de session), il y aura
  // toujours une course pour le faire disparaître. On verrouille donc : dès que les
  // conditions sont réunies UNE fois, le bandeau reste jusqu'à la croix.
  const [bandeauAmisVerrouille, setBandeauAmisVerrouille] = useState(false);
  useEffect(() => {
    if (conditionsReunies) setBandeauAmisVerrouille(true);
  }, [conditionsReunies]);

  const montreBandeauAmis = (bandeauAmisVerrouille || conditionsReunies) && !bandeauAmisFerme;

  useEffect(() => {
    if (montreBandeauAmis) track("bandeau_amis_vu");
  }, [montreBandeauAmis]);

  return (
    // 🎨 Fond crème de la refonte : les cartes blanches s'y détachent.
    <div style={{ background: FOND_PAGE, minHeight: "100%" }}>
      {/* Sticky header — z-index très élevé, toujours au-dessus des cartes */}
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: WHITE, borderBottom: `1px solid ${BORDER}` }}>

        {/* Header — le logo rétrécit au scroll vers le bas, s'agrandit au scroll vers le haut.
            Les boutons (menu, loupe, fr/en, cœur) restent toujours visibles. */}
        <div style={{
          background: STRIPE_BG,
          padding: (filtersVisible || showSearch) ? "8px 12px" : "3px 12px",
          display: "flex", alignItems: "center", gap: 8,
          transition: "padding 0.22s ease",
        }}>
          {/* Gauche : menu + loupe + amis */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HamburgerIcon />
            </button>
            <button onClick={() => {
              setShowSearch(v => {
                if (v) setSearchQuery("");
                else setTimeout(() => searchInputRef.current?.focus(), 50);
                return !v;
              });
            }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <SearchIcon active={showSearch} />
            </button>
            <button onClick={onNavFriends} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NUIT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {pendingFriends > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: BORDEAU, border: "1.5px solid #fff",
                }} />
              )}
            </button>
          </div>

          {/* Centre : logo — grand en haut, petit au scroll vers le bas */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            maxHeight: (filtersVisible || showSearch) ? "46px" : "24px",
            overflow: "hidden", transition: "max-height 0.22s ease",
          }} onClick={handleLogoTap}>
            <div style={{
              transform: (filtersVisible || showSearch) ? "scale(1)" : "scale(0.6)",
              transformOrigin: "center", transition: "transform 0.22s ease",
            }}>
              <MonacOutLogo compact lang={lang} />
            </div>
          </div>

          {/* Droite : fr/en + cœur */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["fr","en"].map(l => (
                <button key={l} onClick={() => onLangChange?.(l)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 10, fontWeight: lang === l ? 700 : 400,
                  letterSpacing: 1, textTransform: "uppercase",
                  color: lang === l ? NUIT : GRIS_LISIBLE,
                  padding: "1px 3px",
                  borderBottom: lang === l ? "1.5px solid #7B2D26" : "1.5px solid transparent",
                }}>{l}</button>
              ))}
            </div>
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
          </div>
        </div>

        {/* Pendant le chargement de l'auth : on réserve la place du bandeau (invisible) → « Bonjour » apparaît sans faire sauter la mise en page */}
        {!authReady && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`, textAlign: "center",
            padding: "5px 12px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, visibility: "hidden",
          }}>&nbsp;</div>
        )}

        {/* Salutation — « Bonjour, <prénom> » sous le logo quand connectée */}
        {userName && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`,
            padding: "7px 12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: 0.5, color: NAVY,
          }}>
            {/* Photo de profil sur l'accueil, à gauche du bonjour. Carré 20 px pour ne
                pas alourdir l'en-tête. Se change depuis le menu. */}
            {avatarUrl && (
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: `center/cover no-repeat url("${avatarUrl}")`,
                border: "1px solid rgba(196,162,65,0.6)",
              }} />
            )}
            <span>
              {lang === "en" ? "Hi, " : "Bonjour, "}
              <span style={{ color: BORDEAU, fontWeight: 600 }}>{userName}</span>
            </span>
          </div>
        )}

        {/* Barre « Inscris-toi » pleine largeur, bien en haut (en-tête fixe) — UNIQUEMENT si pas connectée (additif) */}
        {authReady && !loggedIn && onShowAuth && (
          /* 🎨 PLUS DE BLEU NUIT ICI. Stéphanie, 28 oct 2026 : « mets le
             "inscris-toi" dans les mêmes tons, enlève le bleu ». La bande
             reprend donc le bordeaux de la refonte — celui du bouton « Voir
             l'événement » — au lieu du navy, qui était le seul aplat froid de
             l'écran et cassait l'accord crème/bordeaux/or. */
          <button onClick={onShowAuth} style={{
            display: "block", width: "100%", border: "none", cursor: "pointer",
            background: BORDEAU, color: "#FFFFFF",
            padding: "11px 16px", textAlign: "center",
            fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.4,
            borderTop: `1px solid ${BORDER}`,
          }}>
            {lang === "en"
              ? "✨ Sign up — find your friends & favourites ›"
              : "✨ Inscris-toi — retrouve tes amis & tes favoris ›"}
          </button>
        )}

        {/* Bandeau « Partage ton lien » — connectée, aucune amie. Le bouton ouvre la
            feuille de partage du téléphone : JAMAIS une page web (cf. écran noir du
            7 août). Une croix discrète le referme pour la visite en cours. */}
        {montreBandeauAmis && (
          <div style={{
            background: "#FFFDF7", borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`,
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700,
                fontSize: 14, color: NAVY, lineHeight: 1.25,
              }}>
                {lang === "en"
                  ? "Monaco Together — share your link"
                  : "Monaco Ensemble — partage ton lien"}
              </div>
              <div style={{
                fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY,
                lineHeight: 1.35, marginTop: 2,
              }}>
                {lang === "en"
                  ? "You'll see where your friends go, and they'll see where you go."
                  : "Tu verras où sortent tes amis, eux où tu vas."}
              </div>
            </div>
            <button
              onClick={async () => {
                const r = await partagerInvitation(inviteCode, lang);
                track("bandeau_amis_partage", { resultat: r });
              }}
              style={{
                flexShrink: 0, background: NAVY, color: "#fff", border: "none", cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1.4, textTransform: "uppercase",
                padding: "9px 13px", borderRadius: 3, whiteSpace: "nowrap",
              }}>
              {lang === "en" ? "Share" : "Partager"}
            </button>
            {/* Croix bien visible : c'est le SEUL moyen de faire partir le bandeau. */}
            <button onClick={() => { setBandeauAmisFerme(true); track("bandeau_amis_ferme"); }}
                    aria-label={lang === "en" ? "Close" : "Fermer"}
                    style={{
                      flexShrink: 0, cursor: "pointer",
                      width: 30, height: 30, borderRadius: "50%",
                      background: "#FFFFFF", border: `1px solid ${GOLD}`,
                      color: NAVY, fontSize: 16, lineHeight: 1, padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
          </div>
        )}

        {/* Barre de recherche */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: showSearch ? "52px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <SearchIcon active />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search events…" : "Rechercher…"}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: "'Jost', sans-serif", fontSize: 16, color: NAVY,
                letterSpacing: 0.2,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: GREY, padding: 0, lineHeight: 1,
              }}>✕</button>
            )}
          </div>
        </div>

        {/* Filtres temps — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "44px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          {/* 🫧 LES BULLES TIENNENT DANS L'ÉCRAN. Stéphanie, 28 oct 2026 :
              « mets bien les bulles du menu en haut dans l'écran, il faut
              peut-être les diminuer de taille ». Elles débordaient des deux
              côtés et la première était coupée.
              ⚠️ `justifyContent: center` était le piège : sur une rangée qui
              défile, centrer un contenu plus large que l'écran le fait démarrer
              AU MILIEU — « Aujourd'hui » n'était donc plus visible à l'ouverture.
              On part désormais du bord, et la rangée reste balayable. */}
          <div style={{ display: "flex", gap: 7, padding: "8px 12px", justifyContent: "flex-start", overflowX: "auto", overscrollBehaviorX: "contain", touchAction: "pan-x", scrollbarWidth: "none" }}>
            {TIME_FILTERS.map(f => {
              const active = filter === f.id;
              const label = f.id === "calendar" && rangeStart ? rangeLabel : (t.filters[f.id] || f.label);
              return (
                /* 🔘 CHIPS DE LA REFONTE — 28 oct 2026. Le brief : « filtres
                   temporels en chips avec sélection clairement visible ». Le
                   choisi passe en bordeaux plein, les autres sur un gris très
                   pâle sans contour dur. La hauteur monte à 36 px pour tenir la
                   cible tactile de 44 px avec le pas vertical. */
                <button key={f.id} onClick={() => handleFilterChange(f.id)} style={{
                  flexShrink: 0, padding: "7px 14px", minHeight: 34,
                  borderRadius: RAYON.pastille, border: "none",
                  background: active ? BORDEAU : "rgba(23,36,60,0.05)",
                  color: active ? "#FFFFFF" : GRIS,
                  fontFamily: SANS, fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.1,
                }}>{f.id === "calendar" ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : GRIS} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {rangeStart && rangeLabel}
                  </span>
                ) : label}</button>
              );
            })}
          </div>
        </div>

        {/* Catégories groupées — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "50px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          {/* `touchAction: pan-x` : le conteneur parent verrouille le geste horizontal
              (l'app glissait de côté). Cette rangée-ci, elle, doit rester balayable
              latéralement — on lui rend explicitement le droit. */}
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-start", padding: "5px 12px 9px", overflowX: "auto", overscrollBehaviorX: "contain", touchAction: "pan-x", scrollbarWidth: "none" }}>
            {EVENT_GROUPS.map(g => {
              const active = groupFilter === g.id;
              return (
                <button key={g.id} onClick={() => { setGroupFilter(active ? null : g.id); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                  flexShrink: 0, padding: "6px 11px", minHeight: 30,
                  borderRadius: RAYON.pastille, border: "none",
                  background: active ? BORDEAU : "rgba(23,36,60,0.05)",
                  color: active ? "#FFFFFF" : GRIS,
                  fontFamily: SANS, fontSize: 11.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.1,
                }}>{lang === "en" ? g.labelEn : g.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🎯 LE HERO + « CE SOIR » — la composition exacte de la maquette.
          Stéphanie, 28 oct 2026 : « tu peux faire exactement comme ça, à 100 %
          pareil ». Ordre du téléphone de gauche : grande carte photo avec le
          titre et le bouton POSÉS DESSUS, les points du carrousel, le titre
          « Ce soir » avec son filet et « Tout voir », puis DEUX COLONNES.

          ⚠️ L'ancien bandeau d'ambiance est retiré d'ici : ses quatre images
          étaient GÉNÉRÉES, et la maquette demande une vraie photo. Le hero
          montre une photo du LIEU (étiquetée comme telle) quand la médiathèque
          en a une, et un habillage graphique sinon — jamais une image inventée.

          ⚠️ Ce bloc ne s'affiche que dans le fil ordinaire : avec une catégorie,
          une recherche ou le calendrier, la liste reste telle qu'elle est. */}
      {vitrineActive && heros.length > 0 && (
        <>
          <CarrouselHero
            fiches={heros}
            lang={lang}
            favorites={favorites}
            onToggleFav={onToggleFav}
            onCardClick={onCardClick}
            onReserver={ouvrirReservation}
            social={social}
            inviteCode={inviteCode}
            onShowAuth={onShowAuth}
          />

          {misEnAvant.length > 0 && (
            <>
              {/* Le titre reprend le MOMENT réellement affiché (« Ce soir »,
                  « Maintenant »…), il n'est pas écrit en dur : à 10 h du matin,
                  « Ce soir » au-dessus d'une expo ouverte serait un mensonge. */}
              <TitreSection
                titre={titreVitrine}
                lang={lang}
                onToutVoir={() => {
                  const el = document.getElementById("main-scroll");
                  if (el) el.scrollTo({ top: el.scrollTop + 320, behavior: "smooth" });
                }}
              />
              <GrilleDeuxColonnes
                fiches={misEnAvant}
                lang={lang}
                favorites={favorites}
                onToggleFav={onToggleFav}
                onCardClick={onCardClick}
                onReserver={ouvrirReservation}
                social={social}
                inviteCode={inviteCode}
                onShowAuth={onShowAuth}
              />
            </>
          )}
        </>
      )}

      {/* Calendrier inline */}
      {filter === "calendar" && (
        <CalendarPicker inline lang={lang} initialStart={rangeStart} initialEnd={rangeEnd}
          onChange={(s, e) => { setRangeStart(s || null); setRangeEnd(e || null); }} />
      )}

      {/* Liste — cartes qui s'empilent */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 15 }}>
            {t.empty}
          </div>
        ) : (
          enSections ? sections.map((sec, i) => (
            <div key={sec.cle}>
              {/* Le jour une seule fois, puis les moments qui le découpent. */}
              {sec.jour && sec.jour !== sections[i - 1]?.jour && <IntertitreSection titre={sec.jour} />}
              {sec.jour
                ? <IntertitreMoment titre={sec.moment} />
                : <IntertitreSection titre={sec.moment} />}
              {rendreItems(sec.items, true)}
            </div>
          )) : rendreItems(aAfficher, false)
        )}
      </div>

      {/* 🎟️ La vue de réservation, par-dessus le fil. Posée ICI, dans le div
          racine de HomeScreen — une première tentative l'avait mise dans une
          fonction auxiliaire, à côté d'un </div> déjà fermé : deux frères JSX
          sans fragment, et le build refuse sans dire où. */}
      {resaOuverte && (
        <VueReservation
          url={resaOuverte.url}
          titre={resaOuverte.nom}
          lang={lang}
          onFermer={() => setResaOuverte(null)}
        />
      )}
    </div>
  );

  /**
   * 🧱 LE FIL EN DEUX COLONNES — Stéphanie, 28 oct 2026 : « quand je scrolle
   * ça repart sur une colonne, mais 2 colonnes c'est mieux ».
   *
   * Les fiches ordinaires s'empilent donc par deux, exactement comme la grille
   * sous le hero. Ce qui NE PEUT PAS tenir dans une case de 173 pt garde la
   * pleine largeur :
   *   · une sous-fiche de lieu (`_lieu`), qui porte ses propres actions ;
   *   · un regroupement (« 7 expositions »), qui se déplie ;
   *   · une fiche à annuaire, qui se déplie elle aussi.
   *
   * ⚠️ L'ORDRE EST PRÉSERVÉ. On accumule les fiches ordinaires qui se SUIVENT
   * et on les pose en grille ; dès qu'une pleine largeur arrive, on vide le
   * paquet avant. Sans ça, regrouper toutes les grilles d'abord mélangerait la
   * chronologie — et une app de sorties qui désordonne les heures ne sert plus
   * à rien.
   */
  /**
   * 🧱 LE FIL EN DEUX COLONNES — Stéphanie, 28 oct 2026 : « quand je scrolle
   * ça repart sur une colonne, mais 2 colonnes c'est mieux », puis le soir :
   * « les fiches générales, laisse-les tout de même en 2 colonnes et pas en
   * longs rectangles ».
   *
   * TOUT passe donc en grille : les sorties ordinaires, les regroupements
   * (« 7 expositions ») et les fiches à annuaire (« Musées · 6 ouverts »).
   * Seules les SOUS-fiches d'un annuaire déplié gardent la pleine largeur —
   * elles portent leurs propres actions et ne tiendraient pas dans 173 pt.
   *
   * ⚠️ L'ORDRE EST PRÉSERVÉ : on accumule les fiches qui se SUIVENT et on les
   * pose en grille ; dès qu'un dépliage arrive, on vide le paquet avant de
   * poser ses lieux. Sans ça, la chronologie partirait en morceaux — et une app
   * de sorties qui désordonne les heures ne sert plus à rien.
   */
  function rendreItems(items, sansDate) {
    const sortie = [];
    let paquet = [];
    // 🔁 UN SEUL registre de photos récentes pour TOUTES les grilles de ce
    // passage, sinon deux vues identiques se retrouvent de part et d'autre
    // d'un dépliage.
    const recents = [];
    const viderLePaquet = () => {
      if (!paquet.length) return;
      sortie.push(
        <div key={`grille-${sortie.length}`} style={{ marginBottom: 12 }}>
          <GrilleDeuxColonnes
            fiches={paquet}
            recents={recents}
            lang={lang}
            favorites={favorites}
            onToggleFav={onToggleFav}
            onCardClick={onCardClick}
            onReserver={ouvrirReservation}
            social={social}
            inviteCode={inviteCode}
            onShowAuth={onShowAuth}
          />
        </div>
      );
      paquet = [];
    };

    for (const e of items) {
      // Une SOUS-fiche de lieu : pleine largeur, elle porte ses propres actions.
      if (e._lieu) {
        viderLePaquet();
        sortie.push(
          <CarteLieu
            key={`lieu-${e._fiche.id}-${e._rang}`}
            lieu={e._lieu} fiche={e._fiche} lang={lang} social={social}
            loggedIn={loggedIn} onGoingClick={onGoingClick}
            onOuvrir={() => onCardClick?.(e._fiche)} onReserver={ouvrirReservation}
            evenement={!!e._evenement} favorites={favorites} onToggleFav={onToggleFav}
            inviteCode={inviteCode} onShowAuth={onShowAuth}
          />
        );
        continue;
      }

      // Un REGROUPEMENT (« 7 expositions ») : une carte de grille qui se déplie.
      if (e.groupeFamille) {
        const cle = e.cleGroupe;
        const deplie = !!exposDepliees[cle];
        const tete = e.groupeFamille.find(f => f) || e;
        // 🚨 ON COMPTE LES SORTIES, PAS LES CARTES. Stéphanie, 31 oct 2026,
        // devant le dimanche : « et là je vois 2 brunch » — il y en avait HUIT.
        // Le groupe comptait ses MEMBRES : le brunch du Petit Café Robuchon et
        // la fiche « BRUNCHS · 7 ADRESSES », donc 2. Mais la seconde n'est pas
        // une sortie, c'est un annuaire de sept adresses, et le dépliage en
        // montre bien huit. L'étiquette mentait sur ce qu'elle cachait, et
        // « Voir les 2 » invitait à ouvrir ce qu'on croyait déjà connaître.
        // Une fiche à annuaire vaut donc le nombre de ses adresses.
        const nbSorties = e.groupeFamille.reduce(
          (n, f) => n + (Array.isArray(f.directory) && f.directory.length ? f.directory.length : 1), 0);
        // 🖼️ UNE CARTE DE GROUPE N'EST PAS SA PREMIÈRE FICHE. Stéphanie, 31 oct :
        // « je veux la photo brunch pour la fiche qui annonce les brunchs ».
        // En reprenant `...tete`, la carte héritait du SOUS-TITRE et donc de la
        // PHOTO du premier membre : « Le Petit Café Robuchon » s'affichait en
        // tête de huit brunchs, et la photo montrait sa terrasse. Elle annonce
        // une famille, pas une adresse : on efface le lieu, ce qui lui fait
        // prendre l'image de sa catégorie, et on écrit ce qu'elle contient.
        const famille = FAMILLE_DE[e.catGroupe];
        const sousTitre = famille
          ? (lang === "en" ? famille.nomEn(nbSorties) : famille.nomFr(nbSorties))
          : "";
        paquet.push({
          ...tete,
          subtitle: sousTitre,
          cleFil: `groupe-${cle}`,
          title: `${e.catGroupe}\n${nbSorties} ${lang === "en" ? "to see" : "à voir"}`,
          _onInfos: () => setExposDepliees(d => ({ ...d, [cle]: !d[cle] })),
          _deplie: deplie,
          _nbLieux: nbSorties,
        });
        // 🚨 ON NE DÉPLIE RIEN ICI, ET C'EST TOUT L'INVERSE DE CE QUE J'AI
        // LIVRÉ EN v0.0.173. Stéphanie, 31 oct : « corrige le bug des apéros
        // qui n'apparaissent pas correctement » — le défaut était ma propre
        // correction de la veille.
        //
        // `reunirLesFamillesParJour` a DÉJÀ posé les membres du groupe dans
        // `sec.items`, juste derrière cette carte, et il les a posés selon la
        // règle du 11 octobre : une fiche récapitulative se déplie en SES
        // LIEUX, jamais en elle-même. En redéroulant `groupeFamille` ici,
        // j'ajoutais une SECONDE expansion par-dessus la première : tout
        // apparaissait deux fois, et « CE SOIR · 19 TERRASSES » revenait en
        // carte au milieu de ses propres terrasses — très exactement ce dont
        // Stéphanie se plaignait le 11 octobre.
        //
        // La carte de groupe ne fait donc qu'une chose : basculer l'état. Le
        // dépliage appartient à celui qui construit les sections, et à lui seul.
        continue;
      }

      // Une FICHE À ANNUAIRE : carte de grille elle aussi, qui pose ses lieux
      // SOUS elle une fois dépliée — jamais dans une fenêtre (règle du 11 oct).
      if (Array.isArray(e.directory) && e.directory.length > 0) {
        const cleInfos = `infos-${e.cleFil || `${e.id}-${e.date}`}`;
        const ouvert = !!exposDepliees[cleInfos];
        paquet.push({
          ...e,
          _onInfos: () => setExposDepliees(d => ({ ...d, [cleInfos]: !d[cleInfos] })),
          _deplie: ouvert,
          _nbLieux: e.directory.length,
        });
        if (ouvert) {
          viderLePaquet();
          sortie.push(
            <div key={`annu-${cleInfos}`}>
              {e.directory.map((d, k) => (
                <CarteLieu
                  key={`lieu-${cleInfos}-${k}`}
                  lieu={d} fiche={e} lang={lang} social={social}
                  loggedIn={loggedIn} onGoingClick={onGoingClick}
                  onOuvrir={() => onCardClick?.(e)}
                  favorites={favorites} onToggleFav={onToggleFav}
                  onReserver={ouvrirReservation}
                  inviteCode={inviteCode} onShowAuth={onShowAuth}
                />
              ))}
            </div>
          );
        }
        continue;
      }

      paquet.push(e);
    }
    viderLePaquet();
    return sortie;
  }

}

```

## `src/components/screens/MapScreen.jsx`

```jsx
import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const WHITE = "#FFFFFF";
const LIGHT = "#F5F5FA";

const PINS = [
  { name: "Grimaldi Forum",    x: 72, y: 30, color: "#C8A8D8", events: ["MUSICAL","SALON","GALA","CONFÉRENCE","ENCHÈRES"] },
  { name: "Opéra Garnier MC",  x: 65, y: 40, color: "#B8A8D0", events: ["CONCERT","OPÉRA"] },
  { name: "Musée Océano",      x: 38, y: 72, color: "#90B8D0", events: ["EXPOSITION","ATELIER"] },
  { name: "Stade Louis II",    x: 22, y: 62, color: "#D0A8A8", events: ["FOOTBALL","SPORT"] },
  { name: "Salle Médecin",     x: 55, y: 52, color: "#D4B898", events: ["BASKET"] },
  { name: "Circuit Monaco",    x: 60, y: 44, color: "#D4B8A0", events: ["FORMULE 1","FORMULE E","RALLYE"] },
  { name: "Marché Condamine",  x: 47, y: 50, color: "#A8C8B0", events: ["MARCHÉ","BRUNCH","APÉRO","FOODY"] },
  { name: "La Note Bleue",     x: 80, y: 20, color: "#90D8F8", events: ["JAZZ LIVE","DJ SET","BRUNCH","APÉRO","SOIRÉE"] },
  { name: "Théâtre P. Grace",  x: 70, y: 36, color: "#D4A8C8", events: ["THÉÂTRE"] },
  { name: "Fort Antoine",      x: 44, y: 64, color: "#C8B0D8", events: ["THÉÂTRE","SPECTACLE"] },
  { name: "Salle Léo Ferré",   x: 17, y: 59, color: "#90B8D8", events: ["CONCERT","JAZZ LIVE","DANSE","SPECTACLE"] },
  { name: "Palais Princier",   x: 38, y: 67, color: "#D4B896", events: ["FÊTE NATIONALE","CHANTS"] },
  { name: "Country Club MC",   x: 78, y: 24, color: "#A8D8A8", events: ["TENNIS"] },
  { name: "Port Hercule",      x: 52, y: 53, color: "#90D0E8", events: ["SALON"] },
  { name: "Thermes Marins",    x: 63, y: 36, color: "#A8C8D8", events: ["BIEN-ÊTRE"] },
  { name: "Cinémas 2 Monaco",  x: 57, y: 49, color: "#D4C8A0", events: ["CINÉMA"] },
  { name: "NMNM",              x: 74, y: 27, color: "#C8A8D8", events: ["EXPOSITION","ATELIER"] },
];

export default function MapScreen({ onSelectEvent, onCategoryClick, lang = "fr" }) {
  const [active, setActive] = useState(null);

  const pinEvents = active
    ? ALL_EVENTS.filter(e => active.events.includes(e.cat))
    : [];

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
        }}>{lang === "en" ? "Map" : "Carte"}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>{lang === "en" ? "Principality of Monaco" : "Principauté de Monaco"}</div>
      </div>

      {/* Map */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{
          position: "relative",
          width: "100%",
          paddingBottom: "75%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          <svg
            viewBox="0 0 100 75"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
            }}
          >
            {/* Sea */}
            <rect width="100" height="75" fill="#D0E4F0" />

            {/* Land — stylized Monaco shape */}
            <path
              d="M10,70 L10,55 Q12,40 20,35 L30,32 Q38,28 45,30 L55,28 Q65,25 75,28 L85,30 Q92,35 90,45 L88,55 Q85,65 80,70 Z"
              fill="#F0ECE8"
              stroke="#D8D0C8"
              strokeWidth="0.5"
            />

            {/* Roads */}
            <path d="M20,55 Q40,48 60,45 Q75,43 88,50" fill="none" stroke="#E0D8D0" strokeWidth="0.8" />
            <path d="M45,30 L45,70" fill="none" stroke="#E0D8D0" strokeWidth="0.6" />
            <path d="M30,32 Q35,50 38,70" fill="none" stroke="#E0D8D0" strokeWidth="0.5" />

            {/* Water label */}
            <text x="15" y="20" fill="#8BACC0" fontSize="4" fontFamily="Georgia, serif" fontStyle="italic">
              Mer Méditerranée
            </text>

            {/* Pins */}
            {PINS.map((pin, i) => (
              <g key={i} onClick={() => setActive(active?.name === pin.name ? null : pin)} style={{ cursor: "pointer" }}>
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={active?.name === pin.name ? 5 : 3.5}
                  fill={pin.color}
                  stroke={active?.name === pin.name ? NAVY : WHITE}
                  strokeWidth={active?.name === pin.name ? 1.5 : 1}
                  opacity={0.9}
                />
                {active?.name === pin.name && (
                  <text
                    x={pin.x}
                    y={pin.y - 6}
                    textAnchor="middle"
                    fill={DARK}
                    fontSize="3.5"
                    fontFamily="-apple-system, sans-serif"
                    fontWeight="bold"
                  >{pin.name}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: NAVY,
          marginBottom: 10,
        }}>
          {active ? `📍 ${active.name}` : "Lieux culturels & sportifs"}
        </div>

        {!active && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}>
            {PINS.map((pin, i) => (
              <button
                key={i}
                onClick={() => setActive(pin)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  background: WHITE,
                  borderRadius: 20,
                  border: "1px solid #E8E0D4",
                  cursor: "pointer",
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 11,
                  color: DARK,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: pin.color }} />
                {pin.name}
              </button>
            ))}
          </div>
        )}

        {active && pinEvents.length > 0 && (
          <div>
            {pinEvents.slice(0, 3).map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e)}
                style={{
                  background: WHITE,
                  borderRadius: 14,
                  padding: "10px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ fontSize: 20 }}>{e.emoji}</span>
                <div>
                  <div style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: 13,
                    color: DARK,
                    textTransform: "uppercase",
                    whiteSpace: "pre-line",
                    lineHeight: 1.2,
                  }}>{e.title.replace(/\n/g, " ")}</div>
                  <div style={{
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 11,
                    color: GREY,
                    marginTop: 2,
                  }}>{e.date} · {e.time}</div>
                  <button
                    onClick={ev => { ev.stopPropagation(); onCategoryClick?.(e.cat); }}
                    style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "-apple-system, sans-serif", fontSize: 10,
                      fontWeight: 700, color: NAVY, letterSpacing: 1,
                      textTransform: "uppercase", marginTop: 2,
                      textDecoration: "underline", textUnderlineOffset: 2,
                    }}
                  >{e.cat}</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setActive(null)}
              style={{
                background: "none",
                border: "none",
                color: NAVY,
                fontFamily: "-apple-system, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >← Voir tous les lieux</button>
          </div>
        )}

        {active && pinEvents.length === 0 && (
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: GREY,
            fontSize: 14,
            padding: "10px 0",
          }}>Aucun événement à venir pour ce lieu.</div>
        )}
      </div>
    </div>
  );
}

```

## `src/components/screens/ProfileScreen.jsx`

```jsx
const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const GOLD2 = "#D4B896";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const WHITE = "#FFFFFF";
const LIGHT = "#F5F5FA";
const BORDER = "#DDE0F0";

export default function ProfileScreen({ lang = "fr" }) {
  const t = lang === "en"
    ? {
        profileSub: "About MonacOut",
        cofounder: "Co-founder",
        quote: "Monaco is a permanent stage. We wanted everyone to be part of it.",
        story: "Stéphanie and Agathe share a common belief: Monaco is full of exceptional events, and every resident deserves to enjoy them fully. MonacOut was born from the desire to bring together, in one place, all the cultural and sporting richness of the Principality.",
        conviction: "\"Monaco's cultural wealth belongs to all its residents.\"",
        statement: "All of Monaco, in your pocket.",
        sources: "Official sources",
        eventsPerWeek: "Events/week",
        madeWith: "Made with love",
      }
    : {
        profileSub: "À propos de MonacOut",
        cofounder: "Co-fondatrice",
        quote: "Monaco est une scène permanente. Nous voulions que chacun puisse en être acteur.",
        story: "Stéphanie et Agathe partagent une conviction commune : Monaco regorge d'événements exceptionnels, et chaque résident mérite d'en profiter pleinement. MonacOut est née de cette envie de rassembler, en un seul endroit, toute la richesse culturelle et sportive de la Principauté.",
        conviction: "\"La richesse culturelle de Monaco appartient à tous ses résidents.\"",
        statement: "Tout Monaco, dans votre poche.",
        sources: "Sources officielles",
        eventsPerWeek: "Événements/semaine",
        madeWith: "Fait avec amour",
      };
  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
        }}>{lang === "en" ? "Profile" : "Profil"}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>{t.profileSub}</div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* About section */}
        <div style={{
          background: WHITE,
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          {/* Founders */}
          <div style={{
            display: "flex",
            padding: "20px 20px 16px",
          }}>
            {/* Left: Stéphanie */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingRight: 16,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: WHITE,
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}>S</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: DARK,
                marginBottom: 2,
              }}>Stéphanie</div>
              <div style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: GOLD,
              }}>{t.cofounder}</div>
            </div>

            {/* Divider */}
            <div style={{
              width: 1,
              background: BORDER,
              alignSelf: "stretch",
              margin: "4px 0",
            }} />

            {/* Right: Véronique */}
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingLeft: 16,
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `linear-gradient(135deg, #8A8078, #6A635A)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: "bold",
                color: WHITE,
                fontFamily: "Georgia, serif",
                marginBottom: 8,
              }}>A</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: 26,
                color: DARK,
                marginBottom: 2,
              }}>Agathe</div>
              <div style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: GREY,
              }}>{t.cofounder}</div>
            </div>
          </div>

          {/* Gold gradient separator */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD2}, ${GOLD}, transparent)`,
            margin: "0 20px 16px",
          }} />

          {/* Quote */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: DARK,
            textAlign: "center",
            padding: "0 20px",
            lineHeight: 1.5,
            marginBottom: 16,
          }}>
            {t.quote}
          </div>

          {/* Story */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: GREY,
            lineHeight: 1.9,
            padding: "0 20px 20px",
          }}>
            {t.story}
          </div>

          {/* Conviction box */}
          <div style={{
            background: LIGHT,
            margin: "0 16px 16px",
            borderRadius: 12,
            padding: "12px 14px",
            borderLeft: `3px solid ${GOLD}`,
          }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: DARK,
              lineHeight: 1.6,
            }}>
              {t.conviction}
            </div>
          </div>

          {/* Bold statement */}
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 18,
            color: DARK,
            textAlign: "center",
            padding: "0 20px 20px",
            letterSpacing: 0.5,
          }}>
            {t.statement}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          background: WHITE,
          borderRadius: 20,
          padding: "16px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 22,
              color: GOLD,
            }}>27</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>{t.sources}</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 22,
              color: GOLD,
            }}>18+</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>{t.eventsPerWeek}</div>
          </div>
          <div style={{ width: 1, height: 36, background: BORDER }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>💜</div>
            <div style={{
              fontFamily: "-apple-system, sans-serif",
              fontSize: 10,
              color: GREY,
              letterSpacing: 0.5,
            }}>{t.madeWith}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

## `src/components/screens/WelcomeScreen.jsx`

```jsx
const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const GOLD_FRAME = "#7B2D26";
const BLUE = "#9FC3DC";

// Écran d'accueil au 1er lancement. Invite à se connecter, SANS jamais forcer :
// « Explorer sans compte » laisse entrer librement.
export default function WelcomeScreen({ onLogin, onExplore, lang = "fr" }) {
  return (
    <div style={overlay}>
      <div style={card}>
        <div style={inner}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 58, color: NAVY, lineHeight: 1 }}>M</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, letterSpacing: 6, color: NAVY, marginTop: 6, textTransform: "uppercase" }}>
            MONAC'<span style={{ color: GOLD }}>OUT</span>
          </div>
          <div style={{ height: 1, background: GOLD_FRAME, width: 44, margin: "22px auto" }} />
          <div style={title}>{lang === "en" ? "Welcome to Monac'Out" : "Bienvenue sur Monac'Out"}</div>
          <div style={sub}>
            {lang === "en"
              ? "See which friends are going to the same outings — and share yours. Or simply browse what's on in Monaco."
              : "Vois quels amis vont aux mêmes sorties — et partage les tiennes. Ou explore simplement ce qui se passe à Monaco."}
          </div>
          <button onClick={onLogin} style={btnPrimary}>
            {lang === "en" ? "Sign in / Sign up" : "Se connecter / S'inscrire"}
          </button>
          <button onClick={onExplore} style={btnGhost}>
            {lang === "en" ? "Browse without an account" : "Explorer sans compte"}
          </button>
          <div style={note}>
            {lang === "en" ? "By email — no password. No obligation." : "Par email — pas de mot de passe. Sans obligation."}
          </div>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "absolute", inset: 0, zIndex: 800,
  background: "rgba(15,29,58,0.55)",
  display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
};
const card = { width: 310, border: `3px solid ${GOLD_FRAME}`, borderRadius: 2, padding: 0, background: "#fff" };
// Plus de filet bleu intérieur : un seul trait, comme les cartes du fil.
const inner = { borderRadius: 1, padding: "32px 26px 24px", textAlign: "center" };
const title = { fontFamily: "'Josefin Sans', sans-serif", fontSize: 19, fontWeight: 600, color: NAVY, letterSpacing: 0.5, marginBottom: 10 };
const sub = { fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#555", lineHeight: 1.55, marginBottom: 24 };
const btnPrimary = {
  width: "100%", padding: "13px 0", background: NAVY, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer",
  fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10,
};
const btnGhost = {
  width: "100%", padding: "11px 0", background: "none", color: NAVY, border: `1px solid ${GOLD_FRAME}`, borderRadius: 2, cursor: "pointer",
  fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
};
const note = { fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#999", marginTop: 14 };

```

## `src/data/liveEvents.js`

```js
// Chargement des événements EN DIRECT depuis le site (events.json).
// Permet de corriger/ajouter des événements SANS repasser par Apple.
// Repli automatique sur les données embarquées si pas de réseau.

import { ALL_EVENTS } from "./events";

/**
 * 🚑 DEUX HÔTES, PAS UN. Leçon du 31 oct 2026 : Vercel a mis une adresse IP au
 * défi et, pour ce téléphone-là, `monac-out.vercel.app` a cessé de répondre —
 * plus d'événements, plus de photos, plus de mises à jour. L'app est retombée
 * sur ses données embarquées sans que rien ne le signale.
 * `monacout.com` est un projet Vercel DISTINCT qui sert les MÊMES fichiers.
 * On l'essaie si le premier échoue : deux projets ne tombent pas ensemble.
 */
const HOTES = ["https://monac-out.vercel.app", "https://monacout.com"];
const LIVE_URL = `${HOTES[0]}/events.json`;

/** Essaie chaque hôte dans l'ordre. Rend la première réponse exploitable. */
async function litSurUnDesHotes(chemin) {
  let derniere = null;
  for (const h of HOTES) {
    try {
      const res = await fetch(`${h}${chemin}?t=${Date.now()}`, { cache: "no-store" });
      // ⚠️ Un 403 « Security Checkpoint » renvoie une PAGE HTML avec un code
      // d'erreur : sans ce contrôle, on prendrait la page pour une réponse.
      if (res.ok) return res;
      derniere = res;
    } catch (e) { derniere = null; }
  }
  return derniere;
}
const MOIS = { jan: 0, "fév": 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, "août": 7, sep: 8, oct: 9, nov: 10, "déc": 11 };

function eventDate(e) {
  if (!e?.date) return null;
  const p = e.date.trim().split(" ");
  const m = MOIS[p[2]];
  if (m === undefined) return null;
  const d = new Date(e.year || new Date().getFullYear(), m, parseInt(p[1]));
  return isNaN(d) ? null : d;
}

function eventHour(e) {
  const m = (e.time || "").replace(/\s/g, "").match(/^(\d{1,2})h(\d{2})?/);
  return m ? parseInt(m[1]) * 60 + (m[2] ? parseInt(m[2]) : 0) : 9999;
}

// Une attraction EN COURS reste ouverte jusqu'à `until`, même si sa date affichée
// date d'hier (le script de nuit peut ne pas être passé). Sans ça les expositions
// sortaient du fil du jour au lendemain.
function encoreOuvert(e, ref) {
  if (!e.ongoing || !e.until) return false;
  const fin = new Date(e.until + "T00:00:00");
  return !isNaN(fin) && fin >= ref;
}

// Filtre aujourd'hui→futur + tri chronologique (comme ALL_EVENTS, mais au runtime)
function normalize(events) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return events
    .filter(e => { const d = eventDate(e); return d && (d >= today || encoreOuvert(e, today)); })
    .sort((a, b) => {
      const diff = eventDate(a) - eventDate(b);
      return diff !== 0 ? diff : eventHour(a) - eventHour(b);
    });
}

export async function fetchLiveEvents() {
  try {
    const res = await litSurUnDesHotes("/events.json");
    if (!res || !res.ok) throw new Error("hôtes injoignables");
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.events?.length) return null;
    return normalize(data.events);
  } catch {
    return null; // hors-ligne → l'app garde les données embarquées
  }
}

// ── Réglages de notifications pilotables depuis le site (sans repasser par Apple) ──
// L'app lit public/notif-config.json (servi sur monacout.vercel.app) au lancement.
// Repli sur les valeurs par défaut codées dans App.jsx si absent/hors-ligne.
const NOTIF_CONFIG_URL = "https://monac-out.vercel.app/notif-config.json";
const JOUR_OFFSET = { lundi: 0, mardi: 1, mercredi: 2, jeudi: 3, vendredi: 4, samedi: 5, dimanche: 6 };

export async function fetchNotifConfig() {
  try {
    const res = await litSurUnDesHotes("/notif-config.json");
    if (!res || !res.ok) return null;
    const c = await res.json();
    const offsets = Array.isArray(c.jours)
      ? [...new Set(c.jours.map(j => JOUR_OFFSET[String(j).toLowerCase().trim()]).filter(n => n !== undefined))].sort((a, b) => a - b)
      : null;
    return {
      offsets: offsets && offsets.length ? offsets : null,
      hour: Number.isInteger(c.heure) && c.heure >= 0 && c.heure <= 23 ? c.heure : null,
      perDigest: Number.isInteger(c.parRappel) && c.parRappel >= 1 && c.parRappel <= 6 ? c.parRappel : null,
      weeks: Number.isInteger(c.semaines) && c.semaines >= 1 && c.semaines <= 12 ? c.semaines : null,
      contactEmail: typeof c.contactEmail === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.contactEmail) ? c.contactEmail : null,
      latestVersion: typeof c.latestVersion === "string" ? c.latestVersion : null,
      announcement: c.announcement && typeof c.announcement === "object" ? c.announcement : null,
    };
  } catch {
    return null; // hors-ligne → l'app garde les réglages par défaut
  }
}

// Données embarquées (repli immédiat au démarrage)
export const BUNDLED_EVENTS = ALL_EVENTS;

```

## `src/hooks/useAuth.js`

```js
import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import posthog from 'posthog-js'
import { supabase } from '../lib/supabase'
import { empreinte, versE164 } from '../lib/phone'

// URL publique https de l'app (Universal Link). En natif, window.location.origin
// vaut "capacitor://localhost" — inutilisable comme redirection de lien magique.
const APP_URL = 'https://monac-out.vercel.app'

// Retrouver ses amies par le carnet d'adresses : construit, pas branché.
// Passer à true le jour où la migration supabase/2026-09-23-telephone.sql est
// passée ET où l'interface correspondante est remise dans FriendsScreen.
const CONTACTS_ACTIF = false

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  // On sait seulement OUI ou NON. L'empreinte du numéro ne redescend jamais du
  // serveur : elle n'a aucune raison de circuler, et ce qui ne circule pas ne fuit pas.
  const [phoneSaved, setPhoneSaved] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { posthog.identify(session.user.id) } catch { /* analytics indispo */ }  // relie la personne PostHog au compte (savoir qui est inscrit)
        loadProfile(session.user.id)
      } else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        try { posthog.identify(session.user.id) } catch { /* analytics indispo */ }
        loadProfile(session.user.id)
      } else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
    // ⏸ EN ATTENTE. Le carnet d'adresses a été mis de côté le 23 sep 2026 pour
    // traiter d'abord l'ouverture de `profiles`. Tant que CONTACTS_ACTIF est faux,
    // on n'interroge pas le serveur : inutile de payer un aller-retour à chaque
    // chargement de profil pour une fonction dont rien ne se sert encore.
    if (CONTACTS_ACTIF) {
      try {
        const { data: ok } = await supabase.rpc('mon_numero_est_enregistre')
        setPhoneSaved(ok === true)
      } catch { setPhoneSaved(false) }
    }
  }

  // Enregistre MON numéro sous forme d'empreinte. Le numéro lui-même ne quitte
  // jamais le téléphone — ni vers le serveur, ni vers PostHog, ni dans un log.
  async function savePhone(brut) {
    if (!supabase || !user) return { error: 'Non connecté' }
    if (!versE164(brut)) return { error: 'Numéro non reconnu — essaie 06 12 34 56 78 ou 93 15 22 95' }
    const hash = await empreinte(brut)
    if (!hash) return { error: 'Ton navigateur ne sait pas chiffrer ce numéro' }
    const { error } = await supabase.rpc('enregistrer_mon_numero', { hash })
    if (error) return { error: error.message }
    setPhoneSaved(true)
    try { posthog.capture('phone_saved') } catch { /* analytics indispo */ }
    return { ok: true }
  }

  // Le retirer doit être aussi simple que le donner.
  async function removePhone() {
    if (!supabase || !user) return { error: 'Non connecté' }
    const { error } = await supabase.rpc('enregistrer_mon_numero', { hash: null })
    if (error) return { error: error.message }
    setPhoneSaved(false)
    try { posthog.capture('phone_removed') } catch { /* analytics indispo */ }
    return { ok: true }
  }

  // Envoie un lien magique (clic = connecté) + code en secours dans le même email.
  async function sendCode(email) {
    if (!supabase) return { error: 'Non configuré' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: 'https://monac-out.vercel.app',
      },
    })
    return { error }
  }

  // Vérifie le code saisi → ouvre la session.
  async function verifyCode(email, token) {
    if (!supabase) return { error: 'Non configuré' }
    const { error } = await supabase.auth.verifyOtp({ email, token: String(token).trim(), type: 'email' })
    return { error }
  }

  async function saveProfile(displayName, topics, avatarUrl) {
    if (!supabase || !user) return
    const isNew = !profile?.display_name           // 1er enregistrement du prénom = nouveau compte
    const row = { id: user.id, display_name: displayName }
    if (Array.isArray(topics)) row.preferred_topics = topics
    if (typeof avatarUrl === 'string') row.avatar_url = avatarUrl   // '' = retirer la photo

    let { data, error } = await supabase.from('profiles').upsert(row).select().single()
    // Filet de sécurité : si la colonne avatar_url n'existe pas encore côté base,
    // on réenregistre SANS la photo. Le prénom ne doit jamais être perdu à cause d'elle.
    if (error && 'avatar_url' in row) {
      const sansPhoto = { ...row }; delete sansPhoto.avatar_url
      const retour = await supabase.from('profiles').upsert(sansPhoto).select().single()
      data = retour.data; error = retour.error
    }
    if (error) return { error: error.message }
    setProfile(data)
    if (isNew) {
      try { posthog.capture('signup_completed', { topics: Array.isArray(topics) ? topics : [] }) } catch { /* analytics indisponible */ }
    }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    try { posthog.reset() } catch { /* analytics indispo */ }  // délie la personne PostHog (déconnexion explicite uniquement)
  }

  async function deleteAccount() {
    if (!supabase) return { error: 'Non connecté' }
    const { error } = await supabase.rpc('delete_own_account')
    if (error) return { error: error.message }   // on ne déconnecte PAS si la suppression a échoué
    await supabase.auth.signOut()
    return { ok: true }
  }

  return { user, profile, loading, phoneSaved, sendCode, verifyCode, saveProfile,
           savePhone, removePhone, signOut, deleteAccount }
}

```

## `src/hooks/useSocial.js`

```js
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSocial(userId) {
  const [myParticipations, setMyParticipations] = useState([])  // event_id[]
  const [friends, setFriends]                   = useState([])  // [{ id, display_name, invite_code, participations: event_id[], canSeeMe: bool }]
  const [pending, setPending]                   = useState([])  // demandes reçues
  const [visibility, setVisibility]             = useState([])  // friend_id[] qui peuvent me voir
  // 🚨 A-T-ON DÉJÀ INTERROGÉ LA BASE ? `friends` démarre à [] — sans ce drapeau, tout
  // ce qui teste « la personne n'a aucune amie » est VRAI pendant le chargement.
  // Le bandeau « Partage ton lien » s'affichait donc à tout le monde, puis
  // disparaissait dès l'arrivée de la liste. Stéphanie, 3 septembre 2026 :
  // « le petit message qui apparaît en haut de l'appli reste 1/4 de seconde ».
  const [charge, setCharge]                     = useState(false)

  const load = useCallback(async () => {
    if (!supabase || !userId) return

    // Mes participations
    const { data: parts } = await supabase
      .from('participations')
      .select('event_id')
      .eq('user_id', userId)
      .eq('incognito', false)
    setMyParticipations((parts || []).map(p => p.event_id))

    // Toutes les connexions (pending ou accepted = ami immédiat via lien)
    const { data: friendships } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id, status')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)

    const friendIds = [...new Set((friendships || []).map(f =>
      f.requester_id === userId ? f.addressee_id : f.requester_id
    ))]

    // Demandes en attente reçues (pour UI optionnel)
    const pendingReqs = []
    const pendingIds = []

    // Profils des amis et demandeurs
    const allIds = [...new Set([...friendIds, ...pendingIds])]
    if (!allIds.length) { setFriends([]); setPending([]); setVisibility([]); setCharge(true); return }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')   // « * » et non une liste figée : la liste d amis ne doit pas casser si avatar_url n existe pas encore
      .in('id', allIds)

    // Visibilité : qui a activé "peut me voir"
    const { data: vis } = await supabase
      .from('visibility')
      .select('visible_to_id')
      .eq('user_id', userId)
      .in('visible_to_id', friendIds)
    const visSet = new Set((vis || []).map(v => v.visible_to_id))

    // Par défaut : on se rend visible à ses amis (sauf ceux qu'on a explicitement masqués).
    // Le masquage est mémorisé en local → on ne re-force jamais la visibilité d'un ami masqué.
    try {
      const hidden = JSON.parse(localStorage.getItem('monacout_vis_hidden') || '[]')
      const toDefault = friendIds.filter(fid => !visSet.has(fid) && !hidden.includes(fid))
      if (toDefault.length) {
        await supabase.from('visibility').insert(toDefault.map(fid => ({ user_id: userId, visible_to_id: fid })))
        toDefault.forEach(fid => visSet.add(fid))
      }
    } catch { /* best-effort : si ça échoue, on garde l'état existant */ }

    setVisibility([...visSet])

    // Participations des amis qui m'ont autorisé à les voir
    const { data: visByFriends } = await supabase
      .from('visibility')
      .select('user_id')
      .eq('visible_to_id', userId)
      .in('user_id', friendIds)
    const visibleFriendIds = new Set((visByFriends || []).map(v => v.user_id))

    let friendParts = {}
    if (visibleFriendIds.size) {
      const { data: fp } = await supabase
        .from('participations')
        .select('user_id, event_id')
        .in('user_id', [...visibleFriendIds])
        .eq('incognito', false)
      for (const p of (fp || [])) {
        if (!friendParts[p.user_id]) friendParts[p.user_id] = []
        friendParts[p.user_id].push(p.event_id)
      }
    }

    const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))

    setFriends(friendIds.map(fid => ({
      ...profileMap[fid],
      participations: friendParts[fid] || [],
      canSeeMe: visSet.has(fid),
    })).filter(Boolean))

    setPending((pendingReqs || []).map(r => ({
      friendshipId: r.id,
      ...profileMap[r.requester_id],
    })).filter(p => p.id))
    setCharge(true)
  }, [userId])

  useEffect(() => { load() }, [load])

  async function toggleParticipation(eventId) {
    if (!supabase || !userId) return
    const isGoing = myParticipations.includes(eventId)
    if (isGoing) {
      await supabase.from('participations').delete().eq('user_id', userId).eq('event_id', eventId)
      setMyParticipations(prev => prev.filter(id => id !== eventId))
    } else {
      await supabase.from('participations').insert({ user_id: userId, event_id: eventId })
      setMyParticipations(prev => [...prev, eventId])
    }
  }

  async function toggleVisibility(friendId) {
    if (!supabase || !userId) return
    const isVisible = visibility.includes(friendId)
    let hidden = []
    try { hidden = JSON.parse(localStorage.getItem('monacout_vis_hidden') || '[]') } catch { /* rien */ }
    if (isVisible) {
      await supabase.from('visibility').delete().eq('user_id', userId).eq('visible_to_id', friendId)
      setVisibility(prev => prev.filter(id => id !== friendId))
      // On mémorise le masquage → le défaut « visible » ne le re-forcera pas au prochain chargement.
      if (!hidden.includes(friendId)) { try { localStorage.setItem('monacout_vis_hidden', JSON.stringify([...hidden, friendId])) } catch { /* rien */ } }
    } else {
      await supabase.from('visibility').insert({ user_id: userId, visible_to_id: friendId })
      setVisibility(prev => [...prev, friendId])
      try { localStorage.setItem('monacout_vis_hidden', JSON.stringify(hidden.filter(id => id !== friendId))) } catch { /* rien */ }
    }
  }

  // Cherche un profil par son code d'invitation.
  // ⚠️ DEUX CHEMINS, ET C'EST VOLONTAIRE. `profiles` a été fermée le 23 sep 2026
  // (elle était lisible en entier par n'importe qui, codes d'invitation compris) :
  // la lecture passe désormais par `profil_par_code`. Mais l'OTA et la migration SQL
  // n'arrivent jamais au même instant, et tout le monde n'est pas sur le dernier
  // bundle. On essaie donc la fonction, et on retombe sur l'ancienne lecture tant
  // qu'elle n'existe pas. ➜ La repli pourra disparaître quand la migration sera
  // passée depuis longtemps : à ce moment-là, elle ne rendra plus rien de toute façon.
  async function profilParCode(code) {
    const propre = String(code || '').trim().toLowerCase()
    if (!propre) return null
    const { data, error } = await supabase.rpc('profil_par_code', { code: propre })
    if (!error && Array.isArray(data)) return data[0] || null
    const { data: direct } = await supabase
      .from('profiles').select('id, display_name').eq('invite_code', propre).single()
    return direct || null
  }

  async function addFriendByCode(inviteCode) {
    if (!supabase || !userId) return { error: 'Non connecté' }
    const target = await profilParCode(inviteCode)
    // Message explicite : « Code introuvable » laissait croire à une panne. Le cas
    // réel le plus fréquent est un lien partagé avant que le code soit chargé.
    if (!target) return { error: 'Ce code n\'existe pas — demande à ton amie de renvoyer son lien' }
    if (target.id === userId) return { error: 'C\'est ton propre code !' }
    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: userId, addressee_id: target.id })
    if (error && error.code !== '23505') return { error: error.message }
    await load()
    return { name: target.display_name }
  }

  // Croise le carnet d'adresses avec les personnes qui ont donné leur numéro.
  // On n'envoie QUE des empreintes, calculées dans le téléphone (src/lib/phone.js) :
  // les numéros des gens du carnet — qui n'ont rien demandé, eux — ne partent jamais.
  // Le serveur ne rend que des profils, jamais une empreinte.
  async function matchContacts(hashes) {
    if (!supabase || !userId) return { error: 'Non connecté', trouvees: [] }
    if (!hashes?.length) return { trouvees: [] }
    const { data, error } = await supabase.rpc('match_contacts', { hashes })
    if (error) return { error: error.message, trouvees: [] }
    // On retire celles qui sont déjà des amies ou déjà invitées : les revoir dans
    // la liste donnerait l'impression que le bouton n'a pas marché.
    const connues = new Set([...friends.map(f => f.id), ...pending.map(p => p.id)])
    return { trouvees: (data || []).filter(p => !connues.has(p.id)) }
  }

  // Même effet que le code d'invitation, mais on tient déjà l'identifiant.
  async function addFriendById(id) {
    if (!supabase || !userId) return { error: 'Non connecté' }
    if (id === userId) return { error: 'C\'est toi !' }
    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: userId, addressee_id: id })
    if (error && error.code !== '23505') return { error: error.message }
    await load()
    return { ok: true }
  }

  async function acceptFriend(friendshipId) {
    if (!supabase) return
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId)
    await load()
  }

  async function declineFriend(friendshipId) {
    if (!supabase) return
    await supabase.from('friendships').delete().eq('id', friendshipId)
    await load()
  }

  async function removeFriend(friendId) {
    if (!supabase || !userId) return
    await supabase.from('friendships')
      .delete()
      .or(`and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`)
    await load()
  }

  // Amis qui vont à un event donné (ceux qui ont activé visibilité vers moi)
  function friendsGoingTo(eventId) {
    return friends.filter(f => f.participations.includes(eventId))
  }

  return {
    myParticipations, friends, pending, visibility, charge,
    toggleParticipation, toggleVisibility,
    addFriendByCode, addFriendById, matchContacts,
    acceptFriend, declineFriend, removeFriend,
    friendsGoingTo, reload: load,
  }
}

```

## `src/i18n.js`

```js
export const T = {
  fr: {
    tagline: "Monaco Ensemble",
    filters: {
      today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", calendar: "Calendrier", gratuit: "Gratuit", sport: "⚽ Sport",
      culture: "🎭 Culture", music: "🎵 Musique", cinema: "🎬 Cinéma",
      famille: "👨‍👩‍👧 Famille", ateliers: "🎨 Ateliers", bienetre: "🧘 Bien-être",
      foody: "🍽️ Foody", encheres: "🔨 Enchères", agenda: "Agenda",
    },
    empty: "Aucun événement pour cette période.",
    free: "✅ ENTRÉE LIBRE",
    calTitle: "Agenda", reset: "Réinit.",
    seeEvents: "Voir les événements →", selectDate: "Sélectionnez une date",
    fromTo: (s, e) => `Du ${s} au ${e}`,
    since: (s) => `À partir du ${s}`,
    nav: { events: "MC Events", agenda: "My Agenda" },
    months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
    days: ["L","M","M","J","V","S","D"],
    cofounder: "Co-fondatrice",
    quote: "Monaco est une scène permanente. Nous voulions que chacun puisse en être acteur.",
    story: "Stéphanie et Agathe partagent une conviction commune : Monaco regorge d'événements exceptionnels, et chaque résident mérite d'en profiter pleinement. MonacOut est née de cette envie de rassembler, en un seul endroit, toute la richesse culturelle et sportive de la Principauté.",
    conviction: "\"La richesse culturelle de Monaco appartient à tous ses résidents.\"",
    statement: "Tout Monaco, dans votre poche.",
    sources: "Sources officielles", eventsPerWeek: "Événements/semaine", madeWith: "Fait avec amour",
    profileSub: "À propos de MonacOut",
    noEvents: "Aucun événement.", favEmpty: "Aucun favori pour l'instant.",
  },
  en: {
    tagline: "Monaco Together",
    filters: {
      today: "Today", week: "Week", weekend: "Weekend", calendar: "Calendar", gratuit: "Free", sport: "⚽ Sport",
      culture: "🎭 Culture", music: "🎵 Music", cinema: "🎬 Cinema",
      famille: "👨‍👩‍👧 Family", ateliers: "🎨 Workshops", bienetre: "🧘 Wellness",
      foody: "🍽️ Foody", encheres: "🔨 Auctions", agenda: "Calendar",
    },
    empty: "No events for this period.",
    free: "✅ FREE ENTRY",
    calTitle: "Calendar", reset: "Reset",
    seeEvents: "See events →", selectDate: "Select a date",
    fromTo: (s, e) => `From ${s} to ${e}`,
    since: (s) => `From ${s}`,
    nav: { events: "MC Events", agenda: "My Agenda" },
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["M","T","W","T","F","S","S"],
    cofounder: "Co-founder",
    quote: "Monaco is a permanent stage. We wanted everyone to be part of it.",
    story: "Stéphanie and Agathe share a common belief: Monaco is full of exceptional events, and every resident deserves to enjoy them fully. MonacOut was born from the desire to bring together, in one place, all the cultural and sporting richness of the Principality.",
    conviction: "\"Monaco's cultural wealth belongs to all its residents.\"",
    statement: "All of Monaco, in your pocket.",
    sources: "Official sources", eventsPerWeek: "Events/week", madeWith: "Made with love",
    profileSub: "About MonacOut",
    noEvents: "No events.", favEmpty: "No favorites yet.",
  },
};

// ── Traduction des données d'événement (catégorie, date, heure) en anglais ──
// Les noms de lieux (subtitle) et les titres ne sont jamais traduits.

const CAT_EN = {
  "CONCERT": "CONCERT", "OPÉRA": "OPERA", "MUSICAL": "MUSICAL", "THÉÂTRE": "THEATRE",
  "JAZZ LIVE": "JAZZ LIVE", "DJ SET": "DJ SET", "CHANTS": "CHOIR", "CINÉMA": "CINEMA",
  "FESTIVAL": "FESTIVAL", "GALA": "GALA", "SPECTACLE": "SHOW", "EXPOSITION": "EXHIBITION",
  "CONFÉRENCE": "TALK", "SALON": "FAIR", "FOOTBALL": "FOOTBALL", "BASKET": "BASKETBALL",
  "FORMULE 1": "FORMULA 1", "FORMULE E": "FORMULA E", "TENNIS": "TENNIS", "RALLYE": "RALLY",
  "SPORT": "SPORT", "ATELIER": "WORKSHOP", "DANSE": "DANCE", "BIEN-ÊTRE": "WELLNESS",
  "BRUNCH": "BRUNCH", "APÉRO": "DRINKS", "SOIRÉE": "NIGHTLIFE", "ENCHÈRES": "AUCTION",
  "MARCHÉ": "MARKET", "FÊTE NATIONALE": "NATIONAL DAY",
  "MISE À JOUR": "UPDATE",
};

const DAY_EN = { Dim: "Sun", Lun: "Mon", Mar: "Tue", Mer: "Wed", Jeu: "Thu", Ven: "Fri", Sam: "Sat" };
const MON_EN = { jan: "Jan", "fév": "Feb", mar: "Mar", avr: "Apr", mai: "May", juin: "Jun", juil: "Jul", "août": "Aug", sep: "Sep", oct: "Oct", nov: "Nov", "déc": "Dec" };

export function localizeCat(cat, lang) {
  return lang === "en" ? (CAT_EN[cat] || cat) : cat;
}

export function localizeDate(dateStr, lang) {
  if (lang !== "en" || !dateStr) return dateStr;
  return dateStr.split(" ").map(w => DAY_EN[w] || MON_EN[w] || w).join(" ");
}

// Traduction des titres : phrases (ordre des mots) puis mots.
// On NE touche PAS aux articles (de, du, la…) ni aux noms propres / lieux /
// compositeurs / opéras (Mozart, Grace Kelly, Larvotto, Cyrano…).

const TITLE_PHRASES = [
  ["METS À JOUR", "PLEASE UPDATE"],
  ["CINÉMA À L'AFFICHE CETTE SEMAINE", "FILMS AT THE CINEMA THIS WEEK"],
  ["MESSE DIMANCHE", "SUNDAY MASS"], ["MESSE DOMINICALE", "SUNDAY MASS"],
  ["MESSE LUNDI", "MONDAY MASS"], ["MESSE MARDI", "TUESDAY MASS"],
  ["MESSE MERCREDI", "WEDNESDAY MASS"], ["MESSE JEUDI", "THURSDAY MASS"],
  ["MESSE VENDREDI", "FRIDAY MASS"], ["MESSE SAMEDI", "SATURDAY MASS"],
  ["FEUX D'ARTIFICE", "FIREWORKS"], ["FEU D'ARTIFICE", "FIREWORKS"],
  ["PLEIN AIR", "OPEN-AIR"], ["NOUVEL AN", "NEW YEAR"], ["RÉVEILLON", "NEW YEAR'S EVE"],
  ["FIN D'ANNÉE", "YEAR-END"], ["DÉBUT D'ANNÉE", "NEW-YEAR"], ["D'ANNÉE", "YEAR"],
  ["LEVER DU SOLEIL", "SUNRISE"], ["AU LEVER", "AT SUNRISE"],
  ["FÊTE NATIONALE", "NATIONAL DAY"], ["FÊTE DE LA MUSIQUE", "MUSIC DAY"],
  ["JOURNÉE MONDIALE DE L'ENVIRONNEMENT", "WORLD ENVIRONMENT DAY"],
  ["SITES HISTORIQUES", "HISTORIC SITES"], ["PARENT-ENFANT", "PARENT-CHILD"],
  ["CÔTE D'AZUR", "FRENCH RIVIERA"], ["BEAUX-ARTS", "FINE ARTS"],
  ["FÊTE DES MÈRES", "MOTHER'S DAY"], ["FÊTE DES PÈRES", "FATHER'S DAY"],
  ["BANDES DESSINÉES", "COMICS"], ["BANDE DESSINÉE", "COMIC"],
  ["VISITES GUIDÉES", "GUIDED TOURS"], ["VISITE GUIDÉE", "GUIDED TOUR"],
  ["SOIRÉE NOCTURNE", "NIGHT PARTY"], ["PEINTURE À L'HUILE", "OIL PAINTING"],
  ["À L'HUILE", "OIL"], ["DES ARTISTES", "ARTISTS'"], ["NE PAS CÉDER", "DON'T GIVE UP"],
];

const TITLE_WORDS = {
  // Jours
  "LUNDI": "MONDAY", "MARDI": "TUESDAY", "MERCREDI": "WEDNESDAY", "JEUDI": "THURSDAY",
  "VENDREDI": "FRIDAY", "SAMEDI": "SATURDAY", "DIMANCHE": "SUNDAY", "DOMINICAL": "SUNDAY",
  // Mois
  "JANVIER": "JANUARY", "FÉVRIER": "FEBRUARY", "MARS": "MARCH", "AVRIL": "APRIL",
  "JUIN": "JUNE", "JUILLET": "JULY", "AOÛT": "AUGUST", "SEPTEMBRE": "SEPTEMBER",
  "OCTOBRE": "OCTOBER", "NOVEMBRE": "NOVEMBER", "DÉCEMBRE": "DECEMBER",
  // Saisons
  "ÉTÉ": "SUMMER", "D'ÉTÉ": "SUMMER", "L'ÉTÉ": "SUMMER", "ESTIVALE": "SUMMER", "ESTIVAL": "SUMMER",
  "HIVER": "WINTER", "HIVERNAL": "WINTER", "HIVERNALE": "WINTER", "AUTOMNE": "AUTUMN",
  "AUTOMNAL": "AUTUMN", "D'AUTOMNE": "AUTUMN", "PRINTEMPS": "SPRING", "PRINTANIER": "SPRING",
  // Temps / saison
  "SEMAINE": "WEEK", "WEEK-END": "WEEKEND", "JOURNÉE": "DAY", "SOIRÉE": "EVENING",
  "SOIR": "EVENING", "NUIT": "NIGHT", "NOCTURNE": "NIGHT", "MATINAL": "MORNING",
  "MATINALE": "MORNING", "VEILLE": "EVE", "HEURE": "HOUR", "HEURES": "HOURS",
  "SAISON": "SEASON", "RENTRÉE": "AUTUMN RETURN", "OUVERTURE": "OPENING", "FERMETURE": "CLOSING",
  "CLÔTURE": "CLOSING", "REPRISE": "RETURN", "DÉBUT": "START", "FIN": "END", "ARRIVÉE": "ARRIVAL",
  "ANS": "YEARS", "ANNÉE": "YEAR", "NOUVEL": "NEW", "TOUSSAINT": "ALL SAINTS",
  // Religion / lieux génériques
  "MESSE": "MASS", "PAROISSES": "PARISHES", "PAROISSE": "PARISH", "ÉGLISE": "CHURCH",
  "CATHÉDRALE": "CATHEDRAL", "CHAPELLE": "CHAPEL", "CHANTS": "CHOIR", "CHORAL": "CHORAL",
  // Catégories / activités
  "APÉRO": "DRINKS", "L'APÉRO": "DRINKS", "BRUNCH": "BRUNCH", "DÎNER": "DINNER",
  "DÉJEUNER": "LUNCH", "DÉGUSTATION": "TASTING", "COCKTAILS": "COCKTAILS",
  "SPECTACLE": "SHOW", "EXPOSITION": "EXHIBITION", "CONFÉRENCE": "TALK", "CONFERENCE": "TALK",
  "FÊTE": "FESTIVAL", "FÊTES": "FESTIVALS", "MARCHÉ": "MARKET", "SALON": "FAIR",
  "ENCHÈRES": "AUCTION", "VENTE": "SALE", "VENTES": "SALES", "TOURNÉE": "TOUR",
  "RENCONTRE": "ENCOUNTER", "RENCONTRES": "ENCOUNTERS", "RÉCITAL": "RECITAL",
  "SCÈNE": "STAGE", "ACTE": "ACT", "PIÈCE": "PLAY", "REVUE": "REVUE", "CONTE": "TALE",
  "CONTES": "TALES", "CHANSONS": "SONGS", "MUSIQUE": "MUSIC", "MAGIE": "MAGIC", "MAGIES": "MAGIC",
  // Art & ateliers
  "ATELIER": "WORKSHOP", "ATELIERS": "WORKSHOPS", "STAGE": "COURSE", "STAGES": "COURSES",
  "COURS": "CLASS", "PEINTURE": "PAINTING", "DESSIN": "DRAWING", "GRAVURE": "ENGRAVING",
  "CÉRAMIQUE": "CERAMIC", "ARGILE": "CLAY", "BRODERIE": "EMBROIDERY",
  "CALLIGRAPHIE": "CALLIGRAPHY", "LINOGRAPHIE": "LINOCUT", "ILLUSTRATION": "ILLUSTRATION",
  "PLASTIQUES": "VISUAL", "GRAPHIQUES": "GRAPHIC", "CRÉATIF": "CREATIVE",
  "CRÉATIFS": "CREATIVE", "CRÉATIVE": "CREATIVE", "ARTISTIQUE": "ARTISTIC", "ARTISTIQUES": "ARTISTIC",
  "DÉAMBULATION": "WANDER",
  // Public / famille
  "ENFANTS": "CHILDREN", "ENFANT": "CHILD", "JEUNE": "YOUNG", "JEUNES": "YOUNG",
  "JEUNESSE": "YOUTH", "FAMILLE": "FAMILY", "FÉMININ": "WOMEN'S", "ÉCOLES": "SCHOOLS",
  "DÉCOUVERTE": "DISCOVERY", "INITIATION": "INTRO", "INTENSIF": "INTENSIVE",
  // Bien-être
  "MÉDITATION": "MEDITATION", "RESPIRATION": "BREATHING", "ÉQUILIBRE": "BALANCE",
  "ÉNERGIE": "ENERGY", "CORPS": "BODY", "CONSCIENTE": "MINDFUL", "RETRAITE": "RETREAT",
  "PAUSE": "BREAK", "DÉTOX": "DETOX", "BIEN-ÊTRE": "WELLNESS",
  // Gastronomie
  "VINS": "WINES", "CAVE": "CELLAR", "BULLES": "BUBBLES", "BOULANGERIE": "BAKERY",
  "CACAO": "COCOA", "GASTRONOMIE": "GASTRONOMY", "CHARCUTERIES": "CHARCUTERIE",
  // Nature / mer
  "MER": "SEA", "MARIN": "MARINE", "MARINS": "MARINE", "MARINE": "MARINE", "OCÉAN": "OCEAN",
  "PLAGE": "BEACH", "VOILE": "SAILING", "VOILES": "SAILS", "PLONGÉE": "DIVING",
  "NATURE": "NATURE", "PLANTES": "PLANTS", "JARDIN": "GARDEN", "JARDINS": "GARDENS",
  "BIODIVERSITÉ": "BIODIVERSITY", "RECYCLAGE": "RECYCLING", "PRÉHISTOIRE": "PREHISTORY",
  "PRÉHISTORIQUE": "PREHISTORIC", "EXPLORATION": "EXPLORATION",
  // Lumières / fête
  "LUMIÈRES": "LIGHTS", "ÉTOILES": "STARS", "MERVEILLES": "WONDERS", "FEUX": "FIREWORKS",
  // Divers
  "PRINCESSE": "PRINCESS", "PRINCIER": "PRINCELY", "PRINCIÈRES": "PRINCELY",
  "PRINCIPAUTÉ": "PRINCIPALITY", "VOITURES": "CARS", "MONNAIES": "COINS", "TIMBRES": "STAMPS",
  "MOBILIER": "FURNITURE", "LIVRE": "BOOK", "THÉÂTRE": "THEATRE", "THÉÂTRALE": "THEATRICAL",
  "MUSÉE": "MUSEUM", "PROMENADE": "STROLL", "BALADE": "STROLL", "PRESTIGE": "PRESTIGE",
  "LUXE": "LUXURY", "HISTORIQUES": "HISTORIC", "HISTORIQUE": "HISTORIC", "MONDIALE": "WORLD",
  "MONDIAL": "WORLD", "INTERNATIONALE": "INTERNATIONAL", "FRANÇAISE": "FRENCH",
  "FRANÇAISES": "FRENCH", "CORSE": "CORSICAN", "CORSES": "CORSICAN", "ITALIEN": "ITALIAN",
  "JAPONAIS": "JAPANESE", "JAPON": "JAPAN", "MÉDITERRANÉE": "MEDITERRANEAN",
  "MÉDITERRANÉEN": "MEDITERRANEAN", "NOËL": "CHRISTMAS", "SACRÉ": "SACRED", "SACRÉE": "SACRED",
  "GRATUIT": "FREE", "PUBLIC": "PUBLIC", "NATIONALE": "NATIONAL",
  // Thèmes Philomonaco
  "DÉSIR": "DESIRE", "DÉSIRS": "DESIRES", "ENVIE": "WANT", "BESOIN": "NEED",
  "NAISSANCE": "BIRTH", "ENSEMBLE": "TOGETHER", "ENTRE": "BETWEEN", "INFINI": "INFINITY",
  "DÉCEPTION": "DISAPPOINTMENT", "FILS": "SON",
  // Compléments
  "ARTISTES": "ARTISTS", "ARTISTE": "ARTIST", "GUIDÉE": "GUIDED", "GUIDÉ": "GUIDED",
  "TROPHÉE": "TROPHY", "CINÉMA": "CINEMA", "VISITE": "VISIT", "VISITES": "VISITS",
  "ÉCO-LUDIQUE": "ECO-FUN", "FORUM": "FORUM", "FORUMS": "FORUMS",
};

// Adjectifs français placés APRÈS le nom → en anglais on les met AVANT.
// "YOGA MATINAL" → "MORNING YOGA", "SÉANCE ESTIVALE" → "SUMMER SÉANCE"…
const TRAIL_ADJ = {
  MATINAL: "MORNING", MATINALE: "MORNING", ESTIVAL: "SUMMER", ESTIVALE: "SUMMER",
  HIVERNAL: "WINTER", HIVERNALE: "WINTER", AUTOMNAL: "AUTUMN", AUTOMNALE: "AUTUMN",
  PRINTANIER: "SPRING", NOCTURNE: "NIGHT", DOMINICAL: "SUNDAY", DOMINICALE: "SUNDAY",
  SACRÉ: "SACRED", SACRÉE: "SACRED", MONÉGASQUE: "MONEGASQUE",
};
const TRAIL_RE = new RegExp("([A-ZÀ-Ÿ’'\\-]{2,})\\s+(" + Object.keys(TRAIL_ADJ).join("|") + ")(?=\\s|$)", "gi");

// Noms français « tête » suivis de leur complément → en anglais le complément passe avant.
// "ATELIER CÉRAMIQUE" → "CERAMIC WORKSHOP", "STAGE BALLET" → "BALLET COURSE".
const HEAD_NOUN = { ATELIER: "WORKSHOP", STAGE: "COURSE", COURS: "CLASS", SÉANCE: "SESSION", INITIATION: "INITIATION" };
const HEAD_RE = new RegExp("\\b(" + Object.keys(HEAD_NOUN).join("|") + ")\\s+([A-ZÀ-Ÿ’'\\-]{2,})", "gi");

function ordinal(n) {
  const v = parseInt(n);
  if (v % 100 >= 11 && v % 100 <= 13) return v + "TH";
  return v + (["TH", "ST", "ND", "RD"][v % 10] || "TH");
}

export function localizeTitle(title, lang) {
  if (lang !== "en" || !title) return title;
  let s = title;
  // Ordinaux français : 8ÈME → 8TH, 1ER → 1ST, 2E → 2ND
  s = s.replace(/(\d+)(ÈME|ER|RE|E)\b/gi, (_, n) => ordinal(n));
  for (const [fr, en] of TITLE_PHRASES) s = s.split(fr).join(en);
  // Inversion adjectif postposé → antéposé ("yoga matinal" → "morning yoga")
  s = s.replace(TRAIL_RE, (_, noun, adj) => (TRAIL_ADJ[adj.toUpperCase()] || adj) + " " + noun);
  // Nom tête + complément → complément + nom anglais ("atelier céramique" → "ceramic workshop")
  s = s.replace(HEAD_RE, (_, head, mod) => mod + " " + (HEAD_NOUN[head.toUpperCase()] || head));
  return s.split(/(\s+)/).map(w => TITLE_WORDS[w.toUpperCase()] || w).join("");
}

export function localizeTime(time, lang) {
  if (lang !== "en" || !time) return time;
  return time
    .replace(/(\d{1,2})h(\d{2})/g, "$1:$2")
    .replace(/(\d{1,2})h(?!\d)/g, "$1:00")
    .replace(/Toute la journée/i, "All day")
    .replace(/Dès le/i, "From")
    .replace(/Dès/i, "From");
}

```

## `src/index.css`

```css
/* Josefin Sans + Playfair Display sont désormais EMBARQUÉES (voir main.jsx) → chargement instantané, plus de saut du logo. */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Lato:wght@300;400;700&family=Jost:wght@400;500;600;700&family=Great+Vibes&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #F2EDE6;
  font-family: -apple-system, sans-serif;
}

/* L'app glissait de gauche à droite au doigt sur iPhone : rien n'empêchait la page
   de défiler ni de rebondir horizontalement. On verrouille l'axe horizontal au
   niveau du document. Les rangées qui défilent VRAIMENT de côté (les filtres) ont
   leur propre `overflow-x` et continuent de fonctionner : le verrou ne s'applique
   qu'à la page elle-même. */
html, body, #root {
  max-width: 100%;
  overflow-x: hidden;
  overscroll-behavior-x: none;
}

html, body {
  position: relative;
  width: 100%;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

```

## `src/lib/avatar.js`

```js
/**
 * MonacOut — PHOTO DE PROFIL
 *
 * Réduit la photo choisie en un petit carré et la renvoie en « data URL ».
 * On la stocke ainsi directement dans la colonne `avatar_url` de `profiles`,
 * sans espace de stockage séparé : à 96×96 en JPEG, une photo pèse ~5 Ko —
 * moins qu'une ligne de texte un peu longue. Avantages concrets :
 *  - aucun réglage d'accès (RLS) ni de CORS à maintenir sur un « bucket » ;
 *  - la photo part AVEC le compte quand quelqu'un le supprime (la ligne
 *    profiles disparaît, la photo avec) → obligation légale réglée sans effort ;
 *  - la photo des amis arrive avec la liste d'amis, sans requête de plus.
 * ⚠️ À revoir si l'audience grossit beaucoup (des milliers de comptes) :
 *    il faudra alors passer à Supabase Storage.
 */

export const AVATAR_PX = 96;          // taille finale, en pixels (carré)
const QUALITE = 0.72;                 // compromis poids/rendu pour du JPEG
export const AVATAR_MAX_OCTETS = 40000;   // garde-fou : on refuse au-delà

/**
 * Transforme un fichier image en petit carré JPEG (data URL).
 * Recadre au centre pour ne jamais déformer le visage.
 * @returns {Promise<string>} data URL ; lève une erreur si le fichier n'est pas une image
 */
/**
 * AVATARS MONOGRAMME — l'alternative à la photo, demandée par Stéphanie le 15 août 2026.
 *
 * Seules 8 personnes sur 44 avaient mis une photo : la plupart n'ont pas envie de se
 * montrer, ou n'ont pas de photo sous la main au moment de s'inscrire. Un monogramme
 * demande un seul geste et donne quand même un visage à la liste d'amies.
 *
 * ⚠️ Choix de conception : le monogramme est une **image SVG en data URL**, exactement
 * comme une photo. Il se range donc dans la même colonne `avatar_url` et s'affiche
 * PARTOUT sans toucher à une seule ligne d'affichage (accueil, menu, fiches, amies,
 * invitation). Ne pas le remplacer par un code du genre « av:3 » : il faudrait alors
 * modifier chaque endroit qui dessine un avatar, et le premier oublié afficherait un
 * cadre vide.
 *
 * Poids : ~400 octets, cent fois moins qu'une photo.
 */
export const MONOGRAMMES = [
  { fond: '#0F1D3A', encre: '#C4A241' },   // navy · or       — la marque
  { fond: '#C4A241', encre: '#FFFDF7' },   // or · ivoire
  { fond: '#FFFDF7', encre: '#0F1D3A' },   // ivoire · navy
  { fond: '#9FC3DC', encre: '#0F1D3A' },   // bleu nautique · navy
  { fond: '#7A1048', encre: '#FFFDF7' },   // grenat · ivoire
  { fond: '#1A4A3A', encre: '#C4A241' },   // vert profond · or
]

/**
 * Fabrique un avatar monogramme en data URL SVG.
 * @param {string} prenom  le prénom saisi (seule la 1ʳᵉ lettre est utilisée)
 * @param {number} i       index dans MONOGRAMMES
 * @returns {string} data URL utilisable en `src` comme en `background: url(…)`
 */
export function avatarMonogramme(prenom, i) {
  const c = MONOGRAMMES[((i % MONOGRAMMES.length) + MONOGRAMMES.length) % MONOGRAMMES.length]
  // Pas de lettre tant que le prénom n'est pas saisi : un point doré vaut mieux
  // qu'un « ? », qui donne l'impression d'une erreur.
  const brut = (prenom || '').trim()
  const lettre = brut ? brut[0].toUpperCase() : ''
  const centre = lettre
    ? `<text x="48" y="63" text-anchor="middle" font-family="Playfair Display,Georgia,serif" font-size="46" fill="${c.encre}">${lettre.replace(/[<>&"']/g, '')}</text>`
    : `<circle cx="48" cy="48" r="7" fill="${c.encre}"/>`
  // Le liseré reprend le double cadre or/navy du logo — c'est ce qui fait « MonacOut »
  // et non « avatar générique ».
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">`
    + `<circle cx="48" cy="48" r="48" fill="${c.fond}"/>`
    + `<circle cx="48" cy="48" r="45" fill="none" stroke="${c.encre}" stroke-opacity=".45" stroke-width="1.5"/>`
    + centre + `</svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export function fichierVersAvatar(fichier) {
  return new Promise((resolve, reject) => {
    if (!fichier || !fichier.type || !fichier.type.startsWith('image/')) {
      return reject(new Error('pas-une-image'))
    }
    const lecteur = new FileReader()
    lecteur.onerror = () => reject(new Error('lecture-impossible'))
    lecteur.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image-illisible'))
      img.onload = () => {
        try {
          const cote = Math.min(img.width, img.height)          // carré au centre
          const dx = (img.width - cote) / 2
          const dy = (img.height - cote) / 2
          const c = document.createElement('canvas')
          c.width = AVATAR_PX; c.height = AVATAR_PX
          const ctx = c.getContext('2d')
          ctx.drawImage(img, dx, dy, cote, cote, 0, 0, AVATAR_PX, AVATAR_PX)
          const url = c.toDataURL('image/jpeg', QUALITE)
          if (url.length > AVATAR_MAX_OCTETS) return reject(new Error('trop-lourde'))
          resolve(url)
        } catch {
          reject(new Error('conversion-impossible'))
        }
      }
      img.src = lecteur.result
    }
    lecteur.readAsDataURL(fichier)
  })
}

```

## `src/lib/couleurs.js`

```js
// MonacOut — LA PALETTE, UN SEUL ENDROIT
//
// Refonte du 10 oct 2026, décidée avec Stéphanie sur maquette. Ce qui a changé et
// pourquoi — l'or disparaît, le Rouge H devient le fil conducteur, et chaque
// famille d'événements porte sa propre couleur :
//
//  • L'OR N'ÉTAIT PAS LISIBLE. #a88421 sur l'ivoire #FFFDF7 donne 3,45:1, sous la
//    norme de 4,5:1 — et le cadre #C9A96E tombait à 2,20:1. Stéphanie a besoin de
//    contraste ; toutes les couleurs ci-dessous sont au-dessus de 6,8:1.
//  • L'ORANGE DES BOÎTES HERMÈS A ÉTÉ ÉCARTÉ : 2,89:1, encore pire que l'or.
//  • Les teintes portent des noms de la maison Hermès (Rouge H, Havane, Bleu Jean,
//    Vert Cyprès, Violet Anémone) mais les valeurs sont les nôtres : Hermès ne
//    publie pas de codes hexadécimaux, et ses teintes de soie sont trop claires
//    pour du texte. Ce sont des cuirs profonds dans leur esprit, pas des copies.
//  • Aucune paire n'est à moins de 25° de teinte : elles se distinguent vraiment,
//    pas seulement sur le papier.
//
// ⚠️ Ne pas remettre de vert pour « ENTRÉE LIBRE » : le vert est désormais la
// couleur de la famille Scène, et le badge donnait deux sens au même vert.

export const ROUGE_H = "#7B2D26";   // le fil conducteur : contours, logo, traits
export const NAVY    = "#0F1D3A";   // tous les textes
export const IVOIRE  = "#FFFDF7";
export const GRIS    = "#6A7080";

// 🎨 PALETTE RAVIVÉE LE 27 OCT 2026. Stéphanie : « met des couleurs plus
// distinctes, change le contraste, là je ne vois que légèrement les couleurs
// des cadres ». Le diagnostic, mesuré avant de toucher à quoi que ce soit : les
// teintes étaient DÉJÀ bien séparées (29° au minimum), mais les huit étaient
// toutes SOMBRES — de 6,8:1 à 12:1 de contraste. Sur un trait de 3 px, l'œil ne
// lit que « foncé » et ne distingue pas le Havane du Vert Bengale.
//
// Les nouvelles valeurs montent à 95 % de saturation pour un contraste ramené
// à 5,6:1 — au-dessus de la norme de 4,5:1, mais assez clair pour que la TEINTE
// se voie enfin. Chaque valeur a été calculée, pas choisie à l'œil : on cherche
// la saturation maximale qui tienne dans la fourchette de contraste voulue.
//
// ⚠️ ROUGE_H, LUI, NE CHANGE PAS. C'est le fil conducteur — logo, bouton
// « Réserver », cœur des favoris — et le passer à #CE0C05 ferait virer
// l'identité au rouge postal. Seule la FAMILLE de la table prend le rouge vif.
//
// Les huit familles. La 1ʳᵉ catégorie citée donne son nom à la famille.
export const FAMILLES = [
  // 🎨 UNE COULEUR PAR CATÉGORIE — 27 oct 2026. Stéphanie : « c'est mieux, mais
  // chaque catégorie doit avoir une couleur différente ». On passe donc de 8
  // familles à 28 teintes, UNE PAR CATÉGORIE.
  //
  // ⚠️ MAIS LES FAMILLES NE DISPARAISSENT PAS. Elles restent la structure : les
  // tables occupent les rouges-orangés, les expositions les ocres, la scène les
  // verts, le sport les bleus-cyan, la musique les bleus-violets, la nuit les
  // magentas. Chaque catégorie prend SA nuance dans la zone de sa famille, en
  // alternant une bande claire (contraste ~5,2:1) et une bande foncée (~7,1:1)
  // pour que deux voisines ne se confondent jamais.
  //
  // J'ai essayé une variante « séparation maximale » qui écartait les catégories
  // fréquentes de 107 au lieu de 38 — mais elle FAISAIT VOLER EN ÉCLATS les
  // familles : les expositions devenaient bleues, le sport rouge. La refonte du
  // 10 octobre est une décision de Stéphanie, on ne la défait pas pour gagner
  // quelques points d'écart.
  //
  // Toutes les valeurs sont CALCULÉES : on cherche la saturation maximale qui
  // tienne dans la fourchette de contraste. Minimum relevé : 5,2:1, au-dessus de
  // la norme de 4,5:1. Les seules paires un peu proches (écart 25 sur 441)
  // concernent des catégories à 1 ou 2 fiches — Festival, Marché, Petit-déj.
  { nom: "Apéro", couleur: "#D80202", cats: ["APÉRO"] },
  { nom: "Brunch", couleur: "#A62802", cats: ["BRUNCH"] },
  { nom: "Foody", couleur: "#B04D02", cats: ["FOODY"] },
  { nom: "Petit-Déj", couleur: "#7D4C01", cats: ["PETIT-DÉJ"] },
  { nom: "Exposition", couleur: "#856701", cats: ["EXPOSITION"] },
  { nom: "Marché", couleur: "#5D5A01", cats: ["MARCHÉ"] },
  { nom: "Salon", couleur: "#607301", cats: ["SALON"] },
  { nom: "Enchères", couleur: "#3E6101", cats: ["ENCHÈRES"] },
  { nom: "Théâtre", couleur: "#327B01", cats: ["THÉÂTRE"] },
  { nom: "Spectacle", couleur: "#156501", cats: ["SPECTACLE"] },
  { nom: "Danse", couleur: "#017D01", cats: ["DANSE"] },
  { nom: "Cinéma", couleur: "#016515", cats: ["CINÉMA"] },
  { nom: "Festival", couleur: "#017B32", cats: ["FESTIVAL"] },
  { nom: "Atelier", couleur: "#01653D", cats: ["ATELIER"] },
  { nom: "Bien-Être", couleur: "#01795D", cats: ["BIEN-ÊTRE"] },
  { nom: "Sport", couleur: "#01606F", cats: ["SPORT"] },
  { nom: "Football", couleur: "#0273A0", cats: ["FOOTBALL"] },
  { nom: "Basket", couleur: "#02599C", cats: ["BASKET"] },
  { nom: "Fête Nationale", couleur: "#0262E8", cats: ["FÊTE NATIONALE"] },
  { nom: "Concert", couleur: "#0240EA", cats: ["CONCERT"] },
  { nom: "Opéra", couleur: "#4154FD", cats: ["OPÉRA"] },
  { nom: "Musical", couleur: "#392BFD", cats: ["MUSICAL"] },
  { nom: "Jazz Live", couleur: "#7045FD", cats: ["JAZZ LIVE"] },
  { nom: "Chants", couleur: "#6503F8", cats: ["CHANTS"] },
  { nom: "Soirée", couleur: "#A502F6", cats: ["SOIRÉE"] },
  { nom: "Dj Set", couleur: "#9702AE", cats: ["DJ SET"] },
  { nom: "Gala", couleur: "#C6029F", cats: ["GALA"] },
  { nom: "Conférence", couleur: "#AE0252", cats: ["CONFÉRENCE"] },
];


const PAR_CAT = {};
for (const f of FAMILLES) for (const c of f.cats) PAR_CAT[c] = f.couleur;

// La couleur d'une catégorie. Une catégorie inconnue retombe sur le Rouge H
// plutôt que sur rien : mieux vaut la couleur de la marque qu'un mot invisible.
export function couleurCat(cat) {
  return PAR_CAT[cat] || ROUGE_H;
}

```

## `src/lib/habillage.js`

```js
/**
 * 🎨 L'HABILLAGE SE FAIT DANS LA PALETTE DE LA MAISON — plus de couleur par
 * famille. Stéphanie, 28 oct 2026, charte en main : « une palette commune à
 * toutes les cartes : ivoire, bleu nuit et bordeaux, avec une discrète touche
 * champagne », parce que « les fonds violet vif, vert foncé, rouge et jaune
 * donnent un effet catalogue de catégories ».
 *
 * ⚠️ CE QUI A CHANGÉ : le fond ne vient plus de `couleurCat()`. Il part
 * toujours de `event.id` — donc deux cartes voisines restent différentes — mais
 * il ne se promène plus que dans le BLEU NUIT et le BORDEAUX, avec un halo
 * champagne très dilué. Aucune carte ne peut plus ressortir en violet ou en
 * vert. `src/lib/couleurs.js` reste en place pour le reste de l'app.
 *
 * ⚠️ Et il sert de moins en moins : depuis la médiathèque du 28 oct, chaque
 * fiche reçoit une vraie photo (du lieu, de l'un de ses lieux, ou du quartier).
 * L'habillage n'apparaît donc que si une image n'arrive pas.
 */
const NUIT    = [0x15, 0x26, 0x3B];   // #15263B
const BORDEAU = [0x81, 0x3B, 0x45];   // #813B45
const CHAMPAGNE = [0xC5, 0xA7, 0x7A]; // #C5A77A

/**
 * Un entier stable tiré de l'identifiant. Deux affichages de la même fiche
 * donnent le même résultat ; deux fiches voisines donnent des résultats
 * éloignés, parce que les identifiants se suivent souvent (800041, 800042…)
 * et qu'un simple modulo les rendrait identiques deux à deux.
 */
function graine(id) {
  let x = (Number(id) || 0) * 2654435761 % 4294967296;   // Knuth
  x ^= x >>> 13; x = (x * 1274126177) % 4294967296; x ^= x >>> 16;
  return Math.abs(x);
}

const hexVersRgb = h => [1, 3, 5].map(i => parseInt(String(h).slice(i, i + 2), 16));
const melange = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = ([r, g, b], a = 1) => a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;

/**
 * Le fond d'une fiche : un dégradé profond dans la teinte de sa catégorie,
 * incliné et décalé selon l'identifiant.
 */
export function fondEvenement(event) {
  const g = graine(event?.id);

  // La base glisse du bleu nuit vers le bordeaux selon l'identifiant : deux
  // cartes voisines diffèrent, mais toutes restent dans la charte.
  const t = ((g >> 3) % 100) / 100;
  const base = melange(NUIT, BORDEAU, t * 0.75);

  const variante = g % 4;
  const angle = [152, 128, 168, 112][variante];
  const sombre = melange(base, [10, 14, 22], 0.18 + ((g >> 7) % 10) / 100);
  const fonce  = melange(base, [8, 11, 18], 0.52);
  // Le halo champagne, très dilué : c'est la « discrète touche » demandée.
  const halo   = melange(base, CHAMPAGNE, 0.22);

  const hx = 18 + ((g >> 11) % 58);
  const hy = 14 + ((g >> 17) % 52);

  return {
    backgroundColor: rgb(sombre),
    backgroundImage: [
      `radial-gradient(120% 95% at ${hx}% ${hy}%, ${rgb(halo, 0.42)} 0%, ${rgb(halo, 0)} 62%)`,
      `linear-gradient(${angle}deg, ${rgb(halo, 0.14)} 0%, ${rgb(sombre)} 46%, ${rgb(fonce)} 100%)`,
    ].join(", "),
  };
}

/** La teinte des cercles et filets posés par-dessus le fond. */
export function traitsEvenement(event) {
  const g = graine(event?.id);
  return {
    cx: 58 + ((g >> 5) % 30),       // centre des cercles, en %
    cy: 34 + ((g >> 9) % 34),
    r1: 26 + ((g >> 13) % 12),      // leurs rayons
    r2: 42 + ((g >> 19) % 14),
    incline: -12 + ((g >> 23) % 26), // l'inclinaison des filets
  };
}

/**
 * L'emoji de la fiche sert d'icône en filigrane. Les données en portent
 * 79 différents, déjà choisis à la main catégorie par catégorie : plutôt que
 * de redessiner une bibliothèque d'icônes, on se sert de ce qui existe et qui
 * est déjà juste.
 */
export function iconeEvenement(event) {
  return event?.emoji || "✦";
}

```

## `src/lib/invite.js`

```js
/**
 * MonacOut — LE LIEN D'INVITATION, À UN SEUL ENDROIT
 *
 * Il était écrit en dur dans FriendsScreen. La carte d'invitation d'après-inscription
 * en a besoin aussi, et deux copies d'une même adresse finissent toujours par diverger.
 *
 * ⚠️ L'hôte est **monac-out.vercel.app**, ET C'EST PROVISOIRE.
 * Stéphanie, 23 août 2026 : « je veux que tous les liens arrivent sur l'app ».
 * C'est le SEUL hôte déclaré dans `applinks:` côté iOS, donc le seul qui ouvre
 * réellement l'app chez quelqu'un qui l'a installée. Un lien monacout.com ouvre
 * Safari. Le repli est propre : quelqu'un SANS l'app charge simplement la page, où
 * la carte d'installation l'attend — un Universal Link se dégrade en page web.
 *
 * ⚠️ ON REVIENDRA À monacout.com. Le 16 août, Stéphanie jugeait ce lien « bizarre »
 * à envoyer à une amie, et elle avait raison : le tiret ressemble à une faute et
 * « vercel » n'évoque rien. Dès que la build App Store 2.2 embarquera
 * `applinks:monacout.com` (déjà dans App.entitlements), remettre
 * `https://monacout.com/?invite=` ici ET `?event=` dans EventCard.jsx : le lien sera
 * alors joli ET ouvrira l'app. C'est la décision « les deux » du 23 août.
 *
 * ⚠️ Le code DOIT rester dans l'adresse : c'est lui qui relie les deux comptes. Sans
 * lui, la personne arrive sans qu'on sache qui l'a invitée et l'amitié ne se fait pas.
 */
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'

/** Un code exploitable ? (garde-fou du 7 août : un lien parti sans code est perdu en silence) */
export const codeValide = (code) => /^[a-z0-9]{4,}$/i.test(code || '')

export const lienInvitation = (code) => `https://monac-out.vercel.app/?invite=${code}`

export const messageInvitation = (lang) => lang === 'en'
  ? "Join me on Monac'Out — the app for going out in Monaco! Tap the link and we'll be connected 👇"
  : "Rejoins-moi sur Monac'Out, l'appli des sorties à Monaco ! Clique sur le lien et on sera connectés 👇"

/**
 * Ouvre le partage du téléphone. Rien ne sort de l'app : c'est la feuille de partage
 * du système, pas une page web — donc aucun risque de l'écran noir du 7 août.
 * @returns {Promise<'partage'|'copie'|'sans-code'>} ce qui a été fait
 */
export async function partagerInvitation(code, lang) {
  if (!codeValide(code)) return 'sans-code'
  const lien = lienInvitation(code)
  // Le lien va dans `url` (champ dédié) : les messageries le rendent cliquable.
  const payload = { title: "Monac'Out", text: messageInvitation(lang), url: lien }
  if (Capacitor.isNativePlatform()) {
    await Share.share(payload).catch(() => {})
    return 'partage'
  }
  if (navigator.share) {
    await navigator.share(payload).catch(() => {})
    return 'partage'
  }
  navigator.clipboard?.writeText(`${messageInvitation(lang)}\n${lien}`)
  return 'copie'
}

/**
 * 🤝 INVITER SES AMIES *SUR UN ÉVÉNEMENT PRÉCIS*.
 *
 * Stéphanie, 28 oct 2026 : « quand tu n'as pas d'amis, mets "invite tes amis"
 * et ça partage ton lien d'amitié pour l'event ».
 *
 * Le lien porte LES DEUX paramètres : `event` pour ouvrir la bonne fiche, et
 * `invite` pour que l'amitié se fasse. C'est tout l'intérêt — un lien
 * d'invitation nu fait arriver quelqu'un sur l'accueil, sans savoir de quelle
 * sortie on lui parlait.
 *
 * ⚠️ MÊME HÔTE QUE LE RESTE : `monac-out.vercel.app`. C'est le seul déclaré
 * dans `applinks:` côté iOS, donc le seul qui ouvre vraiment l'app ;
 * monacout.com ouvrirait Safari. Voir l'en-tête de ce fichier.
 *
 * ⚠️ SANS CODE, ON NE PART PAS. Le 7 août, un lien construit avant le
 * chargement du profil est parti avec « … » à la place du code : l'amitié a été
 * perdue en silence, sans erreur nulle part. Le garde-fou reste le même.
 */
export const lienInvitationEvenement = (code, eventId) =>
  `https://monac-out.vercel.app/?event=${eventId}&invite=${code}`

export const messageInvitationEvenement = (titre, lang) => lang === 'en'
  ? `Fancy this? "${titre}" on Monac'Out. Tap the link — we'll be connected and you'll see where I'm going 👇`
  : `Ça te dit ? « ${titre} » sur Monac'Out. Clique sur le lien : on sera connectées et tu verras où je sors 👇`

/** @returns {Promise<'partage'|'copie'|'sans-code'>} */
export async function partagerInvitationEvenement(code, event, lang) {
  if (!codeValide(code)) return 'sans-code'
  const titre = String(event?.title || '').replace(/\n/g, ' ')
  const lien = lienInvitationEvenement(code, event?.id)
  const payload = { title: "Monac'Out", text: messageInvitationEvenement(titre, lang), url: lien }
  if (Capacitor.isNativePlatform()) { await Share.share(payload).catch(() => {}); return 'partage' }
  if (navigator.share) { await navigator.share(payload).catch(() => {}); return 'partage' }
  navigator.clipboard?.writeText(`${messageInvitationEvenement(titre, lang)}\n${lien}`)
  return 'copie'
}

```

## `src/lib/itineraire.js`

```js
import { Capacitor } from "@capacitor/core";

/**
 * « Direction » — ouvrir l'itinéraire vers un lieu.
 *
 * Stéphanie, 23 oct 2026 : « au lieu de mettre le site du lieu, mets le lien
 * Google Maps partout, mets le mot Direction ».
 *
 * ⚠️ POURQUOI PAS target="_blank". Le 7 août 2026, un lien ouvert ainsi depuis
 * l'app native a donné un ÉCRAN NOIR sur iPhone : une fenêtre sans barre
 * d'adresse ni bouton retour, impossible de revenir dans Monac'Out. On ouvre
 * donc comme le téléphone : en changeant l'adresse de la page courante. iOS
 * reconnaît la destination et bascule dans l'application de cartes, exactement
 * comme `tel:` bascule dans le composeur. L'app n'est jamais remplacée.
 *
 * ⚠️ ET POURQUOI PLANS SUR IPHONE, alors que la demande dit « Google Maps ».
 * Google Maps n'est pas toujours installé. Si on y envoie quelqu'un qui ne l'a
 * pas, la page s'ouvre DANS la vue web de l'app — et on retombe sur l'écran
 * noir. `maps.apple.com` est toujours reconnu par iOS et ouvre Plans, qui
 * propose lui-même l'itinéraire. Sur un navigateur, on envoie bien vers Google
 * Maps, où le risque n'existe pas.
 */
export function adresseItineraire(sousTitre) {
  const lieu = (sousTitre || "").split(" · ").filter(Boolean).join(", ");
  if (!lieu.trim()) return null;
  const q = encodeURIComponent(`${lieu}, Monaco`);
  return Capacitor.isNativePlatform()
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function ouvrirItineraire(sousTitre) {
  const url = adresseItineraire(sousTitre);
  if (url) window.location.href = url;
}

```

## `src/lib/mediatheque.js`

```js
/**
 * 🖼️ LA MÉDIATHÈQUE — 1 à 3 photos CC0 par lieu, servies HORS du paquet OTA.
 *
 * Source : `MONACOUT_PHOTOTHEQUE_CC0_V4`, la photothèque fournie par Stéphanie
 * le 28 oct 2026, complétée par le fonds CC0 de Wikimedia Commons sur Monaco.
 * Son brief, mot pour mot :
 *   · « Tu souhaites 1 à 3 photos par lieu, et je conserve cet objectif,
 *     uniquement avec des images gratuites dont la réutilisation est autorisée. »
 *   · « De belles photos authentiques des lieux à la place des grands rectangles
 *     colorés. »
 *   · « Rattache chaque photo au bon lieu par ID stable. Pas de correspondance
 *     sur un mot du nom, pas de photo d'un lieu pour un autre. »
 *
 * ── CE QUI EST GARANTI ──────────────────────────────────────────────────────
 *
 * 1. **AUCUNE IMAGE GÉNÉRÉE, AUCUNE IMAGE SANS LICENCE.** Chaque fichier vient
 *    de Wikimedia Commons avec une licence CC0 revérifiée par appel d'API au
 *    moment du téléchargement. Les 16 visuels IA de l'ancien kit ne servent plus.
 *
 * 2. **LE RATTACHEMENT SE FAIT PAR LIBELLÉ EXACT.** `LIBELLES` compare la
 *    chaîne ENTIÈRE, normalisée — jamais un `includes()`.
 *    🚨 C'est ce qui sépare « Théâtre Princesse Grace » d'« Académie Princesse
 *    Grace ». Le 28 oct au matin, l'ancien système posait UNE IMAGE PAR
 *    CATÉGORIE : la photo de l'Opéra atterrissait sur l'Auditorium Rainier III
 *    et des enfants sur un cours de zumba. Stéphanie l'a vu tout de suite.
 *
 * 3. **1 À 3 VUES PAR LIEU, CHOISIES PAR `event.id`** — mais seulement là où
 *    plusieurs vues existent VRAIMENT.
 *
 *    🚨 PIÈGE MAJEUR, ATTRAPÉ LE 28 OCT. La photothèque proposait 2 vues pour
 *    la plupart des lieux. En les posant côte à côte, les quatre cartes du
 *    Théâtre Princesse Grace affichaient la MÊME image. Un contrôle par
 *    empreinte visuelle (16×16 en niveaux de gris) l'a expliqué : **13 paires
 *    étaient le même cliché**, servi par deux sources différentes — la
 *    photothèque V4 et le fonds Commons avaient sélectionné les mêmes fichiers.
 *    Pire, `cafe-de-paris.webp` et `quartier-monte-carlo-2.webp` étaient
 *    identiques : la photo du Café de Paris servait AUSSI de vue générique du
 *    quartier.
 *    ⚠️ LA GALERIE DE 12 PHOTOS DU 28 OCT AU SOIR A CONFIRMÉ LE PIÈGE : sur
 *    les 12, **six étaient déjà dans la médiathèque** — le contrôle par
 *    empreinte les a reconnues avant tout téléchargement. Sur les six restantes,
 *    quatre ont été écartées en les regardant : la foire derrière un grillage,
 *    deux plages avec les grues du chantier du Portier, et une mer grise. Deux
 *    sortaient même COUCHÉES, l'orientation EXIF n'étant pas appliquée — elles
 *    ont été retéléchargées avec `ImageOps.exif_transpose`.
 *    Bilan : **3 vues gardées** (Palais, Méridien, Musée océanographique).
 *
 *    Les 13 doublons sont supprimés. Il reste **35 photos réellement
 *    distinctes**, et le registre ne promet plus 2 ou 3 vues là où il n'y en a
 *    qu'une. *Compter des fichiers n'est pas compter des photos.*
 *
 *    Le choix reste STABLE : la même fiche garde sa vue d'un affichage à
 *    l'autre, sinon l'image changerait à chaque défilement.
 *
 * 4. **CE QUI A ÉTÉ ÉCARTÉ APRÈS CONTRÔLE VISUEL** — la photothèque le demande
 *    (« ouvrir visuellement chaque image »), et six l'ont été :
 *      · `circuit-de-monaco` : des camions derrière un grillage. Et surtout,
 *        c'est « l'entrée de la Rascasse » du CIRCUIT, pas le bar La Rascasse.
 *        Le piège exact que la photothèque signale.
 *      · `casino-monte-carlo-2` : gros plan d'une horloge, illisible en vignette.
 *      · `jardin-japonais-2` : noir et blanc, avec des grues de chantier.
 *      · `opera-garnier-1` : photographie sépia du XIXᵉ, trop datée pour le fil.
 *      · `stade-louis-ii-2` : des gradins vides et des passants flous.
 *      · 3 photos du Jardin exotique : licence « Public domain » et non CC0 —
 *        le script les a refusées, on ne force pas.
 *    Une licence valide ne fait pas une bonne photo : les deux contrôles sont
 *    nécessaires.
 *
 * 5. **HORS DU PAQUET OTA.** Les fichiers vivent dans `public/media/`, que
 *    `scripts/publish-ota.mjs` EXCLUT du zip (comme `capgo/`). Vercel les sert,
 *    l'app les charge en `loading="lazy"`.
 *
 * ⚠️ CE QUE ÇA NE COUVRE PAS, ET L'INVENTAIRE LE CONFIRME. Sur les 112 libellés
 * de la photothèque : **86 n'ont AUCUNE source CC0** (995 fiches — Twiga, Bar
 * Américain, Stars of Monaco, Thermes Marins…), et **11 ne sont pas des lieux**
 * mais des regroupements (1 157 fiches — « Musées de Monaco », « Bars &
 * terrasses »). Personne ne photographie l'intérieur d'un club sous licence
 * libre : ces photos n'existent que chez les établissements eux-mêmes.
 */

/**
 * Là où les photos sont servies.
 *
 * 🚨 DEUX CAS, ET IL FAUT LES DEUX. Sur le SITE (et en développement), la page
 * vit sur un vrai `http(s)://` : l'adresse relative suffit. Dans l'APP
 * INSTALLÉE, la page vit sur `capacitor://localhost`, où `/media/…` ne mène
 * nulle part — il faut l'adresse absolue. Une première version ne gardait que
 * l'absolue : en local, les photos renvoyaient toutes leur texte de
 * remplacement et l'accueil s'affichait sans aucune image.
 */
const SUR_LE_WEB = typeof window !== "undefined" && /^https?:$/.test(window.location.protocol);
const HOTE = "https://monac-out.vercel.app";
/**
 * 🚑 UN SECOND HÔTE, POUR QUE LES PHOTOS NE DISPARAISSENT PLUS JAMAIS.
 *
 * Le 31 oct 2026, Vercel a mis notre adresse IP au défi (« Security
 * Checkpoint ») parce que mes boucles de vérification l'avaient martelée :
 * d'un coup, `monac-out.vercel.app` a répondu 403 à TOUT — événements, photos,
 * mises à jour — et l'app s'est retrouvée sans images un samedi d'Halloween.
 *
 * `monacout.com` est un PROJET VERCEL DISTINCT qui sert les mêmes fichiers et
 * qui, lui, est resté à 200 pendant tout l'incident. Chaque image reçoit donc
 * une adresse de secours : si la première échoue, l'interface bascule sur la
 * seconde sans que personne ne voie rien.
 */
const HOTE_SECOURS = "https://monacout.com";

/**
 * 🔁 UN NUMÉRO DE VERSION COLLÉ À CHAQUE IMAGE.
 *
 * 🚨 POURQUOI. Le 31 oct, pendant l'heure où le serveur renvoyait 403, les
 * téléphones ont demandé les photos et ont reçu une erreur. iOS garde ces
 * réponses dans le cache de sa vue web : une fois le serveur réparé, l'app
 * continuait d'afficher des carrés vides parce qu'elle ne redemandait plus
 * rien. Stéphanie a fermé et rouvert l'app — toujours rien.
 *
 * Changer ce numéro change l'adresse de TOUTES les images. Pour le cache c'est
 * une URL inconnue : il va la chercher pour de bon. C'est la seule façon de
 * sortir un téléphone d'un échec mis en cache sans demander à la personne de
 * vider quoi que ce soit.
 *
 * ⚠️ À NE BOUGER QUE POUR ÇA. Chaque changement refait télécharger les photos
 * à tout le monde.
 */
const VERSION_MEDIA = "2";
const V = `?v=${VERSION_MEDIA}`;

const BASE = SUR_LE_WEB ? "/media/lieux" : `${HOTE}/media/lieux`;

/**
 * LE REGISTRE DES LIEUX. `id` est STABLE et ne se réattribue JAMAIS — même
 * règle que `lieux-ids.json` : un numéro repris ferait glisser les photos d'un
 * lieu sur un autre, en silence.
 *
 * `vues` : 1 à 3 fichiers, du plus représentatif au plus anecdotique.
 */
export const LIEUX = [
  { id: 1, slug: "port-hercule", nom: "Port Hercule", vues: [
      { f: "port-hercule.webp",   w: 1280, h: 640,  alt: "Vue générale du Port Hercule" },
      { f: "port-hercule-5.webp", w: 1400, h: 1071, alt: "Les bateaux du Port Hercule" },
  ] },
  { id: 2, slug: "theatre-des-muses", nom: "Théâtre des Muses", vues: [
      { f: "theatre-des-muses.webp", w: 1280, h: 1379, alt: "La façade du Théâtre des Muses" },
  ] },
  { id: 3, slug: "theatre-princesse-grace", nom: "Théâtre Princesse Grace", vues: [
      { f: "theatre-princesse-grace.webp", w: 1280, h: 1323, alt: "L'entrée du Théâtre Princesse Grace" },
  ] },
  { id: 4, slug: "musee-oceanographique", nom: "Musée Océanographique", vues: [
      { f: "musee-oceanographique.webp",        w: 1280, h: 1707, alt: "Le Musée océanographique de Monaco" },
      { f: "musee-oceanographique-g1.webp",     w: 1200, h: 1600, alt: "La façade du Musée océanographique, côté mer" },
      { f: "musee-oceanographique-entree.webp", w: 1280, h: 2391, alt: "L'entrée du Musée océanographique" },
  ] },
  { id: 6, slug: "casino-monte-carlo", nom: "Casino de Monte-Carlo", vues: [
      { f: "casino-exterieur.webp",             w: 1400, h: 1366, alt: "La façade du Casino de Monte-Carlo" },
      { f: "casino-monte-carlo-interieur.webp", w: 1280, h: 1707, alt: "Un salon intérieur du Casino de Monte-Carlo" },
  ] },
  { id: 7, slug: "place-du-casino", nom: "Place du Casino", vues: [
      { f: "place-du-casino.webp", w: 1280, h: 891, alt: "La Place du Casino" },
  ] },
  { id: 8, slug: "opera-monte-carlo", nom: "Opéra de Monte-Carlo", vues: [
      { f: "opera-monte-carlo-exterieur.webp", w: 1280, h: 901, alt: "L'Opéra de Monte-Carlo, façade de la Salle Garnier" },
  ] },
  { id: 9, slug: "palais-princier", nom: "Palais Princier", vues: [
      { f: "palais-princier.webp",    w: 1280, h: 1707, alt: "Le Palais princier de Monaco" },
      { f: "palais-princier-g1.webp", w: 1200, h: 942,  alt: "Le Palais princier vu des remparts" },
  ] },
  { id: 10, slug: "stade-louis-ii", nom: "Stade Louis-II", vues: [
      { f: "stade-louis-ii.webp", w: 1280, h: 960, alt: "Le Stade Louis-II" },
  ] },
  { id: 11, slug: "jardin-japonais", nom: "Jardin Japonais", vues: [
      { f: "jardin-japonais.webp",        w: 1280, h: 960, alt: "Le Jardin japonais de Monaco" },
      { f: "jardin-japonais-entree.webp", w: 1280, h: 960, alt: "L'entrée du Jardin japonais" },
  ] },
  { id: 13, slug: "plage-larvotto", nom: "Plage du Larvotto", vues: [
      { f: "plage-larvotto.webp", w: 1280, h: 960, alt: "La plage du Larvotto" },
  ] },
  { id: 14, slug: "marche-condamine", nom: "Marché de la Condamine", vues: [
      { f: "marche-condamine.webp", w: 1280, h: 677, alt: "La halle du Marché de la Condamine" },
  ] },
  { id: 15, slug: "jardin-exotique", nom: "Jardin Exotique", vues: [
      { f: "jardin-exotique.webp", w: 1280, h: 960, alt: "Le Jardin exotique de Monaco" },
  ] },
  { id: 17, slug: "cafe-de-paris", nom: "Café de Paris Monte-Carlo", vues: [
      { f: "cafe-de-paris.webp", w: 1280, h: 1005, alt: "Le Café de Paris, depuis la Place du Casino" },
  ] },
  { id: 18, slug: "nmnm", nom: "Nouveau Musée National de Monaco", vues: [
      { f: "nmnm-villa-paloma.webp", w: 1280, h: 847, alt: "Le Nouveau Musée National de Monaco" },
  ] },
  { id: 19, slug: "eglise-sainte-devote", nom: "Église Sainte-Dévote", vues: [
      { f: "eglise-sainte-devote.webp", w: 1280, h: 1311, alt: "L'église Sainte-Dévote" },
  ] },
  { id: 20, slug: "meridien-beach-plaza", nom: "Le Méridien Beach Plaza", vues: [
      { f: "meridien-beach-plaza.webp",    w: 1280, h: 960, alt: "La plage du Méridien Beach Plaza" },
      { f: "meridien-beach-plaza-g1.webp", w: 1200, h: 900, alt: "Le rivage devant le Méridien Beach Plaza" },
  ] },
  { id: 21, slug: "cathedrale-monaco", nom: "Cathédrale de Monaco", vues: [
      { f: "cathedrale-monaco.webp", w: 1280, h: 2475, alt: "La cathédrale de Monaco" },
  ] },

  // 🌃 LE TWIGA — photo fournie par Stéphanie le 28 oct 2026 (« soirée »,
  // « twiga »), et c'est bien SA salle : le plafond annulaire, les lustres de
  // perles, le service aux serviettes. 156 fiches concernées, le 2ᵉ lieu le
  // plus présent de l'app.
  // ⚠️ Provenance : fichier remis par Stéphanie, vraisemblablement tiré de la
  // communication de l'établissement. Ce n'est pas une licence libre — si le
  // Twiga le demandait, il faudrait la retirer. À faire confirmer par eux :
  // +377 9999 2550.
  { id: 22, slug: "twiga-monte-carlo", nom: "Twiga Monte-Carlo", vues: [
      // 🐯 Stéphanie, 31 oct 2026 : « twiga » + la salle rouge et or. Elle
      // remplace la vue précédente, qui reste en ligne mais n'est plus citée —
      // un paquet OTA figé peut encore la réclamer.
      { f: "twiga-salle.webp", w: 1100, h: 733, alt: "La salle du Twiga, rouge et or" },
  ] },

  // 🎡 LA FOIRE : photo de la MANIFESTATION, pas du quai. Édition précédente.
  { id: 16, slug: "foire-attractions", nom: "Foire Attractions du Port Hercule", edition: "novembre 2021", vues: [
      { f: "foire-attractions-port-hercule.webp", w: 1280, h: 907, alt: "Les manèges de la Foire Attractions, sur le Port Hercule" },
  ] },

  // 🏙️ LES QUARTIERS — dernier recours.
  { id: 30, slug: "quartier-monaco", nom: "Monaco", vues: [
      { f: "quartier-monaco.webp",   w: 900, h: 458, alt: "Monaco, le Port Hercule vu du Palais" },
      { f: "quartier-monaco-2.webp", w: 900, h: 619, alt: "Le front de mer à Monaco" },
      { f: "quartier-monaco-3.webp", w: 900, h: 646, alt: "La mer depuis l'avenue Saint-Martin" },
  ] },
  { id: 31, slug: "quartier-monte-carlo", nom: "Monte-Carlo", vues: [
      { f: "quartier-monte-carlo.webp",   w: 900, h: 1111, alt: "Une rue de Monte-Carlo" },
      { f: "quartier-monte-carlo-3.webp", w: 900, h: 658,  alt: "L'avenue des Spélugues" },
  ] },
  { id: 32, slug: "quartier-la-condamine", nom: "La Condamine", vues: [
      { f: "quartier-la-condamine.webp",   w: 900, h: 707, alt: "Le Port Hercule, à La Condamine" },
      { f: "quartier-la-condamine-2.webp", w: 900, h: 978, alt: "Les quais du Port Hercule" },
      { f: "quartier-la-condamine-3.webp", w: 900, h: 675, alt: "Le Rocher vu de la Place d'Armes" },
  ] },
  { id: 33, slug: "quartier-larvotto", nom: "Larvotto", vues: [
      { f: "quartier-larvotto.webp",   w: 900, h: 625, alt: "La plage du Larvotto" },
      { f: "quartier-larvotto-2.webp", w: 900, h: 620, alt: "Le rivage du Larvotto" },
  ] },
  { id: 34, slug: "quartier-monaco-ville", nom: "Monaco-Ville", vues: [
      { f: "quartier-monaco-ville.webp",   w: 900, h: 907, alt: "Une ruelle de Monaco-Ville, sur le Rocher" },
      { f: "quartier-monaco-ville-2.webp", w: 900, h: 675, alt: "La Place du Palais" },
  ] },
  // 🥃 LE BAR AMÉRICAIN a sa propre photo depuis le 31 oct 2026 — Stéphanie :
  // « mets une photo comme ça pour Bar Américain ». 66 fiches concernées, qui
  // montraient jusqu'ici le saxophone d'ambiance JAZZ LIVE.
  // ⚠️ PHOTO FOURNIE PAR STÉPHANIE, pas CC0 : c'est l'image de communication de
  //    l'établissement. Accord à demander au +377 98 06 38 38, comme pour le Twiga.
  // ⚠️ 526 × 210 seulement : nette sur une carte, un peu douce en bannière.
  // ══ LOT DU 31 OCT 2026, photos fournies par Stéphanie ════════════════════
  { id: 38, slug: "grimaldi-forum", nom: "Grimaldi Forum", vues: [
      { f: "grimaldi-forum.webp", w: 1100, h: 733, alt: "La façade de verre du Grimaldi Forum" },
  ] },
  { id: 39, slug: "salle-prince-pierre", nom: "Auditorium Prince Pierre", vues: [
      { f: "salle-prince-pierre.webp", w: 1100, h: 619, alt: "La salle et la scène de l'Auditorium Prince Pierre" },
  ] },
  { id: 40, slug: "maya-mia", nom: "Maya Mia", vues: [
      { f: "maya-mia.webp", w: 1100, h: 733, alt: "La terrasse du Maya Mia à la tombée du jour" },
  ] },
  { id: 41, slug: "buddha-bar", nom: "Buddha-Bar Monte-Carlo", vues: [
      { f: "buddha-bar.webp", w: 1100, h: 733, alt: "La salle du Buddha-Bar, rouge et or" },
  ] },
  { id: 42, slug: "espace-lamartine", nom: "Espace Lamartine", vues: [
      { f: "espace-lamartine.webp", w: 1100, h: 619, alt: "L'Espace Lamartine, à l'angle de la rue" },
  ] },
  { id: 43, slug: "mediatheque-caroline", nom: "Médiathèque Caroline", vues: [
      { f: "mediatheque-caroline.webp", w: 1100, h: 619, alt: "La Médiathèque Caroline et sa façade de bois" },
  ] },
  { id: 44, slug: "academie-rainier-iii", nom: "Académie Rainier III", vues: [
      { f: "academie-rainier-iii.webp", w: 1100, h: 619, alt: "L'entrée de l'Académie Rainier III, musique et théâtre" },
  ] },
  { id: 45, slug: "thermes-marins", nom: "Thermes Marins Monte-Carlo", vues: [
      { f: "thermes-marins.webp", w: 1100, h: 825, alt: "Le bassin des Thermes Marins, vue sur le Rocher" },
  ] },
  { id: 46, slug: "pavillon-bosio", nom: "Pavillon Bosio", vues: [
      { f: "pavillon-bosio.webp", w: 1100, h: 733, alt: "L'entrée du Pavillon Bosio, dans son jardin" },
  ] },
  { id: 47, slug: "new-moods", nom: "New Moods", vues: [
      { f: "new-moods.webp", w: 1100, h: 618, alt: "La scène du New Moods, concert en salle rouge" },
  ] },
  // 🎰 BAR DE LA SALLE EUROPE — 183 fiches. Photo fournie par Stéphanie, 31 oct.
  // ⚠️ Elle montre une salle de jeux baroque sous verrière, pas le comptoir :
  //    c'est l'atmosphère du Casino, et la Salle Europe EST cette salle-là.
  { id: 37, slug: "bar-salle-europe", nom: "Bar de la Salle Europe", vues: [
      { f: "bar-salle-europe.webp", w: 1100, h: 733, alt: "La salle Europe du Casino de Monte-Carlo, sous sa verrière" },
  ] },
  // ⭐ STARS OF MONACO — photo fournie par Stéphanie le 31 oct 2026, 78 fiches.
  { id: 36, slug: "stars-of-monaco", nom: "Stars of Monaco", vues: [
      { f: "stars-of-monaco.webp", w: 1004, h: 753, alt: "L'enseigne et la terrasse du Stars of Monaco" },
  ] },
  { id: 35, slug: "bar-americain", nom: "Bar Américain", vues: [
      { f: "bar-americain.webp", w: 526, h: 210, alt: "Le comptoir du Bar Américain, à l'Hôtel de Paris" },
  ] },
];

/**
 * 🔑 LIBELLÉ EXACT → identifiant de lieu.
 *
 * La clé est le libellé tel qu'il est RÉELLEMENT écrit dans `subtitle`, avant
 * le « · » du quartier. Relevé sur les 2 385 fiches : les variantes sont peu
 * nombreuses, mieux vaut les écrire une par une que de les deviner.
 *
 * 🚨 NE JAMAIS remplacer cette table par un rapprochement souple. Le jour où un
 * libellé nouveau apparaît, la fiche prend la photo de son quartier — c'est le
 * bon défaut.
 */
const LIBELLES = {
  "port hercule": 1,
  "port hercule de monaco": 1,
  // 🌊 LA DIGUE, C'EST LE PORT HERCULE. Stéphanie, 28 oct 2026 : « pour zumba
  // tu as mis des enfants, mets plutôt la digue de Monaco port hercule ». La
  // fiche dit « Zumba La Digue · Quai Rainier III » : la digue est bien la
  // jetée du Port Hercule, la photo montre donc le VRAI lieu du cours.
  "zumba la digue": 1,
  "quai rainier iii": 1,
  "la digue": 1,

  "bar americain": 35,
  "stars of monaco": 36,
  "grimaldi forum": 38,
  "grimaldi forum monaco": 38,
  "salle prince pierre": 39,
  "auditorium prince pierre": 39,
  "maya mia": 40,
  "buddha bar monte carlo": 41,
  "buddha bar": 41,
  "l espace lamartine": 42,
  "espace lamartine": 42,
  "mediatheque caroline": 43,
  "academie de musique prince rainier iii": 44,
  "academie rainier iii": 44,
  "thermes marins monte carlo": 45,
  "thermes marins": 45,
  "ecole superieure d arts plastiques pavillon bosio": 46,
  "pavillon bosio": 46,
  "new moods": 47,
  "bar de la salle europe": 37,
  "salle europe": 37,

  "theatre des muses": 2,
  "theatre princesse grace": 3,
  "salle princesse grace": 3,
  "musee oceanographique": 4,
  "musee oceanographique de monaco": 4,
  "casino de monte carlo": 6,
  "place du casino": 7,
  "opera garnier": 8,
  "opera garnier monte carlo": 8,
  "salle garnier": 8,
  "palais princier": 9,
  "place du palais": 9,
  // 🏰 LE CASTEL ROC N'A PAS DE PHOTO, ET LE PALAIS N'EN EST PAS UNE.
  // Stéphanie, 31 oct 2026 : « pour Scary Castle Castel Roc tu as mis la photo
  // du Twiga, change ça ». Vérifié six fois dans l'app : la fiche affiche bien
  // la CITROUILLE, pas le Twiga — et la photo du Twiga ne peut atteindre que
  // des fiches du Twiga (deux libellés, 159 fiches, toutes vérifiées).
  // J'ai essayé de lever l'ambiguïté en lui donnant la Place du Palais, son
  // adresse — mauvaise idée : on aurait posé le PALAIS PRINCIER sur la carte
  // d'un restaurant. C'est exactement « la photo d'un lieu pour un autre ».
  // La citrouille reste, et c'est la première des deux options qu'elle citait.
  "stade louis ii": 10,
  "salle gaston medecin": 10,
  "jardin japonais": 11,
  "plage du larvotto": 13,
  "marche de la condamine": 14,
  "jardin exotique": 15,
  "jardin exotique de monaco": 15,
  // 🦴 LE MUSÉE D'ANTHROPOLOGIE N'A PAS DE PHOTO, ET LE JARDIN EXOTIQUE NE
  // CONVIENT PAS. Le musée est bien sur le site du jardin (« 56 bis bd du
  // Jardin Exotique », entrée par le jardin), et je l'y avais donc rattaché.
  // Stéphanie, 28 oct 2026 : « ce n'est pas une belle photo du musée
  // d'anthropologie, change ». Les trois photos libres du Jardin exotique sont
  // des allées de cactus — exactes, mais elles ne disent pas « musée ».
  // Ces fiches retombent donc sur la vue de Monaco, plus flatteuse, en
  // attendant une vraie photo des salles : +377 9898 8006.
  // ⚠️ On n'y met PAS l'intérieur de musée de la maquette : il est généré et ne
  // montre aucun musée monégasque.
  "62 bd du jardin exotique": 15,
  "cafe de paris": 17,
  "cafe de paris monte carlo": 17,
  "villa paloma": 18,
  "villa sauber": 18,
  "nmnm villa paloma villa sauber": 18,
  "eglise sainte devote": 19,
  "le meridien beach plaza": 20,
  "sea club le meridien beach plaza": 20,
  "cathedrale de monaco": 21,
  "cathedrale saint nicolas": 21,
  "cathedrale notre dame immaculee de monaco": 21,
  "cathedrale": 21,
  "twiga monte carlo": 22,
  "twiga": 22,
};

/** Les événements qui ont leur PROPRE photo. Clé : le titre exact, normalisé. */
const TITRES = {
  "foire attractions port hercule": 16,
};

/** Quartier → lieu « quartier » correspondant. */
const PAR_QUARTIER = {
  "monte carlo": 31,
  "la condamine": 32,
  "larvotto": 33,
  "monaco ville": 34,
  "monaco": 30,
  // ⚠️ Fontvieille n'a AUCUNE photo CC0 sur Commons (vérifié le 28 oct 2026) :
  // ses 20 fiches prennent la vue générale de Monaco, légendée « Monaco ».
  // Mieux vaut un quartier vrai mais large qu'un quartier faux.
  "fontvieille": 30,
};

const PAR_ID = new Map(LIEUX.map(l => [l.id, l]));

/** Accents et ponctuation retirés, pour comparer des chaînes ENTIÈRES. */
function normalise(s) {
  return String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Un entier stable tiré de l'identifiant — le même mélange que `habillage.js`.
 * Les identifiants se suivent souvent (800041, 800042…) : un simple modulo
 * donnerait deux cartes voisines identiques.
 */
function graine(id) {
  let x = (Number(id) || 0) * 2654435761 % 4294967296;
  x ^= x >>> 13; x = (x * 1274126177) % 4294967296; x ^= x >>> 16;
  return Math.abs(x);
}

/**
 * Une vue du lieu, choisie de façon STABLE d'après l'identifiant de la fiche.
 * `decalage` permet de prendre la vue SUIVANTE quand la précédente ferait
 * doublon à l'écran — voir `mediasSansRepetition()`.
 */
function vueDuLieu(lieu, eventId, decalage = 0) {
  return lieu.vues[(graine(eventId) + decalage) % lieu.vues.length];
}

/** Construit le média rendu à l'interface. */
function media(lieu, eventId, type, decalage = 0) {
  const v = vueDuLieu(lieu, eventId, decalage);
  return {
    src: `${BASE}/${v.f}${V}`,
    secours: `${HOTE_SECOURS}/media/lieux/${v.f}${V}`,
    mediaType: type,
    venueId: lieu.id, slug: lieu.slug, nomLieu: lieu.nom,
    alt: v.alt, width: v.w, height: v.h,
    edition: lieu.edition || null,
    licence: "CC0 1.0", auteur: "Wikimedia Commons",
  };
}

/** Le libellé du lieu d'une fiche : ce qui précède le « · » du quartier. */
function libelleDuLieu(event) {
  return String(event?.subtitle || "").split("·")[0].trim();
}

/** L'identifiant de lieu d'une fiche, ou `null`. Comparaison EXACTE. */
export function lieuDeLaFiche(event) {
  const cle = normalise(libelleDuLieu(event));
  return cle && Object.prototype.hasOwnProperty.call(LIBELLES, cle) ? LIBELLES[cle] : null;
}

/** La photo d'un ÉVÉNEMENT : celle des données, sinon celle inscrite ici. */
export function photoEvenement(event) {
  const src = event?.image || event?.photo || event?.cover;
  if (src) return { src, mediaType: "event", alt: event?.title || "", credit: event?.imageCredit || null };

  const cle = normalise(String(event?.title || "").replace(/\n/g, " "));
  const id = Object.prototype.hasOwnProperty.call(TITRES, cle) ? TITRES[cle] : null;
  const l = id != null ? PAR_ID.get(id) : null;
  if (!l) return null;
  // ⚠️ « edition » et non « event » : la photo montre bien CETTE manifestation,
  // mais une édition passée. L'interface l'écrit.
  return media(l, event?.id, l.edition ? "edition" : "event");
}

/** La photo du LIEU d'un événement. Toujours marquée `venue`. */
export function photoDuLieu(event) {
  const id = lieuDeLaFiche(event);
  const l = id != null ? PAR_ID.get(id) : null;
  return l ? media(l, event?.id, "venue") : null;
}

/**
 * 🗂️ LA PHOTO D'UNE FICHE À ANNUAIRE, TIRÉE DE SES PROPRES LIEUX.
 *
 * « MUSÉES · 6 OUVERTS À MONACO » n'est pas un lieu, c'est une liste. Mais le
 * Musée océanographique EN FAIT PARTIE, et on a sa photo. L'illustrer avec elle
 * n'est donc pas « la photo d'un autre lieu ».
 *
 * ⚠️ LA LÉGENDE NE DIT PAS « PHOTO DU LIEU » — la photothèque l'interdit pour
 * un regroupement, et elle a raison : la carte n'est pas ce lieu. Elle nomme le
 * lieu photographié, et `mediaType: "groupe"` le fait écrire à l'interface.
 */
export function photoDeLAnnuaire(event) {
  const liste = Array.isArray(event?.directory) ? event.directory : null;
  if (!liste || !liste.length) return null;
  for (const entree of liste) {
    const cle = normalise(String(entree?.name || "").split("·")[0]);
    const id = Object.prototype.hasOwnProperty.call(LIBELLES, cle) ? LIBELLES[cle] : null;
    const l = id != null ? PAR_ID.get(id) : null;
    if (l) return media(l, event?.id, "groupe");
  }
  return null;
}


/* ══════════════════════════════════════════════════════════════════════════
   🌇 LES NEUF IMAGES D'AMBIANCE — pour les 995 fiches sans photo possible.

   Stéphanie a fourni le 28 oct 2026 une planche de neuf vues de Monaco
   (« Monaco Luxury Moments Collage »), chaudes et dorées, dans l'esprit exact
   qu'elle demandait depuis le matin.

   ⚠️ CE SONT DES IMAGES D'AMBIANCE, PAS DES PHOTOS DE LIEUX. Elles sont
   générées : aucune ne montre un établissement réel. Elles ne sont donc JAMAIS
   rattachées à un nom d'établissement — on les choisit sur la CATÉGORIE de la
   sortie (un dîner, une soirée, une terrasse, une plage), ce qui est vrai :
   une soirée ressemble à une soirée. C'est ce qui les sépare d'une « photo du
   Twiga » qui n'en serait pas une.

   🚨 ET ELLES PASSENT APRÈS TOUT LE RESTE. Une vraie photo du lieu, même
   quelconque, vaut mieux qu'une belle image générique : l'ordre de priorité ne
   change pas, l'ambiance ne prend la place que du quartier.

   ⚠️ 547 px de large. Assez pour une carte de 173 pt (519 px sur un écran
   Retina), trop juste pour le hero, qui en demande 1 074. Les heros gardent
   donc les photos réelles. Si Stéphanie récupère la planche en pleine
   définition, on pourra les y mettre aussi.
   ══════════════════════════════════════════════════════════════════════════ */
const AMB = "ambiance";
const AMBIANCES = [
  { f: "port-yachts.webp",     alt: "Le port de Monaco au coucher du soleil" },
  { f: "casino-facade.webp",   alt: "La façade du Casino sous les palmiers" },
  { f: "terrasse-diner.webp",  alt: "Une terrasse dressée face à la mer" },
  { f: "lounge-mer.webp",      alt: "Un salon en plein air au bord de l'eau" },
  { f: "le-rocher.webp",       alt: "Le Rocher de Monaco vu de la mer" },
  { f: "plage-larvotto.webp",  alt: "La plage et ses parasols" },
  { f: "soiree-club.webp",     alt: "Une soirée animée sous les lumières" },
  // 🎷 LE JAZZ A SA PROPRE IMAGE. Stéphanie, 31 oct 2026 : « change la photo du
  // live music du Bar Américain, mets un saxo ou piano ». Les 310 fiches JAZZ
  // LIVE recevaient la salle de club générique — correcte pour une soirée DJ,
  // muette pour un concert. Un saxophone dit ce qu'on va entendre.
  { f: "jazz-live.webp",       alt: "Des saxophonistes en concert" },
  { f: "rooftop-sunset.webp",  alt: "Un rooftop au crépuscule, vue sur le port" },
  { f: "palais-place.webp",    alt: "La place du Palais et ses pins" },
  // 🥤 LE BIEN-ÊTRE A SON IMAGE. Stéphanie, 31 oct 2026 : « pour les bars
  // bien-être, prends celle du bureau avec smoothie ». Les fiches BIEN-ÊTRE
  // tombaient sur la plage ou un salon — joli, mais muet.
  { f: "smoothie-bien-etre.webp", alt: "Un smoothie aux fruits rouges face à la mer" },
  // ☕ LE PETIT-DÉJEUNER. Stéphanie, 31 oct 2026 : « pour les petits déj, prends
  // celle du café ». ⚠️ Sa PREMIÈRE version portait le filigrane Adobe Stock en
  // diagonale — l'aperçu gratuit, pas la photo achetée ; elle l'a remplacée.
  { f: "cafe-petit-dej.webp", alt: "Un café et un croissant en terrasse, face au port" },
  // 🥐 LE BRUNCH. Stéphanie, 31 oct 2026 : « j'ai fait une photo brunch Monaco ».
  { f: "brunch-monaco.webp", alt: "Une table de brunch en terrasse, face au port de Monaco" },
  // 🥂 L'APÉRO. Photo fournie par Stéphanie, 31 oct 2026.
  { f: "apero-monte-carlo.webp", alt: "Deux coupes de champagne en terrasse, face au Casino à la tombée du jour" },
  { f: "expositions-galerie.webp", alt: "Une galerie d'exposition ouverte sur la mer" },
  { f: "spa-bien-etre.webp",       alt: "Une table de soin au bord d'un bassin, bougies et orchidée" },
  { f: "encheres.webp",            alt: "Un marteau de commissaire-priseur et une salle de vente" },
  // 🏀 LE SPORT. Photo fournie par Stéphanie le 31 oct 2026, la dernière famille
  // qui n'avait pas la sienne : ses fiches empruntaient un quartier, et ça se
  // voyait — le Rallye Monte-Carlo montrait le Rocher, le triathlon la plage.
  { f: "sport.webp", alt: "Ballons de basket, football et volley sur un parquet de salle" },
  // 🎤 LES CONFÉRENCES. Stéphanie, 1er nov 2026 : « mets cette photo pour les
  // conférences, toutes sauf conférence philo ».
  // ⚠️ RIEN À FAIRE POUR L'EXCEPTION : les quatre « Rencontres philosophiques »
  //    et les deux ateliers « La philo pour les jeunes » passent par un THÈME,
  //    marqué `avantLeLieu`, qui est lu AVANT les images de famille. Ils gardent
  //    donc leur livre ouvert sans qu'on ait à les écarter ici.
  { f: "conference-monaco.webp", alt: "Une conférence en salle, intervenant au pupitre et public" },
  // 🎬 LE CINÉMA. Photo fournie par Stéphanie le 31 oct 2026. ⚠️ Son enseigne dit
  // « CINÉMA DE MONACO » : la salle de Monaco s'appelle en réalité le Cinéma des
  // Beaux-Arts (Cinémas 2 Monaco). L'enseigne ne désigne donc aucune maison
  // existante — c'est une devanture générique, pas la façade d'un lieu précis.
  { f: "cinema-monaco.webp", alt: "La devanture éclairée d'un cinéma" },
];

/**
 * Catégorie → les ambiances qui lui ressemblent vraiment.
 *
 * 🚨 ON DÉSIGNE PAR LE NOM DU FICHIER, PLUS PAR SON RANG. La table tenait des
 * NUMÉROS de ligne, et le 31 oct 2026 j'ai inséré `jazz-live` au milieu de la
 * liste : tout ce qui suivait a glissé d'un cran, en silence. Résultat livré en
 * v0.0.173 — les 310 fiches JAZZ LIVE ont reçu la place du Palais au lieu du
 * saxophone que Stéphanie demandait, les expositions et conférences un rooftop
 * au crépuscule, et les soirées des saxophonistes.
 * Rien n'a planté, rien n'a été signalé : c'est exactement la famille de défaut
 * des ids rattrapés par un trou. Un nom ne glisse pas.
 */
const AMBIANCE_PAR_CAT = {
  "SOIRÉE": ["soiree-club", "rooftop-sunset"],
  "DJ SET": ["soiree-club", "rooftop-sunset"],
  "JAZZ LIVE": ["jazz-live"],
  "GALA": ["soiree-club", "casino-facade"],
  // 🥂 Une seule image, même raison que le brunch : Stéphanie doit la
  // reconnaître sur la fiche qui annonce les apéros, pas une fois sur trois.
  "APÉRO": ["apero-monte-carlo"],
  // 🥐 UNE SEULE IMAGE POUR LE BRUNCH, et c'est voulu : Stéphanie veut la
  // reconnaître sur la fiche qui annonce les brunchs. Un lot de trois la
  // laissait au tirage — deux fois sur trois, ce n'était pas elle.
  "BRUNCH": ["brunch-monaco"],
  "FOODY": ["terrasse-diner", "lounge-mer"],
  "PETIT-DÉJ": ["cafe-petit-dej", "terrasse-diner"],
  // 🥤 Le smoothie d'abord : c'est l'image que Stéphanie a choisie pour eux.
  // 🧖 Le spa pour les ACTIVITÉS bien-être ; les « wellness bars » gardent le
  //    smoothie, qui leur est attaché nommément (thème) et passe avant.
  "BIEN-ÊTRE": ["spa-bien-etre"],
  "SPORT": ["sport"],
  "FOOTBALL": ["port-yachts"],
  "BASKET": ["port-yachts"],
  "EXPOSITION": ["expositions-galerie"],
  "CONFÉRENCE": ["conference-monaco"],
  "SALON": ["casino-facade", "palais-place"],
  "ENCHÈRES": ["encheres"],
  "CONCERT": ["jazz-live", "casino-facade"],
  "OPÉRA": ["casino-facade"],
  "THÉÂTRE": ["casino-facade", "palais-place"],
  "MUSICAL": ["jazz-live", "casino-facade"],
  "DANSE": ["casino-facade", "soiree-club"],
  "SPECTACLE": ["casino-facade", "soiree-club"],
  "CHANTS": ["palais-place"],
  "CINÉMA": ["cinema-monaco"],
  "ATELIER": ["palais-place", "le-rocher"],
  "MARCHÉ": ["palais-place", "port-yachts"],
  "FESTIVAL": ["port-yachts", "soiree-club"],
  "FÊTE NATIONALE": ["palais-place", "port-yachts"],
};

/** Le nom de fichier (sans extension) → l'entrée d'ambiance. */
const AMBIANCE_PAR_NOM = new Map(AMBIANCES.map(a => [a.f.replace(/\.webp$/, ""), a]));

/**
 * Une image d'ambiance accordée à la catégorie. Choisie de façon STABLE par
 * `event.id`, comme les photos de lieu.
 */
export function imageAmbiance(event, decalage = 0) {
  const lot = AMBIANCE_PAR_CAT[String(event?.cat || "").toUpperCase()];
  if (!lot || !lot.length) return null;
  const nom = lot[(graine(event?.id) + decalage) % lot.length];
  const a = AMBIANCE_PAR_NOM.get(nom);
  if (!a) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${a.f}${V}`,
    secours: `${HOTE_SECOURS}/media/${AMB}/${a.f}${V}`,
    mediaType: "ambiance", nomLieu: null, alt: a.alt,
    width: 547, height: 303, licence: null, auteur: null,
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   🎃 LES IMAGES DE THÈME — une fête, pas un lieu.

   Stéphanie, 30 oct 2026 : « mets photo Halloween où tu peux ».

   ⚠️ CE N'EST NI UNE PHOTO DE LIEU NI UNE AMBIANCE DE CATÉGORIE, et c'est
   pour ça que ça passe AVANT la photo du lieu. Une citrouille sur « Halloween
   Night Twiga » décrit l'ÉVÉNEMENT — ce qui s'y passe ce soir-là — là où la
   façade du Twiga ne décrit que le bâtiment. Rien n'est trompeur : la fête a
   bien lieu, et l'image ne prétend pas montrer la salle.

   🚨 LE SEUL ENDROIT OÙ UN RAPPROCHEMENT PAR MOT EST LÉGITIME. Partout ailleurs
   on compare des libellés ENTIERS (un `includes()` collerait la photo d'un lieu
   sur un autre — l'erreur de l'Opéra sur l'Auditorium). Ici le mot cherché est
   le NOM DE LA FÊTE, pas celui d'un établissement : « Halloween » dans un titre
   ne peut désigner qu'Halloween.
   ⚠️ Les motifs sont ancrés sur des mots entiers et restent peu nombreux : on
   n'ouvre pas la porte à une liste qui s'allonge sans fin.
   ══════════════════════════════════════════════════════════════════════════ */
const THEMES = [
  {
    motif: /\b(halloween|buddhalloween|muertos|catrina|trick or treat|diablotins)\b/i,
    f: "halloween.webp", w: 1100, h: 825,
    alt: "Une citrouille d'Halloween sculptée, dans les feuilles",
  },
  // 📖 LA PHILOSOPHIE. Stéphanie, 31 oct 2026 : « pour celle des conférences
  // philosophiques, prends celle du bureau ».
  // ⚠️ L'AFFICHE QU'ELLE M'A DONNÉE PORTAIT SON TITRE EN DUR, et il disait
  //    « Conférences Philosophiques » alors que la série s'appelle RENCONTRES
  //    philosophiques. Deux défauts pour le prix d'un : un texte gravé devient
  //    illisible dans une vignette et répète le titre de la carte, et il
  //    annonçait le mauvais nom. On ne garde donc que l'image — le buste, le
  //    livre ouvert et l'Acropole au couchant.
  // 🥤 LES WELLNESS BARS. Stéphanie, 31 oct 2026, en renvoyant la photo :
  // « wellness bar ». Le smoothie était bien dans le lot BIEN-ÊTRE, mais ce lot
  // se tire au hasard stable : la fiche « WELLNESS BARS · 5 ADRESSES » était
  // tombée sur `lounge-mer`, et c'est précisément celle qu'elle regardait.
  // Un lot ne garantit rien pour UNE fiche donnée — quand une photo est choisie
  // POUR une fiche, elle se nomme ici, pas dans un tirage.
  {
    motif: /wellness\s*bars?/i,
    f: "smoothie-bien-etre.webp", w: 1100, h: 825,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un smoothie aux fruits rouges face à la mer",
  },
  // 🍷 L'APÉRO MUSIQUE LIVE AU MARCHÉ. Photo fournie par Stéphanie le 1er nov
  // 2026 : « place d'armes Condamine ».
  // ⚠️ SON TABLEAU NOIR PORTAIT UNE DATE EN DUR — « Jeudi 5 novembre, 18h30-21h ».
  //    Une date gravée dans une image est juste une fois et fausse ensuite ;
  //    elle a été recadrée. La halle, les musiciens et les tablées suffisent.
  // ⚠️ UN THÈME ET NON UNE VUE DU LIEU : le Marché de la Condamine a déjà sa
  //    photo de jour, juste pour un marché. Une terrasse au crépuscule n'a rien
  //    à faire sur une fiche de marché du matin.
  {
    avantLeLieu: true,
    motif: /ap[ée]ro\s+musique\s+live/i,
    f: "marche-condamine-apero.webp", w: 1100, h: 1048,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "L'apéro en musique sur la place du Marché de la Condamine, à la tombée du jour",
  },
  // ⛵ LA VOILE ET LES RÉGATES. Stéphanie, 1er nov 2026 : « photo pour events de
  // voile bateaux ». Un THÈME et non une ambiance : ces fiches sont rangées en
  // SPORT, famille qui compte aussi le volley en salle et le rallye — une image
  // par catégorie aurait mis des spinnakers sur un match de volley.
  // ⚠️ L'aviron de mer y est compris : c'est la même baie, les mêmes quais, et
  //    la photo ne prétend pas montrer une épreuve précise.
  {
    avantLeLieu: true,
    motif: /\b(voile|r[ée]gate|sportsboat|primo cup|navicap|optimist|aviron|rowing|yacht club)\b/i,
    f: "voile-regate.webp", w: 1100, h: 619,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Des voiliers en régate dans la baie de Monaco, le Rocher en fond",
  },
  // ♠️ LE BRIDGE. Stéphanie, 1er nov 2026 : « photo pour le bridge ».
  // ⚠️ UN THÈME ET NON UNE AMBIANCE DE CATÉGORIE : les 38 tournois sont rangés
  //    en ATELIER, famille qui compte aussi la zumba, la céramique et les cours
  //    d'informatique. Une image par catégorie aurait mis une table de bridge
  //    sur tout le monde. Le motif ne vise que ces fiches-là.
  {
    avantLeLieu: true,
    motif: /\bbridge\b/i,
    f: "bridge.webp", w: 1100, h: 619,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Une table de bridge dressée, cartes et boîtes d'enchères",
  },
  // 🌅 LE SUNSET DJ SET DU LARVOTTO. Stéphanie, 31 oct 2026 : « prends les photos
  // DJ sunset ».
  // ⚠️ UN THÈME, PAS UNE AMBIANCE DE CATÉGORIE, et la nuance compte : le panneau
  //    de la photo dit « DJ SUNSET · LARVOTTO · MONACO ». Posée sur la catégorie
  //    DJ SET, elle aurait annoncé le Larvotto sur les soirées d'ailleurs. Elle
  //    ne va donc qu'aux 27 fiches qui portent ce nom — pour elles, c'est leur
  //    vraie photo, d'où `avantLeLieu`.
  {
    avantLeLieu: true,
    motif: /sunset\s+dj\s+set|dj\s+sunset/i,
    f: "dj-sunset-larvotto.webp", w: 1100, h: 825,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un DJ au coucher du soleil, sur la plage du Larvotto",
  },
  {
    // 📌 AVANT LA PHOTO DU LIEU, et c'est volontaire. La règle générale dit
    // l'inverse (le Jardin exotique bat la citrouille), mais ces quatre fiches
    // se tiennent au Théâtre Princesse Grace : on y montrerait une façade de
    // théâtre pour une rencontre de philosophie. Stéphanie a choisi cette
    // image POUR ELLES, un choix explicite passe devant une règle par défaut.
    avantLeLieu: true,
    // ⚠️ Élargi le 31 oct 2026 : Stéphanie, « atelier conférence philosophique,
    //    mets cette photo ». Les deux ATELIERS « LA PHILO POUR LES JEUNES »
    //    tombaient sur une image de quartier. Le motif couvre donc « philo »
    //    seul — vérifié sur les 2 400 fiches : six correspondances, les quatre
    //    Rencontres et ces deux ateliers, rien d'autre (MONACOPHIL, qui parle
    //    de philatélie, ne contient pas « philo »).
    motif: /philosoph|\bphilo\b/i,
    f: "philosophie.webp", w: 1100, h: 570,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un livre ouvert sur un socle de marbre, l'Acropole au couchant",
  },
];

/** L'image de la FÊTE à laquelle se rattache une fiche, s'il y en a une. */
export function imageTheme(event, avantLeLieu = false) {
  const texte = `${event?.title || ""} ${event?.desc || ""}`;
  const t = THEMES.find(x => (avantLeLieu ? x.avantLeLieu === true : true) && x.motif.test(texte));
  if (!t) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${t.f}${V}`,
    secours: `${HOTE_SECOURS}/media/${AMB}/${t.f}${V}`,
    mediaType: "theme", nomLieu: null, alt: t.alt,
    width: t.w, height: t.h,
    licence: t.licence ?? "Domaine public",
    auteur: t.auteur ?? "Wikimedia Commons",
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   ⛪ LA PHOTO DE CATÉGORIE — un seul cas, et il est demandé.

   Stéphanie, 31 oct 2026 : « mets une photo de la cathédrale pour les messes ».

   Les 82 fiches CHANTS tombaient presque toutes sur une image de quartier :
   « 5 paroisses » et « 9 paroisses » (57 fiches à elles deux) ne sont pas des
   lieux mais des regroupements, donc aucune photo de lieu ne s'y accrochait.

   ⚠️ CE N'EST PAS UN RETOUR DE L'IMAGE PAR CATÉGORIE qui posait la photo de
   l'Opéra sur l'Auditorium. La différence tient en une phrase : la cathédrale
   EST une église de Monaco, et une carte de messes propose des églises de
   Monaco. On ne prétend pas montrer la paroisse exacte — mais on ne montre pas
   non plus un port ou un casino sur une messe.
   ⚠️ Elle passe APRÈS la photo du lieu : une messe à Saint-Charles ou à
   Sainte-Dévote garde la sienne le jour où on l'aura.
   ══════════════════════════════════════════════════════════════════════════ */
const PAR_CATEGORIE = {
  "CHANTS": 21,          // la cathédrale de Monaco
};

export function photoDeCategorie(event) {
  const id = PAR_CATEGORIE[String(event?.cat || "").toUpperCase()];
  const l = id != null ? PAR_ID.get(id) : null;
  return l ? media(l, event?.id, "categorie") : null;
}

/**
 * 🏙️ LA PHOTO DU QUARTIER — dernier recours.
 *
 * Stéphanie, 28 oct 2026 : « mets sinon une photo de Monaco, du quartier ».
 * ⚠️ Elle n'est JAMAIS présentée comme celle du lieu : la légende porte le nom
 * du QUARTIER (« Monte-Carlo — photo du quartier »), jamais celui de
 * l'établissement. Sans cette mention, on referait l'erreur de l'Opéra posé sur
 * l'Auditorium.
 */
export function photoDuQuartier(event, decalage = 0) {
  const q = normalise(event?.quarter);
  const l = PAR_ID.get(PAR_QUARTIER[q] || 30);
  return l ? media(l, event?.id, "quartier", decalage) : null;
}

/**
 * Le média d'une fiche, dans l'ordre imposé par le brief :
 *   1. photo de l'ÉVÉNEMENT ;
 *   2. photo du LIEU EXACT, étiquetée ;
 *   3. pour un annuaire, la photo de l'un de SES lieux, nommé ;
 *   4. sinon la photo du QUARTIER, annoncée comme telle.
 * Jamais la photo d'un autre établissement.
 */
export function mediaDeLaFiche(event, decalage = 0) {
  return photoEvenement(event)
      // Une image de thème marquée `avantLeLieu` est un choix explicite pour
      // CES fiches-là : elle seule devance la photo du lieu.
      || imageTheme(event, true)
      // 🚨 LA PHOTO DU LIEU PASSE DEVANT L'IMAGE DE FÊTE.
      // Stéphanie, 31 oct 2026 : « l'activité dans la grotte, mets une photo du
      // Jardin exotique ». La citrouille d'Halloween écrasait la vraie photo du
      // lieu : on perdait une information (où ça se passe) pour un décor.
      // La règle revient donc à l'ordre normal — une image qui montre le LIEU
      // RÉEL bat toujours une image de thème. Les fiches sans photo de lieu
      // (Jimmy'z, Buddha-Bar, La Rascasse, le Castelroc, le Parc Princesse
      // Antoinette) gardent la citrouille, qui reste mieux qu'un quartier.
      || photoDuLieu(event)
      || imageTheme(event)
      || photoDeLAnnuaire(event)
      || photoDeCategorie(event)
      || imageAmbiance(event, decalage)
      || photoDuQuartier(event, decalage);
}

/**
 * 🔁 PAS DEUX FOIS LA MÊME PHOTO CÔTE À CÔTE.
 *
 * Stéphanie, 28 oct 2026 : « ne remets pas les mêmes photos à côté pour des
 * activités différentes ». Dans une grille à deux colonnes, deux sorties
 * voisines du même quartier tombaient sur la même vue : l'œil croit voir la
 * même chose deux fois, et la page paraît bâclée.
 *
 * On parcourt donc la liste DANS L'ORDRE D'AFFICHAGE et, dès qu'une photo
 * reparaît, on prend la vue suivante du même quartier.
 *
 * ⚠️ ON NE CORRIGE QUE LES PHOTOS DE QUARTIER. Une photo de LIEU qui se répète
 * est juste : deux concerts au Théâtre des Muses, c'est deux fois le Théâtre
 * des Muses. Changer pour « faire joli » poserait une image fausse — exactement
 * ce qu'on passe la journée à éviter.
 *
 * ⚠️ Et quand un quartier n'a qu'une vue, la répétition subsiste : on ne va pas
 * inventer une photo. Monte-Carlo en a 2, La Condamine 3, Monaco 3.
 */
export function mediasSansRepetition(fiches, recents = []) {
  // 🚨 RÈGLE DURCIE LE 28 OCT AU SOIR. Stéphanie : « ne mets pas 2 photos
  // identiques à côté, SAUF si même event ». Jusqu'ici j'autorisais la
  // répétition dès qu'il s'agissait du même LIEU — deux expositions
  // différentes à la Villa Paloma montraient donc la même image côte à côte.
  // Désormais seule une même fiche (même `id`, par exemple une série reprise
  // deux jours de suite) a le droit de répéter sa photo.
  // Quand le lieu n'a qu'une vue, la seconde carte bascule sur son image
  // d'ambiance de catégorie : on ne va pas inventer une deuxième façade.
  const sortie = [];                  // `recents` : les 3 dernières photos posées.
  // ⚠️ IL FAUT POUVOIR LE PARTAGER ENTRE PLUSIEURS GRILLES. Le fil pose une
  // grille par série de fiches ordinaires ; avec un compteur remis à zéro à
  // chaque grille, deux vues identiques se retrouvaient de part et d'autre
  // d'une bande de regroupement. Le fil passe donc UN SEUL tableau à toutes
  // ses grilles.
  let precedent = null;             // { src, id } de la carte juste avant
  for (const e of fiches || []) {
    let m = mediaDeLaFiche(e);
    const memeFiche = precedent && precedent.id === e.id;

    // 🚨 ON NE FAIT VARIER QUE CE QUI EST DÉCORATIF.
    // Stéphanie, 31 oct 2026, en voyant les cartes de messes : la deuxième
    // « Messe dimanche » affichait le PALAIS PRINCIER, la suivante le port.
    // La règle anti-répétition s'appliquait à TOUTES les images : la photo de
    // la cathédrale, pourtant juste, se faisait écarter dès qu'elle avait déjà
    // servi, et la cascade descendait jusqu'au quartier.
    // Une photo qui DIT quelque chose — le lieu exact, un lieu de l'annuaire,
    // la cathédrale pour une messe, la citrouille pour Halloween — a le droit
    // de se répéter : deux messes, c'est deux fois une église. Seuls le
    // quartier et l'ambiance, qui ne sont que du décor, doivent tourner.
    const decoratif = m && (m.mediaType === "quartier" || m.mediaType === "ambiance");
    if (decoratif && !memeFiche && recents.includes(m.src)) {
      // 1) essayer une autre vue (du lieu, du quartier ou de l'ambiance)
      for (let d = 1; d <= 3 && recents.includes(m.src); d++) {
        const autre = mediaDeLaFiche(e, d);
        if (autre && autre.src !== m.src) { m = autre; break; }
      }
      // 2) un lieu à vue unique : on passe à l'ambiance de sa catégorie
      if (recents.includes(m.src)) {
        for (let d = 0; d < 3 && recents.includes(m.src); d++) {
          const amb = imageAmbiance(e, d);
          if (amb && !recents.includes(amb.src)) { m = amb; break; }
        }
      }
      // 3) ⚠️ DERNIER RECOURS : LE QUARTIER.
      // Certaines catégories n'ont qu'UNE ambiance (CHANTS, OPÉRA, ENCHÈRES…) :
      // la boucle précédente tournait alors à vide et la répétition tenait bon.
      // Le quartier, lui, a 2 ou 3 vues — il débloque toujours la situation.
      if (recents.includes(m.src)) {
        for (let d = 0; d < 3 && recents.includes(m.src); d++) {
          const q = photoDuQuartier(e, d);
          if (q && !recents.includes(q.src)) { m = q; break; }
        }
      }
    }

    sortie.push(m);
    if (m) {
      precedent = { src: m.src, id: e.id };
      recents.push(m.src);
      if (recents.length > 3) recents.shift();
    }
  }
  return sortie;
}

/** Une photo de Monaco pour une BANNIÈRE ÉDITORIALE — jamais pour un lieu précis. */
export function photoEditoriale() {
  const l = PAR_ID.get(30);
  return l ? { src: `${BASE}/${l.vues[0].f}${V}`, alt: l.vues[0].alt, mediaType: "editorial" } : null;
}

```

## `src/lib/phone.js`

```js
// MonacOut — NUMÉROS DE TÉLÉPHONE : normalisation et empreinte
//
// Pourquoi ce fichier existe : pour retrouver une amie dans son carnet d'adresses,
// il faut comparer des numéros. On ne compare JAMAIS des numéros en clair, et on
// n'en envoie JAMAIS au serveur : on envoie une empreinte (SHA-256) calculée DANS
// le téléphone. Le serveur ne reçoit donc pas les numéros de gens qui n'ont rien
// demandé — seulement des suites de caractères qu'il compare entre elles.
//
// ⚠️ À DIRE HONNÊTEMENT : une empreinte de numéro n'est PAS un secret solide. Il
// n'existe qu'une centaine de millions de numéros possibles ; quelqu'un qui aurait
// accès à la base pourrait tous les essayer et retrouver les numéros. L'empreinte
// évite le stockage en clair et la fuite par simple lecture, rien de plus. C'est
// pour cela que le croisement passe par une fonction serveur qui n'accepte qu'un
// carnet à la fois et ne rend jamais la colonne.
//
// Deux pays seulement, ceux des gens qui utilisent l'app : Monaco et la France.

const SEL = "monacout:v1:";   // séparateur de domaine — empêche de réutiliser une
                              // empreinte calculée ailleurs. Ce n'est pas un secret.

// Ramène un numéro écrit n'importe comment au format international E.164.
// « 06 12 34 56 78 » → « +33612345678 » · « 93 15 22 95 » → « +37793152295 »
export function versE164(brut) {
  if (!brut) return null
  let s = String(brut).replace(/[^\d+]/g, "")
  if (s.startsWith("00")) s = "+" + s.slice(2)
  if (s.startsWith("+")) {
    const n = s.slice(1)
    return /^\d{8,15}$/.test(n) ? "+" + n : null
  }
  // 10 chiffres commençant par 0 → France (06…, 07…, 01…)
  if (/^0\d{9}$/.test(s)) return "+33" + s.slice(1)
  // 8 chiffres → Monaco (93…, 97…, 99…, 4…, 6…)
  if (/^\d{8}$/.test(s)) return "+377" + s
  // 9 chiffres commençant par 377 sans le + (saisie fréquente)
  if (/^377\d{8}$/.test(s)) return "+" + s
  if (/^33\d{9}$/.test(s)) return "+" + s
  return null
}

// Empreinte SHA-256, en hexadécimal. Calculée dans le téléphone, jamais ailleurs.
export async function empreinte(brut) {
  const e164 = versE164(brut)
  if (!e164) return null
  if (!globalThis.crypto?.subtle) return null   // contexte non sécurisé : on renonce
  const octets = new TextEncoder().encode(SEL + e164)
  const digest = await globalThis.crypto.subtle.digest("SHA-256", octets)
  return [...new Uint8Array(digest)].map(o => o.toString(16).padStart(2, "0")).join("")
}

// Empreintes d'un carnet entier, dédoublonnées, sans jamais garder les numéros.
// On plafonne : un carnet de 3 000 entrées n'a pas à partir en une seule fois, et
// la fonction serveur refuse au-delà de 1 000.
export async function empreintesDuCarnet(numeros, max = 1000) {
  const vues = new Set()
  for (const n of numeros) {
    const h = await empreinte(n)
    if (h) vues.add(h)
    if (vues.size >= max) break
  }
  return [...vues]
}

// Affichage lisible d'un numéro enregistré — pour que la personne se reconnaisse.
export function joli(e164) {
  if (!e164) return ""
  // Monaco : 8 chiffres par paires (93 15 22 95).
  if (e164.startsWith("+377")) return "+377 " + e164.slice(4).replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  // France : 9 chiffres, le premier seul puis des paires (6 12 34 56 78).
  if (e164.startsWith("+33")) {
    const n = e164.slice(3)
    return "+33 " + n[0] + " " + n.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  }
  return e164
}

```

## `src/lib/prenom.js`

```js
/**
 * MonacOut — DEVINER LE PRÉNOM À PARTIR DE L'ADRESSE E-MAIL
 *
 * Sert à PRÉ-REMPLIR le dernier écran de l'inscription. Au 16 août 2026, 8 personnes
 * sur 50 recevaient leur code, le saisissaient, se connectaient — puis fermaient
 * « Comment tu t'appelles ? » sans répondre. Elles gardaient un compte inutilisable :
 * sans prénom, elles n'existent pour aucune amie.
 *
 * ✅ ÉPROUVÉ SUR LES VRAIES ADRESSES des 8 personnes concernées, avec Stéphanie qui
 * les connaît personnellement (16 août 2026) : les suggestions étaient **justes**.
 * L'adresse porte bien le prénom dans l'immense majorité des cas.
 *
 * ⚠️ Elle reste une SUGGESTION, jamais une décision : la mention « Deviné d'après ton
 * adresse — corrige si besoin » est affichée sous le champ, et la saisie prend la main
 * dès le premier caractère tapé. Une orthographe approximative dans une adresse
 * (« sandrine » pour Sandryne) doit pouvoir se corriger sans lutter.
 *
 * En cas de doute, on ne propose RIEN : un champ vide se remplit, alors qu'un
 * « Rfrealltor » doit d'abord être effacé — ça ajoute du travail au lieu d'en retirer.
 *
 * ⚠️ Ce fichier est séparé d'AuthScreen.jsx exprès : un fichier de composant qui
 * exporte aussi des fonctions casse le rafraîchissement à chaud (react-refresh).
 */

// Boîtes de service : ce ne sont jamais des prénoms.
const GENERIQUES = new Set([
  'contact', 'info', 'infos', 'hello', 'bonjour', 'admin', 'mail', 'email',
  'moi', 'me', 'perso', 'pro', 'noreply', 'newsletter', 'famille', 'home', 'agence',
])

// Prénoms courants à Monaco et alentour (FR, IT, EN). Sert UNIQUEMENT à découper une
// adresse qui colle prénom et nom : « giuliarossi » → « Giulia ». Liste volontairement
// courte : hors liste, on ne propose rien plutôt qu'un mauvais prénom.
const PRENOMS = ('alessandra alessandro alexandra alexandre alice amelie andrea anne antoine antonio arnaud aurelie '
  + 'baptiste beatrice benjamin bernard bruno camille carla caroline catherine cecile charlotte chiara '
  + 'christian christine christophe claire claude claudia clara daniel david delphine diego dominique '
  + 'edouard elena elisa elisabeth emilie emma eric estelle fabien fabio federico florence francesca '
  + 'francesco francois frederic gabriel geraldine giovanni giulia guillaume helene henri isabelle jacques '
  + 'jean jerome julie julien juliette laetitia laetizia laura laurent lea leonardo letizia lorenzo louis '
  + 'luca lucie ludovic manon marc marco margaux maria marie marina mathieu matteo maxime michel michele '
  + 'nathalie nicolas nicole olivia olivier pascal patricia patrick paul philippe pierre quentin raphael '
  + 'rebecca remi richard robert roberto romain sabrina sandra sandrine sarah sebastien serge silvia simon '
  + 'sophie stephane stephanie sylvie thomas valentina valeria valerie veronique victor vincent virginie yves').split(' ')

/**
 * @param {string} email
 * @returns {string} un prénom plausible, ou '' si rien de sûr
 */
export function prenomDepuisEmail(email) {
  const local = String(email || '').split('@')[0].split('+')[0].toLowerCase()
  // Premier morceau avant un séparateur : « marie.dupont » → « marie »
  let brut = local.split(/[._\-0-9]+/).filter(Boolean)[0] || ''
  if (!/^[a-zà-öø-ÿ]+$/i.test(brut)) return ''
  if (GENERIQUES.has(brut)) return ''

  // Adresse collée (« giuliarossi ») : on ne garde que le prénom reconnu au début.
  // On teste du plus long au plus court, sinon « marc » gagnerait sur « marco ».
  if (brut.length >= 8 && !PRENOMS.includes(brut)) {
    const trouve = PRENOMS.filter(p => brut.startsWith(p)).sort((a, b) => b.length - a.length)[0]
    if (!trouve) return ''       // nom inconnu collé : on préfère ne rien proposer
    brut = trouve
  }
  // Ni initiales (« jd ») ni chaîne interminable.
  if (brut.length < 3 || brut.length > 12) return ''
  return brut[0].toUpperCase() + brut.slice(1)
}

```

## `src/lib/reservation.js`

```js
/**
 * « Réserver une place » / « Réserver une table ».
 *
 * Stéphanie, 26 oct 2026 : « fais le lien avec leur système de résa en ouvrant
 * une vue dans l'app de leur système, et mets réserver une place… une table… ».
 *
 * ⚠️ POURQUOI UNE VUE INTÉGRÉE ET PAS UN LIEN. Deux raisons, pas une.
 *   1. `target="_blank"` depuis l'app native donne un ÉCRAN NOIR sur iPhone :
 *      une fenêtre sans barre d'adresse ni retour (constaté le 7 août 2026).
 *   2. `@capacitor/browser`, qui ouvrirait proprement un SFSafariViewController,
 *      N'EST PAS installé — et un plugin natif exige une nouvelle build App
 *      Store, pas un OTA. On ne peut donc pas s'en servir aujourd'hui.
 * Reste la vue intégrée : on affiche la page de réservation DANS l'app, dans un
 * cadre qu'on contrôle, avec une croix pour revenir. C'est livrable en OTA.
 *
 * ⚠️ TOUTES LES PAGES N'ACCEPTENT PAS D'ÊTRE CADRÉES. Vérifié le 26 oct 2026 :
 *      cinemas2monaco.com   → ni X-Frame-Options ni frame-ancestors  🟢
 *      bookings.zenchef.com → idem                                   🟢
 *      sevenrooms.com       → idem                                   🟢
 *      grimaldiforum.com    → X-Frame-Options: SAMEORIGIN            🔴
 * Un cadre refusé ne lève AUCUNE erreur : il reste blanc. On ne peut donc pas
 * le détecter depuis l'app. La règle est donc : le champ `resa` n'est écrit
 * dans les données QUE pour une page vérifiée cadrable. Pas de `resa` → pas de
 * bouton, et le téléphone reste là. Mieux vaut pas de bouton qu'un cadre vide.
 */

/** Catégories où l'on réserve une TABLE, et non une place. */
const A_TABLE = new Set([
  "BRUNCH", "APÉRO", "FOODY", "PETIT-DÉJ", "SOIRÉE", "DJ SET",
]);

/**
 * Le mot exact du bouton. Une place pour un spectacle, une table pour un repas
 * — dire « réserver » tout court laisserait croire qu'on réserve à sa place.
 */
export function motDeReservation(cat, lang) {
  const table = A_TABLE.has(String(cat || "").toUpperCase());
  if (lang === "en") return table ? "Book a table" : "Book a seat";
  return table ? "Réserver une table" : "Réserver une place";
}

/** L'adresse de réservation d'une fiche ou d'une sous-fiche, s'il y en a une. */
export function lienDeReservation(objet) {
  const u = (objet && objet.resa) || "";
  return /^https:\/\//.test(u) ? u : null;
}

/**
 * 🪑 IL N'Y A QU'UN MOT, ET C'EST « RÉSERVER ».
 *
 * Stéphanie, 26 oct 2026 : « je ne veux pas "réserver sur le site" — on est
 * toujours sur leur site quand on réserve ». Elle a raison, et mon libellé
 * « Réserver sur leur site » décrivait un détail technique qui ne regarde pas
 * la personne : qu'on ouvre un formulaire SevenRooms, la page du lieu ou le
 * composeur, elle réserve une table. Le libellé ne dépend donc QUE de la
 * catégorie — voir motDeReservation() et actionDeReservation().
 *
 * `motDuSite` est conservée pour ne pas casser un import oublié, mais elle rend
 * désormais le même mot que partout ailleurs.
 */
export function motDuSite(lang, cat) {
  return motDeReservation(cat, lang);
}

/** L'adresse du site d'un lieu, quand elle a été vérifiée cadrable. */
export function lienDuSite(objet) {
  const u = (objet && objet.siteResa) || "";
  return /^https:\/\//.test(u) ? u : null;
}

/**
 * UN SEUL BOUTON, SUR TOUTES LES FICHES.
 *
 * Stéphanie, 26 oct 2026 : « au lieu du téléphone et site il faudrait en fait
 * ce bouton réserver sur toutes les fiches ».
 *
 * Le bouton dit toujours « Réserver », et fait le mieux disponible :
 *   1. un VRAI formulaire (SevenRooms, Zenchef, billetterie)  → on l'ouvre ;
 *   2. sinon le site du lieu, s'il accepte d'être affiché      → on l'ouvre ;
 *   3. sinon le téléphone                                      → on appelle.
 *
 * ⚠️ LE TÉLÉPHONE N'EST PAS UN PIS-ALLER. Pour la moitié des lieux de Monaco
 * c'est LE moyen de réserver, et c'est le seul qui marche à coup sûr. Il est
 * donc le troisième choix, jamais un échec : un bouton qui appelle vaut mieux
 * qu'un bouton absent.
 *
 * ⚠️ ET LE MOT RESTE HONNÊTE. Au cas 1 on précise « une table » ou « une
 * place » ; aux cas 2 et 3 on dit seulement « Réserver », sans promettre un
 * formulaire qu'on n'a pas.
 */
export function actionDeReservation(objet, cat, lang) {
  // 🪑 LE MÊME MOT DANS LES TROIS CAS. Stéphanie, 26 oct 2026 : « mets le même
  // bouton pour les restaus, réserver une table ».
  //
  // J'avais d'abord inventé trois libellés — « Réserver une table » pour un
  // formulaire, « Réserver » pour un site, « Réserver par téléphone » sinon —
  // par crainte de promettre une table qu'on n'ouvrirait pas. C'était une
  // prudence mal placée : APPELER UN RESTAURANT, C'EST RÉSERVER UNE TABLE, et
  // c'est même la façon dont on réserve dans la moitié des lieux de Monaco.
  // Le mot est donc juste dans les trois cas, et trois libellés différents
  // pour un même geste brouillaient la lecture.
  //
  // Le mot ne dépend plus que de la CATÉGORIE : une table pour un repas, une
  // place pour un spectacle. Seul le mode change ce qui se passe au toucher.
  const mot = motDeReservation(cat, lang);
  const form = lienDeReservation(objet);
  if (form) return { mode: "form", url: form, mot };
  const site = lienDuSite(objet);
  if (site) return { mode: "site", url: site, mot };
  const tel = (objet && (objet.tel || objet.phone)) || "";
  if (!tel) return null;

  // 🎡 CE QUI NE SE RÉSERVE PAS N'A PAS DE BOUTON — ET TOUT LE RESTE A LE MÊME.
  //
  // Stéphanie, 27 oct 2026 : « tout doit être pareil, et on n'indique pas le
  // moyen de résa mais ce que le client réserve : une place ou une table ».
  //
  // 🚨 J'AI MIS TROIS ESSAIS À COMPRENDRE, ET CHACUN AJOUTAIT UNE EXCEPTION :
  //   · « Réserver par téléphone » / « Réserver sur leur site » → ça nommait le
  //     MOYEN, qui ne regarde pas la personne ;
  //   · une barre pleine pour un formulaire, une barre pâle sinon → deux
  //     apparences pour un même geste ;
  //   · puis « Appeler » sur tout ce qui n'est pas un repas → 4 466 fiches.
  // La règle est plus simple que toutes mes nuances : UN SEUL MOT, UNE SEULE
  // COULEUR, et il dit CE QU'ON RÉSERVE. Formulaire, site ou téléphone : la
  // personne s'en moque, elle veut une place ou une table.
  //
  // La seule exception légitime n'est pas un autre libellé, c'est l'ABSENCE de
  // bouton : on ne réserve pas une foire, une messe, un feu d'artifice, un
  // marché ni la fête nationale. On y entre, voilà tout.
  //
  // ⚠️ On ne se fie pas à `free` : les Thursday Live Sessions du Grimaldi Forum
  // sont GRATUITES SUR RÉSERVATION, 200 places. Gratuit ne veut pas dire ouvert.
  // ⚠️ Et « marche » n'est pas « marché » : accents dépliés, les deux s'écrivent
  // pareil, et « Marche et sorties nature » se réserve très bien. C'est la
  // CATÉGORIE qui tranche, jamais le mot seul.
  const texte = `${(objet && (objet.name || objet.title)) || ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const RIEN_A_RESERVER = /\bfoire\b|\bbrocante\b|\bmesse\b|feu d.artifice|procession|vide.grenier/;
  const CAT_OUVERTE = new Set(["MARCHÉ", "CHANTS", "FÊTE NATIONALE"]);
  if (RIEN_A_RESERVER.test(texte) || CAT_OUVERTE.has(String(cat || "").toUpperCase()))
    return null;

  return { mode: "tel", tel: String(tel).replace(/[\s()]/g, ""), mot };

}

```

## `src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = (URL && KEY) ? createClient(URL, KEY) : null

```

## `src/lib/theme.js`

```js
/**
 * MONAC'OUT — LES JETONS DE LA REFONTE (28 oct 2026)
 *
 * Refonte demandée par Stéphanie à partir du kit `MONACOUT_KIT_CLAUDE_CODE` :
 * « une application lifestyle premium, élégante, moderne, fluide ». Les valeurs
 * ci-dessous viennent du brief ; ce fichier les rassemble en un seul endroit
 * pour qu'on n'ait plus jamais à les écrire en dur dans un composant.
 *
 * ⚠️ CE QUI A ÉTÉ DÉCIDÉ, ET PAR QUI. J'ai signalé trois conflits avant de
 * coder ; Stéphanie a tranché les trois le 28 oct :
 *   1. LES CADRES COLORÉS PAR CATÉGORIE SONT SUPPRIMÉS. Ils dataient de la
 *      veille (28 couleurs, trois itérations) mais le brief demande des cartes
 *      sans encadrement épais. La couleur de catégorie survit dans la PASTILLE
 *      de catégorie, pas dans le cadre — couleurs.js reste donc en place et
 *      sert toujours, en plus petit.
 *   2. LES PHOTOS D'AMBIANCE NE VONT QU'EN BANDEAU D'ACCUEIL. Les données ne
 *      contiennent AUCUNE photo d'événement — 2 399 fiches, zéro champ image —
 *      et le kit interdit de faire passer une image d'ambiance pour la photo
 *      d'un événement. Les fiches gardent donc leur dégradé et leur emoji.
 *   3. L'OR DU KIT EST UTILISÉ TEL QUEL, sur décision explicite de Stéphanie,
 *      après que je lui ai montré les chiffres : #B89C68 donne 2,48:1 sur le
 *      crème, soit MOINS que l'or retiré le 10 octobre (3,45:1) et sous la
 *      norme de 4,5:1. Il est donc réservé aux petits libellés de catégorie et
 *      aux filets décoratifs — comme dans la maquette — et ne porte JAMAIS une
 *      information qu'il faut pouvoir lire (heure, lieu, prix, bouton).
 */

// ── Couleurs ────────────────────────────────────────────────────────────────
//
// 🎨 DIRECTION ARTISTIQUE V6 — « CHIC, CHAUDE, NATURELLE ET PREMIUM »,
// validée par Stéphanie le 28 oct 2026 au soir. Les cinq valeurs sont les
// siennes, reprises exactement. Contrastes MESURÉS sur l'ivoire #FAF6F0 :
//
//   Bleu nuit       #14243A  14,52:1 ✓
//   Bordeaux chaud  #87372F   7,45:1 ✓   (blanc dessus : 8,02:1 ✓)
//   Surface         #FFFCF8        —     les cartes
//   Champagne       #C7A575   2,15:1 ⚠️  DÉCOR SEULEMENT
//
// ⚠️ Le champagne reste sous la norme : filets et libellés décoratifs, jamais
// une heure, un lieu, un prix ou un bouton. Même règle que l'or retiré le
// 10 octobre, et que le #C5A77A de la charte du matin.
//
// 🎨 LA CHARTE DE STÉPHANIE, 28 oct 2026 — « les codes couleurs exacts à
// respecter ». Les valeurs ci-dessous sont les SIENNES, reprises telles quelles.
// Contrastes mesurés sur l'ivoire #FAF7F2 (et non estimés) :
//
//   Bleu nuit  #15263B  14,32:1 ✓   titres et textes forts
//   Bordeaux   #813B45   7,43:1 ✓   boutons et actions
//   Blanc      #FFFFFF        —     les cartes
//   Gris doux  #737D88   3,92:1 ⚠️  informations secondaires
//   Champagne  #C5A77A   2,14:1 ⚠️  détails premium — DÉCOR SEULEMENT
//   Bordures   #E8E2DA   1,20:1     filets, jamais du texte
//
// ⚠️ DEUX AVERTISSEMENTS, ET ILS NE SONT PAS DES CAPRICES.
//
// 1. LE GRIS DOUX EST À 3,92:1, SOUS LA NORME DE 4,5:1. Il porte l'heure et le
//    lieu sur chaque carte — exactement ce qu'il faut pouvoir lire d'un coup
//    d'œil. `GRIS_LISIBLE` (#6A737D, 4,51:1) est le MÊME gris assombri d'un
//    cran : la teinte ne bouge pas, le texte repasse au-dessus de la norme.
//    👉 C'est lui qu'utilisent les textes secondaires. `GRIS` reste exporté,
//    pour les aplats et les icônes, où le contraste de texte ne s'applique pas.
//    (Même raisonnement que le 10 oct, quand l'or à 3,45:1 a été retiré.)
//
// 2. LE CHAMPAGNE NE PORTE JAMAIS UNE INFORMATION. 2,14:1, c'est moins que l'or
//    retiré le 10 octobre. Il sert aux filets et aux petits libellés décoratifs,
//    jamais à une heure, un lieu, un prix ou un bouton.
export const NUIT    = "#14243A";   // Bleu nuit — couleur principale    14,52:1 ✓
export const BORDEAU = "#87372F";   // Bordeaux chaud — boutons, actions   7,45:1 ✓
export const CREME   = "#FAF6F0";   // Ivoire — la valeur de la charte
// 🤍 LE FOND DE PAGE PASSE AU BLANC. Stéphanie, 28 oct 2026 : « et si tu mets
// l'arrière-plan en blanc, peut-être celui du fond du tél ». L'ivoire et le
// blanc cassé des cartes étaient trop proches : les cartes ne se détachaient
// que par leur filet rouge. En posant le blanc derrière, le blanc cassé des
// cartes devient le ton CHAUD, et l'écran respire.
export const FOND_PAGE = "#FFFFFF";
// ⚠️ LES CARTES NE SONT PLUS EN BLANC PUR. Stéphanie, 28 oct 2026 : « je ne
// veux pas de fond blanc, mets un blanc cassé ». Le #FFFFFF de la charte était
// la seule valeur froide de l'écran, au milieu d'un ivoire et d'un bordeaux
// chauds — il « sautait » à l'œil. Le blanc cassé reste plus clair que le fond
// ivoire (#FAF7F2), donc la carte se détache toujours, et le filet rouge ajouté
// le même jour marque la limite.
export const BLANC   = "#FFFCF8";   // Surface — les cartes
export const BLANC_PUR = "#FFFFFF"; // la valeur de la charte, si besoin ailleurs
export const OR      = "#C7A575";   // Champagne — décor SEULEMENT        2,15:1 ⚠️
export const GRIS    = "#737D88";   // Gris doux — aplats et icônes       3,92:1 ⚠️
export const GRIS_LISIBLE = "#6A737D"; // le même, lisible en texte       4,51:1 ✓
export const BORDURE = "#E8E2DA";   // Bordures légères — filets, jamais du texte
export const SAUGE   = "#DDE8DF";   // fond de pastille, jamais du texte

// ── 🌅 LE GRAIN DES PHOTOS ──────────────────────────────────────────────────
//
// Stéphanie, 28 oct 2026 : « je veux que les photos soient belles, chaudes et
// un peu dorées, toutes ». Les 35 photos viennent de contributeurs différents,
// à des heures et des saisons différentes : certaines sont bleutées, d'autres
// grises. Côte à côte dans une grille, ça se voit tout de suite.
//
// On les accorde donc au moment de l'AFFICHAGE, pas en retouchant les fichiers :
//   · rien n'est ajouté au poids servi, ni au paquet OTA ;
//   · une photo reçue demain d'un établissement prendra le même grain sans
//     retouche ;
//   · et on peut revenir en arrière en changeant une ligne.
//
// La recette : un peu de chaleur (`sepia`), la saturation et le contraste
// relevés d'un cheveu, et un voile champagne très dilué par-dessus. Volontaire-
// ment léger — au-delà, le bleu de la Méditerranée vire au vert, et Monaco sans
// sa mer bleue n'est plus Monaco.
// ⚠️ PREMIER RÉGLAGE TROP TIMIDE. À sepia(0.16), la différence ne se voyait
// pas sur la capture : les photos restaient bleutées et grises. Doublé.
// ⚠️ LE SÉPIA EST REDESCENDU À 0,18. À 0,34 il mangeait le bleu du ciel —
// Stéphanie, 28 oct au soir : « retouche-les avec ciel bleu ». La chaleur vient
// désormais du VOILE champagne et de la retouche des fichiers
// (`scripts/retouche-ciel.mjs`), pas d'un filtre qui jaunit tout, ciel compris.
export const GRAIN_PHOTO =
  "sepia(0.18) saturate(1.26) contrast(1.05) brightness(1.03)";

// Le voile champagne, posé en surimpression sur chaque photo.
// `soft-light` réchauffe les clairs sans noircir les ombres — `multiply`
// assombrissait trop les façades blanches du Casino et de l'Opéra.
export const VOILE_CHAUD = {
  // Le voile démarre BAS : le haut de l'image, là où se trouve le ciel, reste
  // libre. Sans ça on redorait exactement ce qu'on venait de rendre bleu.
  background: "linear-gradient(180deg, rgba(199,165,117,0.06) 0%, rgba(199,165,117,0.26) 45%, rgba(135,55,47,0.30) 100%)",
  mixBlendMode: "overlay",
};

// ── Espacement : l'échelle 8 / 12 / 16 / 24 / 32 du brief ───────────────────
export const ESP = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 };

// ── Arrondis : 12 à 18 px ───────────────────────────────────────────────────
export const RAYON = { sm: 12, md: 16, lg: 18, pastille: 999 };

// ── Ombres : « surface douce », rien de marqué ──────────────────────────────
export const OMBRE = {
  carte: "0 1px 2px rgba(23,36,60,0.04), 0 8px 24px rgba(23,36,60,0.06)",
  haute: "0 2px 6px rgba(23,36,60,0.06), 0 16px 40px rgba(23,36,60,0.10)",
};

// ── Typographie ─────────────────────────────────────────────────────────────
// Le brief demande « titres soignés (serif premium si la police est déjà
// disponible) ». Playfair Display est DÉJÀ chargée par l'app : on ne va donc
// chercher aucune police nouvelle, ce qui éviterait un chargement fragile et
// un poids inutile dans le bundle OTA.
export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS  = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

/** Un texte secondaire : heure, lieu, compte d'amis. */
export const texteSecondaire = {
  fontFamily: SANS, fontSize: 13.5, color: GRIS_LISIBLE, lineHeight: 1.5,
};

/**
 * ⚠️ LES QUATRE IMAGES D'AMBIANCE SONT RETIRÉES (28 oct 2026, au soir).
 * Elles étaient générées par IA, pesaient 592 Ko dans le paquet OTA, et plus
 * aucun écran ne les affichait depuis que la médiathèque sert de vraies photos
 * hors du bundle. Du poids transporté pour rien chez 98 appareils.
 */

/**
 * ✒️ REMETTRE UN TITRE EN CASSE DE PHRASE, SANS ABAISSER LES NOMS PROPRES.
 *
 * Le brief et les maquettes veulent « Cinéma à l'affiche cette semaine », pas
 * « CINÉMA À L'AFFICHE CETTE SEMAINE ». Les titres arrivent en capitales parce
 * que les sources les publient ainsi.
 *
 * 🚨 PREMIER ESSAI, ÉCARTÉ. Une simple mise en minuscules donnait « Wellness
 * bars 5 adresses à monaco » et « Ligue 1 AS monaco aj auxerre » — un nom propre
 * abaissé sur chaque carte, pire que la capitale de trop. Les titres sont pleins
 * de lieux, de clubs et d'artistes, et aucune liste écrite à la main ne les
 * couvrirait : il y en a des centaines, et ils changent chaque nuit.
 *
 * ✅ CE QUI MARCHE. Les SOUS-TITRES, eux, sont correctement capitalisés —
 * « Musée d'Anthropologie Préhistorique · Monaco », « Cinémas 2 Monaco ·
 * Monte-Carlo ». On en tire donc le dictionnaire à l'exécution : tout mot qui
 * apparaît quelque part avec une majuscule suivie de minuscules est un nom
 * propre, et il garde sa forme. 225 relevés au 28 oct 2026, et la liste se
 * met à jour toute seule quand les données changent.
 *
 * ⚠️ ON NE TOUCHE PAS AUX DONNÉES : la conversion se fait à l'AFFICHAGE.
 * events.json garde ses titres d'origine, et les scripts de nuit — dédoublonnage,
 * rapprochement par titre, billetterie — continuent de travailler dessus.
 */
const SIGLES = new Set([
  "DJ", "VF", "VO", "VOST", "OPMC", "AS", "ASM", "SBM", "TPG", "NMNM", "MC",
  "UEFA", "BKT", "FC", "PSG", "OM", "CREM", "AIAP", "UNESCO", "TV", "IA", "QR",
  "II", "III", "IV", "VI", "VII", "VIII", "IX", "XI", "XII", "XV", "XX", "XXI",
]);

let _noms = null;
/** Le dictionnaire, construit une fois à partir des sous-titres des fiches. */
export function apprendreLesNomsPropres(fiches) {
  const d = new Map();
  for (const e of fiches || []) {
    for (const champ of [e.subtitle, e.source, e.quarter]) {
      for (const mot of String(champ || "").split(/[\s·,—–()]+/)) {
        const nu = mot.replace(/^[^A-Za-zÀ-ÿ]+|[^A-Za-zÀ-ÿ']+$/g, "");
        if (nu.length < 3) continue;
        if (!/^[A-ZÀ-Ý][a-zà-ÿ]/.test(nu)) continue;
        d.set(nu.toLowerCase(), nu);
      }
    }
  }
  _noms = d;
  return d.size;
}

export function casseNaturelle(titre) {
  const t = String(titre || "");
  const lettres = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  // Un titre déjà en casse mixte n'est pas touché : on ne corrige que ce qui crie.
  if (!lettres || lettres !== lettres.toUpperCase()) return t;

  let debut = true;
  return t.split(/(\s+)/).map(mot => {
    if (/^\s+$/.test(mot)) return mot;
    const nu = mot.replace(/[^A-Za-zÀ-ÿ0-9']/g, "");
    if (SIGLES.has(nu.toUpperCase())) { debut = false; return mot; }
    const propre = _noms && _noms.get(nu.toLowerCase());
    if (propre) { debut = false; return mot.replace(nu, propre); }
    // ⚠️ « MONTE-CARLO » est UN mot pour le découpage, DEUX pour le dictionnaire.
    // Sans ce passage, il ressortait « monte-carlo » alors que « Monte » et
    // « Carlo » figurent tous deux dans les sous-titres.
    if (_noms && /[-']/.test(mot)) {
      const recolle = mot.split(/([-'])/).map(part => {
        const p = part.replace(/[^A-Za-zÀ-ÿ]/g, "");
        // ⚠️ Un séparateur se garde tel quel ; une lettre seule s'abaisse. Sans
        // cette distinction, « L'AFFICHE » ressortait « L'affiche » avec un L
        // majuscule au milieu de la phrase.
        if (part === "-" || part === "'") return part;
        if (p.length < 3) return part.toLowerCase();
        return _noms.get(p.toLowerCase()) || part.toLowerCase();
      }).join("");
      if (recolle !== mot.toLowerCase()) { debut = false; return recolle; }
    }
    const bas = mot.toLowerCase();
    const sortie = debut ? bas.charAt(0).toUpperCase() + bas.slice(1) : bas;
    debut = /[.!?:]$/.test(mot);
    return sortie;
  }).join("");
}


```

## `src/lib/track.js`

```js
import posthog from "posthog-js";

// Capteur de mesure partagé (invisible pour l'utilisateur).
// Volontairement silencieux : si PostHog est bloqué par le navigateur ou hors ligne,
// l'app doit continuer à fonctionner exactement pareil.
export function track(event, props) {
  try { posthog.capture(event, props); } catch { /* analytics indisponible */ }
}

```

## `src/main.jsx`

```jsx
import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
// Polices du logo EMBARQUÉES (chargées depuis l'app, pas internet) → plus de saut de taille au démarrage
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/josefin-sans/300.css'
import '@fontsource/josefin-sans/400.css'
import '@fontsource/josefin-sans/600.css'
import '@fontsource/josefin-sans/700.css'
import './index.css'
import App from './App.jsx'
import posthog from 'posthog-js'
import * as Sentry from '@sentry/react'
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'
import { SplashScreen } from '@capacitor/splash-screen'
import { Analytics } from '@vercel/analytics/react'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { Sentry.captureException(error, { extra: info }); }
  render() {
    if (this.state.error) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100dvh", fontFamily:"sans-serif", color:"#0F1D3A", gap:16 }}>
        <div style={{ fontSize:32 }}>⚠️</div>
        <div style={{ fontWeight:600 }}>Une erreur est survenue</div>
        <button onClick={() => window.location.reload()} style={{ padding:"10px 24px", background:"#7B2D26", color:"#fff", border:"none", borderRadius:8, cursor:"pointer" }}>Recharger</button>
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

// ── Version de l'interface, attachée à TOUS les événements ────────────────────
// Sans elle, impossible de savoir si une correction publiée en OTA arrive vraiment
// chez les gens : le 11 août 2026, 19 personnes déclenchaient encore un événement
// retiré du code depuis des jours, et on ne l'a découvert que par hasard.
// `register` = propriété collée à chaque événement suivant, pas seulement celui-ci.
// Tout est enveloppé : si quoi que ce soit manque, on n'envoie rien et l'app continue.
let versionInterface = 'inconnue'
try {
  // eslint-disable-next-line no-undef
  if (typeof __OTA_VERSION__ === 'string') versionInterface = __OTA_VERSION__
} catch { /* define absent (mode dev) → on garde « inconnue » */ }

try {
  posthog.register({
    version_interface: versionInterface,        // version du bundle en cours d'exécution
    plateforme: Capacitor.getPlatform(),        // ios · android · web
    natif: Capacitor.isNativePlatform(),
  })
} catch { /* jamais bloquer le démarrage pour une mesure */ }

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
  // 2) Cherche une nouvelle interface ; si dispo, la télécharge et l'applique (auto-appliquant).
  // 🚑 DEUX HÔTES POUR LA MISE À JOUR AUSSI. C'était le dernier point unique
  // de rupture : le 31 oct 2026, une adresse IP mise au défi par Vercel a
  // coupé `monac-out.vercel.app` pour un téléphone — plus de données, plus de
  // photos, ET plus de moyen de recevoir le correctif. L'app ne pouvait pas se
  // réparer elle-même.
  // `monacout.com` est un projet Vercel DISTINCT qui sert les mêmes fichiers.
  const OTA_HOTES = ['https://monac-out.vercel.app', 'https://monacout.com'];
  // L'instant du lancement : il décide si l'on peut appliquer sans déranger.
  const DEBUT = Date.now();
  window.addEventListener('load', () => {
    (async () => {
      try {
        // On essaie chaque hôte ; le premier qui répond vraiment gagne.
        // ⚠️ `res.ok` est indispensable : un 403 « Security Checkpoint » rend
        // une PAGE HTML, et `res.json()` échouerait en silence.
        let manifeste = null, hoteRetenu = null;
        for (const h of OTA_HOTES) {
          try {
            const r = await fetch(`${h}/capgo/latest.json?t=${Date.now()}`, { cache: 'no-store' });
            if (r.ok) { manifeste = await r.json(); hoteRetenu = h; break; }
          } catch { /* hôte injoignable → on tente le suivant */ }
        }
        if (!manifeste) return;
        const { version } = manifeste;
        let { url } = manifeste;
        if (!version || !url) return;                         // rien à publier
        // Le paquet se télécharge sur l'hôte qui a répondu, pas sur celui que
        // le manifeste cite : sinon on repart sur l'hôte bloqué.
        if (hoteRetenu !== OTA_HOTES[0]) {
          url = url.replace(OTA_HOTES[0], hoteRetenu);
        }
        const cur = await CapacitorUpdater.current();
        if (cur?.bundle?.version === version) return;         // déjà à jour
        const bundle = await CapacitorUpdater.download({ version, url });

        // ⏱️ APPLIQUER TOUT DE SUITE, MAIS SEULEMENT SI PERSONNE N'A ENCORE LU.
        //
        // Stéphanie, 26 oct 2026 : « ok fais ça, comme ça tout le monde aura la
        // dernière version ». Mesuré le même jour : 98 appareils répartis sur
        // 19 versions d'interface, dont 48 % sur des versions de la mi-octobre.
        // La cause n'était pas une panne — c'est que l'application se faisait
        // au PROCHAIN démarrage à froid, et que l'app se consulte 1 à 2 fois par
        // semaine. Un OTA mettait donc une à deux semaines à se répandre.
        //
        // ⚠️ POURQUOI PAS « TOUJOURS TOUT DE SUITE ». Appliquer, c'est recharger
        // la vue web. Quelqu'un en train de lire le fil verrait l'écran sauter —
        // c'est exactement ce qu'on avait écarté en écrivant `next()`. Et ce
        // n'est pas théorique : cette semaine a vu CINQ OTA, donc une personne
        // qui ouvre deux fois trouverait du nouveau presque à chaque fois.
        //
        // Le compromis : on applique immédiatement TANT QU'ON EST DANS LES
        // PREMIÈRES SECONDES du lancement, pendant que l'écran de démarrage est
        // encore là ou vient de s'effacer. La personne voit une seconde de
        // chargement en plus, et rien d'autre. Passé ce délai — connexion lente,
        // zip plus lourd — on retombe sur l'ancien comportement : au prochain
        // démarrage, sans jamais interrompre une lecture en cours.
        const AVANT_LECTURE_MS = 6000;
        if (Date.now() - DEBUT < AVANT_LECTURE_MS) {
          await CapacitorUpdater.set({ id: bundle.id });   // recharge aussitôt
        } else {
          await CapacitorUpdater.next({ id: bundle.id });  // au prochain démarrage
        }
      } catch { /* hors-ligne ou erreur → on garde la version intégrée */ }
    })();
  });
}

// Masque le SplashScreen natif + l'écran ivoire après le rendu React
setTimeout(() => {
  if (Capacitor.isNativePlatform()) {
    SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
  }
  const boot = document.getElementById('boot');
  if (boot) {
    boot.style.opacity = '0';
    setTimeout(() => boot.remove(), 500);
  }
}, 600);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      {!Capacitor.isNativePlatform() && <Analytics />}
    </ErrorBoundary>
  </StrictMode>,
)

```
