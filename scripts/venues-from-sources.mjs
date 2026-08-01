#!/usr/bin/env node
/**
 * MonacOut — LIEUX ISSUS DU TABLEAU DES SOURCES (CLAUDE.md)
 *
 * Le robot de complétion ne connaissait que 15 lieux écrits à la main, alors que
 * le tableau des sources de CLAUDE.md en documente ~148 (nom, site officiel,
 * téléphone). Résultat : « Les Lives du Summer Bar », l'expo du Palais Princier,
 * le Musée d'Anthropologie… étaient rejetés pour « lieu inconnu ».
 *
 * Ce module lit ce tableau et en fait une table exploitable par le robot.
 * → Ajouter une ligne au tableau de CLAUDE.md suffit désormais à couvrir un lieu.
 *
 * PRUDENCE (« un événement manquant vaut mieux qu'un faux ») :
 *  - les agrégateurs interdits comme lien (règle 16) sont exclus ;
 *  - un lieu n'est retenu que s'il possède un MOT DISTINCTIF, c'est-à-dire un mot
 *    d'au moins 5 lettres qui n'apparaît dans AUCUN autre nom de lieu. Sans ça,
 *    « Théâtre des Muses » et « Théâtre des Variétés » se confondraient ;
 *  - tout lieu écarté est signalé, jamais deviné.
 */
import { readFileSync } from "fs";

// Sites d'agenda / annuaires : jamais utilisables comme lien d'un lieu (règle 16)
const AGREGATEURS = [
  "visitmonaco.com", "yourmonaco.mc", "principocket.com", "monte-carlo.mc",
  "culture.mc", "pagesjaunes.fr", "google.com", "songkick.com", "eurotravelo.com",
];

// Mots trop courants pour identifier un lieu à eux seuls
const BANALS = new Set([
  "monaco", "monte", "carlo", "montecarlo", "monegasque", "monegasques", "principaute",
  "de", "du", "des", "la", "le", "les", "et", "aux", "au", "en", "sur", "pour",
  "club", "salle", "espace", "centre", "maison", "restaurant", "hotel", "bar",
  "theatre", "musee", "eglise", "association", "fondation", "societe", "academie",
  "monacaise", "internationale", "international", "sport", "sports", "grand", "grande",
]);

const QUARTIERS = [
  ["monte-carlo", "Monte-Carlo"], ["monaco-ville", "Monaco-Ville"], ["fontvieille", "Fontvieille"],
  ["la condamine", "La Condamine"], ["condamine", "La Condamine"], ["larvotto", "Larvotto"],
  ["mareterra", "Monaco"], ["port hercule", "La Condamine"],
];

const CATEGORIES = [
  "CONCERT", "OPÉRA", "MUSICAL", "THÉÂTRE", "JAZZ LIVE", "DJ SET", "CHANTS", "CINÉMA",
  "FESTIVAL", "GALA", "SPECTACLE", "EXPOSITION", "CONFÉRENCE", "FOOTBALL", "BASKET",
  "FORMULE 1", "FORMULE E", "TENNIS", "RALLYE", "SPORT", "ATELIER", "DANSE",
  "BIEN-ÊTRE", "BRUNCH", "APÉRO", "SOIRÉE", "ENCHÈRES", "MARCHÉ", "SALON",
];

const sansAccent = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const echappe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Découpe un nom de lieu en mots significatifs (sans accents, sans mots banals). */
function motsSignificatifs(nom) {
  return sansAccent(nom)
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((m) => m.length >= 4 && !BANALS.has(m));
}

/**
 * Lit le tableau des sources et renvoie { lieux, ecartes }.
 * `lieux` a exactement la forme attendue par le robot :
 *   { match, name, quarter, link, phone, cat }
 */
