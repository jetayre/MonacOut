#!/usr/bin/env node
/**
 * MonacOut — UNE FICHE PAR JOUR pour « les lieux simplement ouverts ».
 *
 * ── Pourquoi ce script existe ─────────────────────────────────────────────────
 * Le 11 août 2026, 1 426 fiches sur 2 708 étaient des apéros / brunchs / soirées.
 * Cinq lieux à eux seuls en occupaient 797 — le 99 Sushi Bar avait 185 fiches
 * répétant « l'apéro quotidien, 18h-19h ». Aucune information propre à la date :
 * un annuaire déguisé en événements, qui noyait les vrais rendez-vous.
 * Stéphanie : « une fiche tous les jours générale, et quand événement particulier
 * dans un des lieux une fiche séparée. »
 *
 * ── La règle, et elle est stricte ─────────────────────────────────────────────
 * FONDU dans la fiche du jour : uniquement « le lieu est ouvert, comme d'habitude ».
 * GARDE SA FICHE : tout ce qui a un nom propre à la soirée — Trumpet Nights,
 * les soirées Twiga, le sunset DJ du Méridien, Lilly's Club Night, la pub night du
 * Ship & Castle, un concert, une dégustation, une soirée à thème ponctuelle.
 * En cas de doute : on GARDE la fiche séparée. Mieux vaut une fiche de trop qu'un
 * rendez-vous effacé.
 *
 * La liste ci-dessous est donc une liste FERMÉE, écrite à la main, relue.
 * Ne JAMAIS la remplacer par une heuristique du genre « le titre commence par
 * APÉRO » : « APÉRO NORMA » est générique, « SASS CAFÉ APÉRO DU MARDI » aussi,
 * mais « APÉRO BUDDHA-BAR » l'est et « SUSHI SOUS LES ÉTOILES BUDDHA-BAR » non.
 * Seul un œil humain fait cette différence — d'où la liste explicite.
 *
 * Idempotent : marqueur `sdj:1`. Le script ne retire que ses propres fiches et les
 * fiches génériques ; il ne touche à rien d'autre. Il tourne APRÈS le générateur
 * nightlife dans le CI : celui-ci recrée les génériques, celui-ci les refond.
 *
 * Usage : node scripts/soirees-du-jour.mjs [--dry]
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FICHIER = join(__dirname, "..", "src", "data", "events.js");
const SORTIE = join(__dirname, "..", "soirees-du-jour.txt");
// ⚠️ REGISTRE — sans lui, ce script DÉTRUIT des données. Éprouvé le 11 août 2026 :
// au 1er passage il a bien refondu 1 194 fiches en 241 ; au 2e il a supprimé ses
// propres 241 fiches et n'a rien pu reconstruire, puisque les fiches génériques qui
// lui servaient de source avaient disparu. 2 707 → 1 754 → 1 513 fiches, en silence.
// Le registre garde la composition de chaque journée : le script redevient rejouable.
const REGISTRE = join(__dirname, "..", "soirees-du-jour.json");
const DRY = process.argv.includes("--dry");
// --reset : ignore le registre et repart des seules fiches présentes. À utiliser
// quand les lieux ou leurs jours d'ouverture ont vraiment changé.
const RESET = process.argv.includes("--reset");
const ANNEE_COURANTE = new Date().getFullYear();

// ── Les titres « le lieu est simplement ouvert » ──────────────────────────────
// Comparaison sur le début du titre, à plat (sans accents ni ponctuation).
const GENERIQUES_SOIR = [
  "AFTERLIGHT BY 99 MARETERRA",              // 99 Sushi Bar — apéro quotidien
  "LE VIVALDI BAR A COCKTAILS PORT HERCULE",
  "HAPPY HOUR SEXY TACOS LARVOTTO",
  "APERO NORMA CONDAMINE",
  "HAPPY HOUR LA RASCASSE PORT HERCULE",
  "BRASSERIE DE MONACO PORT HERCULE",         // DJ résident TOUS les soirs = permanent
  "DINER CASTELROC PLACE DU PALAIS",
  "DINER CASTELROC",
  "APERO GUSTAVE HERMITAGE",
  "APERO BUDDHA-BAR MONTE-CARLO",
  "APERO COYA PISCO BAR",
  "APERO PANINO CLUB",
  "APERO TRINITY MONACO",
  "APERO BLUE GIN MC BAY",
  "APERO JACK MONACO",
  "EQUIVOQUE ROOFTOP SUNSET",
  "APERO TERRASSE TAVOLO COLUMBUS",
  "SASS CAFE APERO DU MARDI",
  "APERO BAR AMERICAIN HOTEL DE PARIS",
  "AFTERWORK AMU MONTE-CARLO",
  "SUNSET APERO NOTE BLEUE",
  "STARS OF MONACO LE PORT",
];

const GENERIQUES_BRUNCH = [
  "BRUNCH CLUB D AVIRON PORT HERCULE",
  "BRUNCH MARLOW MARETERRA",
  "BRUNCH MADA ONE MONTE-CARLO",
  "CAFE DE PARIS BRASSERIE MONTE-CARLO",
  "BRUNCH GRAN CAFFE MONACO",
  "BRUNCH PAVYLLON HERMITAGE",
  "BRUNCH PETIT CAFE ROBUCHON",
  "BRUNCH SMAKELIJK LARVOTTO",
  "BRUNCH CAFFE MILANO PORT HERCULE",
  "BRUNCH LAS BRISAS VUE MER",
  "BRUNCH LA NOTE BLEUE LARVOTTO",
  "BRUNCH NOBU MONTE-CARLO",
  "HEALTHY BRUNCH WOO MONACO",
];

// ⚠️ L'apostrophe devient une ESPACE. Sans ça « BRUNCH CLUB D'AVIRON » ne
// correspondait pas à l'entrée « BRUNCH CLUB D AVIRON » de la liste, et ses 26 fiches
// restaient dans le fil sans qu'on s'en aperçoive. Écrire les entrées SANS apostrophe.
const plat = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^A-Za-z0-9& -]/g, " ").replace(/\s+/g, " ").trim().toUpperCase();

const estGenerique = (titre, liste) => {
  const t = plat(titre);
  return liste.some(g => t.startsWith(g));
};

// ── Lecture ───────────────────────────────────────────────────────────────────
let contenu = readFileSync(FICHIER, "utf8");
const lignes = contenu.split("\n");

const champ = (l, n) => (l.match(new RegExp(`${n}:"([^"]*)"`)) || [])[1] || "";
const titrePlat = l => champ(l, "title").replace(/\\n/g, " ").trim();

// jour → { soir:[{lieu,heure,tel}], brunch:[…] }
const parJour = new Map();
const aSupprimer = new Set();
let dejaGenerees = 0;

lignes.forEach((l, i) => {
  if (!l.trim().startsWith("{id:")) return;
  if (/\bsdj:1\b/.test(l)) { aSupprimer.add(i); dejaGenerees++; return; }

  const titre = titrePlat(l);
  if (!titre) return;
  const soir = estGenerique(titre, GENERIQUES_SOIR);
  const brunch = estGenerique(titre, GENERIQUES_BRUNCH);
  if (!soir && !brunch) return;                       // un vrai rendez-vous : on le laisse

  const date = champ(l, "date");
  if (!date) return;
  // ⚠️ Le champ `year` est ABSENT pour l'année courante et PRÉSENT pour les autres.
  // Sans cette normalisation, « Mar 11 août » et « Mar 11 août + year:2026 » donnaient
  // deux clés différentes → deux fiches « ce soir » le même jour, chacune avec la
  // moitié des lieux. Repéré à l'essai : le 11 août n'affichait que le Sass Café.
  const annee = String((l.match(/year:(\d+)/) || [])[1] || ANNEE_COURANTE);
  const cle = `${date}|${annee}`;
  if (!parJour.has(cle)) parJour.set(cle, { soir: [], brunch: [] });

  const lieu = (champ(l, "subtitle").split(" · ")[0] || "").trim();
  const entree = { lieu, heure: champ(l, "time"), tel: champ(l, "phone"), titre: plat(titre) };
  parJour.get(cle)[soir ? "soir" : "brunch"].push(entree);
  aSupprimer.add(i);
});

// ── Fusion avec le registre ───────────────────────────────────────────────────
// L'extraction ne voit que les fiches génériques ENCORE présentes. Après un premier
// passage, il n'y en a plus : c'est le registre qui fournit la composition du jour.
// Le générateur nightlife en recrée une partie à chaque passage (les `nlg:1`), jamais
// les fiches écrites à la main — d'où une fusion par UNION, jamais un remplacement.
// Pour retirer un lieu pour de bon : `--reset`, ou supprimer sa ligne du registre.
let registre = {};
if (!RESET && existsSync(REGISTRE)) {
  try { registre = JSON.parse(readFileSync(REGISTRE, "utf8")) || {}; } catch { registre = {}; }
}

const MOIS_NUM = { jan:0, "fév":1, mar:2, avr:3, mai:4, juin:5, juil:6, "août":7, sep:8, oct:9, nov:10, "déc":11 };
function dateDeLaCle(cle) {
  const [d, an] = cle.split("|");
  const p = d.trim().split(" ");
  const m = MOIS_NUM[p[2]];
  if (m === undefined || isNaN(parseInt(p[1]))) return null;
  return new Date(Number(an) || ANNEE_COURANTE, m, parseInt(p[1]));
}

const union = (a = [], b = []) => {
  const vus = new Set(); const out = [];
  for (const e of [...a, ...b]) if (e && e.lieu && !vus.has(e.lieu)) { vus.add(e.lieu); out.push(e); }
  return out;
};

// Mémoire des titres réellement reconnus, tous passages confondus. Une entrée de la
// liste qui n'a JAMAIS rien apparié est une faute de frappe : on le dit clairement,
// sinon un lieu reste dans le fil sans que personne le remarque (cas Club d'Aviron).
registre.__titresFondus = Array.isArray(registre.__titresFondus) ? registre.__titresFondus : [];
for (const [, v] of parJour) {
  for (const e of [...(v.soir || []), ...(v.brunch || [])]) {
    if (e.titre && !registre.__titresFondus.includes(e.titre)) registre.__titresFondus.push(e.titre);
  }
}
const jamaisVues = [...GENERIQUES_SOIR, ...GENERIQUES_BRUNCH]
  .filter(g => !registre.__titresFondus.some(t => t.startsWith(g)));

for (const [cle, v] of parJour) {
  registre[cle] = {
    soir: union(registre[cle]?.soir, v.soir),
    brunch: union(registre[cle]?.brunch, v.brunch),
  };
}

// Purge les journées passées : le nettoyage quotidien les retire du fil de toute façon.
const hier = new Date(); hier.setHours(0, 0, 0, 0); hier.setDate(hier.getDate() - 1);
let purgees = 0;
for (const cle of Object.keys(registre)) {
  if (cle.startsWith("__")) continue;
  const d = dateDeLaCle(cle);
  if (!d || d < hier) { delete registre[cle]; purgees++; }
}

// ── Génération ────────────────────────────────────────────────────────────────
const NL = "\\n";
const listeLieux = arr => {
  const vus = new Set(); const out = [];
  for (const e of arr) if (e.lieu && !vus.has(e.lieu)) { vus.add(e.lieu); out.push(e); }
  return out;
};

// Le texte cite CHAQUE lieu par son nom : la recherche doit continuer de trouver
// « 99 Sushi Bar » un mardi, même si le lieu n'a plus de fiche à lui ce jour-là.
function carteSoir(id, date, annee, lieux) {
  const noms = lieux.map(e => e.heure && /^\d/.test(e.heure) ? `${e.lieu} (${e.heure})` : e.lieu);
  const tel = lieux.filter(e => e.tel).map(e => `${e.lieu} ${e.tel}`);
  const desc = `Les terrasses et bars de la Principauté ouverts ce soir, sans soirée particulière : ${noms.join(" · ")}.`
    + (tel.length ? ` Réservations : ${tel.join(" · ")}.` : "")
    + ` Les soirées à thème et les concerts ont leur propre fiche.`;
  const descEn = `The Principality's terraces and bars open tonight, with no special event on: ${noms.join(" · ")}.`
    + (tel.length ? ` Bookings: ${tel.join(" · ")}.` : "")
    + ` Themed nights and concerts have their own cards.`;
  return `  {id:${id},${annee ? `year:${annee},` : ""}cat:"APÉRO",date:"${date}",time:"18h00",`
    + `title:"CE SOIR${NL}${lieux.length} TERRASSE${lieux.length > 1 ? "S" : ""}${NL}OUVERTE${lieux.length > 1 ? "S" : ""}",subtitle:"Bars & terrasses · Principauté",`
    + `desc:"${desc}",descEn:"${descEn}",free:true,hot:false,recap:true,sdj:1,`
    + `fallback:"linear-gradient(150deg,#1A2A4A,#2A4A6A,#0A1428)",accent:"#A8C8E8",emoji:"🍸",`
    + `source:"Monac'Out",quarter:"Monaco"},`;
}

function carteBrunch(id, date, annee, lieux) {
  const noms = lieux.map(e => e.heure && /^\d/.test(e.heure) ? `${e.lieu} (${e.heure})` : e.lieu);
  const tel = lieux.filter(e => e.tel).map(e => `${e.lieu} ${e.tel}`);
  const desc = `Où bruncher à Monaco ce jour-là : ${noms.join(" · ")}.`
    + (tel.length ? ` Réservations : ${tel.join(" · ")}.` : "")
    + ` Les brunchs événements gardent leur propre fiche.`;
  const descEn = `Where to brunch in Monaco that day: ${noms.join(" · ")}.`
    + (tel.length ? ` Bookings: ${tel.join(" · ")}.` : "")
    + ` Special brunch events keep their own cards.`;
  return `  {id:${id},${annee ? `year:${annee},` : ""}cat:"BRUNCH",date:"${date}",time:"12h00",`
    + `title:"BRUNCH${lieux.length > 1 ? "S" : ""}${NL}${lieux.length} ADRESSE${lieux.length > 1 ? "S" : ""}${NL}À MONACO",subtitle:"Brunchs · Principauté",`
    + `desc:"${desc}",descEn:"${descEn}",free:true,hot:false,recap:true,sdj:1,`
    + `fallback:"linear-gradient(150deg,#3A2A10,#6A5228,#241800)",accent:"#E8D0A0",emoji:"🥐",`
    + `source:"Monac'Out",quarter:"Monaco"},`;
}

// Les ids 93xxxx sont réservés à ce script (aucune autre plage ne les utilise).
let idSoir = 930000, idBrunch = 940000;
const nouvelles = [];
let nbSoir = 0, nbBrunch = 0;
// On génère depuis le REGISTRE, pas depuis la seule extraction : c'est ce qui rend le
// script rejouable. Tri par date pour que les ids restent stables d'un passage à l'autre.
for (const cle of Object.keys(registre).filter(k => !k.startsWith("__")).sort((a, b) => (dateDeLaCle(a) || 0) - (dateDeLaCle(b) || 0))) {
  const v = registre[cle];
  const [date, an] = cle.split("|");
  // Même convention que le reste du fichier : pas de `year` pour l'année courante.
  const annee = Number(an) === ANNEE_COURANTE ? "" : an;
  const s = listeLieux(v.soir || []), b = listeLieux(v.brunch || []);
  if (s.length) { nouvelles.push(carteSoir(idSoir++, date, annee, s)); nbSoir++; }
  if (b.length) { nouvelles.push(carteBrunch(idBrunch++, date, annee, b)); nbBrunch++; }
}

// ── Écriture ──────────────────────────────────────────────────────────────────
const gardees = lignes.filter((_, i) => !aSupprimer.has(i));
const idx = gardees.lastIndexOf("];") >= 0
  ? gardees.map((l, i) => (l.trim() === "];" ? i : -1)).filter(i => i >= 0)[0]
  : -1;
if (idx === -1) { console.error("✗ Marqueur `];` introuvable — rien n'a été écrit."); process.exit(1); }

const retirees = aSupprimer.size - dejaGenerees;

// ── GARDE-FOU. C'est LUI qui aurait évité l'incident du 11 août 2026 ──────────
// Ce script retire des fiches puis en écrit d'autres. Si la deuxième moitié échoue
// pour une raison quelconque, il ne reste qu'une suppression — 1 200 fiches perdues
// sans un mot. On refuse donc d'écrire un fichier qui enlève sans remplacer.
// Mieux vaut un fil inchangé qu'un fil amputé : la même règle que pour les piscines.
if (aSupprimer.size > 0 && nouvelles.length === 0) {
  console.error(`✗ ${aSupprimer.size} fiche(s) à retirer mais AUCUNE fiche du jour à écrire.`);
  console.error("  Le fichier n'a PAS été modifié. Registre vide ou illisible ?");
  console.error(`  Registre : ${REGISTRE}`);
  process.exit(1);
}

const sortie = [...gardees.slice(0, idx), ...nouvelles, ...gardees.slice(idx)].join("\n");
const rapport = [
  `FICHES « CE SOIR » / « BRUNCHS » — ${new Date().toISOString().slice(0, 10)}`,
  ``,
  `Fiches génériques refondues : ${retirees}`,
  `Anciennes fiches du jour remplacées : ${dejaGenerees}`,
  `Fiches « ce soir » créées : ${nbSoir}`,
  `Fiches « brunchs » créées : ${nbBrunch}`,
  `Journées au registre : ${Object.keys(registre).filter(k => !k.startsWith("__")).length} (${purgees} passées purgées)`,
  ``,
  `Gain net : ${retirees - nbSoir - nbBrunch} fiches de moins dans le fil.`,
  ``,
  `Les rendez-vous à thème NE SONT PAS touchés (Trumpet Nights, soirées Twiga,`,
  `sunset DJ, Lilly's Club Night, pub night Ship & Castle, concerts, dégustations…).`,
].join("\n");

if (jamaisVues.length) {
  console.error("\n⚠️  Entrée(s) de la liste qui n'ont JAMAIS rien apparié — faute de frappe ?");
  jamaisVues.forEach(g => console.error("   ✗ " + g));
}
console.log(rapport);
if (DRY) { console.log("\n(--dry : rien n'a été écrit)"); process.exit(0); }
writeFileSync(FICHIER, sortie);
writeFileSync(REGISTRE, JSON.stringify(registre, null, 1) + "\n");
writeFileSync(SORTIE, rapport + "\n");
