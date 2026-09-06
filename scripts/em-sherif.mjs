#!/usr/bin/env node
/**
 * MonacOut — SOIRÉES LIVE MUSIC À EM SHERIF MONTE-CARLO
 *
 * Même besoin que `bar-americain.mjs`, source différente : le SBM annonce ici un
 * artiste PAR DATE et non par quinzaine —
 *   « Samedi 19 septembre : Rob Percu & Sax »
 *
 * On lit donc la page officielle à chaque passage quotidien et on écrit une fiche
 * par soirée annoncée. Rien n'est deviné : une date absente de la page n'existe pas.
 *
 * Idempotent : retire ses propres fiches (marqueur `ems:1`) avant de réécrire.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'src/data/events.js');
const PAGE = 'https://www.montecarlosbm.com/fr/agenda/em-sherif-monte-carlo-soirees-live-music';

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS  = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
const MOIS_LONGS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const JOURS_LONGS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];

const texte = h => h
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&#8217;|&rsquo;|&#039;|&#x27;/g, "'")
  .replace(/\s+/g, ' ');

const echappe = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const html = await fetch(PAGE, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } })
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
  .catch(e => { console.error(`✗ Em Sherif : page illisible (${e.message}) — aucune fiche touchée.`); process.exit(1); });

const t = texte(html);

// « Samedi 26 septembre : Rob Percu & Sax | Closing » — on coupe au « | », qui
// porte une mention de service et non le nom de l'artiste.
const re = new RegExp(
  `(?:${JOURS_LONGS.join('|')})\\s+(\\d{1,2})\\s*(?:er)?\\s+(${MOIS_LONGS.join('|')})\\s*:\\s*([^|:]{2,50}?)\\s*(?=\\||(?:${JOURS_LONGS.join('|')})\\s+\\d|[A-ZÉÛ]{4,}\\s*:|$)`,
  'gi',
);

const annee = new Date().getFullYear();
const today = new Date(); today.setHours(0, 0, 0, 0);
const vues = new Set();
const soirees = [];
let m;
while ((m = re.exec(t))) {
  const mo = MOIS_LONGS.indexOf(m[2].toLowerCase());
  if (mo < 0) continue;
  const d = new Date(annee, mo, +m[1]);
  const artiste = m[3].replace(/\s+/g, ' ').trim();
  const cle = `${d.toDateString()}|${artiste}`;
  if (!artiste || vues.has(cle) || d < today) continue;
  vues.add(cle);
  soirees.push({ d, artiste });
}

if (soirees.length === 0) {
  console.log('· Em Sherif : aucune soirée à venir sur la page (saison terminée ?) — fiches retirées.');
}

let s = readFileSync(FILE, 'utf8');
s = s.split('\n').filter(l => !l.includes('ems:1')).join('\n');
s = s.replace(/\n\s*\/\/ ── SOIRÉES EM SHERIF[^\n]*/g, '');

const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(970000, maxId + 1);

const lignes = soirees.map(({ d, artiste }) => {
  const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  const titre = `SOIRÉE LIVE\\n${echappe(artiste.toLocaleUpperCase('fr-FR'))}\\nEM SHERIF`;
  const desc = `Soirée musicale à Em Sherif Monte-Carlo, au rez-de-chaussée de l'Hôtel de Paris : ${echappe(artiste)}, de 20h30 à 23h30. Cuisine libanaise et méditerranéenne. Tenue casual chic.`;
  const descEn = `Live music night at Em Sherif Monte-Carlo, on the ground floor of the Hôtel de Paris: ${echappe(artiste)}, from 8.30pm to 11.30pm. Lebanese and Mediterranean cuisine. Casual chic dress code.`;
  return `  {id:${id++},year:${d.getFullYear()},cat:"DJ SET",date:"${date}",time:"20h30 — 23h30",title:"${titre}",subtitle:"Em Sherif Monte-Carlo · Hôtel de Paris · Monte-Carlo",desc:"${desc}",descEn:"${descEn}",free:false,hot:false,ems:1,fallback:"linear-gradient(150deg,#2A1030,#5A2A60,#180020)",accent:"#D8A8E8",emoji:"🎶",link:"${PAGE}",source:"Monte-Carlo SBM",quarter:"Monte-Carlo"},`;
});

const idx = s.lastIndexOf('\n];');
s = s.slice(0, idx)
  + (lignes.length ? '\n\n  // ── SOIRÉES EM SHERIF (lues chaque jour sur le programme officiel SBM) ──\n' + lignes.join('\n') : '')
  + s.slice(idx);
writeFileSync(FILE, s);

console.log(`✓ Em Sherif : ${lignes.length} soirées à venir.`);
soirees.slice(0, 8).forEach(x => console.log(`   ${x.d.toLocaleDateString('fr-FR')} : ${x.artiste}`));
