#!/usr/bin/env node
/**
 * MonacOut — « CONTRÔLE-SOURCE » 🔎🚓
 * Vérifie AUTOMATIQUEMENT l'exactitude des dates par rapport aux SITES OFFICIELS,
 * SANS validation humaine.
 *
 * Principe (règle d'or : une date fausse est pire qu'un événement absent) :
 *   - Pour chaque événement ponctuel à venir (concert, opéra, conférence, sport,
 *     gala, expo…) ayant un lien officiel : on REND la page (navigateur Playwright,
 *     comme le scraper) et on cherche la date de l'événement.
 *   - Date trouvée            → l'événement est CONFIRMÉ, on le garde.
 *   - Page OK mais date absente→ l'événement est RETIRÉ automatiquement.
 *   - Page en erreur / réseau  → ON NE TOUCHE À RIEN (sécurité anti-faux positif).
 *
 * Aucune intervention humaine. Lent (réseau + navigateur) → CI quotidienne.
 *
 * Usage :
 *   node source-check.mjs            # DRY-RUN : signale, ne supprime pas (défaut)
 *   node source-check.mjs --apply    # APPLIQUE : retire les événements non confirmés
 *   node source-check.mjs --limit=20 # limite le nombre de vérifs (test)
 */

import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');
const REPORT_FILE = join(__dirname, 'source-check-report.txt');

const APPLY = process.argv.includes('--apply');
const LIMIT = (() => { const a = process.argv.find(x => x.startsWith('--limit=')); return a ? parseInt(a.split('=')[1]) : Infinity; })();

const MOIS_FR  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const MOIS_FULL_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const MOIS_EN  = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const MOIS_EN3 = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const MOIS_IDX = { jan:0,'fév':1,mar:2,avr:3,mai:4,juin:5,juil:6,'août':7,sep:8,oct:9,nov:10,'déc':11 };

// Catégories ponctuelles et datées (billetterie). On exclut les récurrences
// (brunch/apéro/soirée/atelier…) dont la page n'affiche pas de date précise.
const VERIFIABLE = new Set([
  'CONCERT','OPÉRA','MUSICAL','THÉÂTRE','DANSE','SPECTACLE','GALA','FESTIVAL',
  'CONFÉRENCE','SALON','ENCHÈRES','EXPOSITION','TENNIS','FOOTBALL','BASKET',
  'FORMULE 1','FORMULE E','RALLYE','CHANTS',
]);
const GENERIC_LINK = /mairie\.mc|visitmonaco|yourmonaco/i;

// Une page d'accueil n'affiche pas de date précise → invérifiable, on n'y touche pas.
function isHomepage(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/\/$/, '').toLowerCase();
    return p === '' || ['/en','/fr','/fr-fr','/en-us','/en-gb','/home','/accueil'].includes(p);
  } catch { return true; }
}

function parseEvents(src) {
  const events = [];
  const re = /\{id:(\d+)[^}]*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const raw = m[0];
    const get = k => { const r = raw.match(new RegExp(`${k}:"([^"]*)"`)); return r ? r[1] : null; };
    const num = k => { const r = raw.match(new RegExp(`${k}:(\\d+)`)); return r ? parseInt(r[1]) : null; };
    events.push({ id: num('id'), year: num('year') || 2026, cat: get('cat'), date: get('date'), title: get('title'), link: get('link') });
  }
  return events;
}

function parts(e) {
  if (!e.date) return null;
  const p = e.date.trim().split(' ');
  const day = parseInt((p[1] || '').replace(/[^0-9]/g, ''));
  const mi = MOIS_IDX[p[2]];
  if (isNaN(day) || mi === undefined) return null;
  return { day, mi, jsDate: new Date(e.year, mi, day) };
}

function datePatterns(day, mi, year) {
  const d = String(day), dd = String(day).padStart(2,'0'), mm = String(mi+1).padStart(2,'0');
  return [
    `${d} ${MOIS_FR[mi]}`, `${d} ${MOIS_FULL_FR[mi]}`, `${d} ${MOIS_EN[mi]}`, `${d} ${MOIS_EN3[mi]}`,
    `${MOIS_EN[mi]} ${d}`, `${MOIS_EN3[mi]} ${d}`, `${dd}/${mm}`, `${dd}.${mm}`, `${dd}-${mm}`, `${year}-${mm}-${dd}`,
  ].map(s => s.toLowerCase());
}

