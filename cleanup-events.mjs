#!/usr/bin/env node
/**
 * MonacOut — Suppression automatique des événements > 30j dans le passé.
 * Utilisé par GitHub Actions. Exit 0 toujours.
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
  const year = yearMatch ? parseInt(yearMatch[1]) : 2026;
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
cutoff.setDate(cutoff.getDate() - 30);

const content = readFileSync(EVENTS_FILE, 'utf8');
const lines = content.split('\n');
let removed = 0;

const filtered = lines.filter(line => {
  if (!line.trim().startsWith('{id:')) return true;
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
