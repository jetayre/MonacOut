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
      year: getNum('year') || 2026,
      cat: get('cat'),
      date: get('date'),
      time: get('time'),
      title: get('title'),
      desc: get('desc'),
      descEn: get('descEn'),
      free: getBool('free'),
      hot: getBool('hot'),
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

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
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

  const totalIssues = missingDescEn.length + wrongDays.length + oldEvents.length + coverageGaps.length;

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

main();
