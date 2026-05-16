#!/usr/bin/env node
/**
 * MonacOut — Pipeline automatique
 * 1. Scrape les sources officielles (OPMC, Grimaldi Forum, Culture Monaco, Cinémas, Ballet)
 * 2. Visite chaque page de détail pour récupérer date et heure
 * 3. Génère un objet événement MonacOut complet
 * 4. Insère dans src/data/events.js
 * 5. npm run build + git commit + git push
 *
 * Cron : 0 8 * * * /usr/local/bin/node /Users/stephanieayre/monacout/auto-events.mjs >> /Users/stephanieayre/monacout/auto-events.log 2>&1
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');
const LOG_FILE    = join(__dirname, 'auto-events-report.txt');
const now = new Date();
const dateStr = now.toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });

// ── Constants ─────────────────────────────────────────────────────────────────

const JOURS_EN = { sunday:'Dim', monday:'Lun', tuesday:'Mar', wednesday:'Mer', thursday:'Jeu', friday:'Ven', saturday:'Sam' };
const JOURS_FR = { dimanche:'Dim', lundi:'Lun', mardi:'Mar', mercredi:'Mer', jeudi:'Jeu', vendredi:'Ven', samedi:'Sam' };
const JOURS    = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS     = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];
const EN_MON   = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };
const FR_MON   = { jan:0,janv:0,fév:1,fevr:1,feb:1,mar:2,avr:3,apr:3,mai:4,may:4,juin:5,jun:5,juil:6,jul:6,août:7,aug:7,aout:7,sep:8,oct:9,nov:10,déc:11,dec:11 };

const CAT_STYLE = {
  'CONCERT':     { fallback:'linear-gradient(150deg,#1A1240,#2D1F6E,#1A1240)', accent:'#C4A8F8', emoji:'🎵' },
  'OPÉRA':       { fallback:'linear-gradient(150deg,#2A0A1A,#7A1A40,#2A0A1A)', accent:'#F4B0C8', emoji:'🎭' },
  'DANSE':       { fallback:'linear-gradient(150deg,#3A0840,#8A1890,#3A0840)', accent:'#E8A0F8', emoji:'💃' },
  'CINÉMA':      { fallback:'linear-gradient(150deg,#0A1A3A,#1A3A6A,#0A1A3A)', accent:'#A0C0F8', emoji:'🎬' },
  'EXPOSITION':  { fallback:'linear-gradient(150deg,#2A1808,#6A3818,#2A1808)', accent:'#F8C8A0', emoji:'🎨' },
  'THÉÂTRE':     { fallback:'linear-gradient(150deg,#1A0830,#4A1870,#1A0830)', accent:'#D0B0F8', emoji:'🎭' },
  'SPECTACLE':   { fallback:'linear-gradient(150deg,#0A1A2A,#2A4A6A,#0A1A2A)', accent:'#A8C8E8', emoji:'✨' },
  'FESTIVAL':    { fallback:'linear-gradient(150deg,#0A2818,#1A6A3A,#0A2818)', accent:'#A0F0B0', emoji:'🎪' },
  'CONFÉRENCE':  { fallback:'linear-gradient(150deg,#0A1828,#1A3A50,#0A1828)', accent:'#A0C8D8', emoji:'💬' },
  'ATELIER':     { fallback:'linear-gradient(150deg,#201808,#504018,#201808)', accent:'#D8C880', emoji:'✏️' },
  'MUSICAL':     { fallback:'linear-gradient(150deg,#1A0830,#4A1870,#1A0830)', accent:'#D0B0F8', emoji:'🎶' },
  'JAZZ LIVE':   { fallback:'linear-gradient(150deg,#0A180A,#1A3818,#0A180A)', accent:'#90C890', emoji:'🎷' },
  'ENCHÈRES':    { fallback:'linear-gradient(150deg,#1A1000,#4A3000,#1A1000)', accent:'#D4A840', emoji:'🔨' },
  'GALA':        { fallback:'linear-gradient(150deg,#1A1000,#4A3000,#1A1000)', accent:'#D4C840', emoji:'✨' },
  'BIEN-ÊTRE':   { fallback:'linear-gradient(150deg,#0A2818,#1A5030,#0A2818)', accent:'#90E0B0', emoji:'🧘' },
  'SALON':       { fallback:'linear-gradient(150deg,#0A1020,#1A2840,#0A1020)', accent:'#8AB8D8', emoji:'🚢' },
};

const SOURCE_VENUE = {
  'OPMC':                        'Opéra de Monte-Carlo · Monaco',
  'Grimaldi Forum':              'Grimaldi Forum · Monaco',
  'Culture Monaco':              'Salle Garnier · Monaco',
  'Cinémas 2 Monaco':           'Cinémas de Monaco · Monte-Carlo',
  'Ballet de Monte-Carlo':       'Salle des Princes · Monaco',
  'Fondation Prince Albert II':      'Fondation Prince Albert II · Monaco',
  'Fdtn Princesse Charlène':         'Fondation Princesse Charlène · Monaco',
  'Fdtn Prince Pierre':              'Fondation Prince Pierre · Monaco',
  'Fight Aids Monaco':               'Fight Aids Monaco · Monaco',
  'Croix-Rouge de Monaco':           'Croix-Rouge de Monaco',
  'Fondation Flavien':               'Fondation Flavien · Monaco',
  'AMADE Monaco':                    'AMADE · Monaco',
  'Mission Enfance Monaco':          'Mission Enfance · Monaco',
  'Les Anges Gardiens de Monaco':    'Les Anges Gardiens · Monaco',
  'AMAPEI Monaco':                   'AMAPEI · Monaco',
  'Jewish Cultural Center Monaco':   'Jewish Cultural Center · Monaco',
  'Mairie de Monaco':                'Mairie de Monaco',
  'AS Monaco Basket':                'Salle Gaston Médecin · Monaco',
  'AS Monaco FC':                    'Stade Louis II · Monaco',
  'La Note Bleue':                   'La Note Bleue · Monaco',
  'FIA Formula E':                   'Circuit de Monaco',
  'Automobile Club de Monaco':       'Circuit de Monaco · Monaco',
  'Herculis Monaco':                 'Stade Louis II · Monaco',
  'TV Festival Monte-Carlo':         'Grimaldi Forum · Monaco',
  'RM Sotheby\'s Monaco':            'Grimaldi Forum · Monaco',
  'Bonhams Monaco':                  'Monaco',
  'Monaco Legend Auctions':          'Monaco',
  'Monte-Carlo SBM':                 'Monte-Carlo',
  'Sass Café':                       'Sass Café · Monte-Carlo',
  'NMNM Monaco':                     'NMNM · Monaco',
  'Philomonaco':                     'Monaco',
  'Musée Océanographique':           'Musée Océanographique · Monaco-Ville',
  'Monaco Run':                      'Monaco',
  'Monaco Yacht Show':               'Port Hercule · Monaco',
  // ── Bien-être & wellness ──────────────────────────────────────────────────
  'Thermes Marins Monte-Carlo':      'Thermes Marins · Monaco',
  'BodyFlow MC':                     'BodyFlow MC · Palais La Scala · Monaco',
  'Yoga Monte-Carlo':                'Yoga Monte-Carlo · Monaco',
  'Fairmont Monte Carlo':            'Fairmont Monte Carlo · Monaco',
  'yumé Monaco':                     'yumé · Résidence Hemera · Monaco',
  'Aritual Monaco':                  'Aritual · Quai Antoine Ier · Monaco',
  'Odéon Spa':                       'Odéon Spa · Tour Odéon · Monaco',
  'SPA Clarins & myBlend':           'SPA Clarins myBlend · Monte-Carlo Bay',
  'Monaco Wellness System':          'Monaco Wellness System · Monaco',
  'Jenna Lifestyle':                 'Jenna Lifestyle · Fontvieille · Monaco',
  // ── Brunch ───────────────────────────────────────────────────────────────
  'Nikki Beach Monte Carlo':         'Nikki Beach · Fairmont Monte Carlo',
  'La Môme Monte-Carlo':             'La Môme Monte-Carlo · Av. J.F. Kennedy',
  'Le Petit Café Robuchon':          'Le Petit Café Robuchon · Rue du Portier · Monaco',
  'Woo Monaco':                      'Woo Monaco · Rue Princesse Caroline',
  'Gran Caffè Monaco':               'Gran Caffè · Rue Grimaldi · La Condamine',
  'Azzurra Kitchen':                 'Azzurra Kitchen · Novotel Monte-Carlo',
  'Horizon Rooftop':                 'Horizon Rooftop · Fairmont Monte Carlo',
  // ── Apéro & nightlife ────────────────────────────────────────────────────
  'Equivoque Rooftop':               'Equivoque Rooftop · Monaco',
  'La Môme Monte-Carlo':             'La Môme · Monte-Carlo',
  'Le Rouge et le Blanc':            'Le Rouge et le Blanc · Monaco',
  'Wine Palace YCM':                 'Wine Palace · Yacht Club de Monaco',
  'Caffè Milano Monaco':             'Caffè Milano · Monte-Carlo',
  'AMU Monte Carlo':                 'AMU · Monte Carlo',
  'yumé':                            'yumé · Résidence Hemera · Monaco',
  // ── Clubs & DJ events ────────────────────────────────────────────────────
  'New Moods Monte-Carlo':           'New Moods · Casino de Monte-Carlo · SBM',
  'The Marlow Monaco':               'The Marlow · Mareterra · Monaco',
  'Blue Gin Monte-Carlo Bay':        'Blue Gin · Monte-Carlo Bay Hotel',
  'Sunset Monaco':                   'Sunset Monaco · Méridien Beach Plaza · Larvotto',
  'Twiga Monte Carlo':               'Twiga Monte Carlo · Av. Princesse Grace',
  'Lilly\'s Club':                   'Lilly\'s Club · Monte-Carlo',
  'Amber Lounge Monaco':             'Amber Lounge · Monaco GP',
  'Jack Monaco':                     'Jack Monaco · Port Monaco',
  'Nobu Monte-Carlo':                'Nobu Monte-Carlo · Fairmont',
  // ── Théâtres monaco ──────────────────────────────────────────────────────
  'Théâtre Princesse Grace':         'Théâtre Princesse Grace · Monaco',
  'Théâtre des Muses Monaco':        'Théâtre des Muses · Monaco',
  'Théâtre Fort Antoine':            'Théâtre du Fort Antoine · Monaco',
  'Théâtre des Variétés Monaco':     'Théâtre des Variétés · Monaco',
};

const UI_NOISE = new Set([
  'events','upcoming events','navigation','online boutique','alerts agenda',
  'boutique','agenda','programme','planning','season','saison',
  'accueil','home','menu','footer','header','news','newsletter',
  'billetterie','tickets','contact','about','infos pratiques','informations',
]);

const GENERIC_TYPES = new Set([
  'conference','variety show','show','concert','festival','congress',
  'exhibition','event','gala','ceremony','spectacle','exposition',
]);

// ── Helpers ───────────────────────────────────────────────────────────────────

function norm(s = '') {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/['''\-–—]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function loadExistingTitles() {
  const src = readFileSync(EVENTS_FILE, 'utf8');
  const titles = new Set();
  // Match titles including those with escaped quotes (\")
  for (const m of src.matchAll(/title:"((?:[^"\\]|\\.)*)"/g)) {
    const raw = m[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    titles.add(norm(raw));
  }
  return titles;
}

function getMaxId() {
  const src = readFileSync(EVENTS_FILE, 'utf8');
  const ids = [...src.matchAll(/\{id:(\d+)/g)].map(m => parseInt(m[1]));
  return Math.max(...ids);
}

function frDate(d) {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

/** Parse english or french date string → Date JS */
function parseDate(str) {
  if (!str) return null;
  str = str.trim();

  // "Sunday 24 May 2026" or "Dimanche 24 mai 2026"
  let m = str.match(/(\w+)\s+(\d{1,2})\s+(\w+)\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[2]);
    const mon = m[3].toLowerCase();
    const year = parseInt(m[4]);
    const idx = EN_MON[mon] ?? FR_MON[mon.substring(0,4)] ?? FR_MON[mon.substring(0,3)];
    if (idx !== undefined) return new Date(year, idx, day);
  }
  // "24 May 2026" or "24 mai 2026"
  m = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/i);
  if (m) {
    const day = parseInt(m[1]);
    const mon = m[2].toLowerCase();
    const year = parseInt(m[3]);
    const idx = EN_MON[mon] ?? FR_MON[mon.substring(0,4)] ?? FR_MON[mon.substring(0,3)];
    if (idx !== undefined) return new Date(year, idx, day);
  }
  // "May 24, 2026"
  m = str.match(/(\w+)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (m) {
    const mon = m[1].toLowerCase();
    const day = parseInt(m[2]);
    const year = parseInt(m[3]);
    const idx = EN_MON[mon] ?? FR_MON[mon];
    if (idx !== undefined) return new Date(year, idx, day);
  }
  // "24/05/2026"
  m = str.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return new Date(parseInt(m[3]), parseInt(m[2])-1, parseInt(m[1]));

  return null;
}

