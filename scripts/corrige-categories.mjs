#!/usr/bin/env node
/**
 * SPECTACLE n'est pas une poubelle.
 *
 * Stéphanie, 26 oct 2026 : « tu as mis beaucoup de choses dans spectacle qui ne
 * sont pas des spectacles — appels indésirables c'est un atelier, tout ce qui
 * est à la Maison du Numérique ce sont des ateliers pas des spectacles, une vie
 * sur mesure c'est théâtre pas spectacle ».
 *
 * 🚨 D'OÙ VIENT LE MAL. L'ancien `categorie()` de import-principocket retombait
 * sur "SPECTACLE" quand il ne reconnaissait rien. Corrigé le 24 oct (il rend
 * désormais `null` et laisse le lieu décider), mais les fiches DÉJÀ importées
 * gardent leur fausse catégorie : 116 fiches SPECTACLE, dont des cours
 * informatiques, des ateliers d'écriture, deux matchs de basket et un match de
 * Ligue 1.
 *
 * ⚠️ ON CORRIGE PAR LE LIEU, PAS PAR LE TITRE. Un titre ment (« PÂQUES
 * SANGLANTES » est un film), un lieu beaucoup moins : la Maison du Numérique ne
 * programme que des ateliers, la Salle Gaston Médecin que du basket. Les règles
 * par titre ne servent que là où un même lieu accueille plusieurs genres.
 *
 * ⚠️ ET ON NE TOUCHE À AUCUNE DATE. Ce script ne change QUE le champ `cat`.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FICHIER = join(__dirname, "../src/data/events.js");
const ESSAI = !process.argv.includes("--ecris");

// ── Règles par LIEU : le lieu décide, quelle que soit la formulation du titre ──
const PAR_LIEU = [
  [/Maison du Num[ée]rique/i,  "ATELIER"],   // cours informatiques pour tous
  [/M[ée]diath[èe]que/i,        "ATELIER"],   // pauses écriture, ateliers philo
  [/Salle Gaston M[ée]decin/i,  "BASKET"],    // l'AS Monaco Basket y joue
  [/Stade Louis II/i,           "FOOTBALL"],  // sauf exception traitée plus bas
];

// ── Règles par TITRE, pour les lieux qui accueillent plusieurs genres ────────
const PAR_TITRE = [
  [/\bballet\b|dance forum|bayad[èe]re|rom[ée]o et juliette/i, "DANSE"],
  [/\bop[ée]ra\b|italiana in algeri|fidelio/i,                  "OPÉRA"],
  // ⚠️ « CINE FAMILLE » n'est pas « ciné-club » : l'essai à blanc rangeait
  // « CINE FAMILLE LE PETIT PRINCE » dans les ateliers de la Médiathèque. Une
  // projection reste une projection, quel que soit le lieu qui l'accueille.
  [/cin[ée].?club|cin[ée] famille|projection|film de /i,        "CINÉMA"],
  // Une rencontre ou une conférence n'est pas un atelier : on n'y fait rien,
  // on écoute. « Behind the scenes of culture in Monaco », « D'où vient le
  // désir de vengeance » sont des causeries, pas des travaux pratiques.
  [/behind the scenes|d ou vient|rencontre avec|conf[ée]rence/i,"CONFÉRENCE"],
  [/coastal rowing|challenge prince albert/i,                   "SPORT"],
  [/messe|c[ée]l[ée]bration|ordre de malte/i,                   "CHANTS"],
  [/atelier|pause [ée]criture|la philo pour/i,                  "ATELIER"],
];

// Les lieux de théâtre : tout ce qui y reste en SPECTACLE est du théâtre, SAUF
// ce qu'une règle par titre a déjà nommé (un ballet au TPG reste un ballet).
const THEATRES = /Th[ée][âa]tre (Princesse Grace|des Muses|des Vari[ée]t[ée]s)/i;

const cible = (titre, sousTitre) => {
  for (const [re, cat] of PAR_TITRE) if (re.test(titre)) return cat;
  for (const [re, cat] of PAR_LIEU)  if (re.test(sousTitre)) return cat;
  if (THEATRES.test(sousTitre)) return "THÉÂTRE";
  return null;
};

const lignes = readFileSync(FICHIER, "utf8").split("\n");
let n = 0;
const vus = [];

for (let i = 0; i < lignes.length; i++) {
  const l = lignes[i];
  if (!/^\s*\{id:\d+,/.test(l)) continue;
  if (!/cat:"SPECTACLE"/.test(l)) continue;
  const titre = (l.match(/title:"([^"]*)"/) || [])[1] || "";
  const sousTitre = (l.match(/subtitle:"([^"]*)"/) || [])[1] || "";
  const nouvelle = cible(titre.replace(/\\n/g, " "), sousTitre);
  if (!nouvelle) continue;
  lignes[i] = l.replace('cat:"SPECTACLE"', `cat:"${nouvelle}"`);
  n++;
  vus.push(`  SPECTACLE → ${nouvelle.padEnd(9)} ${titre.replace(/\\n/g, " ").slice(0, 44).padEnd(46)} ${sousTitre.split(" · ")[0].slice(0, 28)}`);
}

console.log(`🏷️  ${n} fiche(s) sortie(s) de SPECTACLE${ESSAI ? "  (ESSAI À BLANC — rien n'est écrit)" : ""}\n`);
console.log(vus.join("\n"));

if (!ESSAI && n) {
  writeFileSync(FICHIER, lignes.join("\n"));
  console.log(`\n   ✓ enregistré.`);
} else if (ESSAI) {
  console.log(`\n   Relancer avec --ecris pour appliquer.`);
}
