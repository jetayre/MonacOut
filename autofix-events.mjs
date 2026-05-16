#!/usr/bin/env node
/**
 * MonacOut — Auto-correction des erreurs détectables dans events.js
 *
 * Corrections appliquées :
 *  1. Abrégés de jour de semaine incorrects (ex: "Ven 23 mai" alors que le 23 mai est un Sam)
 *
 * Exécution : node autofix-events.mjs
 * Intégré dans GitHub Actions (daily-check.yml) avant verify-events.mjs
 *
 * Toujours exit 0 — c'est un outil de correction, pas de vérification.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const MOIS = { jan:0, 'fév':1, mar:2, avr:3, mai:4, juin:5, juil:6, 'août':7, sep:8, oct:9, nov:10, 'déc':11 };
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

const content = readFileSync(EVENTS_FILE, 'utf8');
const lines   = content.split('\n');

let fixed = 0;
const fixes = [];

const result = lines.map(line => {
  if (!line.trim().startsWith('{id:')) return line;

  const dm = line.match(/date:"([^"]+)"/);
  if (!dm) return line;
  const dateStr = dm[1];
  if (dateStr.includes('—')) return line; // plage de dates, pas de correction

  const parts = dateStr.trim().split(' ');
  if (parts.length < 3) return line;

  const declaredDay = parts[0];
  const dayNum      = parseInt(parts[1]);
  const monthIdx    = MOIS[parts[2]];
  if (monthIdx === undefined || isNaN(dayNum)) return line;

  const ym   = line.match(/year:(\d+)/);
  const year = ym ? parseInt(ym[1]) : 2026;

  const expectedDay = JOURS[new Date(year, monthIdx, dayNum).getDay()];

  if (declaredDay !== expectedDay) {
    const idM = line.match(/id:(\d+)/);
    fixes.push(`  [id:${idM?.[1]}] "${declaredDay} ${parts[1]} ${parts[2]}" → "${expectedDay} ${parts[1]} ${parts[2]}"`);
    fixed++;
    return line.replace(`date:"${dateStr}"`, `date:"${expectedDay} ${parts[1]} ${parts[2]}"`);
  }

  return line;
});

if (fixed > 0) {
  writeFileSync(EVENTS_FILE, result.join('\n'));
  console.log(`AutoFix — ${fixed} abrégé(s) de jour corrigé(s) :`);
  fixes.forEach(f => console.log(f));
} else {
  console.log('AutoFix — Aucune correction nécessaire.');
}