/** Parse time from text: "18h00", "18:00", "6:30pm" */
function parseTime(text) {
  let m = text.match(/\b(\d{1,2})h(\d{2})\b/i);
  if (m) return `${m[1]}h${m[2]}`;
  m = text.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/i);
  if (m) {
    let h = parseInt(m[1]);
    if (m[3]?.toLowerCase() === 'pm' && h < 12) h += 12;
    return `${h}h${m[2]}`;
  }
  return null;
}

/** Infer MonacOut category from title + source */
function inferCat(title, source) {
  const t = norm(title);
  if (/opera|opera/.test(t)) return 'OPÉRA';
  if (/ballet|danse/.test(t)) return 'DANSE';
  if (/symphon|concert|philharmon|orchestre/.test(t)) return 'CONCERT';
  if (/cine|cinema|film|projection|cineclub|club/.test(t) && !/concer/.test(t)) return 'CINÉMA';
  if (/jazz|blues/.test(t)) return 'JAZZ LIVE';
  if (/exposition|exhibition|expo/.test(t)) return 'EXPOSITION';
  if (/conference|conferen/.test(t)) return 'CONFÉRENCE';
  if (/atelier|workshop/.test(t)) return 'ATELIER';
  if (/festival/.test(t)) return 'FESTIVAL';
  if (/theatre|theater/.test(t)) return 'THÉÂTRE';
  if (/musical/.test(t)) return 'MUSICAL';
  if (/gala/.test(t)) return 'GALA';
  if (/enchere|auction|vente/.test(t)) return 'ENCHÈRES';
  if (/yoga|pilates|meditat|thalasso|breathwork|bien.?etre|detox|wellness|spa marin|sound.?healing|bain sonore/.test(t)) return 'BIEN-ÊTRE';
  if (/bootcamp|fitness|running|marathon|triathlon/.test(t) && !/concert|musiq/.test(t)) return 'SPORT';
  if (/brunch/.test(t)) return 'BRUNCH';
  if (/salon|show/.test(t)) return 'SALON';
  if (/spectacle/.test(t)) return 'SPECTACLE';
  // Source-based fallback
  if (source === 'OPMC') return 'CONCERT';
  if (source === 'Ballet de Monte-Carlo') return 'DANSE';
  if (source === 'Cinémas 2 Monaco') return 'CINÉMA';
  if (source === 'New Moods Monte-Carlo') return 'CONCERT';
  if (source === 'Sunset Monaco') return 'DJ SET';
  if (source === 'Twiga Monte Carlo') return 'SOIRÉE';
  if (source === 'Lilly\'s Club') return 'SOIRÉE';
  if (source === 'Blue Gin Monte-Carlo Bay') return 'APÉRO';
  if (source === 'The Marlow Monaco') return 'BRUNCH';
  if (source === 'Amber Lounge Monaco') return 'SOIRÉE';
  if (source === 'Jack Monaco') return 'APÉRO';
  if (source === 'Nobu Monte-Carlo') return 'SOIRÉE';
  if (source === 'Grimaldi Forum') return 'SPECTACLE';
  return 'SPECTACLE';
}

