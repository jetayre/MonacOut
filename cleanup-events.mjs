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

// Une fiche « en cours » encore ouverte mais restée sur une vieille date est
// REDATÉE ici, au lieu d'être laissée en l'état. Sans quoi le policier la
// déclarait périmée et REFUSAIT le commit — Stéphanie, 11 septembre 2026 : « le
// policier ne doit pas bloquer la mise à jour des bonnes infos ». Elle a raison :
// le nettoyage disait « je la garde, elle est encore ouverte » et le policier
// répondait « elle est périmée, je bloque tout ». Deux scripts qui se
// contredisent ne doivent pas coûter une publication.
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS_FR  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const dateDuJour = `${JOURS_FR[today.getDay()]} ${today.getDate()} ${MOIS_FR[today.getMonth()]}`;
let redatees = 0;

const filtered = lines.filter(line => {
  if (!line.trim().startsWith('{id:')) return true;
  if (encoreOuvert(line)) return true;
  const d = parseEventDate(line);
  if (d && d < cutoff) { removed++; return false; }
  return true;
}).map(line => {
  if (!encoreOuvert(line)) return line;
  const d = parseEventDate(line);
  if (!d || d >= today) return line;
  redatees++;
  return line.replace(/date:"[^"]*"/, `date:"${dateDuJour}"`)
             .replace(/,year:\d{4}/, `,year:${today.getFullYear()}`);
});

if (redatees > 0) console.log(`${redatees} fiche(s) « en cours » redatée(s) au ${dateDuJour}.`);
if (removed > 0 || redatees > 0) {
  writeFileSync(EVENTS_FILE, filtered.join('\n'));
  if (removed > 0) console.log(`${removed} événement(s) passé(s) supprimé(s).`);
} else {
  console.log('Aucun événement passé à supprimer.');
}
