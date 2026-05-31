#!/usr/bin/env node
/**
 * MonacOut — Auto-correction des erreurs détectables dans events.js
 *
 * Corrections appliquées :
 *  1. Abrégés de jour de semaine incorrects (ex: "Ven 23 mai" alors que le 23 mai est un Sam)
 *  2. Événements récurrents placés sur le mauvais jour (ex: Nikki Beach brunch un Lundi au lieu du Samedi)
 *     → Skip si la date cible a déjà un événement du même venue+cat (évite les doublons)
 *
 * Exécution : node autofix-events.mjs
 * Intégré dans GitHub Actions (daily-check.yml) avant verify-events.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const MOIS     = { jan:0, 'fév':1, mar:2, avr:3, mai:4, juin:5, juil:6, 'août':7, sep:8, oct:9, nov:10, 'déc':11 };
const MOIS_ARR = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const JOURS    = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

// ─── Calcul des fêtes mobiles ────────────────────────────────────────────────
function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

// Fêtes MOBILES avec date unique exacte (Lundi férié)
// Noël/Toussaint exclus : ce sont des saisons, pas un jour précis — trop d'events légitimes ont ces mots
function holidayRules(year) {
  const easter = easterDate(year);
  return [
    { key: /p[âa]ques/i,       label: 'Lundi de Pâques',    exact: addDays(easter, 1),  margin: 10 },
    { key: /ascension/i,       label: 'Jeudi de l\'Ascension', exact: addDays(easter, 39), margin: 4  },
    { key: /pentec[oô]te/i,    label: 'Lundi de Pentecôte',  exact: addDays(easter, 50), margin: 7  },
  ];
}

// ─── Règles venue → jour attendu (tirées du tableau CLAUDE.md) ──────────────
const VENUE_DAY_RULES = [
  { venue: 'Nobu Monte-Carlo',        day: 0, cat: 'BRUNCH'  },
  { venue: 'Woo Monaco',              day: 1, cat: 'BRUNCH'  },
  { venue: 'Sass Café',               day: 2, cat: 'APÉRO'   },
  { venue: 'Bar Américain',           day: 3, cat: 'APÉRO'   },
  { venue: 'AMU Monte-Carlo',         day: 4, cat: 'APÉRO'   },
  { venue: 'La Note Bleue',           day: 5, cat: 'APÉRO'   },
  { venue: 'La Note Bleue',           day: 6, cat: 'BRUNCH'  },
  { venue: 'Nikki Beach',             day: 6, cat: 'BRUNCH'  },
  { venue: 'La Brasserie de Monaco',  day: 6, cat: 'BRUNCH'  },
  { venue: "Jimmy'z",                 day: 6, cat: 'SOIRÉE'  },
  { venue: "Lilly's Club",            day: 6, cat: 'SOIRÉE'  },
  { venue: 'Monaco Brewery',          day: 6, cat: 'APÉRO'   },
  { venue: 'Amber Lounge',            day: 6, cat: 'GALA'    },
  { venue: 'Sunset Monaco',           day: 6, cat: 'DJ SET'  },
  { venue: 'Panino Club',             day: 5, cat: 'APÉRO'   },
  { venue: 'U Tapu',                  day: 5, cat: 'APÉRO'   },
  { venue: 'Trinity Monaco',          day: 5, cat: 'APÉRO'   },
  { venue: 'Slammers',                day: 4, cat: 'APÉRO'   },
  { venue: 'Ship & Castle',           day: 4, cat: 'APÉRO'   },
  { venue: 'Equivoque',               day: 5, cat: 'APÉRO'   },
  { venue: 'Jack Monaco',             day: 5, cat: 'APÉRO'   },
  { venue: 'Jack Monaco',             day: 6, cat: 'SOIRÉE'  },
];

function nearestCorrectDay(year, month, day, targetDayIdx) {
  for (const offset of [-1, 1, -2, 2, -3, 3]) {
    const candidate = new Date(year, month, day + offset);
    if (candidate.getDay() === targetDayIdx) return candidate;
  }
  return null;
}

const content = readFileSync(EVENTS_FILE, 'utf8');
const lines   = content.split('\n');

// ─── Index existant : "venue|cat|date" → true (pour détecter les collisions) ─
const existingIndex = new Set();
for (const line of lines) {
  if (!line.trim().startsWith('{id:')) continue;
  const sm = line.match(/subtitle:"([^"]+)"/);
  const cm = line.match(/cat:"([^"]+)"/);
  const dm = line.match(/date:"([^"]+)"/);
  if (sm && cm && dm) existingIndex.add(`${sm[1]}|${cm[1]}|${dm[1]}`);
}

let fixed = 0;
let skipped = 0;
let deleted = 0;
const fixes     = [];
const skips     = [];
const deletions = [];

const result = lines.map(line => {
  if (!line.trim().startsWith('{id:')) return line;

  const dm = line.match(/date:"([^"]+)"/);
  if (!dm) return line;
  const dateStr = dm[1];
  if (dateStr.includes('—')) return line;

  const parts = dateStr.trim().split(' ');
  if (parts.length < 3) return line;

  const declaredDay = parts[0];
  const dayNum      = parseInt(parts[1]);
  const monthIdx    = MOIS[parts[2]];
  if (monthIdx === undefined || isNaN(dayNum)) return line;

  const ym   = line.match(/year:(\d+)/);
  const year = ym ? parseInt(ym[1]) : new Date().getFullYear();
  const idM  = line.match(/id:(\d+)/);
  const id   = idM?.[1];

  // ── Correction 3 : date hors fenêtre d'une fête mobile ─────────────────
  const titleM = line.match(/title:"([^"]*)"/);
  const descM  = line.match(/desc:"([^"]*)"/);
  const eventText = ((titleM?.[1] || '') + ' ' + (descM?.[1] || '')).toLowerCase();
  for (const { key, label, exact, margin } of holidayRules(year)) {
    if (!key.test(eventText)) continue;
    const eventD = new Date(year, monthIdx, dayNum);
    const diff   = Math.abs((eventD - exact) / 86400000);
    if (diff > margin) {
      const newDay  = JOURS[exact.getDay()];
      const newNum  = exact.getDate();
      const newMois = MOIS_ARR[exact.getMonth()];
      const newDate = `${newDay} ${newNum} ${newMois}`;
      fixes.push(`  [id:${id}] "${label}" ${year} : "${dateStr}" → "${newDate}" (écart ${Math.round(diff)}j — corrigé automatiquement)`);
      fixed++;
      line = line.replace(`date:"${dateStr}"`, `date:"${newDate}"`);
      // Mettre à jour dateStr pour la suite
      parts[0] = newDay; parts[1] = String(newNum); parts[2] = newMois;
    }
    break;
  }

  // ── Correction 1 : abrégé de jour incorrect ─────────────────────────────
  const currentDateStr = line.match(/date:"([^"]+)"/)?.[1] || dateStr;
  const currentParts   = currentDateStr.split(' ');
  const currentDay     = currentParts[0];
  const currentNum     = parseInt(currentParts[1]);
  const currentMonth   = MOIS[currentParts[2]];
  const expectedDay = currentMonth !== undefined ? JOURS[new Date(year, currentMonth, currentNum).getDay()] : null;
  if (expectedDay && currentDay !== expectedDay) {
    fixes.push(`  [id:${id}] label "${currentDay}" → "${expectedDay}" pour le ${currentNum} ${currentParts[2]} ${year}`);
    fixed++;
    line = line.replace(`date:"${currentDateStr}"`, `date:"${expectedDay} ${currentParts[1]} ${currentParts[2]}"`);
  }

  // ── Correction 2 : mauvais jour pour une venue récurrente ────────────────
  const subtitleM = line.match(/subtitle:"([^"]+)"/);
  const catM      = line.match(/cat:"([^"]+)"/);
  if (!subtitleM || !catM) return line;

  const subtitle  = subtitleM[1];
  const cat       = catM[1];
  const actualDay = new Date(year, monthIdx, dayNum).getDay();

  for (const rule of VENUE_DAY_RULES) {
    if (!subtitle.includes(rule.venue) || cat !== rule.cat || actualDay === rule.day) continue;

    const correct = nearestCorrectDay(year, monthIdx, dayNum, rule.day);
    if (!correct) continue;

    // Sécurité : écart ≤ 3 jours
    const diffDays = Math.abs(
      correct.getDate() - dayNum + (correct.getMonth() - monthIdx) * 30
    );
    if (diffDays > 3) continue;

    const newDay  = JOURS[correct.getDay()];
    const newNum  = correct.getDate();
    const newMois = MOIS_ARR[correct.getMonth()];
    const newDate = `${newDay} ${newNum} ${newMois}`;

    // Anti-collision : si la date cible a déjà un event du même venue+cat
    const collisionKey = `${subtitle}|${cat}|${newDate}`;
    if (existingIndex.has(collisionKey)) {
      if (diffDays <= 1) {
        // Écart de 1 jour = erreur de calcul systématique → supprimer le doublon
        deletions.push(`  [id:${id}] "${rule.venue}" (${cat}) : "${declaredDay} ${dayNum} ${parts[2]}" supprimé (doublon de "${newDate}")`);
        deleted++;
        return null; // supprime la ligne
      } else {
        // Écart de 2-3 jours = possiblement un événement spécial → conserver
        skips.push(`  [id:${id}] "${rule.venue}" (${cat}) : "${declaredDay} ${dayNum} ${parts[2]}" → "${newDate}" conservé (écart ${diffDays}j, vérifier manuellement)`);
        skipped++;
      }
      break;
    }

    fixes.push(`  [id:${id}] venue "${rule.venue}" (${cat}) : "${declaredDay} ${dayNum} ${parts[2]}" → "${newDate}"`);
    fixed++;
    line = line.replace(`date:"${dateStr}"`, `date:"${newDate}"`);
    break;
  }

  return line;
});

const hasChanges = fixed > 0 || deleted > 0;
if (hasChanges || skipped > 0) {
  if (hasChanges) {
    writeFileSync(EVENTS_FILE, result.filter(l => l !== null).join('\n'));
  }
  if (fixed > 0) {
    console.log(`AutoFix — ${fixed} correction(s) de jour appliquée(s) :`);
    fixes.forEach(f => console.log(f));
  }
  if (deleted > 0) {
    console.log(`AutoFix — ${deleted} doublon(s) supprimé(s) (±1 jour, correct déjà présent) :`);
    deletions.forEach(d => console.log(d));
  }
  if (skipped > 0) {
    console.log(`AutoFix — ${skipped} événement(s) à vérifier manuellement (écart 2-3j) :`);
    skips.forEach(s => console.log(s));
  }
} else {
  console.log('AutoFix — Aucune correction nécessaire.');
}
