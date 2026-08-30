#!/usr/bin/env node
/**
 * MonacOut — CONTRÔLE DES SOIRÉES SBM (Jimmy'z & COYA MUSIC)
 *
 * Pourquoi ce script existe. Le 30 août 2026, Stéphanie a signalé que la soirée
 * Bob Sinclar était annoncée le samedi 26 septembre alors qu'elle a lieu le
 * VENDREDI 25. La fiche était fausse depuis le 22 mai — trois mois.
 *
 * Rien ne pouvait l'attraper :
 *  · `autofix-events.mjs` vérifie que le jour de semaine colle à la date. Or
 *    « Sam 26 sep » est parfaitement cohérent : le 26 septembre EST un samedi.
 *    Une date fausse mais cohérente est invisible pour ce contrôle.
 *  · `cross-check-dates.mjs` compare à PrinciPocket, qui ne référence pas les
 *    soirées de club du SBM. Il n'y avait aucune source de comparaison.
 *
 * Le SBM publie toute sa saison sur deux pages. Ce script les lit et compare.
 * Une fiche qui ne correspond plus fait échouer le passage quotidien.
 *
 * ⚠️ Il ne CORRIGE rien : il signale. Une date se corrige en la vérifiant, pas
 *    en la déplaçant automatiquement — c'est précisément ce qui a créé le bug.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EVENTS = join(ROOT, 'src/data/events.js');

const PAGES = [
  'https://www.montecarlosbm.com/fr/agenda/programmation-saison-jimmyz-monte-carlo',
  'https://www.montecarlosbm.com/fr/agenda/coya-music-presents-coya-monte-carlo',
];

const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MOIS  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const JOURS_COURTS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS_COURTS  = ['jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc'];

const sansAccent = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function texte(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'")
    .replace(/\s+/g, ' ');
}

/**
 * « VENDREDI 25 SEPTEMBRE: BOB SINCLAR by NEFT x Jimmy'z » → {date, libelle}
 *
 * On DÉCOUPE le texte sur les en-têtes de date au lieu de capturer le libellé
 * avec une expression bornée : la dernière soirée de la liste est suivie du reste
 * de l'article, et une capture bornée à 70 caractères ne s'y terminait jamais —
 * elle disparaissait purement et simplement du contrôle.
 */
function lireProgramme(t, anneeDefaut) {
  const tete = new RegExp(`(${JOURS.join('|')})\\s+(\\d{1,2})\\s*(?:er)?\\s+(${MOIS.join('|')})\\s*(\\d{4})?\\s*:`, 'gi');
  const marques = [];
  let m;
  while ((m = tete.exec(t)) !== null) marques.push({ m, fin: tete.lastIndex });

  const out = [];
  marques.forEach((cur, k) => {
    const suite = k + 1 < marques.length ? marques[k + 1].m.index : cur.fin + 70;
    const brut = t.slice(cur.fin, Math.min(suite, cur.fin + 70)).trim();
    const [, jour, num0, mois0, an0] = cur.m;
    const jourIdx = JOURS.indexOf(sansAccent(jour));
    const num = parseInt(num0, 10);
    const moisIdx = MOIS.findIndex(x => sansAccent(x) === sansAccent(mois0));
    const annee = an0 ? parseInt(an0, 10) : anneeDefaut;
    if (moisIdx < 0 || !annee) return;
    const d = new Date(annee, moisIdx, num);
    out.push({
      annee, moisIdx, num,
      jourAnnonce: jourIdx,
      jourReel: d.getDay(),
      dateFiche: `${JOURS_COURTS[d.getDay()]} ${num} ${MOIS_COURTS[moisIdx]}`,
      libelle: brut.replace(/\s+/g, ' ').slice(0, 64).trim(),
    });
  });
  return out;
}

/** Le nom d'artiste : ce qui précède « by », « x », « | » ou « Opening/Closing ». */
const artiste = l =>
  sansAccent(l)
    .replace(/^soiree\s+/i, '')
    .split(/\s+(?:by|x|\||opening|closing|grand prix)\b/i)[0]
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const args = process.argv.slice(2);
const anneeDefaut = new Date().getFullYear();

