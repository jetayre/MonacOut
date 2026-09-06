#!/usr/bin/env node
/**
 * MonacOut — LIVE MUSIC AU BAR AMÉRICAIN (Hôtel de Paris Monte-Carlo)
 *
 * Pourquoi ce script existe. Le 6 septembre 2026, Stéphanie demande : « et ce soir
 * y a pas de concerts ou de fête dans les clubs Jimmy'z ou Twiga… ? » Le fil ne
 * proposait qu'une carte pour la soirée. Or le Bar Américain de l'Hôtel de Paris
 * a un GROUPE LIVE TOUS LES SOIRS à partir de 19h, toute l'année — et l'app n'en
 * disait rien depuis le premier jour.
 *
 * Le SBM publie la programmation par quinzaine sur une seule page :
 *   « Du 31 août au 13 septembre : Melissa Maugran Band »
 *
 * Figer cette liste dans le code la rendrait fausse en quelques semaines. Ce
 * script lit donc la page officielle à chaque passage quotidien et régénère les
 * fiches avec le bon artiste pour chaque jour.
 *
 * ⚠️ Il n'invente rien. Si la page devient illisible, il sort en erreur et ne
 *    touche à rien : mieux vaut aucune fiche qu'un nom d'artiste périmé.
 *
 * Idempotent : il retire ses propres fiches (marqueur `bam:1`) avant de réécrire.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'src/data/events.js');
const PAGE = 'https://www.montecarlosbm.com/fr/agenda/programmation-musicale-bar-americain-live-music';

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS  = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
const MOIS_LONGS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];

function texte(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;|&#039;|&#x27;/g, "'")
    .replace(/\s+/g, ' ');
}

/**
 * « Du 31 août au 13 septembre : Melissa Maugran Band » → une période.
 *
 * La page ne répète pas l'année dans les lignes ; elle la donne dans les titres de
 * section (« Septembre 2026 »). On part donc de l'année courante et on avance d'un
 * an dès qu'un mois recule — c'est ce qui arrive une seule fois, sur « Du 21
 * décembre au 3 janvier ».
 */
function lirePeriodes(t, anneeDepart) {
  const re = new RegExp(
    `Du\\s+(\\d{1,2})\\s*(?:er)?\\s+(${MOIS_LONGS.join('|')})\\s+au\\s+(\\d{1,2})\\s*(?:er)?\\s+(${MOIS_LONGS.join('|')})\\s*:\\s*([^…]{2,70}?)(?=\\s+(?:Du\\s+\\d|${MOIS_LONGS.map(m => m[0].toUpperCase() + m.slice(1)).join('|')}\\s+\\d{4}|Suivez|$))`,
    'gi',
  );
  const out = [];
  let annee = anneeDepart, moisPrecedent = -1, m;
  while ((m = re.exec(t))) {
    const mDeb = MOIS_LONGS.indexOf(m[2].toLowerCase());
    const mFin = MOIS_LONGS.indexOf(m[4].toLowerCase());
    if (mDeb < 0 || mFin < 0) continue;
    if (moisPrecedent >= 0 && mDeb < moisPrecedent) annee++;   // on a passé le 31 décembre
    moisPrecedent = mDeb;
    const debut = new Date(annee, mDeb, +m[1]);
    // Une période qui finit dans un mois antérieur à son début enjambe le nouvel an.
    const fin = new Date(mFin < mDeb ? annee + 1 : annee, mFin, +m[3]);
    const artiste = m[5].replace(/\s+/g, ' ').trim();
    if (artiste) out.push({ debut, fin, artiste });
  }
  // Doublons : la page répète une période sous deux titres de mois (« Du 31 août au
  // 13 septembre » apparaît sous Août ET sous Septembre).
  const vues = new Set();
  return out.filter(p => {
    const k = `${p.debut.toDateString()}|${p.artiste}`;
    if (vues.has(k)) return false;
    vues.add(k); return true;
  });
}

const echappe = s => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const majuscule = s => s.toLocaleUpperCase('fr-FR');

const html = await fetch(PAGE, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } })
  .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
  .catch(e => { console.error(`✗ Bar Américain : page illisible (${e.message}) — aucune fiche touchée.`); process.exit(1); });

const t = texte(html);
const periodes = lirePeriodes(t, new Date().getFullYear());
if (periodes.length === 0) {
  console.error('✗ Bar Américain : aucune période lue sur la page — aucune fiche touchée.');
  process.exit(1);
}

let s = readFileSync(FILE, 'utf8');
s = s.split('\n').filter(l => !l.includes('bam:1')).join('\n');
s = s.replace(/\n\s*\/\/ ── LIVE MUSIC BAR AMÉRICAIN[^\n]*/g, '');

const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(960000, maxId + 1);

const today = new Date(); today.setHours(0, 0, 0, 0);
const fin = new Date(today); fin.setMonth(fin.getMonth() + 3);

const lignes = [];
for (const p of periodes) {
  for (let d = new Date(Math.max(p.debut, today)); d <= p.fin && d <= fin; d.setDate(d.getDate() + 1)) {
    const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
    const titre = `LIVE MUSIC\\n${echappe(majuscule(p.artiste))}\\nBAR AMÉRICAIN`;
    const desc = `Groupe live à partir de 19h au Bar Américain de l'Hôtel de Paris Monte-Carlo : ${echappe(p.artiste)}. Jazz, swing, blues, soul et chanson dans le bar le plus mythique de Monaco. Ouvert tous les jours de 12h à 1h30. Tenue casual chic.`;
    const descEn = `Live band from 7pm at the Bar Américain, Hôtel de Paris Monte-Carlo: ${echappe(p.artiste)}. Jazz, swing, blues, soul and chanson in Monaco's most legendary bar. Open daily from noon to 1.30am. Casual chic dress code.`;
    lignes.push(`  {id:${id++},year:${d.getFullYear()},cat:"JAZZ LIVE",date:"${date}",time:"19h00 — 01h30",title:"${titre}",subtitle:"Bar Américain · Hôtel de Paris · Monte-Carlo",desc:"${desc}",descEn:"${descEn}",free:false,hot:false,bam:1,fallback:"linear-gradient(150deg,#2A1A08,#5A3A18,#180C00)",accent:"#E8C088",emoji:"🎷",link:"${PAGE}",source:"Monte-Carlo SBM",quarter:"Monte-Carlo"},`);
  }
}

const idx = s.lastIndexOf('\n];');
s = s.slice(0, idx)
  + '\n\n  // ── LIVE MUSIC BAR AMÉRICAIN (lu chaque jour sur le programme officiel SBM) ──\n'
  + lignes.join('\n') + s.slice(idx);
writeFileSync(FILE, s);

console.log(`✓ Bar Américain : ${lignes.length} soirées sur ${periodes.length} périodes lues.`);
for (const p of periodes.slice(0, 4)) {
  console.log(`   ${p.debut.toLocaleDateString('fr-FR')} → ${p.fin.toLocaleDateString('fr-FR')} : ${p.artiste}`);
}
