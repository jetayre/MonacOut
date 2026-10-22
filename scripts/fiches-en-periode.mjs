#!/usr/bin/env node
/**
 * MonacOut — UNE FICHE QUI ANNONCE UNE PÉRIODE DOIT S'AFFICHER PENDANT CETTE PÉRIODE
 *
 * Stéphanie, 22 oct 2026 : « corrige une fois pour toute et que les bonnes infos
 * s'affichent correctement tous les jours ».
 *
 * ── Le défaut, et pourquoi il revenait ──────────────────────────────────────────
 * C'est le bug de Nadège, en plus discret. Une fiche dit « jusqu'au 28 octobre »
 * mais ne porte qu'UNE date et n'est pas `ongoing` : elle n'apparaît donc qu'un
 * seul jour, et reste introuvable tous les autres — alors qu'on peut y aller.
 * `quality-check.mjs` le SIGNALAIT depuis des mois ; personne ne le corrigeait, et
 * un rapport qu'on ne traite pas finit par ne plus être lu. Ce script corrige.
 *
 * ── Ce qu'il fait, et surtout ce qu'il refuse de faire ──────────────────────────
 * Il LIT la date de fin dans le texte de la fiche. Il n'en invente jamais (règle 17)
 * et il ne touche JAMAIS à la date de début : déplacer un événement est précisément
 * la faute qu'on s'interdit depuis le 10 octobre (voir « Un script ne redate pas »).
 * Il ajoute seulement `ongoing:true` + `until`, c'est-à-dire : « cette fiche reste
 * visible jusqu'à cette date », ce que la fiche affirme déjà elle-même.
 *
 * Quatre garde-fous, tous nécessaires :
 *  1. le mois doit être un vrai mois français, écrit en toutes lettres ;
 *  2. la date de fin doit être APRÈS la date de la fiche — sinon on ne comprend
 *     pas ce qu'on lit, et on ne touche à rien ;
 *  3. elle doit rester à moins de 18 mois — au-delà, c'est une erreur de lecture ;
 *  4. une fiche `recap:true` est exemptée : elle cite les dates des AUTRES fiches.
 *
 * Une fiche `ongoing` SANS `until` est le cas inverse et le plus dangereux : elle
 * n'est jamais redatée, et `cleanup-events.mjs` finit par la supprimer en silence.
 * Si son texte donne une date de fin, on la pose ; sinon on la SIGNALE, sans rien
 * deviner — une date inventée est pire qu'une fiche manquante.
 *
 * Rejouable : au deuxième passage il n'a plus rien à faire.
 *
 * Usage : node scripts/fiches-en-periode.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER = join(RACINE, "src/data/events.js");

const MOIS = { jan:0, fév:1, fev:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, aout:7, sep:8, oct:9, nov:10, déc:11, dec:11 };
const MOIS_LONG = { janvier:0, février:1, fevrier:1, mars:2, avril:3, mai:4, juin:5, juillet:6, août:7, aout:7, septembre:8, octobre:9, novembre:10, décembre:11, decembre:11 };

const src0 = readFileSync(FICHIER, "utf8");
const lignes = src0.split("\n");

// Lecture légère : une fiche = une ligne commençant par {id:
const champ = (l, n) => { const m = l.match(new RegExp(`${n}:"((?:[^"\\\\]|\\\\.)*)"`)); return m ? m[1] : null; };
const bool  = (l, n) => new RegExp(`${n}:true`).test(l);

const fiches = [];
lignes.forEach((l, i) => {
  const m = l.match(/^\s*\{id:(\d+),/);
  if (!m) return;
  const an = l.match(/year:(\d{4})/);
  fiches.push({
    i, id: +m[1], ligne: l,
    annee: an ? +an[1] : 2026,
    date: champ(l, "date"), titre: champ(l, "title"), desc: champ(l, "desc"),
    until: champ(l, "until"), ongoing: bool(l, "ongoing"), recap: bool(l, "recap"),
  });
});

// Combien de fiches portent le même titre ? Une série n'a pas besoin d'être ongoing.
const parTitre = new Map();
for (const f of fiches) {
  const c = (f.titre || "").replace(/\\n/g, " ").trim().toUpperCase();
  parTitre.set(c, (parTitre.get(c) || 0) + 1);
}

const dateFiche = (f) => {
  const m = (f.date || "").match(/^\w+\s+(\d{1,2})\s+(\S+)$/);
  if (!m || !(m[2] in MOIS)) return null;
  return new Date(f.annee, MOIS[m[2]], +m[1]);
};

// La date de fin annoncée DANS le texte de la fiche. Jamais ailleurs, jamais devinée.
const finAnnoncee = (f, depart) => {
  const t = f.desc || "";
  // « tous les mercredis jusqu'au X » décrit une SÉRIE, pas une période continue :
  // la rendre `ongoing` l'afficherait tous les jours, donc à de fausses dates.
  // On ne touche pas, on signale — mieux vaut une fiche incomplète qu'une fiche fausse.
  if (/tous les\s+(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i.test(t)) return { serie: true };
  // ⚠️ Les deux apostrophes existent dans les données : la droite ' et la
  // typographique '. Ne chercher que la première ne trouvait RIEN — le défaut est
  // resté invisible des mois pour ce seul caractère.
  const m = t.match(/jusqu['\u2019]au\s+(\d{1,2})(?:er)?\s+([A-Za-zÀ-ÿ]+)(?:\s+(\d{4}))?/i);
  if (!m) return null;
  const mois = MOIS_LONG[m[2].toLowerCase()];
  if (mois === undefined) return null;                 // « jusqu'au petit matin »
  const jour = +m[1];
  let annee = m[3] ? +m[3] : depart.getFullYear();
  let d = new Date(annee, mois, jour);
  if (!m[3] && d < depart) d = new Date(annee + 1, mois, jour);   // la fin bascule sur l'an prochain
  return d;
};

const DIX_HUIT_MOIS = 1000 * 60 * 60 * 24 * 550;
const corrigees = [], signalees = [];
let src = src0;

for (const f of fiches) {
  if (f.recap) continue;                                // elle cite les dates des autres
  const depart = dateFiche(f);
  if (!depart) continue;

  const besoin = (!f.ongoing && parTitre.get((f.titre || "").replace(/\\n/g, " ").trim().toUpperCase()) === 1)
              || (f.ongoing && !f.until);
  if (!besoin) continue;

  const fin = finAnnoncee(f, depart);
  if (fin && fin.serie) {
    signalees.push(`${f.date} · ${(f.titre||"").replace(/\\n/g," ")} — série hebdomadaire annoncée : une fiche par occurrence, pas une fiche continue (id ${f.id})`);
    continue;
  }
  if (!fin) {
    if (f.ongoing && !f.until)
      signalees.push(`${f.date} · ${(f.titre||"").replace(/\\n/g," ")} — « ongoing » sans date de fin, et son texte n'en donne aucune (id ${f.id})`);
    continue;
  }
  if (fin <= depart) { signalees.push(`${f.date} · id ${f.id} — fin annoncée AVANT la date de la fiche, non touchée`); continue; }
  if (fin - depart > DIX_HUIT_MOIS) { signalees.push(`${f.date} · id ${f.id} — fin annoncée à plus de 18 mois, non touchée`); continue; }

  const iso = `${fin.getFullYear()}-${String(fin.getMonth()+1).padStart(2,"0")}-${String(fin.getDate()).padStart(2,"0")}`;
  let nouvelle = f.ligne;
  if (!f.ongoing) nouvelle = nouvelle.replace(/,cat:/, `,ongoing:true,until:"${iso}",cat:`);
  else            nouvelle = nouvelle.replace(/,cat:/, `,until:"${iso}",cat:`);

  if (nouvelle === f.ligne) { signalees.push(`id ${f.id} — insertion impossible, ligne inattendue`); continue; }
  src = src.replace(f.ligne, nouvelle);
  corrigees.push(`${f.date} · ${(f.titre||"").replace(/\\n/g," ")} → visible jusqu'au ${iso} (id ${f.id})`);
}

if (corrigees.length) {
  // Aucun id ne doit avoir été dupliqué par une substitution trop large.
  const ids = [...src.matchAll(/\{id:(\d+),/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) {
    console.error("🚨 Des ids seraient en double — fichier NON écrit."); process.exit(1);
  }
  writeFileSync(FICHIER, src);
}

console.log(`Fiches en période : ${corrigees.length} corrigée(s), ${signalees.length} à regarder.`);
corrigees.forEach(c => console.log("   ✓ " + c));
signalees.forEach(s => console.log("   ⚠️  " + s));
