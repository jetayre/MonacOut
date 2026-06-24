#!/usr/bin/env node
/**
 * MonacOut — Génère public/events.json (TOUS les événements à venir).
 * L'app le télécharge en direct à chaque ouverture → les corrections de données
 * apparaissent SANS repasser par Apple. Repli sur les données embarquées hors-ligne.
 *
 * Publié sur https://monacout.vercel.app/events.json à chaque déploiement.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { ALL_EVENTS } = await import('../src/data/events.js');

const payload = {
  generatedAt: new Date().toISOString(),
  count: ALL_EVENTS.length,
  events: ALL_EVENTS,
};

const out = join(ROOT, 'public', 'events.json');
writeFileSync(out, JSON.stringify(payload), 'utf8');
console.log(`✓ events.json généré (${ALL_EVENTS.length} événements) → ${out}`);