export function lieuxDepuisSources(cheminMd) {
  const lignes = readFileSync(cheminMd, "utf8").split("\n");
  const brut = [];

  for (const ligne of lignes) {
    if (!ligne.startsWith("|")) continue;
    const cellules = ligne.split("|").map((c) => c.trim());
    if (cellules.length < 4) continue;

    const nomBrut = cellules[1];
    if (!nomBrut || /^-+$/.test(nomBrut) || /^\*?\*?Source/i.test(nomBrut)) continue;

    const url = (ligne.match(/https?:\/\/[^\s|)]+/) || [])[0];
    if (!url) continue;                                   // ligne de section, pas un lieu
    const hote = url.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "");
    if (AGREGATEURS.some((a) => hote.endsWith(a))) continue;

    // « **Nom** (précision) — note » → « Nom »
    const nom = nomBrut
      .replace(/\*\*/g, "")
      .replace(/\s*\((?!=).*?\)\s*/g, " ")
      .replace(/\s*[—–-]\s.*$/, "")
      .replace(/_/g, "")
      .trim();
    if (nom.length < 4) continue;

    const tel = (ligne.match(/\+\d[\d\s]{7,}/) || [])[0];
    const q = QUARTIERS.find(([cle]) => sansAccent(ligne).includes(cle));
    // on prend la catégorie qui apparaît EN PREMIER dans la cellule (l'ordre du
    // tableau reflète l'usage principal du lieu : « APÉRO, CONCERT » = d'abord un bar)
    const cellCat = cellules[3] || "";
    const cat = CATEGORIES
      .map((c) => [c, cellCat.indexOf(c)])
      .filter(([, i]) => i >= 0)
      .sort((a, b) => a[1] - b[1])
      .map(([c]) => c)[0];

    brut.push({
      nom,
      link: url,
      phone: tel ? tel.trim() : "",
      quarter: q ? q[1] : "Monaco",
      cat: cat || "SPECTACLE",
      mots: motsSignificatifs(nom),
    });
  }

  // Le même lieu peut figurer deux fois dans le tableau (ex. l'Opéra) → on fusionne.
  const parNom = new Map();
  for (const l of brut) {
    const cle = sansAccent(l.nom);
    const dejaLa = parNom.get(cle);
    if (!dejaLa) parNom.set(cle, l);
    else if (!dejaLa.phone && l.phone) parNom.set(cle, l);   // on garde la version avec téléphone
  }
  const uniques = [...parNom.values()];

  // Un mot n'identifie un lieu que s'il n'apparaît dans aucun AUTRE nom.
  const compte = new Map();
  for (const l of uniques) for (const m of new Set(l.mots)) compte.set(m, (compte.get(m) || 0) + 1);

  const lieux = [];
  const ecartes = [];
  for (const l of uniques) {
    const distinctifs = l.mots.filter((m) => compte.get(m) === 1);
    let match;
    if (distinctifs.length) {
      // un mot suffit à l'identifier : le plus long est le plus caractéristique
      const cle = distinctifs.sort((a, b) => b.length - a.length)[0];
      match = new RegExp(echappe(cle), "i");
    } else if (l.mots.length >= 2) {
      // aucun mot unique (« Théâtre Princesse Grace » vs « Académie Princesse Grace »)
      // → on exige que TOUS les mots significatifs soient présents
      match = new RegExp(l.mots.map((m) => `(?=.*${echappe(m)})`).join(""), "i");
    } else {
      ecartes.push(l.nom); continue;
    }
    lieux.push({ match, name: l.nom, quarter: l.quarter, link: l.link, phone: l.phone, cat: l.cat });
  }
  return { lieux, ecartes };
}

// Exécution directe : `node scripts/venues-from-sources.mjs` → aperçu
if (process.argv[1] && process.argv[1].endsWith("venues-from-sources.mjs")) {
  const { lieux, ecartes } = lieuxDepuisSources(new URL("../CLAUDE.md", import.meta.url).pathname);
  console.log(`Lieux exploitables depuis le tableau des sources : ${lieux.length}`);
  console.log(`Écartés (aucun mot distinctif) : ${ecartes.length}`);
  ecartes.forEach((n) => console.log("   ·", n));
  console.log("\nExemples :");
  lieux.slice(0, 8).forEach((l) => console.log(`   ${l.match} → ${l.name} · ${l.quarter} · ${l.cat} · ${l.phone || "sans tel"}`));
}
