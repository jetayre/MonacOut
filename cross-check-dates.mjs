#!/usr/bin/env node
/**
 * MonacOut — Vérification croisée des dates
 *
 * Scrape PrinciPocket (source fiable) pour les 14 prochains mois,
 * compare les dates avec events.js, corrige automatiquement les écarts.
 *
 * Sources utilisées en interne uniquement — jamais exposées à l'utilisateur.
 * Les liens PrinciPocket/YourMonaco ne sont jamais insérés dans events.js.
 *
 * Usage : node cross-check-dates.mjs
 * CI    : lancé avant verify-events dans daily-check.yml
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const MOIS_FR  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const EN_MON   = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };

// ── Normalisation titre ───────────────────────────────────────────────────────

function norm(s = '') {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function titleFromSlug(slug) {
  // "/en/events/HASH32-Title-of-Event" → "title of event"
  return norm(slug.replace(/^\/en\/events\/[0-9a-f]{32}-/, '').replace(/-/g, ' '));
}

/** Similarité Jaccard sur les mots de ≥4 chars */
function jaccard(a, b) {
  const wa = new Set(a.split(' ').filter(w => w.length >= 4));
  const wb = new Set(b.split(' ').filter(w => w.length >= 4));
  if (wa.size === 0 || wb.size === 0) return 0;
  const inter = [...wa].filter(w => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return inter / union;
}

// ── Scraping PrinciPocket ─────────────────────────────────────────────────────

async function fetchPrinciPocketPage(page) {
  const url = `https://www.principocket.com/en/events?page=${page}`;
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MonacOut-DateChecker/1.0)' },
    });
    if (!res.ok) return { events: [], hasMore: false };
    const html = await res.text();

    // Collect all event href positions
    const hrefRe = /href="(\/en\/events\/[^"]+)"/g;
    const hrefs  = [];
    let m;
    while ((m = hrefRe.exec(html)) !== null) hrefs.push({ slug: m[1], pos: m.index });

    // Collect all date block positions: date-year + date-day + date-month
    // Structure: <div class="date-year">YYYY</div> <div class="date-content"> <div class="date-day">D</div> <div class="date-month">Mon</div> </div>
    const dateRe = /<div class="date-year">(\d{4})<\/div>[\s\S]{0,100}?<div class="date-day">(\d{1,2})<\/div>[\s\S]{0,100}?<div class="date-month">(\w{3,4})<\/div>/g;
    const dates  = [];
    while ((m = dateRe.exec(html)) !== null) {
      dates.push({ year: parseInt(m[1]), day: parseInt(m[2]), mon: m[3].toLowerCase().slice(0,3), pos: m.index });
    }

    // For each date, find the closest href that precedes it (within 2000 chars)
    const seen   = new Set();
    const events = [];
    for (const d of dates) {
      const preceding = hrefs.filter(h => h.pos < d.pos && d.pos - h.pos < 2000);
      if (preceding.length === 0) continue;
      const { slug } = preceding[preceding.length - 1];
      if (seen.has(slug)) continue;
      seen.add(slug);
      const monIdx = EN_MON[d.mon];
      if (monIdx === undefined) continue;
      events.push({ slug, titleNorm: titleFromSlug(slug), date: new Date(d.year, monIdx, d.day) });
    }

    // Check if there's a next page in pagination
    const hasMore = /[?&]page=(\d+)/.test(html) && events.length > 0;
    return { events, hasMore };
  } catch {
    return { events: [], hasMore: false };
  }
}

async function fetchAllPrinciPocket() {
  const now      = new Date();
  const cutoff   = new Date(now.getFullYear(), now.getMonth() + 14, 1); // 14 months ahead
  const allEvents = [];
  const seen     = new Set();

  // Paginate through all pages, stop when events are beyond 14-month window
  for (let page = 1; page <= 20; page++) {
    const { events, hasMore } = await fetchPrinciPocketPage(page);
    if (events.length === 0) break;

    let allPast = true;
    for (const e of events) {
      if (e.date >= now && e.date < cutoff) {
        allPast = false;
        if (!seen.has(e.slug)) { seen.add(e.slug); allEvents.push(e); }
      } else if (e.date >= cutoff) {
        allPast = false; // Future but beyond window — keep paginating
      }
    }

    if (!hasMore) break;
    // Small delay to be respectful
    await new Promise(r => setTimeout(r, 300));
  }
  return allEvents;
}

// ── Parsing events.js ─────────────────────────────────────────────────────────

