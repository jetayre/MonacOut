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

  // ── 1. Supprimer les anciennes fiches hebdo cinéma (weeklyFilms:true) ───────
  let src = readFileSync(EVENTS_FILE, 'utf8');
  const linesBefore = src.split('\n');
  const linesAfter = linesBefore.filter(l => {
    // Remove new-style weekly cinema cards
    if (l.includes('weeklyFilms:true')) return false;
    // Remove old-style cards from before weeklyFilms flag existed:
    // lines that are a Cinémas 2 Monaco event but not a permanent pinLast-only daily card
    if (l.includes('source:"Cinémas 2 Monaco"') && !l.includes('pinLast:true')) return false;
    return true;
  });
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
  let seancesParFilm = {};

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
        'nouveauté','nouveautés','à l\'affiche','a l\'affiche','à l\'affiche cette semaine',
        'vf','vo','vostf','vostfr','vf & vo stf','vf & vo stfr',
        'en ce moment','en salles','toutes les séances',
      ]);

      function extractTimes(text) {
        return [...new Set(text.match(/\b\d{1,2}h\d{2}\b/g) || [])].slice(0, 6);
      }

      // Essai 0 : liens film directs (cinemas2monaco.com ?page=12&film=N)
      // Le titre vient de l'img[alt] dans le lien, ou du texte du lien hors sous-éléments
      const filmAnchors = [...document.querySelectorAll('a[href*="film="]')]
        .filter(a => /[?&]film=\d+/.test(a.href));
      if (filmAnchors.length >= 1 && filmAnchors.length <= 30) {
        for (const a of filmAnchors) {
          const imgAlt = cleanStr(a.querySelector('img')?.getAttribute('alt') || '');
          // Texte direct du lien (sans texte des sous-éléments)
          const linkTextDirect = [...a.childNodes]
            .filter(n => n.nodeType === 3)
            .map(n => n.textContent)
            .join(' ')
            .trim();
          const raw = imgAlt || cleanStr(linkTextDirect) || cleanStr(a.textContent);
          if (!raw || isNoise(raw) || seen.has(raw)) continue;
          seen.add(raw);
          const parent = a.closest('div,tr,li,article,td') || a.parentElement;
          const times = extractTimes(parent?.innerText || '');
          results.push({ title: raw, time: times.join(' · ') || null, link: a.href });
          if (results.length >= 12) break;
        }
        if (results.length >= 1) return results;
      }

      // Essai 1 : sélecteurs spécifiques aux sites de ciné
      const specificSelectors = [
        '[class*="film-card"]','[class*="filmCard"]','[class*="movie-card"]',
        '[class*="film-item"]','[class*="movie-item"]','[class*="affiche"]',
        '[class*="item-film"]','[class*="seance-film"]','[class*="programme-item"]',
        '.film','.movie','[data-film]','[data-movie]',
      ];
      function cleanStr(s) {
        return (s || '').replace(/[\n\r\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      }
      function isNoise(t) {
        const low = t.toLowerCase();
        if (NOISE.has(low)) return true;
        // reject section labels that look like "NOUVEAUTÉ" or "VF & VO STF — 2h00"
        if (/^(vf|vo|vostf|nouveaut)/i.test(low)) return true;
        // reject very short strings (< 4 chars) or suspiciously long ones
        if (t.length < 4 || t.length > 100) return true;
        return false;
      }

      for (const sel of specificSelectors) {
        const els = [...document.querySelectorAll(sel)];
        if (els.length < 2 || els.length > 30) continue;
        for (const el of els) {
          const titleEl = el.querySelector(
            'h1,h2,h3,h4,[class*="titre"],[class*="title"],[class*="nom"],[class*="name"]'
          );
          const rawTitle = cleanStr(titleEl?.innerText || el.querySelector('strong,b')?.innerText || '');
          if (!rawTitle || isNoise(rawTitle) || seen.has(rawTitle)) continue;
          seen.add(rawTitle);
          const times = extractTimes(el.innerText || '');
          results.push({ title: rawTitle, time: times.join(' · ') || null, link: el.querySelector('a[href]')?.href });
        }
        if (results.length >= 4) break;
      }

      // Essai 2 : articles génériques avec horaires
      if (results.length < 2) {
        const articles = [...document.querySelectorAll('article, .card, [class*="card"], li')];
        for (const el of articles.slice(0, 50)) {
          const titleEl = el.querySelector('h2,h3,h4,[class*="titre"],[class*="title"]');
          const rawTitle = cleanStr(titleEl?.innerText || '');
          if (!rawTitle || isNoise(rawTitle) || seen.has(rawTitle)) continue;
          const times = extractTimes(el.innerText || '');
          if (times.length === 0) continue;
          seen.add(rawTitle);
          results.push({ title: rawTitle, time: times.join(' · '), link: el.querySelector('a[href]')?.href });
          if (results.length >= 12) break;
        }
      }

      // Essai 3 : headings + bloc parent avec horaires
      if (results.length < 2) {
        const main = document.querySelector('main,#main,#content,.content') || document.body;
        for (const h of main.querySelectorAll('h2,h3,h4')) {
          const rawTitle = cleanStr(h.innerText);
          if (!rawTitle || isNoise(rawTitle) || seen.has(rawTitle)) continue;
          const parent = h.closest('section,article,div') || h.parentElement;
          const times = extractTimes(parent?.innerText || '');
          seen.add(rawTitle);
          results.push({ title: rawTitle, time: times.join(' · ') || null });
          if (results.length >= 12) break;
        }
      }

      return results;
    });

    console.log(`  Scraping : ${films.length} film(s) trouvé(s) sur cinemas2monaco.com`);
    // ── SÉANCES PAR JOUR ────────────────────────────────────────────────────
    // Stéphanie, 6 septembre 2026 : « peux-tu mettre les horaires pour chaque
    // séance sur la fiche cinéma en cliquant sur info ? »
    //
    // Les horaires SONT sur la page, mais au format « 16:00 » — l'ancien relevé
    // ne cherchait que « 16h00 » et repartait donc les mains vides, en ramenant
    // à la place les DURÉES (« 2h10 »), qui ne sont pas des séances.
    //
    // Le site range chaque film dans un tableau : une colonne par jour
    // (Aujourd'hui, Lun 07, Mar 08…), une ligne par version (VF, VO), et dans
    // chaque case une ou plusieurs séances. Une séance déjà passée porte la
    // classe « inactive » : on l'écarte, elle n'a plus rien à proposer.
    try {
      seancesParFilm = await page.evaluate(() => {
        const out = {};
        for (const tbody of document.querySelectorAll('table tbody')) {
          const lignes = [...tbody.querySelectorAll('tr')];
          if (lignes.length < 2) continue;
          const jours = [...lignes[0].querySelectorAll('th')].map(t => t.textContent.trim());
          if (!jours.some(j => /aujourd/i.test(j))) continue;

          // Le titre du film est le dernier intitulé rencontré avant ce tableau.
          let n = tbody.closest('table'), titre = '';
          while (n && !titre) {
            n = n.parentElement;
            const h = n && n.querySelector('h1,h2,h3,h4,[class*="titre"],[class*="title"]');
            if (h) titre = h.textContent.trim();
          }
          if (!titre) continue;

          const parJour = {};
          for (const tr of lignes.slice(1)) {
            const cases = [...tr.querySelectorAll('td')];
            const version = (cases[0]?.textContent || '').trim();   // VF ou VO
            cases.slice(1).forEach((td, i) => {
              const jour = jours[i + 1];
              if (!jour) return;
              for (const div of td.querySelectorAll('div')) {
                if (div.classList.contains('inactive')) continue;   // séance passée
                const h = (div.querySelector('span')?.textContent || '').trim();
                if (!/^\d{1,2}:\d{2}$/.test(h)) continue;
                (parJour[jour] = parJour[jour] || []).push(version ? `${version} ${h}` : h);
              }
            });
          }
          if (Object.keys(parJour).length) out[titre] = parJour;
        }
        return out;
      });
      const n = Object.keys(seancesParFilm).length;
      console.log(`  Séances : ${n} film(s) avec horaires par jour`);
    } catch (e) {
      console.log(`  · séances illisibles (${e.message}) — la fiche restera sans horaires`);
    }

    for (const f of films) console.log(`    • ${f.title}${f.time ? ' — ' + f.time : ''}`);
  } catch (e) {
    console.log(`  ✗ Erreur scraping : ${e.message}`);
  } finally {
    await browser.close();
  }

  // Filtre anti-parasites : les libellés de rubrique du site ("A L'AFFICHE VF & VO STF",
  // "VF", durées seules…) ne sont PAS des films → on les retire.
  films = films.filter(f => {
    const t = (f.title || '').toUpperCase().trim();
    if (/AFFICHE/.test(t)) return false;
    if (/^(VF|VO|VOST|VOSTFR|VF ?& ?VO)\b/.test(t)) return false;
    if (/^\d{1,2}\s*H\s*\d{2}$/.test(t.replace(/\s/g, ''))) return false;
    return t.length >= 2;
  });

  // ── 3. Créer UNE fiche par jour restant de la semaine cinéma ───────────────
  // (mercredi → mardi) pour que le filtre "Aujourd'hui" fonctionne chaque jour
  const today   = new Date(); today.setHours(0,0,0,0);
  const endDate = getEndOfCinemaWeek();
  let nextId    = getMaxId() + 1;

  const entries = [];
  if (films.length > 0) {
    // Venues : un objet par film, nom = titre + horaires si dispo
    const venues = films.map(film => {
      const safeTitle = film.title.replace(/[\n\r\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      const vName = film.time ? `${safeTitle} — ${film.time}` : safeTitle;
      const vLink = (film.link && !film.link.includes('cinemas2monaco.com/#')) ? film.link : 'https://www.cinemas2monaco.com';
      return `{name:"${vName.replace(/\\/g,'\\\\').replace(/"/g,'\\"')}",link:"${vLink}"}`;
    });
    const venuesStr = `[${venues.join(',')}]`;

    // Desc : liste des titres seuls
    const filmList    = films.map(f => f.title.replace(/[\n\r\t]+/g, ' ').trim()).join(' · ');
    const filmListEsc = filmList.replace(/\\/g,'\\\\').replace(/"/g,'\\"');

    // Le tableau du site nomme ses colonnes « Aujourd'hui », « Lun 07 », « Mar 08 ».
    // On retrouve donc la bonne colonne pour chaque fiche du jour.
    const colonneDuJour = (d, estAujourdhui) =>
      estAujourdhui ? "Aujourd'hui" : `${JOURS[d.getDay()]} ${String(d.getDate()).padStart(2, '0')}`;

    const echapper = t => t.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    // Le ⓘ de la fiche affiche « nom » puis « info » en dessous : le titre du film,
    // puis ses séances du jour. Un film sans séance ce jour-là n'y figure pas —
    // l'annoncer serait envoyer quelqu'un devant une salle fermée.
    const annuaireDuJour = (col) => {
      const lignes = [];
      for (const film of films) {
        const titre = film.title.replace(/[\n\r\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
        const cle = Object.keys(seancesParFilm).find(k =>
          k.toLowerCase().includes(titre.toLowerCase()) || titre.toLowerCase().includes(k.toLowerCase()));
        const heures = cle ? (seancesParFilm[cle][col] || []) : [];
        if (!heures.length) continue;
        lignes.push(`{name:"${echapper(titre)}",info:"${echapper(heures.join(' · '))}"}`);
      }
      return lignes.length ? `,directory:[${lignes.join(',')}]` : '';
    };

    // Une fiche par jour restant (aujourd'hui inclus → mardi fin de semaine)
    const d = new Date(today);
    let premier = true;
    while (d <= endDate) {
      const dateFr = frDate(d);
      const year   = d.getFullYear();
      const yearF  = year !== 2026 ? `,year:${year}` : '';
      const annu   = annuaireDuJour(colonneDuJour(d, premier));
      premier = false;
      entries.push(
        `  {id:${nextId++}${yearF},cat:"CINÉMA",date:"${dateFr}",time:"En journée",title:"CINÉMA\\nÀ L'AFFICHE\\nCETTE SEMAINE",subtitle:"Cinémas 2 Monaco · Monte-Carlo",desc:"${filmListEsc}",descEn:"${filmListEsc}",free:false,hot:false,weeklyFilms:true,pinLast:true,fallback:"linear-gradient(150deg,#1A0A3A,#3A1A6A,#0A0020)",accent:"#C0A0F0",emoji:"🎬",link:"https://www.cinemas2monaco.com",phone:"+377 9325 3681",source:"Cinémas 2 Monaco",quarter:"Monte-Carlo",venues:${venuesStr}${annu}},`
      );
      d.setDate(d.getDate() + 1);
    }
  }

  // ── 4. Insérer dans events.js ──────────────────────────────────────────────
  if (entries.length > 0) {
    const INSERT_MARKER = '// ── MESSES — WEEK-END';
    if (!src.includes(INSERT_MARKER)) {
      console.log('  ✗ Marqueur introuvable dans events.js — abandon');
      return;
    }
    src = src.replace(INSERT_MARKER, `${entries.join('\n')}\n  ${INSERT_MARKER}`);
    console.log(`  ✓ ${entries.length} fiche(s) ajoutée(s) — ${films.length} film(s), jusqu'au ${frDate(endDate)}`);
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
    // ⚠️ Commiter AUSSI les fichiers produits par le build : l'app lit ses données en
    // direct dans public/events.json (liveEvents.js). Ne pousser que la source revenait
    // à publier un programme cinéma invisible jusqu'au prochain passage de daily-check —
    // et indéfiniment si ce passage n'avait, lui, rien à modifier.
    execSync(`git add src/data/events.js public/events.json public/widget-events.json`, { cwd: __dirname });
    const filmList = films.map(f => f.title).join(', ').slice(0, 80);
    const msg = entries.length > 0
      ? `chore: programme cinéma — ${films.length} film(s), fiches dim→mar`
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
