// Chargement des événements EN DIRECT depuis le site (events.json).
// Permet de corriger/ajouter des événements SANS repasser par Apple.
// Repli automatique sur les données embarquées si pas de réseau.

import { ALL_EVENTS } from "./events";

const LIVE_URL = "https://monacout.vercel.app/events.json";
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

// Filtre aujourd'hui→futur + tri chronologique (comme ALL_EVENTS, mais au runtime)
function normalize(events) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return events
    .filter(e => { const d = eventDate(e); return d && d >= today; })
    .sort((a, b) => {
      const diff = eventDate(a) - eventDate(b);
      return diff !== 0 ? diff : eventHour(a) - eventHour(b);
    });
}

export async function fetchLiveEvents() {
  try {
    const res = await fetch(`${LIVE_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.events?.length) return null;
    return normalize(data.events);
  } catch {
    return null; // hors-ligne → l'app garde les données embarquées
  }
}

// Données embarquées (repli immédiat au démarrage)
export const BUNDLED_EVENTS = ALL_EVENTS;
