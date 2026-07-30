#!/usr/bin/env node
/**
 * MonacOut — Recalcule le REPLI STATIQUE du bandeau d'annonce chaque jour.
 *
 * Le bandeau in-app a deux niveaux :
 *   - announcements[] (DATÉ) : les apps À JOUR calculent elles-mêmes « Ce soir / Demain soir ».
 *   - announcement (STATIQUE) : repli pour les apps PAS ENCORE à jour → elles affichent ce texte tel quel.
 *
 * Ce script régénère le repli statique à partir de announcements[], en calculant « Ce soir : » /
 * « Demain soir : » selon la date du jour (fuseau Monaco). Ainsi, MÊME les vieilles apps affichent
 * toujours le bon message, sans intervention manuelle. Branché dans daily-check.yml (2×/jour).
 *
 * Usage : node scripts/refresh-announcement.mjs   (exit 0 toujours)
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'notif-config.json');
let cfg;
try { cfg = JSON.parse(readFileSync(FILE, 'utf8')); } catch { process.exit(0); }
const list = Array.isArray(cfg.announcements) ? cfg.announcements : [];

// Date du jour en fuseau Monaco (le CI tourne en UTC).
const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Monaco', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const today = new Date(todayStr + 'T00:00:00');

// Choisit l'événement le plus proche dans la fenêtre [aujourd'hui .. J-lead].
let best = null;
for (const a of list) {
  if (!a || !a.id || !a.date) continue;
  const diff = Math.round((new Date(a.date + 'T00:00:00') - today) / 86400000);
  const lead = a.leadDays != null ? a.leadDays : 1;
  if (diff < 0 || diff > lead) continue;
  if (!best || diff < best.diff) best = { a, diff };
}

const prev = JSON.stringify(cfg.announcement || {});
if (!best) {
  // Rien d'actuel → repli vide (aucun bandeau pour les vieilles apps).
  cfg.announcement = { id: 'none', message: '', messageEn: '', until: todayStr };
} else {
  const { a, diff } = best;
  const preFR = diff === 0 ? 'Ce soir : ' : diff === 1 ? 'Demain soir : ' : '';
  const preEN = diff === 0 ? 'Tonight: ' : diff === 1 ? 'Tomorrow night: ' : '';
  cfg.announcement = {
    id: `${a.id}-${diff === 0 ? 'cesoir' : 'demain'}`,
    message: preFR + (a.titleFR || '') + '.',
    messageEn: preEN + (a.titleEN || a.titleFR || '') + '.',
    cta: a.cta, ctaEn: a.ctaEn, link: a.link,
    until: a.date,
  };
}

if (JSON.stringify(cfg.announcement) !== prev) {
  writeFileSync(FILE, JSON.stringify(cfg, null, 2) + '\n');
  console.log('Repli statique recalculé →', cfg.announcement.message || '(vide)');
} else {
  console.log('Repli statique déjà à jour →', cfg.announcement.message || '(vide)');
}
process.exit(0);
