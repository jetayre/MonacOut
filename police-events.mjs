#!/usr/bin/env node
/**
 * MonacOut — « LE POLICIER » 🚓
 * Agent de contrôle qualité placé À LA SOURCE : il corrige puis VÉRIFIE
 * les dates, noms et horaires des événements AVANT toute publication.
 *
 * Tourne aux deux sources d'ajout d'événements :
 *   1. Hook pre-commit  → bloque les commits manuels fautifs
 *   2. auto-events.mjs  → bloque les push du bot scraper (rollback)
 *
 * Séquence :
 *   1. AUTOFIX  — corrige automatiquement ce qui est corrigeable
 *                 (jours de semaine, fêtes mobiles, lieux récurrents)
 *   2. CONTRÔLE — vérifie le reste ; rapide (aucun appel réseau)
 *   3. VERDICT  — exit 1 (BLOQUE) si une faute critique subsiste, sinon exit 0
 *
 * Rapide par conception : la vérification réseau des liens (lente) reste
 * dans verify-events.mjs (CI quotidienne), pas ici.
 *
 * Usage : node police-events.mjs   (exit 1 = publication refusée)
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const MOIS = { jan:0, 'fév':1, mar:2, avr:3, mai:4, juin:5, juil:6, 'août':7, sep:8, oct:9, nov:10, 'déc':11 };
const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const MONACO_DISTRICTS = new Set([
  'Monte-Carlo', 'Monaco-Ville', 'Monaco', 'Fontvieille',
  'La Condamine', 'Larvotto', 'Moneghetti', 'Jardin Exotique',
  'Saint-Roman', 'La Rousse',
]);

const FORBIDDEN_DOMAINS = [
  'visitmonaco.com', 'yourmonaco.mc', 'principocket.com',
  'monte-carlo.mc', 'culture.mc',
];

// ── Parsing ────────────────────────────────────────────────────────────────
function parseEvents(src) {
  const events = [];
  const re = /\{id:(\d+)[^}]*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const raw = m[0];
    const get = k => { const r = raw.match(new RegExp(`${k}:"([^"]*)"`)); return r ? r[1] : null; };
    const num = k => { const r = raw.match(new RegExp(`${k}:(\\d+)`)); return r ? parseInt(r[1]) : null; };
    events.push({
      id: num('id'),
      year: num('year') || 2026,
      cat: get('cat'),
      date: get('date'),
      time: get('time'),
      title: get('title'),
      subtitle: get('subtitle'),
      descEn: get('descEn'),
      link: get('link'),
      quarter: get('quarter'),
    });
  }
  return events;
}

function eventDate(e) {
  if (!e.date) return null;
  const p = e.date.trim().split(' ');
  if (p.length < 3) return null;
  const day = parseInt(p[1].replace(/[^0-9]/g, ''));
  const mo = MOIS[p[2]];
  if (mo === undefined || isNaN(day)) return null;
  return new Date(e.year, mo, day);
}

// ── Contrôles ─────────────────────────────────────────────────────────────────
// faults = BLOQUANTS (publication refusée) · warnings = signalés sans bloquer
function inspect(events) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const STALE = new Date(today); STALE.setDate(STALE.getDate() - 2); // > J-2 = anormal
  const faults = [], warnings = [];
  const lbl = e => ({ id: e.id, title: (e.title || '?').replace(/\n/g, ' '), date: e.date });
  const fault = (e, msg) => faults.push({ ...lbl(e), msg });
  const warn  = (e, msg) => warnings.push({ ...lbl(e), msg });

  for (const e of events) {
    // 1. NOM : titre obligatoire
    if (!e.title || e.title.trim().length < 2) fault(e, 'Nom (titre) manquant');

    // 2. DATE : jour de la semaine correct (hors plages "4 — 8 juil")
    if (e.date && !e.date.includes('—')) {
      const d = eventDate(e);
      if (!d) fault(e, `Date illisible : "${e.date}"`);
      else {
        const declared = e.date.trim().split(' ')[0];
        const expected = JOURS[d.getDay()];
        if (declared !== expected) fault(e, `Jour faux : "${declared}" déclaré, "${expected}" attendu pour le ${e.date}`);
        // Événement passé : nettoyé par le cron + filtré par l'app → simple avertissement,
        // sauf s'il traîne depuis > 2 jours (signe que le nettoyage ne tourne pas).
        if (d < today) {
          if (d < STALE) fault(e, `Événement périmé depuis > 2 jours (${e.date} ${e.year}) — nettoyage à vérifier`);
          else warn(e, `Événement d'hier encore présent (${e.date}) — sera nettoyé automatiquement`);
        }
      }
    }

    // (Le champ `time` est libre : heure, plage, "Toute la journée", "14h30 · 20h30"…
    //  → pas de contrôle de format. L'exactitude de l'horaire est vérifiée vs la
    //  source par source-check.mjs.)

    // 4. GÉOGRAPHIE : quartier dans Monaco
    if (e.quarter && !MONACO_DISTRICTS.has(e.quarter)) fault(e, `Hors Monaco : quartier "${e.quarter}"`);

    // 5. LIENS : pas d'agrégateur interdit, pas de HTTP non sécurisé
    if (e.link) {
      if (FORBIDDEN_DOMAINS.some(dom => e.link.includes(dom))) fault(e, `Lien agrégateur interdit : ${e.link}`);
      if (e.link.startsWith('http://')) fault(e, `Lien non sécurisé (http) : ${e.link}`);
    }

    // 6. TRADUCTION : descEn obligatoire
    if (!e.descEn || e.descEn.trim().length < 5) fault(e, 'Traduction anglaise (descEn) manquante');
  }
  return { faults, warnings };
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log('🚓 LE POLICIER — contrôle des événements avant publication\n');

// 1. AUTOFIX
console.log('  1/2 · Corrections automatiques (autofix)…');
try {
  const out = execSync('node autofix-events.mjs', { cwd: __dirname, stdio: 'pipe' }).toString().trim();
  console.log(out ? '       ' + out.split('\n').join('\n       ') : '       (rien à corriger)');
} catch (err) {
  console.log('       ⚠ autofix : ' + (err.message || 'erreur'));
}

// 2. CONTRÔLE
console.log('\n  2/2 · Contrôle qualité (dates, noms, horaires, géo, liens)…');
const events = parseEvents(readFileSync(EVENTS_FILE, 'utf8'));
const { faults, warnings } = inspect(events);

console.log(`       ${events.length} événements inspectés.\n`);

if (warnings.length > 0) {
  console.log(`   ⚠️  ${warnings.length} avertissement(s) (non bloquant) :`);
  for (const w of warnings.slice(0, 5)) console.log(`      [id:${w.id}] ${w.date || ''} — ${w.msg}`);
  if (warnings.length > 5) console.log(`      … et ${warnings.length - 5} autre(s).`);
  console.log('');
}

if (faults.length === 0) {
  console.log('✅ FEU VERT — aucun défaut critique. Publication autorisée.\n');
  process.exit(0);
}

console.log(`🛑 FEU ROUGE — ${faults.length} défaut(s) critique(s). PUBLICATION REFUSÉE :\n`);
for (const f of faults) {
  console.log(`   [id:${f.id}] ${f.date || ''} — ${f.title}`);
  console.log(`      → ${f.msg}\n`);
}
console.log('Corrige ces événements puis recommence. (Le policier a déjà appliqué les corrections automatiques possibles.)');
process.exit(1);
