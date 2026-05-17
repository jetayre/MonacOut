#!/usr/bin/env node
/**
 * MonacOut — Scraper automatique des sources officielles
 * Usage : node scrape-events.mjs
 * Cron  : 0 7 * * * /usr/local/bin/node /Users/stephanieayre/monacout/scrape-events.mjs >> /Users/stephanieayre/monacout/scrape-events.log 2>&1
 *
 * Sources scrappées :
 *   1. opmc.mc                — Orchestre Philharmonique
 *   2. grimaldiforum.com      — Grimaldi Forum (JS rendu)
 *   3. culture.mc             — Culture Monaco (JS rendu)
 *   4. cinemas2monaco.com     — Cinémas 2 Monaco
 *   5. tvfestival.com         — TV Festival
 *   6. balletsdemontecarlo.com — Ballet de Monte-Carlo
 *   7. principocket.com       — Agrégateur Monaco (source interne, jamais surfacée)
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE  = join(__dirname, 'src/data/events.js');
const REPORT_FILE  = join(__dirname, 'scrape-events-report.txt');
const now = new Date();
const dateStr = now.toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });

// ── Helpers ───────────────────────────────────────────────────────────────────

function norm(s = '') {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['’‘\-–—]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

/** Charge les titres déjà en base pour détecter les doublons */
function loadExistingTitles() {
  const src = readFileSync(EVENTS_FILE, 'utf8');
  const titles = new Set();
  for (const m of src.matchAll(/title:"([^"]+)"/g)) {
    titles.add(norm(m[1].replace(/\\n/g, ' ')));
  }
  return titles;
}

/** Formate une date JS en "Jeu 18 juin" */
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
function frDate(d) {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

/** Tente de parser une date anglaise ou française vers Date JS */
function parseDate(str) {
  if (!str) return null;
  // "20 May 2026", "May 20, 2026", "20/05/2026", "20 mai 2026"
  const EN_MONTHS = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };
  const FR_MONTHS = { jan:0,fév:1,feb:1,mar:2,avr:3,apr:3,mai:4,may:4,juin:5,jun:5,juil:6,jul:6,août:7,aug:7,sep:8,oct:9,nov:10,déc:11,dec:11 };

  str = str.trim();
  // "20 May 2026" or "20 mai 2026"
  let m = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[1]);
    const mon = m[2].toLowerCase();
    const year = parseInt(m[3]);
    const idx = EN_MONTHS[mon] ?? FR_MONTHS[mon.substring(0,4)] ?? FR_MONTHS[mon.substring(0,3)];
    if (idx !== undefined) return new Date(year, idx, day);
  }
  // "May 20, 2026"
  m = str.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (m) {
    const mon = m[1].toLowerCase();
    const day = parseInt(m[2]);
    const year = parseInt(m[3]);
    const idx = EN_MONTHS[mon] ?? FR_MONTHS[mon];
    if (idx !== undefined) return new Date(year, idx, day);
  }
  // "29/04/2026"
  m = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(parseInt(m[3]), parseInt(m[2])-1, parseInt(m[1]));

  return null;
}

// ── Scrapers par source ───────────────────────────────────────────────────────

/**
 * OPMC — récupère la liste des concerts (HTTP simple, page SSR partielle)
 */
async function scrapeOPMC(page) {
  await page.goto('https://opmc.mc/en/concert/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const events = await page.evaluate(() => {
    const results = [];
    // Cherche les blocs d'événements — plusieurs structures possibles
    const cards = document.querySelectorAll('article, .event-item, .concert-item, [class*="event"], [class*="concert"]');
    cards.forEach(card => {
      const title = card.querySelector('h2,h3,h4,.title,[class*="title"]')?.innerText?.trim();
      const date  = card.querySelector('time,.date,[class*="date"]')?.innerText?.trim()
                 || card.querySelector('time')?.getAttribute('datetime');
      const time  = card.querySelector('.time,[class*="time"]')?.innerText?.trim();
      const link  = card.querySelector('a')?.href;
      if (title && title.length > 2) results.push({ title, date, time, link, source: 'OPMC' });
    });
    // Fallback: tableau
    if (results.length === 0) {
      document.querySelectorAll('table tr').forEach(row => {
        const cells = [...row.querySelectorAll('td,th')].map(c => c.innerText.trim());
        if (cells.length >= 2 && cells[0].match(/\d/)) {
          results.push({ date: cells[0], title: cells[1], time: cells[2], source: 'OPMC' });
        }
      });
    }
    return results;
  });
  return events;
}

