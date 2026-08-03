#!/usr/bin/env node
/**
 * MonacOut — Gère le BANDEAU d'annonce, chaque jour, automatiquement (mode A+B).
 *
 * B (manuel, PRIORITAIRE) : les entrées de announcements[] dont l'id NE commence PAS par "auto-"
 *   sont tes ajouts à la main (ex: Palais, Vanessa). Elles priment.
 * A (auto) : si AUCUN manuel n'est actif aujourd'hui/demain, le script choisit tout seul UN
 *   temps fort à venir (ce soir / demain soir) parmi les événements, avec un FILTRE STRICT
 *   (que du notable : hot / opéra / gala / festival — jamais un apéro). Il l'ajoute comme
 *   entrée "auto-<id>".
 *
 * Il régénère aussi le REPLI STATIQUE `announcement` (avec « Ce soir / Demain soir » calculé)
 * pour que MÊME les vieilles apps affichent le bon message.
 *
 * Diffusé à TOUS → on reste conservateur : mieux vaut pas de bandeau qu'un événement médiocre.
 * Branché dans daily-check.yml (2×/jour). Usage : node scripts/refresh-announcement.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CFG_FILE = join(ROOT, 'public', 'notif-config.json');
const EVENTS_FILE = join(ROOT, 'public', 'events.json');

const MOIS = { jan: 0, 'fév': 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, 'août': 7, sep: 8, oct: 9, nov: 10, 'déc': 11 };
const pad = n => String(n).padStart(2, '0');

let cfg;
try { cfg = JSON.parse(readFileSync(CFG_FILE, 'utf8')); } catch { process.exit(0); }

// Jour courant en fuseau Monaco (le CI tourne en UTC).
const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Monaco', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const today = new Date(todayStr + 'T00:00:00');
const CUR_YEAR = today.getFullYear();
const diffDays = d => Math.round((d - today) / 86400000);
function evDate(e) {
  const m = (e.date || '').match(/(\d{1,2})\s+([A-Za-zéûôà]+)/);
  if (!m) return null;
  const mo = MOIS[m[2].toLowerCase()];
  if (mo == null) return null;
  return new Date(e.year || CUR_YEAR, mo, +m[1]);
}

// ── B : entrées manuelles (on retire les auto- et on purge les manuelles trop anciennes) ──
let manual = (cfg.announcements || []).filter(a => a && a.id && a.date && !String(a.id).startsWith('auto-'));
manual = manual.filter(a => diffDays(new Date(a.date + 'T00:00:00')) >= -1);
const activeManual = manual.some(a => { const df = diffDays(new Date(a.date + 'T00:00:00')); const lead = a.leadDays != null ? a.leadDays : 1; return df >= 0 && df <= lead; });

// ── A : auto-pick d'un temps fort (seulement si aucun manuel actif) ──
let auto = null;
if (!activeManual) {
  let evts = [];
  try { const j = JSON.parse(readFileSync(EVENTS_FILE, 'utf8')); evts = Array.isArray(j) ? j : (j.events || []); } catch { /* pas d'events → pas d'auto */ }
  // Liste BLANCHE : uniquement des temps forts CULTURELS (pas de sport, enchères, apéro, conférence…).
  const CULTURAL = new Set(['OPÉRA', 'CONCERT', 'MUSICAL', 'THÉÂTRE', 'DANSE', 'GALA', 'FESTIVAL', 'SPECTACLE', 'JAZZ LIVE']);
  const NOTABLE = new Set(['OPÉRA', 'GALA', 'FESTIVAL']);
  // SALLES DE PRESTIGE : un spectacle qui s'y donne est un temps fort par nature,
  // même si personne n'a pensé à le marquer « hot ». Sans cette règle le bandeau
  // restait vide la plupart des jours (2 août : « Soul! » au Sporting était écarté).
  const PRESTIGE = /salle des [ée]toiles|sporting|palais princier|cour d.honneur|auditorium rainier|salle garnier|op[ée]ra de monte-carlo|salle des princes/i;
  const enSallePrestige = e => PRESTIGE.test(`${e.subtitle || ''} ${e.source || ''}`);
  const cands = [];
  for (const e of evts) {
    if (!e || !e.date || !e.link) continue;
    if (e.venues || e.ongoing || e.weeklyFilms || e.noNotif || e.nlg || e.directory || e.recurring) continue;
    if (!CULTURAL.has(e.cat)) continue;                            // que la culture
    if (!(e.hot === true || NOTABLE.has(e.cat) || enSallePrestige(e))) continue;   // notable, ou grande salle
    const d = evDate(e); if (!d) continue;
    const df = diffDays(d);
    if (df < 0 || df > 1) continue;                                 // seulement ce soir / demain soir
    cands.push({ e, df, d });
  }
  // Combien de jours différents chaque spectacle occupe-t-il ? Une série qui se joue
  // tous les soirs (ex. « Soul! » du 2 au 9 août) monopoliserait le bandeau une
  // semaine entière et écraserait un concert exceptionnel donné le même soir.
  // À égalité de jour, on préfère donc l'événement le plus RARE.
  const nbDates = new Map();
  for (const e of evts) {
    const cle = (e.title || '').replace(/\n/g, ' ').trim();
    if (!cle) continue;
    if (!nbDates.has(cle)) nbDates.set(cle, new Set());
    nbDates.get(cle).add(`${e.year || CUR_YEAR}-${e.date}`);
  }
  const rarete = e => (nbDates.get((e.title || '').replace(/\n/g, ' ').trim()) || { size: 1 }).size;

  cands.sort((x, y) =>
    x.df - y.df ||
    rarete(x.e) - rarete(y.e) ||                      // l'événement unique d'abord
    (y.e.hot ? 1 : 0) - (x.e.hot ? 1 : 0));
  if (cands.length) {
    const { e, d } = cands[0];
    const clean = e.title.replace(/\n/g, ' ').replace(/\s*ⓘ\s*$/, '').replace(/\s+/g, ' ').trim();
    const venue = (e.subtitle || '').split(' · ')[0];
    const tt = /\d/.test(e.time || '') ? ', ' + e.time : '';
    const t = `${clean}${venue ? ' — ' + venue : ''}${tt}`;
    auto = { id: `auto-${e.id}`, date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, titleFR: t, titleEN: t, cta: 'Découvrir', ctaEn: 'Discover', link: e.link };
  }
}

