#!/usr/bin/env node
/**
 * MonacOut — LA MÊME SOIRÉE, DEUX FOIS, SOUS DEUX NOMS
 *
 * Stéphanie, 23 oct 2026 : « assure-toi que, sans que je corrige, tu vérifies
 * bien que tout y est correctement ».
 *
 * ── Ce que le contrôle qualité ne voyait pas ─────────────────────────────────
 * Il compare lieu + jour. Or les cinquante fiches fantômes trouvées cette
 * semaine portaient DEUX LIBELLÉS DE LIEU DIFFÉRENTS pour la même salle :
 *   « Salle Garnier · Monte-Carlo »  et  « Opéra Garnier Monte-Carlo · Monaco »
 *   « RIGOLETTO VERDI »              et  « RIGOLETTO OPERA »
 * Le rapprochement par lieu ne pouvait pas les voir, et elles vivaient côte à
 * côte depuis juillet. Pire : tant que la copie fautive portait une date d'un
 * jour trop tôt, rien ne les superposait.
 *
 * ── Ce que celui-ci regarde ──────────────────────────────────────────────────
 * Le JOUR, l'HEURE, et le titre réduit à ses mots porteurs — sans accents, sans
 * langue, sans les mots creux (OPERA, CONCERT, SYMPHONIC, LIGUE 1…). Deux
 * fiches qui partagent tout cela sont presque sûrement la même soirée.
 *
 * ⚠️ IL NE SUPPRIME RIEN. Deux fiches le même soir sont parfois deux vrais
 * événements : Porgy and Bess et le Gala du 21 novembre, l'atelier danse de
 * 16h30 et Bronia à 19h30 le 19 décembre. Seul un humain tranche. Le script
 * SIGNALE, et ne fait pas échouer le passage — une alarme qui bloque tout
 * finit par être désactivée.
 *
 * Usage : node scripts/detecte-doublons.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");

// Les mots qui ne distinguent rien : ils décrivent le genre, pas la soirée.
const CREUX = new Set(["OPERA","OPERAS","CONCERT","CONCERTS","SYMPHONIC","SYMPHONIQUE",
  "RECITAL","PIANO","MUSIC","MUSIQUE","CHAMBER","CHAMBRE","LIGUE","UEFA","LEAGUE",
  "CONFERENCE","LE","LA","LES","DE","DU","DES","ET","AND","THE","A","AU","AUX","EN",
  "SPECTACLE","MONACO","AS","SOIREE","MATCH","DANS","PAR","POUR","SUR","UN","UNE","D","L",
  // ⚠️ « Monte » et « Carlo » sont dans un nom de lieu sur deux : sans eux, le Royal
  // Charity Gala et l'Amazónico du 28 novembre passaient pour la même soirée.
  "MONTE","CARLO","FORUM","GRIMALDI","SALLE","GARNIER","THEATRE","AUDITORIUM","ESPACE",
  "HOTEL","CLUB","BAR","CAFE","RESTAURANT","AVEC","CHEZ","ANS","EDITION","FESTIVAL"]);

const sansAccent = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const motsPorteurs = (titre) => {
  const m = sansAccent(titre).replace(/[^A-Z0-9 ]/g, " ").split(/\s+/)
    .filter(w => w.length > 2 && !CREUX.has(w));
  return [...new Set(m)].sort();
};

let ev;
try {
  const d = JSON.parse(readFileSync(join(RACINE, "public/events.json"), "utf8"));
  ev = Array.isArray(d) ? d : (d.events || []);
} catch { console.log("events.json illisible — rien à faire."); process.exit(0); }

const paires = [];
const par = new Map();
for (const e of ev) {
  const mots = motsPorteurs(e.title);
  if (mots.length < 1) continue;                       // un titre sans mot porteur ne prouve rien
  const cle = `${e.date}|${e.year || 2026}|${(e.time || "").slice(0, 5)}`;
  if (!par.has(cle)) par.set(cle, []);
  par.get(cle).push({ e, mots });
}

for (const [cle, g] of par) {
  if (g.length < 2) continue;
  for (let i = 0; i < g.length; i++) for (let j = i + 1; j < g.length; j++) {
    const a = g[i], b = g[j];
    const communs = a.mots.filter(m => b.mots.includes(m));
    const petit = Math.min(a.mots.length, b.mots.length);
    // Au moins deux mots porteurs en commun, ou tous ceux du plus court.
    if (communs.length < Math.max(2, Math.min(2, petit))) continue;
    if (communs.length < petit * 0.6) continue;
    paires.push({ cle, a: a.e, b: b.e, communs });
  }
}

const t = (x) => (x.title || "").replace(/\n/g, " ").slice(0, 42);
const lieu = (x) => (x.subtitle || "").split(" · ")[0].slice(0, 28);

let txt = `DOUBLONS PROBABLES — ${new Date().toISOString().slice(0, 10)}\n`;
txt += `Même jour, même heure, mêmes mots porteurs dans le titre — même si le\n`;
txt += `libellé du lieu diffère. Ce contrôle NE SUPPRIME RIEN : deux fiches le\n`;
txt += `même soir sont parfois deux vrais événements. À trancher à la main.\n\n`;

if (!paires.length) {
  console.log("Doublons probables : aucun.");
  txt += "Aucun.\n";
} else {
  console.log(`Doublons probables : ${paires.length} paire(s).`);
  for (const p of paires) {
    const l = `${p.a.date} ${p.a.year || 2026} ${p.a.time}\n` +
              `   ${String(p.a.id).padStart(8)}  ${t(p.a).padEnd(44)} ${lieu(p.a)}\n` +
              `   ${String(p.b.id).padStart(8)}  ${t(p.b).padEnd(44)} ${lieu(p.b)}\n` +
              `   mots communs : ${p.communs.join(", ")}\n`;
    console.log("\n■ " + l);
    txt += "■ " + l + "\n";
  }
  txt += `\n${paires.length} paire(s).\n`;
}
writeFileSync(join(RACINE, "doublons-probables.txt"), txt);
process.exit(0);                                       // signale, ne bloque jamais