/** Clean title for MonacOut: uppercase, \n line breaks (literal backslash-n) */
function cleanTitle(raw) {
  const cleaned = raw
    .replace(/^(Exhibition|Exposition|Concert|Spectacle|Festival|Show|Gala)\s*[-–:]\s*/i, '')
    .trim();
  if (cleaned.length <= 28) return cleaned.toUpperCase();
  const words = cleaned.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line.length + w.length + 1 > 22 && line.length > 0) {
      lines.push(line.trim());
      line = w;
    } else {
      line += (line ? ' ' : '') + w;
    }
  }
  if (line) lines.push(line.trim());
  // Uppercase each line before joining so the \n separator stays lowercase
  return lines.map(l => l.toUpperCase()).join('\\n');
}

/** Generate a complete MonacOut event object */
function generateEvent(candidate, dateObj, time, id) {
  const cat = inferCat(candidate.title, candidate.source);
  const style = CAT_STYLE[cat] || CAT_STYLE['SPECTACLE'];
  const dateFr = frDate(dateObj);
  const year = dateObj.getFullYear();
  const venue = SOURCE_VENUE[candidate.source] || candidate.venue || candidate.source;
  const rawTitle = candidate.title.replace(/^(Exhibition|Exposition|Concert|Spectacle|Festival|Show|Gala)\s*[-–:]\s*/i, '').trim();
  const title = cleanTitle(rawTitle);
  const titlePlain = rawTitle.replace(/\n/g, ' ');

  // Escape for JS double-quoted string
  const esc = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n');

  let obj = `  {id:${id}`;
  if (year !== 2026) obj += `,year:${year}`;
  obj += `,cat:"${cat}",date:"${dateFr}"`;
  if (time) obj += `,time:"${time}"`;
  obj += `,title:"${esc(title)}"`;
  obj += `,subtitle:"${esc(venue)}"`;
  obj += `,desc:"${esc(titlePlain)}"`;
  obj += `,descEn:"${esc(titlePlain)}"`;
  obj += `,free:false`;
  obj += `,hot:false`;
  obj += `,fallback:"${style.fallback}"`;
  obj += `,accent:"${style.accent}"`;
  obj += `,emoji:"${style.emoji}"`;
  if (candidate.link) obj += `,link:"${candidate.link}"`;
  obj += `,source:"${esc(candidate.source)}"`;
  obj += `},`;
  return obj;
}

