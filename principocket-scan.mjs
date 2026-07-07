#!/usr/bin/env node
/**
 * MonacOut — Scan de complétude PrinciPocket
 *
 * Scrape TOUS les événements PrinciPocket, les compare à src/data/events.js,
 * et signale ceux qui MANQUENT dans l'app (fenêtre 12 mois glissante).
 * PrinciPocket agrège tous les lieux de Monaco → ce scan couvre implicitement
 * tous les lieux ajoutés (OPMC, musées, hôtels, etc.).
 *
 * Écrit principocket-scan-report.txt et envoie un email (Resend) si des events manquent.
 * Toujours exit 0 : ne bloque jamais le workflow CI.
 *
 * Usage : node principocket-scan.mjs
 * CI    : daily-check.yml (6h + 18h Monaco)
 *
 * ⚠️ PrinciPocket est une source de découverte INTERNE — son nom et ses liens
 * ne doivent jamais apparaître dans l'app. Ce script ne fait que SIGNALER.
 */

import https from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname   = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');
const REPORT_FILE = join(__dirname, 'principocket-scan-report.txt');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO    = 'stephanie.ayre@icloud.com';
const NAVY = '#0F1D3A', GOLD = '#C4A241';

const MON  = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
const MOIS = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const JOURS= ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

function norm(s='') {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function titleFromSlug(slug) {
  return norm(slug.replace(/^\/en\/events\/[0-9a-f]{32}-/, '').replace(/-/g,' '));
}

// ── Titres de l'app (normalisés) ──────────────────────────────────────────────
const src = readFileSync(EVENTS_FILE, 'utf8');
const appTitles   = [...src.matchAll(/title:"([^"]+)"/g)].map(m => norm(m[1].replace(/\\n/g,' ')));
const appWordSets = appTitles.map(t => new Set(t.split(' ').filter(w => w.length >= 4)));

function inApp(candNorm) {
  if (candNorm.length < 4) return true;
  const cw = new Set(candNorm.split(' ').filter(w => w.length >= 4));
  for (let i = 0; i < appTitles.length; i++) {
    if (appTitles[i].includes(candNorm) || candNorm.includes(appTitles[i])) return true;
    let shared = 0;
    for (const w of cw) if (appWordSets[i].has(w)) shared++;
    if (shared >= (cw.size <= 1 ? 1 : 2)) return true;
  }
  return false;
}

// ── Scrape PrinciPocket (toutes les pages) ────────────────────────────────────
function fetchPage(page) {
  return new Promise(resolve => {
    const req = https.get(`https://www.principocket.com/en/events?page=${page}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MonacOut-Scan/1.0)' }, timeout: 15000 },
      res => {
        let html = ''; res.on('data', c => html += c);
        res.on('end', () => {
          const hrefRe = /href="(\/en\/events\/[0-9a-f]{32}-[^"]+)"/g;
          const hrefs = []; let m;
          while ((m = hrefRe.exec(html)) !== null) hrefs.push({ slug: m[1], pos: m.index });
          const dateRe = /<div class="date-year">(\d{4})<\/div>[\s\S]{0,100}?<div class="date-day">(\d{1,2})<\/div>[\s\S]{0,100}?<div class="date-month">(\w{3,4})<\/div>/g;
          const dates = []; while ((m = dateRe.exec(html)) !== null) dates.push({ year:+m[1], day:+m[2], mon:m[3].toLowerCase().slice(0,3), pos:m.index });
          const events = []; const seen = new Set();
          for (const d of dates) {
            const prec = hrefs.filter(h => h.pos < d.pos && d.pos - h.pos < 2000);
            if (!prec.length) continue;
            const slug = prec[prec.length-1].slug;
            if (seen.has(slug)) continue; seen.add(slug);
            const mo = MON[d.mon]; if (mo === undefined) continue;
            events.push({ slug, title: titleFromSlug(slug), date: new Date(d.year, mo, d.day) });
          }
          resolve({ events, count: events.length });
        });
      });
    req.on('error', () => resolve({ events: [], count: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ events: [], count: 0 }); });
  });
}

const all = new Map();
for (let p = 1; p <= 25; p++) {
  const { events, count } = await fetchPage(p);
  for (const e of events) if (!all.has(e.slug)) all.set(e.slug, e);
  if (count === 0) break;
}

// ── Diff : futurs dans la fenêtre 12 mois, absents de l'app ───────────────────
const today = new Date(); today.setHours(0,0,0,0);
const horizon = new Date(today); horizon.setMonth(horizon.getMonth() + 12);
const missing = [...all.values()]
  .filter(e => e.date >= today && e.date <= horizon)
  .filter(e => !inApp(e.title))
  .sort((a,b) => a.date - b.date);

// ── Rapport ───────────────────────────────────────────────────────────────────
const dateStr = new Date().toLocaleString('fr-FR', { timeZone:'Europe/Monaco', dateStyle:'full', timeStyle:'short' });
const lines = [];
lines.push('════════════════════════════════════════════');
lines.push('  MonacOut — Scan PrinciPocket (complétude)');
lines.push(`  ${dateStr}`);
lines.push('════════════════════════════════════════════');
lines.push('');
lines.push(`PrinciPocket : ${all.size} événements scannés.`);
lines.push(`Events manquants dans l'app : ${missing.length}`);
lines.push('');
for (const e of missing) {
  const d = `${JOURS[e.date.getDay()]} ${e.date.getDate()} ${MOIS[e.date.getMonth()]} ${e.date.getFullYear()}`;
  lines.push(`   • [${d}]  ${e.title}`);
}
const report = lines.join('\n');
writeFileSync(REPORT_FILE, report + '\n');
console.log(report);

// Détection pure : aucun email. Le rapport reste dans principocket-scan-report.txt,
// repris par l'agent quotidien qui vérifie chaque event sur sa source officielle
// avant de n'ajouter QUE les 100 % sûrs.
console.log(missing.length ? `\n${missing.length} event(s) à vérifier puis ajouter (voir le rapport).` : '\nRien à signaler.');
process.exit(0);