/**
 * Grimaldi Forum — JS rendu, attend le chargement des events
 */
async function scrapeGrimaldiForum(page) {
  await page.goto('https://www.grimaldiforum.com/en/events-schedule-monaco/', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const events = await page.evaluate(() => {
    const results = [];
    // Cherche les cartes d'événements
    const selectors = [
      '[class*="event"]', '[class*="Event"]', '[class*="card"]', '[class*="Card"]',
      'article', '.item', '[class*="show"]', '[class*="spectacle"]'
    ];
    const seen = new Set();
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const title = el.querySelector('h2,h3,h4,h5,[class*="title"],[class*="name"]')?.innerText?.trim();
        if (!title || title.length < 3 || seen.has(title)) return;
        seen.add(title);
        const date = el.querySelector('time,[class*="date"],[class*="Date"]')?.innerText?.trim();
        const link = el.querySelector('a')?.href;
        results.push({ title, date, link, source: 'Grimaldi Forum' });
      });
    }
    // Fallback: cherche tous les titres h2/h3 avec une date proche
    if (results.length === 0) {
      document.querySelectorAll('h2,h3').forEach(h => {
        const title = h.innerText.trim();
        if (title.length < 3) return;
        const parent = h.closest('section,article,div');
        const date = parent?.querySelector('time,[class*="date"]')?.innerText?.trim();
        results.push({ title, date, source: 'Grimaldi Forum' });
      });
    }
    return results.slice(0, 50);
  });
  return events;
}

/**
 * Culture Monaco — JS rendu
 */
async function scrapeCultureMonaco(page) {
  await page.goto('https://culture.mc/en/what-s-on', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  const events = await page.evaluate(() => {
    const results = [];
    const seen = new Set();
    document.querySelectorAll('[class*="event"],[class*="Event"],article,[class*="card"],li').forEach(el => {
      const title = el.querySelector('h2,h3,h4,[class*="title"]')?.innerText?.trim();
      if (!title || title.length < 3 || seen.has(title)) return;
      seen.add(title);
      const date = el.querySelector('time,[class*="date"],[class*="when"]')?.innerText?.trim();
      const venue = el.querySelector('[class*="venue"],[class*="lieu"],[class*="location"]')?.innerText?.trim();
      const link = el.querySelector('a')?.href;
      results.push({ title, date, venue, link, source: 'Culture Monaco' });
    });
    return results.slice(0, 60);
  });
  return events;
}

/**
 * Cinémas 2 Monaco — récupère les films (simple HTTP souvent suffisant)
 */
async function scrapeCinemas(page) {
  await page.goto('https://www.cinemas2monaco.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const events = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('[class*="film"],[class*="movie"],[class*="seance"],article,.item').forEach(el => {
      const title = el.querySelector('h2,h3,[class*="title"],[class*="name"]')?.innerText?.trim();
      if (!title || title.length < 2) return;
      const date = el.querySelector('time,[class*="date"],[class*="release"]')?.innerText?.trim();
      const duration = el.innerText.match(/\d+h\d*/)?.[0];
      results.push({ title, date, duration, cat: 'CINÉMA', source: 'Cinémas 2 Monaco' });
    });
    // Fallback: titres
    if (results.length === 0) {
      document.querySelectorAll('h2,h3').forEach(h => {
        const title = h.innerText.trim();
        if (title.length > 2) results.push({ title, cat: 'CINÉMA', source: 'Cinémas 2 Monaco' });
      });
    }
    return results.slice(0, 30);
  });
  return events;
}

/**
 * Ballet de Monte-Carlo
 */