// ── Scrapers ──────────────────────────────────────────────────────────────────

async function scrapeOPMC(page) {
  await page.goto('https://opmc.mc/en/concert/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  return page.evaluate(() => {
    const results = [];
    const cards = document.querySelectorAll('article, .event-item, .concert-item, [class*="event"], [class*="concert"]');
    cards.forEach(card => {
      const title = card.querySelector('h2,h3,h4,.title,[class*="title"]')?.innerText?.trim();
      const date  = card.querySelector('time,.date,[class*="date"]')?.innerText?.trim()
                 || card.querySelector('time')?.getAttribute('datetime');
      const time  = card.querySelector('.time,[class*="time"]')?.innerText?.trim();
      const link  = card.querySelector('a')?.href;
      if (title && title.length > 2) results.push({ title, date, time, link, source: 'OPMC' });
    });
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
}

async function scrapeGrimaldiForum(page) {
  await page.goto('https://www.grimaldiforum.com/en/events-schedule-monaco/', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const results = [];
    const seen = new Set();
    const selectors = ['[class*="event"]','[class*="Event"]','[class*="card"]','article','.item'];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const title = el.querySelector('h2,h3,h4,h5,[class*="title"],[class*="name"]')?.innerText?.trim();
        if (!title || title.length < 5 || seen.has(title)) return;
        seen.add(title);
        const date = el.querySelector('time,[class*="date"],[class*="Date"]')?.innerText?.trim();
        const link = el.querySelector('a')?.href;
        results.push({ title, date, link, source: 'Grimaldi Forum' });
      });
    }
    return results.slice(0, 40);
  });
}

async function scrapeCultureMonaco(page) {
  await page.goto('https://culture.mc/en/what-s-on', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);
  return page.evaluate(() => {
    const results = [];
    const seen = new Set();
    // Get all event links
    document.querySelectorAll('a[href*="/evenement"],a[href*="/evenements/"],a[href*="/event"]').forEach(a => {
      const title = a.querySelector('h2,h3,h4,[class*="title"]')?.innerText?.trim()
                 || a.closest('li,article,div')?.querySelector('h2,h3,h4,[class*="title"]')?.innerText?.trim()
                 || a.innerText?.trim();
      if (!title || title.length < 5 || seen.has(title)) return;
      seen.add(title);
      const parent = a.closest('li,article,div,[class*="card"]');
      const date = parent?.querySelector('time,[class*="date"],[class*="when"]')?.innerText?.trim();
      results.push({ title, date, link: a.href, source: 'Culture Monaco' });
    });
    return results.slice(0, 50);
  });
}

async function scrapeCinemas(page) {
  await page.goto('https://www.cinemas2monaco.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  return page.evaluate(() => {
    const results = [];
    document.querySelectorAll('[class*="film"],[class*="movie"],[class*="seance"],article,.item').forEach(el => {
      const title = el.querySelector('h2,h3,[class*="title"],[class*="name"]')?.innerText?.trim();
      if (!title || title.length < 2) return;
      const date = el.querySelector('time,[class*="date"]')?.innerText?.trim();
      const link = el.querySelector('a')?.href;
      results.push({ title, date, link, cat: 'CINÉMA', source: 'Cinémas 2 Monaco' });
    });
    if (results.length === 0) {
      document.querySelectorAll('h2,h3').forEach(h => {
        const title = h.innerText.trim();
        if (title.length > 2) results.push({ title, cat: 'CINÉMA', source: 'Cinémas 2 Monaco' });
      });
    }
    return results.slice(0, 20);
  });
}

async function scrapeBallet(page) {
  try {
    await page.goto('https://www.balletsdemontecarlo.com/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    return page.evaluate(() => {
      const results = [];
      document.querySelectorAll('article,[class*="event"],[class*="spectacle"],[class*="show"]').forEach(el => {
        const title = el.querySelector('h2,h3,h4,[class*="title"]')?.innerText?.trim();
        if (!title || title.length < 3) return;
        const date = el.querySelector('time,[class*="date"]')?.innerText?.trim();
        const link = el.querySelector('a')?.href;
        results.push({ title, date, link, source: 'Ballet de Monte-Carlo' });
      });
      return results.slice(0, 20);
    });
  } catch { return []; }
}

