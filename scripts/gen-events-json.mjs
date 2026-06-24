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

// Ajoute l'indice « plus d'infos » au titre servi (donnée → visible sur l'app
// installée SANS repasser par Apple). Les données source (events.js) restent propres.
const HINT = " ⓘ";
const events = ALL_EVENTS.map(e => {
  let t = e.title;
  if (e.emoji && !t.startsWith(e.emoji)) t = e.emoji + " " + t;   // icône au début (donnée → visible sans v1.7)
  if (!t.endsWith(HINT)) t = t + HINT;                            // indice « plus d'infos » à la fin
  return { ...e, title: t };
});

const payload = {
  generatedAt: new Date().toISOString(),
  count: events.length,
  events,
};

const out = join(ROOT, 'public', 'events.json');
writeFileSync(out, JSON.stringify(payload), 'utf8');
console.log(`✓ events.json généré (${ALL_EVENTS.length} événements) → ${out}`);
