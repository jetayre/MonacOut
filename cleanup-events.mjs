#!/usr/bin/env node
/**
 * MonacOut — Suppression automatique des événements passés (J-1).
 * Utilisé par GitHub Actions et le hook pre-commit. Exit 0 toujours.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const MOIS = { jan: 0, 'fév': 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, 'août': 7, sep: 8, oct: 9, nov: 10, 'déc': 11 };

function parseEventDate(line) {
  const dateMatch = line.match(/date:"([^"]+)"/);
  if (!dateMatch) return null;
  const dateStr = dateMatch[1];
  if (dateStr.includes('—')) return null;
  const yearMatch = line.match(/year:(\d+)/);
  const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
  const parts = dateStr.trim().split(' ');
  if (parts.length < 3) return null;
  const day = parseInt(parts[1]);
  const month = MOIS[parts[2]];
  if (month === undefined || isNaN(day)) return null;
  return new Date(year, month, day);
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const cutoff = new Date(today);
cutoff.setDate(cutoff.getDate() - 1);

const content = readFileSync(EVENTS_FILE, 'utf8');
const lines = content.split('\n');
let removed = 0;

// Une attraction EN COURS (ongoing:true) est ouverte tous les jours jusqu'à `until`.
// Elle ne porte qu'une date, redatée chaque nuit par refresh-cinema.mjs. Si ce
// redatage saute une seule fois, elle tombait ici et était SUPPRIMÉE pour de bon —
// une exposition ouverte jusqu'en janvier disparaissait sans que personne le voie.
// On ne la supprime donc que lorsque sa date de fin est réellement passée.
function encoreOuvert(line) {
  if (!/ongoing:true/.test(line)) return false;
  const u = line.match(/until:"(\d{4}-\d{2}-\d{2})"/);
  if (!u) return false;
  const fin = new Date(u[1] + 'T00:00:00');
  return !isNaN(fin) && fin >= today;
}

const filtered = lines.filter(line => {
  if (!line.trim().startsWith('{id:')) return true;
  if (encoreOuvert(line)) return true;
  const d = parseEventDate(line);
  if (d && d < cutoff) { removed++; return false; }
  return true;
});

if (removed > 0) {
  writeFileSync(EVENTS_FILE, filtered.join('\n'));
  console.log(`${removed} événement(s) passé(s) supprimé(s).`);
} else {
  console.log('Aucun événement passé à supprimer.');
}