/**
 * Scraper générique — fonctionne pour la plupart des sites WordPress/CMS
 */
async function scrapeGeneric(page, url, sourceName) {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    return await page.evaluate((src) => {
      const results = [];
      const seen = new Set();
      const selectors = [
        'article', '[class*="event"]', '[class*="Event"]',
        '[class*="card"]', '[class*="agenda"]', '[class*="manifestation"]',
        '[class*="post-item"]', '.item', 'li[class*="post"]',
      ];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach(el => {
          const title = el.querySelector('h2,h3,h4,[class*="title"],[class*="name"]')?.innerText?.trim();
          if (!title || title.length < 5 || seen.has(title)) return;
          seen.add(title);
          const date = el.querySelector('time,[class*="date"],[class*="quand"],[class*="when"]')?.innerText?.trim()
                    || el.querySelector('time')?.getAttribute('datetime');
          const link = el.querySelector('a')?.href;
          results.push({ title, date, link, source: src });
        });
      }
      // Fallback: headings in main content area
      if (results.length === 0) {
        const main = document.querySelector('main,#main,.main,#content,.content') || document.body;
        main.querySelectorAll('h2,h3').forEach(h => {
          const title = h.innerText.trim();
          if (title.length < 5 || seen.has(title)) return;
          seen.add(title);
          const parent = h.closest('section,article,div,li');
          const date = parent?.querySelector('time,[class*="date"]')?.innerText?.trim();
          const link = parent?.querySelector('a')?.href;
          results.push({ title, date, link, source: src });
        });
      }
      return results.slice(0, 30);
    }, sourceName);
  } catch (e) {
    console.log(`     ✗ ${sourceName} : ${e.message}`);
    return [];
  }
}