const programme = [];
for (const url of PAGES) {
  let html;
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 MonacOut' } });
    if (!r.ok) { console.log(`⚠️  ${url} → HTTP ${r.status}, page ignorée`); continue; }
    html = await r.text();
  } catch (e) {
    console.log(`⚠️  ${url} injoignable (${e.message}) — page ignorée, pas d'échec`);
    continue;
  }
  const entrees = lireProgramme(texte(html), anneeDefaut);
  console.log(`  ${entrees.length} soirées lues sur ${url.split('/').pop()}`);
  programme.push(...entrees);
}

if (!programme.length) {
  console.log('\n⚠️  Aucune programmation lisible (SBM injoignable ou page modifiée).');
  console.log('    Rien n\'est signalé : mieux vaut ne rien dire que crier à tort.');
  process.exit(0);
}

// ── Incohérences DANS LA SOURCE elle-même (jour annoncé ≠ jour réel) ───────────
const sourceDouteuse = programme.filter(p => p.jourAnnonce !== p.jourReel);

// ── Nos fiches SBM nommées ────────────────────────────────────────────────────
const contenu = readFileSync(EVENTS, 'utf8');
const nôtres = [];
for (const ligne of contenu.split('\n')) {
  if (!ligne.trim().startsWith('{id:')) continue;
  if (!/montecarlosbm\.com/.test(ligne)) continue;
  const src = ligne.match(/source:"([^"]+)"/)?.[1] || '';
  if (!/Jimmy|COYA/i.test(src)) continue;
  const id = ligne.match(/id:(\d+)/)[1];
  const date = ligne.match(/date:"([^"]+)"/)?.[1] || '';
  const titre = (ligne.match(/title:"([^"]+)"/)?.[1] || '').replace(/\\n/g, ' ');
  nôtres.push({ id, date, titre, cle: sansAccent(titre) });
}

// ⚠️ Un même artiste peut revenir plusieurs fois dans la saison (Carmine Sorrentino
// joue l'ouverture, le Grand Prix ET la clôture). On regroupe donc ses dates : une
// fiche est juste si elle correspond à L'UNE d'elles, pas forcément à la première.
const parArtiste = new Map();
for (const p of programme) {
  const a = artiste(p.libelle);
  if (a.length < 4) continue;
  if (!parArtiste.has(a)) parArtiste.set(a, []);
  parArtiste.get(a).push(p);
}

const ecarts = [];
const manquants = [];
for (const [a, dates] of parArtiste) {
  const fiches = nôtres.filter(f => f.cle.includes(a));
  if (!fiches.length) { manquants.push(...dates); continue; }
  for (const fiche of fiches) {
    if (dates.some(p => p.dateFiche === fiche.date)) continue;   // une date colle → OK
    ecarts.push({ fiche, choix: dates });
  }
}

console.log('\n═══ CONTRÔLE DES SOIRÉES SBM ═══');
console.log(`${programme.length} soirées au programme · ${nôtres.length} fiches SBM nommées chez nous`);

if (sourceDouteuse.length) {
  console.log('\n⚠️  LE SITE DU SBM SE CONTREDIT (jour annoncé ≠ date) — à lire à la main :');
  for (const p of sourceDouteuse)
    console.log(`   « ${p.libelle} » : annoncé ${JOURS[p.jourAnnonce]}, or le ${p.num} ${MOIS[p.moisIdx]} est un ${JOURS[p.jourReel]}`);
}

const aVenir = manquants.filter(p => new Date(p.annee, p.moisIdx, p.num) >= new Date(new Date().toDateString()));
if (aVenir.length) {
  console.log(`\nℹ️  ${aVenir.length} soirée(s) à venir absente(s) de l'app :`);
  for (const p of aVenir) console.log(`   ${p.dateFiche} — ${p.libelle}`);
}

if (ecarts.length) {
  console.log('\n🚨 DATES QUI NE CORRESPONDENT PLUS AU PROGRAMME OFFICIEL :');
  for (const { fiche, choix } of ecarts) {
    console.log(`   [id:${fiche.id}] « ${fiche.titre} »`);
    console.log(`      notre fiche : ${fiche.date}`);
    for (const p of choix) console.log(`      le SBM dit  : ${p.dateFiche}  (« ${p.libelle} »)`);
  }
  console.log('\n➜ Vérifier sur la page du SBM et corriger À LA MAIN. Ne jamais laisser');
  console.log('  un script déplacer une date : c\'est ce qui a produit le bug du 26 septembre.');
  process.exit(1);
}

console.log('\n✅ Toutes nos fiches SBM nommées portent la date du programme officiel.');
process.exit(0);
