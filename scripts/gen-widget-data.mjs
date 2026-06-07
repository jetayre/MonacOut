#!/usr/bin/env node
/**
 * MonacOut — Génère public/widget-events.json pour le widget iOS natif.
 * Lit ALL_EVENTS (déjà filtré aujourd'hui→futur et trié) et exporte
 * les 8 prochains événements dans un format simple que le widget Swift lit.
 *
 * Publié sur https://monacout.vercel.app/widget-events.json à chaque déploiement.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const MOIS = { jan:0, 'fév':1, mar:2, avr:3, mai:4, juin:5, juil:6, 'août':7, sep:8, oct:9, nov:10, 'déc':11 };

function isoDate(e) {
  const p = e.date.trim().split(' ');
  const m = MOIS[p[2]];
  if (m === undefined) return null;
  const year = e.year || new Date().getFullYear();
  const day = parseInt(p[1]);
  if (isNaN(day)) return null;
  // Construction locale (pas de conversion UTC) pour garder le bon jour
  const pad = n => String(n).padStart(2, '0');
  return `${year}-${pad(m + 1)}-${pad(day)}`;
}

const { ALL_EVENTS } = await import('../src/data/events.js');

// Importance par catégorie : les événements majeurs (F1, sport, galas, opéra…)
// passent avant les soirées/brunchs/apéros récurrents. Plus le poids est bas,
// plus l'événement est prioritaire dans le widget.
const CAT_RANK = {
  'FORMULE 1': 0, 'FORMULE E': 0, 'TENNIS': 0, 'FOOTBALL': 0, 'BASKET': 0,
  'RALLYE': 0, 'SPORT': 1, 'GALA': 1, 'OPÉRA': 1, 'FESTIVAL': 1, 'ENCHÈRES': 1,
  'CONCERT': 2, 'THÉÂTRE': 2, 'MUSICAL': 2, 'DANSE': 2, 'SPECTACLE': 2,
  'EXPOSITION': 2, 'SALON': 2, 'CONFÉRENCE': 2, 'CHANTS': 2, 'JAZZ LIVE': 2,
  'CINÉMA': 3, 'ATELIER': 3, 'MARCHÉ': 3, 'BIEN-ÊTRE': 3, 'FÊTE NATIONALE': 1,
  'BRUNCH': 4, 'APÉRO': 4, 'SOIRÉE': 4, 'DJ SET': 4,
};
const rank = e => CAT_RANK[e.cat] ?? 3;

// On ne re-priorise que les prochains événements (fenêtre courte), pour ne pas
// faire remonter un match de foot lointain devant les sorties du jour.
// ALL_EVENTS est déjà trié par date : on prend les 14 plus proches comme vivier,
// on les classe par (hot, importance, date), puis on garde les 8 premiers.
const pool = ALL_EVENTS.slice(0, 14);
const selected = pool
  .map((e, i) => ({ e, i })) // i = rang chronologique d'origine (tri stable)
  .sort((a, b) =>
    (a.e.hot === b.e.hot ? 0 : a.e.hot ? -1 : 1) ||
    rank(a.e) - rank(b.e) ||
    a.i - b.i
  )
  .slice(0, 8)
  .map(x => x.e);

const items = selected.map(e => ({
  date: e.date,                                   // "Sam 30 mai"
  iso: isoDate(e),                                // "2026-05-30"
  time: e.time || '',
  title: (e.title || '').replace(/\n/g, ' '),
  venue: (e.subtitle || '').split('·')[0].trim(), // nom de salle
  quarter: e.quarter || '',
  emoji: e.emoji || '📍',
}));

const payload = {
  generatedAt: new Date().toISOString(),
  events: items,
};

const out = join(ROOT, 'public', 'widget-events.json');
writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8');
console.log(`✓ widget-events.json généré (${items.length} événements) → ${out}`);