async function main() {
  const today = new Date(); today.setHours(0,0,0,0);
  const horizon = new Date(today); horizon.setDate(horizon.getDate() + 30);

  const src = readFileSync(EVENTS_FILE, 'utf8');
  const all = parseEvents(src);
  let todo = all.filter(e => {
    if (!VERIFIABLE.has(e.cat)) return false;
    if (!e.link || GENERIC_LINK.test(e.link)) return false;
    if (e.date && e.date.includes('—')) return false;
    const p = parts(e);
    return p && p.jsDate >= today && p.jsDate <= horizon;
  });
  if (todo.length > LIMIT) todo = todo.slice(0, LIMIT);

  console.log(`🔎 CONTRÔLE-SOURCE ${APPLY ? '(APPLIQUE)' : '(DRY-RUN)'} — ${todo.length} événements ponctuels (30 j).\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (compatible; MonacOut-SourceCheck/1.0)' });

  const confirmed = [], toRemove = [], skipped = [];
  for (const e of todo) {
    const p = parts(e);
    const title = (e.title || '').replace(/\n/g, ' ');
    let text = '';
    try {
      await page.goto(e.link, { waitUntil: 'networkidle', timeout: 20000 });
      text = (await page.evaluate(() => document.body?.innerText || '')).toLowerCase().replace(/\s+/g, ' ');
    } catch {
      skipped.push({ id: e.id, date: e.date, title, link: e.link, reason: 'page injoignable (réseau) — non touché' });
      continue;
    }
    if (!text || text.length < 50) { skipped.push({ id: e.id, date: e.date, title, link: e.link, reason: 'page vide — non touché' }); continue; }

    const found = datePatterns(p.day, p.mi, e.year).some(s => text.includes(s));
    if (found) {
      confirmed.push(e.id);
    } else if (isHomepage(e.link)) {
      // Page d'accueil : la date n'y figure jamais → invérifiable, on ne supprime pas.
      skipped.push({ id: e.id, date: e.date, title, link: e.link, reason: 'lien = page d\'accueil, date invérifiable — non touché' });
    } else {
      // Page d'événement précise + date absente → suppression automatique justifiée.
      toRemove.push({ id: e.id, date: e.date, title, link: e.link });
    }
  }
  await browser.close();

  // ── Application : retrait automatique des non-confirmés
  let removed = 0;
  if (APPLY && toRemove.length > 0) {
    const ids = new Set(toRemove.map(r => r.id));
    const kept = src.split('\n').filter(line => {
      const m = line.match(/^\s*\{id:(\d+)/);
      if (m && ids.has(parseInt(m[1]))) { removed++; return false; }
      return true;
    });
    writeFileSync(EVENTS_FILE, kept.join('\n'), 'utf8');
  }

  // ── Rapport
  const ts = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });
  let report = `========================================\n`;
  report += `MONACOUT — CONTRÔLE-SOURCE (exactitude vs sites officiels)\n`;
  report += `Généré le : ${ts}  ·  Mode : ${APPLY ? 'APPLIQUÉ' : 'DRY-RUN'}\n`;
  report += `Confirmés : ${confirmed.length}  ·  Non confirmés : ${toRemove.length}  ·  Ignorés (réseau) : ${skipped.length}\n`;
  report += `========================================\n\n`;
  if (toRemove.length) {
    report += `── DATES NON CONFIRMÉES SUR LA SOURCE ${APPLY ? '(RETIRÉS)' : '(seraient retirés)'} ──\n`;
    for (const r of toRemove) report += `[id:${r.id}] ${r.date} — ${r.title}\n  ${r.link}\n`;
    report += '\n';
  }
  if (skipped.length) {
    report += `── IGNORÉS (erreur réseau, non touchés par sécurité) ──\n`;
    for (const s of skipped) report += `[id:${s.id}] ${s.date} — ${s.title} (${s.reason})\n`;
    report += '\n';
  }
  if (!toRemove.length && !skipped.length) report += `✓ Toutes les dates correspondent aux sites officiels.\n`;
  writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(report);
  console.log(APPLY ? `Retirés : ${removed} événement(s). Rapport : ${REPORT_FILE}` : `Rapport : ${REPORT_FILE} (aucune suppression — relancer avec --apply)`);

  if (toRemove.length > 0) process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
