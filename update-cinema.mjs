#!/usr/bin/env node
/**
 * MonacOut — Mise à jour hebdomadaire programme cinéma
 * 1. Supprime les anciennes fiches film (pas les cartes permanentes pinLast)
 * 2. Scrape cinemas2monaco.com pour le programme de la semaine
 * 3. Crée une fiche par film, datée au mardi fin de semaine
 * 4. npm run build + git commit + push
 *
 * Lancé chaque mercredi à 8h Monaco via GitHub Actions (cinema-update.yml)
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];

function frDate(d) {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

function getMaxId() {
  const src = readFileSync(EVENTS_FILE, 'utf8');
  return Math.max(...[...src.matchAll(/\{id:(\d+)/g)].map(m => +m[1]));
}

function cleanTitle(raw) {
  const words = raw.toUpperCase().split(/\s+/);
  const lines = []; let line = '';
  for (const w of words) {
    if (line.length + w.length + 1 > 18 && line.length > 0) {
      lines.push(line.trim()); line = w;
    } else {
      line += (line ? ' ' : '') + w;
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 3).join('\\n');
}

// Prochain mardi = fin de la semaine cinéma (programme Wed→Tue)
function getEndOfCinemaWeek() {
  const d = new Date(); d.setHours(0,0,0,0);
  while (d.getDay() !== 2) d.setDate(d.getDate() + 1);
  return d;
}

async function main() {
  const logDate = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });
  console.log(`\n[${logDate}] Programme cinéma — mise à jour hebdomadaire`);

  // ── 1. Supprimer les anciennes fiches film ──────────────────────────────────
  let src = readFileSync(EVENTS_FILE, 'utf8');
  const linesBefore = src.split('\n');
  const linesAfter = linesBefore.filter(l =>
    !(l.includes('source:"Cinémas 2 Monaco"') && !l.includes('pinLast:true'))
  );
  const removed = linesBefore.length - linesAfter.length;
  src = linesAfter.join('\n');
  console.log(`  Nettoyage : ${removed} ancienne(s) fiche(s) film supprimée(s)`);

  // ── 2. Scraper cinemas2monaco.com ──────────────────────────────────────────
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    locale: 'fr-FR',
  });
  const page = await context.newPage();
  let films = [];

  try {
    await page.goto('https://www.cinemas2monaco.com', { waitUntil: 'networkidle', timeout: 35000 });
    await page.waitForTimeout(2500);

    films = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      const NOISE = new Set([
        'accueil','contact','billetterie','programme','séances','films',
        'agenda','horaires','mentions légales','nous contacter','english',
        'bandes annonces','newsletter','tarifs','abonnement','cinéma',
        'cinemas','cinémas 2 monaco','news',
      ]);

      function extractTimes(text) {
        return [...new Set(text.match(/\b\d{1,2}h\d{2}\b/g) || [])].slice(0, 6);
      }

      // Essai 1 : sélecteurs spécifiques aux sites de ciné
      const specificSelectors = [
        '[class*="film-card"]','[class*="filmCard"]','[class*="movie-card"]',
        '[class*="film-item"]','[class*="movie-item"]','[class*="affiche"]',
        '[class*="item-film"]','[class*="seance-film"]','[class*="programme-item"]',
        '.film','.movie','[data-film]','[data-movie]',
      ];
      for (const sel of specificSelectors) {
        const els = [...document.querySelectorAll(sel)];
        if (els.length < 2 || els.length > 30) continue;
        for (const el of els) {
          const titleEl = el.querySelector(
            'h1,h2,h3,h4,[class*="titre"],[class*="title"],[class*="nom"],[class*="name"]'
          );
          const title = titleEl?.innerText?.trim() || el.querySelector('strong,b')?.innerText?.trim();
          if (!title || title.length < 3 || title.length > 120 || NOISE.has(title.toLowerCase()) || seen.has(title)) continue;
          seen.add(title);
          const times = extractTimes(el.innerText || '');
          results.push({ title, time: times.join(' · ') || null, link: el.querySelector('a[href]')?.href });
        }
        if (results.length >= 4) break;
      }

      // Essai 2 : articles génériques avec horaires
      if (results.length < 2) {
        const articles = [...document.querySelectorAll('article, .card, [class*="card"], li')];
        for (const el of articles.slice(0, 50)) {
          const titleEl = el.querySelector('h2,h3,h4,[class*="titre"],[class*="title"]');
          const title = titleEl?.innerText?.trim();
          if (!title || title.length < 3 || title.length > 120 || NOISE.has(title.toLowerCase()) || seen.has(title)) continue;
          const times = extractTimes(el.innerText || '');
          if (times.length === 0) continue; // ignorer les éléments sans horaires
          seen.add(title);
          results.push({ title, time: times.join(' · '), link: el.querySelector('a[href]')?.href });
          if (results.length >= 12) break;
        }
      }

      // Essai 3 : headings + bloc parent avec horaires
      if (results.length < 2) {
        const main = document.querySelector('main,#main,#content,.content') || document.body;
        for (const h of main.querySelectorAll('h2,h3,h4')) {
          const title = h.innerText.trim();
          if (title.length < 3 || title.length > 120 || NOISE.has(title.toLowerCase()) || seen.has(title)) continue;
          const parent = h.closest('section,article,div') || h.parentElement;
          const times = extractTimes(parent?.innerText || '');
          seen.add(title);
          results.push({ title, time: times.join(' · ') || null });
          if (results.length >= 12) break;
        }
      }

      return results;
    });

    console.log(`  Scraping : ${films.length} film(s) trouvé(s) sur cinemas2monaco.com`);
    for (const f of films) console.log(`    • ${f.title}${f.time ? ' — ' + f.time : ''}`);
  } catch (e) {
    console.log(`  ✗ Erreur scraping : ${e.message}`);
  } finally {
    await browser.close();
  }

  // ── 3. Créer les fiches événement ──────────────────────────────────────────
  const endDate   = getEndOfCinemaWeek();
  const dateFr    = frDate(endDate);
  const year      = endDate.getFullYear();
  let nextId      = getMaxId() + 1;

  const entries = films.map(film => {
    const esc     = s => s.replace(/\\/g,'\\\\').replace(/"/g,'\\"');
    const title   = cleanTitle(film.title);
    const desc    = film.title.replace(/"/g,'\\"');
    const time    = esc(film.time || 'Voir horaires sur le site');
    const yearF   = year !== 2026 ? `,year:${year}` : '';
    return `  {id:${nextId++}${yearF},cat:"CINÉMA",date:"${dateFr}",time:"${time}",title:"${esc(title)}",subtitle:"Cinémas 2 Monaco · Monte-Carlo",desc:"${desc}",descEn:"${desc}",free:false,hot:false,fallback:"linear-gradient(150deg,#1A0A3A,#3A1A6A,#0A0020)",accent:"#C0A0F0",emoji:"🎬",link:"https://www.cinemas2monaco.com",phone:"+377 9325 3681",source:"Cinémas 2 Monaco",quarter:"Monte-Carlo"},`;
  });

  // ── 4. Insérer dans events.js ──────────────────────────────────────────────
  if (entries.length > 0) {
    const INSERT_MARKER = '// ── MESSES — WEEK-END';
    if (!src.includes(INSERT_MARKER)) {
      console.log('  ✗ Marqueur introuvable dans events.js — abandon');
      return;
    }
    src = src.replace(INSERT_MARKER, `${entries.join('\n')}\n  ${INSERT_MARKER}`);
    console.log(`  ✓ ${entries.length} fiche(s) ajoutée(s) — programme jusqu'au ${dateFr}`);
  }

  writeFileSync(EVENTS_FILE, src);

  // ── 5. Build ────────────────────────────────────────────────────────────────
  try {
    execSync('npm run build', { cwd: __dirname, stdio: 'pipe' });
    console.log('  ✓ Build réussi');
  } catch (e) {
    console.log(`  ✗ Build échoué : ${e.stderr?.toString()?.slice(0, 200)}`);
    execSync(`git checkout -- ${EVENTS_FILE}`, { cwd: __dirname });
    return;
  }

  // ── 6. Git push ─────────────────────────────────────────────────────────────
  try {
    execSync(`git add src/data/events.js`, { cwd: __dirname });
    const filmList = films.map(f => f.title).join(', ').slice(0, 80);
    const msg = entries.length > 0
      ? `chore: programme cinéma semaine jusqu'au ${dateFr} — ${entries.length} film(s)`
      : `chore: nettoyage fiches cinéma (aucun nouveau film scrapé)`;
    execSync(`git commit -m "${msg.replace(/"/g,'\\"')}"`, { cwd: __dirname });
    execSync('git push origin main', { cwd: __dirname });
    console.log('  ✓ Publié sur GitHub');
  } catch (e) {
    if (e.message.includes('nothing to commit')) {
      console.log('  — Aucune modification à commiter');
    } else {
      console.log(`  ✗ Git : ${e.message}`);
    }
  }

  console.log('\n  Terminé.');
}

main().catch(e => { console.error('Erreur pipeline cinéma:', e); process.exit(1); });