/** Visit event detail page to extract date and time */
async function fetchEventDetails(page, url) {
  if (!url) return {};
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(1000);
    const text = await page.evaluate(() => document.body.innerText);
    const datePatterns = [
      /\b(sunday|monday|tuesday|wednesday|thursday|friday|saturday|dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)\s+(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\s+(\d{4})/gi,
      /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december|janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\s+(\d{4})/gi,
    ];
    let dateStr = null;
    for (const pat of datePatterns) {
      const m = pat.exec(text);
      if (m) { dateStr = m[0]; break; }
    }
    const timeM = text.match(/\b(\d{1,2})h(\d{2})\b/) || text.match(/\b(\d{1,2}):(\d{2})\s*(am|pm)?\b/i);
    const time = timeM ? parseTime(timeM[0]) : null;
    return { dateStr, time };
  } catch {
    return {};
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n[${dateStr}] MonacOut — Pipeline automatique`);

  const existing = loadExistingTitles();
  let nextId = getMaxId() + 1;
  console.log(`  ${existing.size} événements en base. Prochain ID : ${nextId}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    locale: 'fr-FR',
  });
  const page = await context.newPage();

  // ── Scraping ────────────────────────────────────────────────────────────────
  let allCandidates = [];
  const scrapers = [
    // ── Sources culturelles ──────────────────────────────────────────────────
    { name: 'OPMC',              fn: scrapeOPMC },
    { name: 'Grimaldi Forum',    fn: scrapeGrimaldiForum },
    { name: 'Culture Monaco',    fn: scrapeCultureMonaco },
    { name: 'Cinémas 2 Monaco', fn: scrapeCinemas },
    { name: 'Ballet MC',         fn: scrapeBallet },
    // ── Fondations majeures ──────────────────────────────────────────────────
    { name: 'FPA2',              fn: p => scrapeGeneric(p, 'https://www.fpa2.org/en/events',                          'Fondation Prince Albert II') },
    { name: 'Fdtn P. Charlène',  fn: p => scrapeGeneric(p, 'https://www.fondationprincessecharlene.mc/evenements',    'Fdtn Princesse Charlène') },
    { name: 'Fdtn P. Pierre',    fn: p => scrapeGeneric(p, 'https://www.fondationprincepierre.mc/evenements',         'Fdtn Prince Pierre') },
    // ── Pages news/actualités des fondations ─────────────────────────────────
    { name: 'FPA2 news',         fn: p => scrapeGeneric(p, 'https://www.fpa2.org/en/news',                            'Fondation Prince Albert II') },
    { name: 'Charlène actus',    fn: p => scrapeGeneric(p, 'https://www.fondationprincessecharlene.mc/actualites',    'Fdtn Princesse Charlène') },
    { name: 'Croix-Rouge presse',fn: p => scrapeGeneric(p, 'https://croix-rouge.mc/presse',                           'Croix-Rouge de Monaco') },
    // ── Associations humanitaires (sites actifs) ─────────────────────────────
    { name: 'Fight Aids Monaco',  fn: p => scrapeGeneric(p, 'https://www.fightaidsmonaco.com/evenements',             'Fight Aids Monaco') },
    { name: 'Croix-Rouge MC',     fn: p => scrapeGeneric(p, 'https://croix-rouge.mc/agenda/',                         'Croix-Rouge de Monaco') },
    { name: 'AMADE',              fn: p => scrapeGeneric(p, 'https://www.amade.org/',                                  'AMADE Monaco') },
    { name: 'Mission Enfance',    fn: p => scrapeGeneric(p, 'https://www.missionenfance.org',                          'Mission Enfance Monaco') },
    { name: 'Anges Gardiens',     fn: p => scrapeGeneric(p, 'https://www.anges-gardiens-monaco.com',                   'Les Anges Gardiens de Monaco') },
    { name: 'AMAPEI',             fn: p => scrapeGeneric(p, 'https://www.amapei.org',                                  'AMAPEI Monaco') },
    { name: 'JCC Monaco',         fn: p => scrapeGeneric(p, 'https://www.jccmonaco.com/events',                        'Jewish Cultural Center Monaco') },
    // ── Fondations santé & recherche ────────────────────────────────────────
    { name: 'Fdtn Flavien',       fn: p => scrapeGeneric(p, 'https://www.fondationflavien.com/evenements/',            'Fondation Flavien') },
    // ── Sport ────────────────────────────────────────────────────────────────
    { name: 'AS Monaco Basket',   fn: p => scrapeGeneric(p, 'https://billetterie.asmonaco.basketball/fr',              'AS Monaco Basket') },
    { name: 'AS Monaco FC',       fn: p => scrapeGeneric(p, 'https://www.asmonaco.com',                                'AS Monaco FC') },
    { name: 'Formula E',          fn: p => scrapeGeneric(p, 'https://www.fiaformulae.com/en/calendar',                 'FIA Formula E') },
    { name: 'Monaco Grand Prix',  fn: p => scrapeGeneric(p, 'https://monaco-grandprix.com/en/',                        'Automobile Club de Monaco') },
    { name: 'Herculis',           fn: p => scrapeGeneric(p, 'https://monaco.diamondleague.com/meeting/herculis/',       'Herculis Monaco') },
    { name: 'Monaco Run',         fn: p => scrapeGeneric(p, 'https://www.monacorun.com',                               'Monaco Run') },
    // ── Culture & divertissement ─────────────────────────────────────────────
    { name: 'Mairie Monaco',      fn: p => scrapeGeneric(p, 'https://www.mairie.mc/agenda',                            'Mairie de Monaco') },
    { name: 'La Note Bleue',      fn: p => scrapeGeneric(p, 'https://lanotebleue.mc/en/',                              'La Note Bleue') },
    { name: 'TV Festival',        fn: p => scrapeGeneric(p, 'https://www.tvfestival.com/en/programme/',                 'TV Festival Monte-Carlo') },
    { name: 'NMNM',               fn: p => scrapeGeneric(p, 'https://www.nmnm.mc/en/events',                           'NMNM Monaco') },
    { name: 'Philomonaco',        fn: p => scrapeGeneric(p, 'https://www.philomonaco.com/evenements',                  'Philomonaco') },
    { name: 'Musée Océano',       fn: p => scrapeGeneric(p, 'https://musee.oceano.org/fr/activites',                   'Musée Océanographique') },
    { name: 'OPMC saison',        fn: p => scrapeGeneric(p, 'https://opmc.mc/en/season-25-26/',                        'OPMC') },
    { name: 'TPG Monaco',         fn: p => scrapeGeneric(p, 'https://www.tpgmonaco.mc/fr/programme',                    'Théâtre Princesse Grace') },
    { name: 'Théâtre des Muses',  fn: p => scrapeGeneric(p, 'https://www.letheatredesmuses.com/',                       'Théâtre des Muses Monaco') },
    { name: 'Fort Antoine',       fn: p => scrapeGeneric(p, 'https://theatrefortantoine.com/',                          'Théâtre Fort Antoine') },
    { name: 'Théâtre Variétés',   fn: p => scrapeGeneric(p, 'https://www.monte-carlo.mc/fr/sorties/spectacles/theatre-des-varietes', 'Théâtre des Variétés Monaco') },
    // ── Enchères ─────────────────────────────────────────────────────────────
    { name: 'RM Sotheby\'s',      fn: p => scrapeGeneric(p, 'https://rmsothebys.com/en/auctions/mc26',                 'RM Sotheby\'s Monaco') },
    { name: 'Bonhams Monaco',     fn: p => scrapeGeneric(p, 'https://www.bonhams.com/auctions/?department=monaco',     'Bonhams Monaco') },
    { name: 'Monaco Legend',      fn: p => scrapeGeneric(p, 'https://www.monacolegendauctions.com',                    'Monaco Legend Auctions') },
    // ── SBM / lifestyle ──────────────────────────────────────────────────────
    { name: 'SBM agenda',         fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/fr/agenda',                 'Monte-Carlo SBM') },
    { name: 'Sass Café',          fn: p => scrapeGeneric(p, 'https://www.sasscafe.com',                                'Sass Café') },
    // ── Salon & nautisme ─────────────────────────────────────────────────────
    { name: 'Monaco Yacht Show',  fn: p => scrapeGeneric(p, 'https://www.monacoyachtshow.com',                         'Monaco Yacht Show') },
    { name: 'ACM calendrier',     fn: p => scrapeGeneric(p, 'https://www.acm.mc/fr/calendrier',                        'Automobile Club de Monaco') },
    // ── Brunch ────────────────────────────────────────────────────────────────
    { name: 'Nikki Beach',        fn: p => scrapeGeneric(p, 'https://nikkibeach.com/monte-carlo/events/',                'Nikki Beach Monte Carlo') },
    { name: 'La Môme',            fn: p => scrapeGeneric(p, 'https://www.lamomemontecarlo.com/evenements/',              'La Môme Monte-Carlo') },
    { name: 'Robuchon café',      fn: p => scrapeGeneric(p, 'https://robuchonmonaco.com/le-petit-cafe/',                 'Le Petit Café Robuchon') },
    { name: 'Woo Monaco',         fn: p => scrapeGeneric(p, 'https://woo.mc/',                                          'Woo Monaco') },
    { name: 'Gran Caffè',         fn: p => scrapeGeneric(p, 'https://grancaffe.mc/',                                     'Gran Caffè Monaco') },
    { name: 'Azzurra Kitchen',    fn: p => scrapeGeneric(p, 'https://www.novotelmontecarlo.com/en/restaurant-bars/azzurra-kitchen/', 'Azzurra Kitchen') },
    { name: 'Horizon Rooftop',    fn: p => scrapeGeneric(p, 'https://www.fairmont.com/monte-carlo/dining/horizon-rooftop-monaco/', 'Horizon Rooftop') },
    // ── Bien-être & wellness ──────────────────────────────────────────────────
    { name: 'Thermes Marins',     fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/fr/offres-speciales',        'Thermes Marins Monte-Carlo') },
    { name: 'BodyFlow MC',        fn: p => scrapeGeneric(p, 'https://www.bodyflow.mc/',                                  'BodyFlow MC') },
    { name: 'Yoga MC',            fn: p => scrapeGeneric(p, 'http://yogamontecarlo.com/category/events/',                'Yoga Monte-Carlo') },
    { name: 'yumé Monaco',        fn: p => scrapeGeneric(p, 'https://yume.mc/',                                          'yumé Monaco') },
    { name: 'Aritual',            fn: p => scrapeGeneric(p, 'https://www.aritual.fr/',                                   'Aritual Monaco') },
    { name: 'Odéon Spa',          fn: p => scrapeGeneric(p, 'https://odeonspa.com/',                                    'Odéon Spa') },
    { name: 'Clarins myBlend',    fn: p => scrapeGeneric(p, 'https://www.montecarlobay.com/wellness/',                   'SPA Clarins & myBlend') },
    { name: 'Monaco Wellness',    fn: p => scrapeGeneric(p, 'https://www.monacowellnesssystem.com/',                     'Monaco Wellness System') },
    { name: 'Fairmont wellness',  fn: p => scrapeGeneric(p, 'https://www.fairmont.com/monte-carlo/offers/',              'Fairmont Monte Carlo') },
    { name: 'Jenna Lifestyle',    fn: p => scrapeGeneric(p, 'http://jennalifestyle.com/',                                'Jenna Lifestyle') },
    // ── Apéro & nightlife ────────────────────────────────────────────────────
    { name: 'Equivoque',          fn: p => scrapeGeneric(p, 'http://www.equivoquemc.com/',                               'Equivoque Rooftop') },
    { name: 'La Môme MC',         fn: p => scrapeGeneric(p, 'https://www.lamome-montecarlo.com/',                        'La Môme Monte-Carlo') },
    { name: 'YCM events',         fn: p => scrapeGeneric(p, 'https://www.ycm.mc/fr/programme-de-la-semaine',             'Wine Palace YCM') },
    { name: 'AMU MC',             fn: p => scrapeGeneric(p, 'https://www.amu-mc.com/',                                   'AMU Monte Carlo') },
    { name: 'New Moods',          fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/en/spectacles/new-moods',     'New Moods Monte-Carlo') },
    { name: 'The Marlow',         fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/en/restaurant-monaco/marlow', 'The Marlow Monaco') },
    { name: 'Blue Gin',           fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/en/bar-nightclub-monaco/the-blue-gin', 'Blue Gin Monte-Carlo Bay') },
    { name: 'Sunset Monaco',      fn: p => scrapeGeneric(p, 'https://www.sunsetmonaco.com/',                              'Sunset Monaco') },
    { name: 'Twiga MC',           fn: p => scrapeGeneric(p, 'https://twigaworld.com/twiga-montecarlo/',                   'Twiga Monte Carlo') },
    { name: 'Lilly\'s Club',      fn: p => scrapeGeneric(p, 'https://lillysclub.com/future-events',                       'Lilly\'s Club') },
    { name: 'Jimmy\'z SBM',       fn: p => scrapeGeneric(p, 'https://www.montecarlosbm.com/en/nightlife/jimmyz-monte-carlo', 'Jimmy\'z Monte-Carlo') },
    { name: 'Amber Lounge',       fn: p => scrapeGeneric(p, 'https://www.amberlounge.com/events/monaco-2026/',              'Amber Lounge Monaco') },
    { name: 'Jack Monaco',        fn: p => scrapeGeneric(p, 'https://www.jack.mc/',                                          'Jack Monaco') },
    { name: 'Nobu Monte-Carlo',   fn: p => scrapeGeneric(p, 'https://www.fairmont-montecarlo.com/en/events/',                'Nobu Monte-Carlo') },
    // ── Associations sans site web détecté (vérifiées, à réessayer) ──────────
    // Monaco Aide et Présence      — aucun site trouvé (vérifié 15/05/2026)
    // Société Saint-Vincent de Paul Monaco — aucun site trouvé
    // Les Anges Gardiens Monaco    — site trouvé, pas de page événements
    // Association Amitié Sans Frontières — aucun site trouvé
    // Children & Future            — aucun site trouvé
    // Caritas Monaco               — aucun site trouvé
    // Assoc. Amis de l'Opéra MC   — aucun site trouvé
    // Comité AIAP UNESCO Monaco    — aucun site trouvé
    // ICDA Monaco                  — aucun site trouvé
    // La Maison de France FGFM     — aucun site trouvé
    // Assoc. Monégasque Myopathies — aucun site trouvé
    // Écoute Cancer Réconfort      — aucun site trouvé
  ];

  for (const { name, fn } of scrapers) {
    try {
      console.log(`  → Scraping ${name}...`);
      const results = await fn(page);
      const valid = results.filter(r => r.title && !r.error);
      console.log(`     ${valid.length} candidats trouvés.`);
      allCandidates.push(...valid);
    } catch (e) {
      console.log(`     ✗ Erreur : ${e.message}`);
    }
  }

  // ── Déduplication ───────────────────────────────────────────────────────────
  const today = new Date(); today.setHours(0,0,0,0);
  const newCandidates = [];

  for (const c of allCandidates) {
    if (!c.title) continue;
    const normTitle = norm(c.title);
    if (UI_NOISE.has(normTitle)) continue;
    if (GENERIC_TYPES.has(normTitle)) continue;
    if (/^(nous contacter|contact|accueil|home|faire un don|donate)$/i.test(normTitle)) continue;
    // Skip archive events with old years in the title
    if (/\b(201[0-9]|202[0-4])\b/.test(c.title)) continue;
    const wordCount = normTitle.split(' ').filter(w => w.length > 0).length;
    if (wordCount <= 1 && normTitle.length < 8) continue;

    const words = normTitle.split(' ').filter(w => w.length > 3);
    const alreadyIn = words.length > 0 && [...existing].some(t => {
      const matchCount = words.filter(w => t.includes(w)).length;
      return matchCount >= Math.max(2, Math.floor(words.length * 0.6));
    });
    if (alreadyIn) continue;

    newCandidates.push(c);
  }

  console.log(`\n  ${newCandidates.length} nouveaux candidats à enrichir.`);

  // ── Enrichissement (visite des pages de détail) ────────────────────────────
  const eventsToAdd = [];

  for (const candidate of newCandidates) {
    console.log(`  → Enrichissement : ${candidate.title.substring(0, 60)}`);

    let dateObj = null;
    let time = candidate.time || null;

    // Use date from listing if available
    if (candidate.date) {
      dateObj = parseDate(candidate.date);
      if (!time) time = parseTime(candidate.date);
    }

    // Visit detail page if we still need date (and have a link)
    if (!dateObj && candidate.link) {
      try {
        const details = await fetchEventDetails(page, candidate.link);
        if (details.dateStr) dateObj = parseDate(details.dateStr);
        if (!time && details.time) time = details.time;
      } catch (e) {
        console.log(`     ✗ Page de détail inaccessible : ${e.message}`);
      }
    }

    if (!dateObj) {
      console.log(`     ✗ Date introuvable — ignoré.`);
      continue;
    }
    if (dateObj < today) {
      console.log(`     ✗ Événement passé (${frDate(dateObj)}) — ignoré.`);
      continue;
    }
    // Skip events clearly located outside Monaco
    const venue = (candidate.venue || '').toLowerCase();
    const titleLow = candidate.title.toLowerCase();
    if (/\b(paris|strasbourg|cannes|nice|lyon|marseille|london|new york|genève|geneva|rome|madrid)\b/.test(venue + ' ' + titleLow)) {
      console.log(`     ✗ Hors Monaco — ignoré.`);
      continue;
    }

    const eventObj = generateEvent(candidate, dateObj, time, nextId++);
    eventsToAdd.push({ title: candidate.title, date: frDate(dateObj), obj: eventObj });
    console.log(`     ✓ Événement prêt : ${frDate(dateObj)} — ${candidate.title.substring(0, 50)}`);
  }

  await browser.close();

  if (eventsToAdd.length === 0) {
    console.log('\n  Aucun nouvel événement à insérer. Fin.');
    writeFileSync(LOG_FILE, `[${dateStr}] Aucun nouvel événement à insérer.\n`, 'utf8');
    return;
  }

  // ── Insertion dans events.js ────────────────────────────────────────────────
  console.log(`\n  Insertion de ${eventsToAdd.length} événements dans events.js...`);
  let src = readFileSync(EVENTS_FILE, 'utf8');

  const INSERT_MARKER = '// ── MESSES — WEEK-END';
  if (!src.includes(INSERT_MARKER)) {
    console.log(`  ✗ Marqueur d'insertion introuvable. Abandon.`);
    return;
  }

  const newLines = eventsToAdd.map(e => e.obj).join('\n');
  src = src.replace(INSERT_MARKER, `${newLines}\n  ${INSERT_MARKER}`);
  writeFileSync(EVENTS_FILE, src, 'utf8');
  console.log(`  ✓ events.js mis à jour.`);

  // ── Build ───────────────────────────────────────────────────────────────────
  console.log('\n  Build...');
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'pipe' });
    console.log('  ✓ Build réussi.');
  } catch (e) {
    console.log(`  ✗ Build échoué :\n${e.stderr?.toString()}`);
    // Rollback
    execSync(`git checkout -- ${EVENTS_FILE}`, { cwd: __dirname });
    return;
  }

  // ── Git push ────────────────────────────────────────────────────────────────
  const titles = eventsToAdd.map(e => e.title.substring(0, 40)).join(', ');
  const msg = `chore: auto-add ${eventsToAdd.length} événements (${new Date().toISOString().substring(0,10)})`;
  try {
    execSync(`git add src/data/events.js`, { cwd: __dirname });
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: __dirname });
    execSync(`git push origin main`, { cwd: __dirname });
    console.log(`  ✓ Poussé sur GitHub : ${eventsToAdd.length} nouveaux événements.`);
  } catch (e) {
    console.log(`  ✗ Git push échoué : ${e.message}`);
  }

  // ── Rapport final ───────────────────────────────────────────────────────────
  let report = `[${dateStr}] ${eventsToAdd.length} événements ajoutés automatiquement :\n`;
  for (const e of eventsToAdd) report += `  + ${e.date} — ${e.title}\n`;
  writeFileSync(LOG_FILE, report, 'utf8');
  console.log('\n' + report);
}

main().catch(e => {
  console.error('Erreur pipeline:', e);
  process.exit(1);
});