function parseEventsJs(src) {
  const MOIS_IDX = Object.fromEntries(MOIS_FR.map((m,i) => [m,i]));
  const events = [];
  const re = /\{id:(\d+)[^\n]+\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const raw    = m[0];
    const id     = parseInt(raw.match(/id:(\d+)/)?.[1]);
    const yearM  = raw.match(/year:(\d+)/);
    const year   = yearM ? parseInt(yearM[1]) : new Date().getFullYear();
    const dateM  = raw.match(/date:"([^"]+)"/);
    const titleM = raw.match(/title:"([^"]+)"/);
    if (!dateM || !titleM) continue;
    const dateStr = dateM[1];
    if (dateStr.includes('—')) continue; // range dates — skip
    const parts   = dateStr.trim().split(' ');
    if (parts.length < 3) continue;
    const day     = parseInt(parts[1]);
    const monIdx  = MOIS_IDX[parts[2]];
    if (isNaN(day) || monIdx === undefined) continue;
    events.push({
      id, year, dateStr,
      date: new Date(year, monIdx, day),
      titleNorm: norm(titleM[1].replace(/\\n/g, ' ')),
      _raw: raw,
    });
  }
  return events;
}

// ── Correspondance titre ──────────────────────────────────────────────────────

function findBestMatch(externalEvent, internalEvents, minScore = 0.55) {
  let best = null, bestScore = 0;
  for (const e of internalEvents) {
    const score = jaccard(externalEvent.titleNorm, e.titleNorm);
    if (score > bestScore) { bestScore = score; best = e; }
  }
  return bestScore >= minScore ? { match: best, score: bestScore } : null;
}

// ── Correction ────────────────────────────────────────────────────────────────

function applyDateFix(src, event, newDate) {
  const newDay  = JOURS_FR[newDate.getDay()];
  const newNum  = newDate.getDate();
  const newMois = MOIS_FR[newDate.getMonth()];
  const newDateStr = `${newDay} ${newNum} ${newMois}`;
  const oldDateStr = event.dateStr;
  return src.replace(
    `id:${event.id},`, // unique anchor
    `id:${event.id},`  // unchanged — we only update the date field
  ).replace(
    new RegExp(`(\\{id:${event.id},[^\\n]*?)date:"${oldDateStr.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`),
    (_, prefix) => `${prefix}date:"${newDateStr}"`
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const now = new Date();
  const dateStr = now.toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });
  console.log(`\n[${dateStr}] MonacOut — Vérification croisée des dates (PrinciPocket)\n`);

  let src;
  try { src = readFileSync(EVENTS_FILE, 'utf8'); }
  catch (e) { console.error('Impossible de lire events.js:', e.message); process.exit(1); }

  console.log('Scraping PrinciPocket (14 mois)…');
  const external = await fetchAllPrinciPocket();
  console.log(`  → ${external.length} events trouvés sur PrinciPocket`);

  const internal = parseEventsJs(src);
  console.log(`  → ${internal.length} events analysés depuis events.js\n`);

  const corrections = [];
  const ambiguous   = [];

  for (const ext of external) {
    const result = findBestMatch(ext, internal);
    if (!result) continue;
    const { match: ev } = result;

    const diffDays = Math.abs((ext.date - ev.date) / 86400000);
    if (diffDays < 1) continue; // déjà correct

    // Exclure si l'écart est > 30j (probablement deux events différents)
    if (diffDays > 30) continue;

    // Exclure si les années diffèrent (prudence)
    if (ext.date.getFullYear() !== ev.year) continue;

    corrections.push({ ev, ext, diffDays: Math.round(diffDays) });
  }

  // Dédoublonner : garder la correction avec le plus grand score Jaccard
  const correctionById = new Map();
  for (const c of corrections) {
    const existing = correctionById.get(c.ev.id);
    if (!existing || c.diffDays < existing.diffDays) correctionById.set(c.ev.id, c);
  }

  const finalCorrections = [...correctionById.values()];

  if (finalCorrections.length === 0) {
    console.log('✓ Toutes les dates sont cohérentes avec PrinciPocket.\n');
    return;
  }

  console.log(`${finalCorrections.length} correction(s) de date à appliquer :\n`);
  let modifiedSrc = src;
  for (const { ev, ext, diffDays } of finalCorrections) {
    const newDay  = JOURS_FR[ext.date.getDay()];
    const newNum  = ext.date.getDate();
    const newMois = MOIS_FR[ext.date.getMonth()];
    const newDateStr = `${newDay} ${newNum} ${newMois}`;
    console.log(`  [id:${ev.id}] "${ev.titleNorm.slice(0,50)}" : "${ev.dateStr}" → "${newDateStr}" (écart ${diffDays}j)`);
    modifiedSrc = applyDateFix(modifiedSrc, ev, ext.date);
  }

  writeFileSync(EVENTS_FILE, modifiedSrc);
  console.log(`\n✓ ${finalCorrections.length} correction(s) écrites dans events.js\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
