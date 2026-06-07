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

// Priorité aux événements phares (hot) — ils remontent en tête du widget,
// puis on complète avec les prochains événements. Chaque groupe reste trié
// par date (ALL_EVENTS est déjà chronologique).
const hot = ALL_EVENTS.filter(e => e.hot);
const rest = ALL_EVENTS.filter(e => !e.hot);
const selected = [...hot, ...rest].slice(0, 8);

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
