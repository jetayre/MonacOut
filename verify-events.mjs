#!/usr/bin/env node
/**
 * MonacOut — Agent de vérification quotidienne des événements
 * Exécution prévue : 6h00 chaque jour via cron ou launchd
 *
 * Rôle :
 *  1. Lire src/data/events.js
 *  2. Vérifier que chaque événement a un champ descEn
 *  3. Vérifier les jours de la semaine (Lun/Mar/Mer/Jeu/Ven/Sam/Dim)
 *  4. Signaler les événements passés qui devraient être retirés (> 30j passés)
 *  5. Signaler les trous de couverture mensuelle (APÉRO, BRUNCH, ATELIER, BIEN-ÊTRE, CONFÉRENCE)
 *  6. Écrire un rapport dans verify-events-report.txt à la racine
 *
 * Usage :
 *   node verify-events.mjs
 *
 * Cron (6h00 chaque jour) :
 *   0 6 * * * cd /Users/stephanieayre/monacout && node verify-events.mjs >> verify-events.log 2>&1
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { setTimeout as sleep } from 'timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, 'src/data/events.js');

// ── Parsing ──────────────────────────────────────────────────────────────────

function parseEvents(source) {
  const events = [];
  // Match each {id:...,} object — single-line objects
  const re = /\{id:(\d+)[^}]+\}/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const raw = m[0];
    const get = (key) => {
      const r = new RegExp(`${key}:"([^"]*)"`, '');
      const match = raw.match(r);
      return match ? match[1] : null;
    };
    const getBool = (key) => {
      const r = new RegExp(`${key}:(true|false)`, '');
      const match = raw.match(r);
      return match ? match[1] === 'true' : null;
    };
    const getNum = (key) => {
      const r = new RegExp(`${key}:(\\d+)`, '');
      const match = raw.match(r);
      return match ? parseInt(match[1]) : null;
    };
    events.push({
      id: getNum('id'),
      year: getNum('year') || new Date().getFullYear(),
      cat: get('cat'),
      date: get('date'),
      time: get('time'),
      title: get('title'),
      desc: get('desc'),
      descEn: get('descEn'),
      free: getBool('free'),
      hot: getBool('hot'),
      link: get('link'),
      source: get('source'),
      quarter: get('quarter'),
      _raw: raw,
    });
  }
  return events;
}

// ── Date helpers ──────────────────────────────────────────────────────────────

const MOIS = { jan: 0, fév: 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, août: 7, sep: 8, oct: 9, nov: 10, déc: 11 };
const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function eventDate(e) {
  const parts = e.date.trim().split(' ');
  if (parts.length < 3) return null;
  // Handle ranges like "4 — 8 juil 2026" — take first day
  const dayStr = parts[1].replace(/[^0-9]/g, '');
  const moisStr = parts[2];
  const moisIdx = MOIS[moisStr];
  if (moisIdx === undefined || !dayStr) return null;
  return new Date(e.year, moisIdx, parseInt(dayStr));
}

function expectedDayAbbrev(d) {
  return JOURS[d.getDay()];
}

// ── Checks ────────────────────────────────────────────────────────────────────

function checkMissingDescEn(events) {
  return events.filter(e => !e.descEn).map(e => ({
    id: e.id,
    date: e.date,
    title: e.title ? e.title.replace(/\n/g, ' ') : '?',
    issue: 'descEn manquant',
  }));
}

function checkWrongDayOfWeek(events) {
  const issues = [];
  for (const e of events) {
    // Skip events with date ranges (e.g., "4 — 8 juil 2026")
    if (e.date.includes('—')) continue;
    const parts = e.date.trim().split(' ');
    if (parts.length < 3) continue;
    const declaredDay = parts[0]; // e.g. "Jeu"
    const d = eventDate(e);
    if (!d) continue;
    const expected = expectedDayAbbrev(d);
    if (declaredDay !== expected) {
      issues.push({
        id: e.id,
        date: e.date,
        title: e.title ? e.title.replace(/\n/g, ' ') : '?',
        issue: `Jour déclaré: ${declaredDay} — attendu: ${expected}`,
      });
    }
  }
  return issues;
}

function checkOldEvents(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30); // alert if > 30 days in the past
  return events.filter(e => {
    const d = eventDate(e);
    return d && d < cutoff;
  }).map(e => ({
    id: e.id,
    date: e.date,
    title: e.title ? e.title.replace(/\n/g, ' ') : '?',
    issue: 'Événement > 30j dans le passé — à supprimer',
  }));
}

function checkMonthlyCoverage(events) {
  const RECURRING_CATS = ['APÉRO', 'BRUNCH', 'ATELIER', 'BIEN-ÊTRE', 'CONFÉRENCE'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const issues = [];

  // Check 12 months ahead
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const checkDate = new Date(today);
    checkDate.setMonth(checkDate.getMonth() + monthOffset);
    const year = checkDate.getFullYear();
    const month = checkDate.getMonth();

    for (const cat of RECURRING_CATS) {
      const has = events.some(e => {
        const d = eventDate(e);
        return d && d.getFullYear() === year && d.getMonth() === month && e.cat === cat;
      });
      if (!has) {
        const moisNom = Object.keys(MOIS).find(k => MOIS[k] === month);
        issues.push({
          issue: `Trou couverture : aucun événement "${cat}" en ${moisNom} ${year}`,
        });
      }
    }
  }
  return issues;
}

// ── Vérification dates fêtes ──────────────────────────────────────────────────

function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

function holidayWindows(year) {
  const easter = easterDate(year);
  return [
    { key: /p[âa]ques/i,         label: 'Lundi de Pâques',    center: addDays(easter, 1),   margin: 10 },
    { key: /ascension/i,             label: 'Ascension',  center: addDays(easter, 39),     margin: 4  },
    { key: /pentec[oô]te/i,           label: 'Pentecôte',  center: addDays(easter, 50),     margin: 7  },
    { key: /toussaint/i,        label: 'Toussaint',           center: new Date(year, 10, 1), margin: 30 },
    { key: /no[eë]l/i,          label: 'Noël',                center: new Date(year, 11, 25), margin: 30 },
  ];
}

function checkHolidayDates(events) {
  const issues = [];
  const yearsSeen = new Set(events.map(e => e.year));
  for (const year of yearsSeen) {
    const windows = holidayWindows(year);
    for (const e of events.filter(ev => ev.year === year)) {
      const d = eventDate(e);
      if (!d) continue;
      const text = ((e.title || '') + ' ' + (e.desc || '')).toLowerCase();
      for (const { key, label, center, margin } of windows) {
        if (!key.test(text)) continue;
        const diff = Math.abs((d - center) / 86400000);
        if (diff > margin) {
          issues.push({
            id: e.id,
            date: e.date,
            title: e.title ? e.title.replace(/\n/g, ' ') : '?',
            issue: `"${label}" ${year} attendu autour du ${center.getDate()}/${center.getMonth()+1} (±${margin}j) — event daté le ${d.getDate()}/${d.getMonth()+1} (écart ${Math.round(diff)}j)`,
          });
          break;
        }
      }
    }
  }
  return issues;
}

// ── Vérification des liens ────────────────────────────────────────────────────

// Mots-clés indiquant une page de réservation directe dans l'URL
const BOOKING_PATH_KEYWORDS = [
  'ticket', 'billet', 'booking', 'reserv', 'contact', 'programme', 'program',
  'concert', 'visit', 'atelier', 'season', 'saison', 'agenda', 'event',
  'billetterie', 'shop', 'schedule', 'calendar',
];

// Mots-clés de bouton réservation dans le HTML de la page
const BOOKING_HTML_KEYWORDS = [
  'réserver', 'reserver', 'acheter', 'billetterie', 'ticket', 'booking',
  'réservation', 'reservation', 'buy ticket', 'book now', 'add to cart',
  'ajouter au panier', 'commander', 'inscri',
];

function isHomepageUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname.replace(/\/$/, '');
    return p === '' || p === '/en' || p === '/fr' || p === '/fr-fr' || p === '/en-us';
  } catch { return false; }
}

function urlLooksDirectToBooking(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return BOOKING_PATH_KEYWORDS.some(k => path.includes(k));
  } catch { return false; }
}

async function fetchPage(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MonacOut-LinkChecker/1.0)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    const finalUrl = res.url;
    const html = res.ok ? await res.text() : '';
    return { ok: res.ok, status: res.status, finalUrl, html };
  } catch (err) {
    return { ok: false, status: 0, finalUrl: url, html: '', error: err.message };
  }
}

function hasBookingButton(html) {
  const lower = html.toLowerCase();
  return BOOKING_HTML_KEYWORDS.some(k => lower.includes(k));
}

function redirectedToOtherDomain(originalUrl, finalUrl) {
  try {
    return new URL(originalUrl).hostname !== new URL(finalUrl).hostname;
  } catch { return false; }
}

async function checkLinks(events) {
  // Dédupliquer les liens — une seule requête par URL unique
  const linkMap = new Map();
  for (const e of events) {
    if (!e.link) {
      linkMap.set(`__missing_${e.id}`, { link: null, events: [e] });
      continue;
    }
    if (!linkMap.has(e.link)) linkMap.set(e.link, { link: e.link, events: [] });
    linkMap.get(e.link).events.push(e);
  }

  const issues = [];
  const ok = [];
  let checked = 0;

  for (const { link, events: evts } of linkMap.values()) {
    const ids = evts.map(e => e.id);
    const titles = evts.map(e => (e.title || '').replace(/\\n/g, ' ')).join(', ');

    // Lien manquant
    if (!link) {
      issues.push({ level: '⚠️', ids, titles, link: '(vide)', issue: 'Lien manquant' });
      continue;
    }

    checked++;
    const { ok: httpOk, status, finalUrl, html, error } = await fetchPage(link);
    await sleep(300); // politesse — éviter le rate-limit

    // Lien mort — distinguer vrai 404/410 des faux positifs (403 = bloque bots, réseau = CI firewall)
    if (!httpOk) {
      const isTrulyDead = !error && (status === 404 || status === 410 || status === 0);
      const level = isTrulyDead ? '❌' : '⚠️';
      const msg = error ? `Inaccessible (réseau) : ${error}` : `HTTP ${status}`;
      issues.push({ level, ids, titles, link, issue: msg });
      continue;
    }

    // Redirigé vers un autre domaine (suspect)
    if (redirectedToOtherDomain(link, finalUrl)) {
      issues.push({ level: '⚠️', ids, titles, link, issue: `Redirigé vers un autre domaine : ${finalUrl}` });
      continue;
    }

    const directPath = urlLooksDirectToBooking(link);
    const hasButton = hasBookingButton(html);
    const isHome = isHomepageUrl(link);

    if (isHome && !hasButton) {
      // Page d'accueil sans bouton réservation visible → trop de clics
      issues.push({ level: '⚠️', ids, titles, link, issue: 'Page d\'accueil — aucun bouton "Réserver" détecté. Risque > 2 clics pour réserver.' });
    } else if (isHome && hasButton) {
      // Page d'accueil mais avec bouton réservation visible — acceptable mais à vérifier manuellement
      issues.push({ level: '💡', ids, titles, link, issue: 'Page d\'accueil avec bouton réservation — vérifier manuellement que c\'est ≤ 2 clics.' });
    } else if (!directPath && !hasButton) {
      // URL générique sans bouton ni chemin direct
      issues.push({ level: '⚠️', ids, titles, link, issue: 'URL générique — aucun bouton "Réserver" trouvé sur la page. Vérifier si lien plus direct existe.' });
    } else {
      ok.push({ ids, link });
    }
  }

  return { issues, okCount: ok.length, checkedCount: checked };
}

// ── Vérification géographique ─────────────────────────────────────────────────

const MONACO_DISTRICTS = new Set([
  'Monte-Carlo', 'Monaco-Ville', 'Monaco', 'Fontvieille',
  'La Condamine', 'Larvotto', 'Moneghetti', 'Jardin Exotique',
  'Saint-Roman', 'La Rousse',
]);

function checkGeography(events) {
  return events.filter(e => e.quarter && !MONACO_DISTRICTS.has(e.quarter)).map(e => ({
    id: e.id,
    date: e.date,
    title: e.title?.replace(/\n/g, ' ') || '?',
    issue: `Quartier hors Monaco : "${e.quarter}"`,
  }));
}

// ── Vérification domaines de liens interdits ──────────────────────────────────

const FORBIDDEN_DOMAINS = [
  'visitmonaco.com', 'yourmonaco.mc', 'principocket.com',
  'monte-carlo.mc', 'culture.mc',
];

function checkForbiddenLinks(events) {
  return events.filter(e => {
    if (!e.link) return false;
    return FORBIDDEN_DOMAINS.some(d => e.link.includes(d));
  }).map(e => ({
    id: e.id,
    date: e.date,
    title: e.title?.replace(/\n/g, ' ') || '?',
    issue: `Lien agrégateur interdit : ${e.link}`,
  }));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const now = new Date();
  const dateStr = now.toLocaleString('fr-FR', { timeZone: 'Europe/Monaco' });

  let source;
  try {
    source = readFileSync(EVENTS_FILE, 'utf8');
  } catch (err) {
    console.error('Impossible de lire events.js:', err.message);
    process.exit(1);
  }

  const events = parseEvents(source);
  console.log(`[${dateStr}] ${events.length} événements analysés.`);

  const missingDescEn = checkMissingDescEn(events);
  const wrongDays = checkWrongDayOfWeek(events);
  const oldEvents = checkOldEvents(events);
  const coverageGaps = checkMonthlyCoverage(events);
  const holidayErrors = checkHolidayDates(events);
  const geoIssues = checkGeography(events);
  const forbiddenLinkIssues = checkForbiddenLinks(events);

  console.log('Vérification des liens en cours…');
  const { issues: linkIssues, okCount: linksOk, checkedCount: linksChecked } = await checkLinks(events);

  const totalIssues = missingDescEn.length + wrongDays.length + oldEvents.length + coverageGaps.length + holidayErrors.length + geoIssues.length + forbiddenLinkIssues.length + linkIssues.filter(i => i.level === '❌').length;

  let report = `========================================\n`;
  report += `MONACOUT — RAPPORT VÉRIFICATION QUOTIDIENNE\n`;
  report += `Généré le : ${dateStr}\n`;
  report += `Événements analysés : ${events.length}\n`;
  report += `Problèmes détectés : ${totalIssues}\n`;
  report += `========================================\n\n`;

  if (missingDescEn.length > 0) {
    report += `── DESCEN MANQUANTS (${missingDescEn.length}) ────────────────\n`;
    for (const i of missingDescEn) {
      report += `  [id:${i.id}] ${i.date} — ${i.title}\n`;
    }
    report += '\n';
  } else {
    report += `✓ Tous les événements ont un champ descEn.\n\n`;
  }

  if (wrongDays.length > 0) {
    report += `── JOURS DE LA SEMAINE INCORRECTS (${wrongDays.length}) ────\n`;
    for (const i of wrongDays) {
      report += `  [id:${i.id}] ${i.date} — ${i.title} (${i.issue})\n`;
    }
    report += '\n';
  } else {
    report += `✓ Tous les jours de la semaine sont corrects.\n\n`;
  }

  if (oldEvents.length > 0) {
    report += `── ÉVÉNEMENTS ANCIENS À SUPPRIMER (${oldEvents.length}) ───\n`;
    for (const i of oldEvents) {
      report += `  [id:${i.id}] ${i.date} — ${i.title}\n`;
    }
    report += '\n';
  } else {
    report += `✓ Aucun événement trop ancien détecté.\n\n`;
  }

  if (coverageGaps.length > 0) {
    report += `── TROUS DE COUVERTURE MENSUELLE (${coverageGaps.length}) ──\n`;
    for (const i of coverageGaps) {
      report += `  ${i.issue}\n`;
    }
    report += '\n';
  } else {
    report += `✓ Couverture mensuelle complète sur 12 mois.\n\n`;
  }

  if (holidayErrors.length > 0) {
    report += `── EVENTS MAL DATÉS PAR RAPPORT AUX FÊTES (${holidayErrors.length}) ──\n`;
    for (const i of holidayErrors) {
      report += `  [id:${i.id}] ${i.date} — ${i.title}\n`;
      report += `  ⚠️  ${i.issue}\n\n`;
    }
  } else {
    report += `✓ Toutes les fêtes (Pâques, Pentecôte, Toussaint, Noël…) correctement datées.\n\n`;
  }

  // ── Géographie (critique App Store)
  if (geoIssues.length > 0) {
    report += `── 🚨 ÉVÉNEMENTS HORS MONACO — CRITIQUE (${geoIssues.length}) ────\n`;
    for (const i of geoIssues) {
      report += `  [id:${i.id}] ${i.date} — ${i.title}\n`;
      report += `  ⛔ ${i.issue}\n`;
    }
    report += '\n';
  } else {
    report += `✓ Tous les événements sont bien dans la Principauté de Monaco.\n\n`;
  }

  // ── Liens interdits (agrégateurs)
  if (forbiddenLinkIssues.length > 0) {
    report += `── 🚨 LIENS AGRÉGATEURS INTERDITS — CRITIQUE (${forbiddenLinkIssues.length}) ──\n`;
    for (const i of forbiddenLinkIssues) {
      report += `  [id:${i.id}] ${i.date} — ${i.title}\n`;
      report += `  ⛔ ${i.issue}\n`;
    }
    report += '\n';
  } else {
    report += `✓ Aucun lien agrégateur interdit (visitmonaco, culture.mc, etc.).\n\n`;
  }

  // ── Liens
  report += `── VÉRIFICATION LIENS (${linksChecked} URLs testées) ──────────\n`;
  if (linkIssues.length === 0) {
    report += `✓ Tous les liens sont accessibles et pointent vers une page de réservation directe.\n\n`;
  } else {
    const errors   = linkIssues.filter(i => i.level === '❌');
    const warnings = linkIssues.filter(i => i.level === '⚠️');
    const infos    = linkIssues.filter(i => i.level === '💡');

    if (errors.length > 0) {
      report += `\n  ❌ LIENS MORTS / INACCESSIBLES (${errors.length})\n`;
      for (const i of errors) {
        report += `     [id:${i.ids.join(',')}] ${i.titles}\n`;
        report += `     → ${i.link}\n`;
        report += `     ⚡ ${i.issue}\n\n`;
      }
    }
    if (warnings.length > 0) {
      report += `\n  ⚠️  LIENS TROP GÉNÉRIQUES — risque > 2 clics pour réserver (${warnings.length})\n`;
      for (const i of warnings) {
        report += `     [id:${i.ids.join(',')}] ${i.titles}\n`;
        report += `     → ${i.link}\n`;
        report += `     💬 ${i.issue}\n\n`;
      }
    }
    if (infos.length > 0) {
      report += `\n  💡 À VÉRIFIER MANUELLEMENT (${infos.length})\n`;
      for (const i of infos) {
        report += `     [id:${i.ids.join(',')}] ${i.titles}\n`;
        report += `     → ${i.link}\n`;
        report += `     💬 ${i.issue}\n\n`;
      }
    }
    report += `  ✓ ${linksOk} liens OK (directs, page réservation détectée)\n\n`;
  }

  report += `========================================\n`;
  report += `Fin du rapport\n`;

  const reportPath = join(__dirname, 'verify-events-report.txt');
  writeFileSync(reportPath, report, 'utf8');

  console.log(report);
  console.log(`Rapport sauvegardé : ${reportPath}`);

  if (totalIssues > 0) {
    process.exit(1); // exit code 1 so cron/CI peut détecter des problèmes
  }
}

main().catch(err => { console.error(err); process.exit(1); });