cfg.announcements = auto ? [...manual, auto] : manual;

// ── Repli statique (vieilles apps) : l'entrée active la plus proche, avec préfixe « Ce soir / Demain soir » ──
let best = null;
for (const a of cfg.announcements) {
  const df = diffDays(new Date(a.date + 'T00:00:00'));
  const lead = a.leadDays != null ? a.leadDays : 1;
  if (df < 0 || df > lead) continue;
  if (!best || df < best.df) best = { a, df };
}
const prev = JSON.stringify(cfg.announcement || {});
if (!best) {
  cfg.announcement = { id: 'none', message: '', messageEn: '', until: todayStr };
} else {
  const { a, df } = best;
  const preFR = df === 0 ? 'Ce soir : ' : df === 1 ? 'Demain soir : ' : '';
  const preEN = df === 0 ? 'Tonight: ' : df === 1 ? 'Tomorrow night: ' : '';
  cfg.announcement = {
    id: `${a.id}-${df === 0 ? 'cesoir' : 'demain'}`,
    message: preFR + (a.titleFR || '') + '.',
    messageEn: preEN + (a.titleEN || a.titleFR || '') + '.',
    cta: a.cta, ctaEn: a.ctaEn, link: a.link,
    until: a.date,
  };
}

writeFileSync(CFG_FILE, JSON.stringify(cfg, null, 2) + '\n');
console.log(`Bandeau : ${cfg.announcement.message || '(vide)'}  ${auto ? '[auto: ' + auto.titleFR + ']' : activeManual ? '[manuel actif]' : '[rien]'}`);
process.exit(0);