async function scrapeBallet(page) {
  try {
    await page.goto('https://www.balletsdemontecarlo.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    return await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('article,[class*="event"],[class*="spectacle"],[class*="show"]').forEach(el => {
        const title = el.querySelector('h2,h3,h4,[class*="title"]')?.innerText?.trim();
        if (!title || title.length < 3) return;
        const date = el.querySelector('time,[class*="date"]')?.innerText?.trim();
        const venue = el.querySelector('[class*="venue"],[class*="lieu"]')?.innerText?.trim();
        results.push({ title, date, venue, cat: 'DANSE', source: 'Ballet de Monte-Carlo' });
      });
      return results.slice(0, 20);
    });
  } catch (e) {
    return [{ error: `Ballet scrape failed: ${e.message}` }];
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n[${dateStr}] MonacOut — Scraping des sources officielles`);
  const existing = loadExistingTitles();
  console.log(`  ${existing.size} événements déjà en base.`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  let allCandidates = [];

  const scrapers = [
    { name: 'OPMC',              fn: scrapeOPMC },
    { name: 'Grimaldi Forum',    fn: scrapeGrimaldiForum },
    { name: 'Culture Monaco',    fn: scrapeCultureMonaco },
    { name: 'Cinémas 2 Monaco', fn: scrapeCinemas },
    { name: 'Ballet MC',         fn: scrapeBallet },
  ];

  for (const { name, fn } of scrapers) {
    try {
      console.log(`  → Scraping ${name}...`);
      const results = await fn(page);
      const valid = results.filter(r => r.title && !r.error);
      console.log(`     ${valid.length} événements trouvés.`);
      allCandidates.push(...valid);
    } catch (e) {
      console.log(`     ✗ Erreur : ${e.message}`);
    }
  }

  await browser.close();

  // ── Détection des nouveaux événements ──────────────────────────────────────
  const today = new Date(); today.setHours(0,0,0,0);
  const newEvents = [];

  // Titres UI/navigation à ignorer
  const UI_NOISE = new Set([
    'events','upcoming events','navigation','online boutique','alerts agenda',
    'boutique','agenda','programme','planning','season','saison',
    'accueil','home','menu','footer','header','news','actualites','newsletter',
    'billetterie','tickets','contact','about','infos pratiques',
  ]);

  for (const candidate of allCandidates) {
    if (!candidate.title) continue;
    const normTitle = norm(candidate.title);

    // Filtre UI noise
    if (UI_NOISE.has(normTitle)) continue;
    // Titres trop courts ou trop génériques
    const wordCount = normTitle.split(' ').filter(w => w.length > 0).length;
    if (wordCount <= 1 && normTitle.length < 8) continue;
    // Titres génériques (type d'événement seul, sans nom propre)
    const GENERIC_TYPES = new Set(['conference','variety show','show','concert','festival','congress','exhibition','event','gala','ceremony','spectacle','exposition']);
    if (GENERIC_TYPES.has(normTitle)) continue;

    // Vérif doublons (mots clés du titre)
    const words = normTitle.split(' ').filter(w => w.length > 3);
    const alreadyIn = words.length > 0 && [...existing].some(t => {
      const matchCount = words.filter(w => t.includes(w)).length;
      return matchCount >= Math.max(2, Math.floor(words.length * 0.6));
    });

    if (alreadyIn) continue;

    // Filtre sur la date si disponible
    if (candidate.date) {
      const d = parseDate(candidate.date);
      if (d && d < today) continue;
      if (d) candidate.dateParsed = frDate(d);
    }

    newEvents.push(candidate);
  }

  // ── Rapport ────────────────────────────────────────────────────────────────
  let report = `========================================\n`;
  report += `MONACOUT — RAPPORT DE SCRAPING\n`;
  report += `Généré le : ${dateStr}\n`;
  report += `Candidats totaux : ${allCandidates.length}\n`;
  report += `Nouveaux potentiels : ${newEvents.length}\n`;
  report += `========================================\n\n`;

  if (newEvents.length === 0) {
    report += `✓ Aucun nouvel événement détecté.\n`;
  } else {
    report += `── NOUVEAUX ÉVÉNEMENTS POTENTIELS ────────────────\n\n`;
    for (const e of newEvents) {
      report += `  📌 ${e.title}\n`;
      if (e.dateParsed || e.date) report += `     Date   : ${e.dateParsed || e.date}\n`;
      if (e.venue)  report += `     Lieu   : ${e.venue}\n`;
      if (e.link)   report += `     Lien   : ${e.link}\n`;
      report += `     Source : ${e.source}\n\n`;
    }
    report += `\n► Pour ajouter ces événements, lancer Claude Code.\n`;
  }

  report += `========================================\n`;

  writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(report);
  console.log(`Rapport sauvegardé : ${REPORT_FILE}`);
}

main().catch(e => {
  console.error('Erreur scraper:', e);
  process.exit(1);
});
