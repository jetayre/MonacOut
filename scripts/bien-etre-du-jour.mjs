#!/usr/bin/env node
/**
 * MonacOut — UNE FICHE BIEN-ÊTRE PAR JOUR, d'où sortent les lieux.
 *
 * ── Pourquoi ce script existe ─────────────────────────────────────────────────
 * Stéphanie, 11 octobre 2026 : « espace lamartine c'est le bien être aussi ? si
 * oui on doit faire une fiche bien être et de là ressort aquagym et lamartine ».
 * Même raisonnement que pour les terrasses du soir : l'aquagym de la Piscine
 * Saint-Charles produisait UNE fiche par jour, et l'Espace Lamartine une autre,
 * toutes deux disant seulement « le lieu est ouvert et propose ses cours ».
 * Elles se répètent, et elles séparent dans le fil deux choses qu'on cherche
 * ensemble.
 *
 * ── Ce qui est FONDU, ce qui GARDE SA FICHE ───────────────────────────────────
 * FONDU : « le lieu est simplement ouvert aujourd'hui » — les cours collectifs
 *   de la piscine, les activités permanentes de l'Espace Lamartine.
 * GARDE SA FICHE : tout rendez-vous qui a un nom et une date à lui — le Yoga &
 *   Bain sonore des Thermes Marins, la journée Master Oh, les Sound Healing, le
 *   Wellness Weekend du Fairmont, le Yoga du Printemps. Ceux-là, on les cherche
 *   par leur nom : les fondre reviendrait à les effacer.
 * En cas de doute : on GARDE la fiche séparée.
 *
 * ── Deux réponses honnêtes à la question de Stéphanie ─────────────────────────
 * 1. L'Espace Lamartine n'est bien-être QU'EN PARTIE. Sur ses sept familles
 *    d'activités, trois le sont (sport et remise en forme, marche et sorties
 *    nature, danse et chant) ; les quatre autres (loisirs créatifs, culture et
 *    jeux, informatique, bibliothèque) sont des ateliers. La fiche bien-être ne
 *    reprend donc QUE les trois premières, et la fiche ATELIER de l'Espace
 *    Lamartine continue d'exister pour le reste. Annoncer « bien-être » devant
 *    un cours de couture serait faux.
 * 2. Le Stade Nautique n'y figure pas l'hiver, et ce n'est pas un oubli : son
 *    bassin est en plein air et sa saison s'arrête le 7 octobre.
 *
 * Idempotent : marqueur `bdj:1`. Le script ne retire QUE ses propres fiches et
 * celles qu'il absorbe (marqueur `psc:` des piscines). Il tourne APRÈS
 * `piscines.mjs` dans le CI : celui-ci recrée les fiches de cours, celui-là les
 * refond. L'ordre est essentiel, comme nightlife → soirees-du-jour.
 *
 * Usage : node scripts/bien-etre-du-jour.mjs [--dry]
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { BASE_BIENETRE, BASE_ATELIERS, idFiche, chargerRegistreLieux, ecrireRegistreLieux, numeroLieu } from "./lib-lieux.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS = join(__dirname, "..", "src/data/events.js");
// 📒 LE REGISTRE — c'est lui qui rend le script REJOUABLE, et il n'est pas
// facultatif. Au 1er essai (11 oct 2026) le script a bien refondu 50 fiches ;
// au 2e il n'avait plus rien pour reconstruire, puisque les fiches de cours
// qui lui servaient de source avaient été absorbées. Le garde-fou a refusé
// d'écrire — mais sans registre, le script ne peut tourner qu'une fois.
// Exactement l'incident du 11 août 2026 sur les terrasses.
const REGISTRE = join(__dirname, "..", "bien-etre-du-jour.json");
const DRY = process.argv.includes("--dry");
const NL = "\\n";
const ANNEE_COURANTE = new Date().getFullYear();

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "déc"];
const MOIS_FR = { jan: 0, fév: 1, mar: 2, avr: 3, mai: 4, juin: 5, juil: 6, août: 7, sep: 8, oct: 9, nov: 10, déc: 11 };

/** « Lun 12 oct » + année → Date, ou null. */
function enDate(date, annee) {
  const m = String(date).match(/^\w+\s+(\d{1,2})\s+(\S+)$/);
  if (!m) return null;
  const mois = MOIS_FR[m[2]];
  if (mois === undefined) return null;
  return new Date(Number(annee), mois, Number(m[1]));
}

// ── L'Espace Lamartine, RANGÉ PAR THÈME ET NON PAR LIEU ──────────────────────
// Stéphanie, 11 octobre 2026 : « je trie par thème pas par lieux […] ne fait pas
// une fiche lamartine mais reprend tout et classe les selon nos filtres ».
// Une fiche « Espace Lamartine » oblige à l'ouvrir pour savoir si on y trouve du
// pilates ou un cours d'informatique. Chaque famille d'activités part donc dans
// le filtre qui lui correspond, avec l'adresse du lieu sur elle.
// ⚠️ Horaires LUS sur mairie.mc, jamais déduits. Fermé le dimanche.
const LAMARTINE_ADR = "Espace Lamartine · 19 bd Princesse Charlotte · Monte-Carlo";
const LAMARTINE_TEL = "+377 9315 2863";
const LAMARTINE_HEURES = { 1: "9h-20h", 2: "9h-20h", 3: "9h-20h", 4: "9h-20h", 5: "9h-20h", 6: "10h-18h" };
const LAMARTINE_RAPPEL = " Gratuit, ouvert aux Monégasques, résidents et élèves scolarisés à Monaco, à partir de 16 ans."
  + " Le programme change chaque semaine : appeler pour l'horaire d'un cours précis.";
const LAMARTINE_THEMES = [
  { filtre: "bienetre", nom: "Sport et remise en forme",
    desc: "Pilates, yoga, stretching, gym douce, cardio rythmé, renforcement, gainage, équilibre, coordination motrice, taiso, cardio drum, circuit training." },
  { filtre: "bienetre", nom: "Marche et sorties nature",
    desc: "Marche nordique, marche oxygénation, randonnées. ⚠️ Plusieurs sorties ont lieu hors de la Principauté : se renseigner avant de s'inscrire." },
  { filtre: "bienetre", nom: "Danse et chant",
    desc: "Danse de salon, danse en ligne, chant, répétitions de spectacles." },
  { filtre: "atelier", nom: "Loisirs créatifs",
    desc: "Couture, dessin et peinture, décopatch, création de bijoux, confection d'objets — dont des ateliers au profit du Téléthon." },
  { filtre: "atelier", nom: "Culture et jeux",
    desc: "Club photo, atelier d'écriture, forum des lecteurs, ciné-club, jeux de société, jeux de mémoire, quiz." },
  { filtre: "atelier", nom: "Informatique",
    desc: "Cours d'informatique, initiation au smartphone en séance individuelle, projets vidéo." },
  { filtre: "atelier", nom: "Bibliothèque et espace commun",
    desc: "Bibliothèque, postes informatiques, salle de musique, jeux de société en accès libre pendant les heures d'ouverture." },
];

// ── Lecture ───────────────────────────────────────────────────────────────────
let registre = {};
try { if (existsSync(REGISTRE)) registre = JSON.parse(readFileSync(REGISTRE, "utf8")) || {}; } catch { registre = {}; }

const src = readFileSync(EVENTS, "utf8");
const lignes = src.split("\n");

const aSupprimer = new Set();
let dejaGenerees = 0;
/** date|année → { piscine: [{lieu, heure, tel, detail}] } */
const parJour = new Map();

lignes.forEach((l, i) => {
  if (!l.trim().startsWith("{id:")) return;
  // nos propres fiches d'un passage précédent
  if (/\bbdj:1\b/.test(l)) { aSupprimer.add(i); dejaGenerees++; return; }
  // les fiches de cours des piscines, que l'on absorbe
  if (!/\bpsc:/.test(l)) return;
  const date = (l.match(/date:"([^"]+)"/) || [])[1];
  const annee = (l.match(/year:(\d{4})/) || [])[1] || String(ANNEE_COURANTE);
  const sub = (l.match(/subtitle:"([^"]+)"/) || [])[1] || "";
  const tel = (l.match(/phone:"([^"]+)"/) || [])[1] || "";
  const heure = (l.match(/time:"([^"]+)"/) || [])[1] || "";
  const desc = (l.match(/desc:"((?:[^"\\]|\\.)*)"/) || [])[1] || "";
  if (!date) return;
  const lieu = sub.split("·")[0].trim() || "Piscine";
  // « Aujourd'hui : Pilates 17h30 · Oxygène 18h30 » → on garde la liste des cours,
  // c'est la seule chose qui change d'un jour à l'autre.
  const cours = (desc.match(/Aujourd'hui\s*:\s*([^.]+)\./) || [])[1] || "";
  const cle = `${date}|${annee}`;
  if (!parJour.has(cle)) parJour.set(cle, { piscine: [] });
  parJour.get(cle).piscine.push({ lieu, heure, tel, cours: cours.trim() });
  aSupprimer.add(i);
});

// Le registre garde la composition de chaque journée : ce qu'on vient de lire
// l'enrichit, il ne le remplace pas. Une journée déjà connue et absente de la
// lecture (parce que ses fiches de cours ont été absorbées à un passage
// précédent) reste donc reconstructible.
for (const [cle, v] of parJour) registre[cle] = v;
for (const cle of Object.keys(registre)) if (!parJour.has(cle)) parJour.set(cle, registre[cle]);

// ── Fabrication ───────────────────────────────────────────────────────────────
const regLieux = chargerRegistreLieux();

const annuaireJSON = lieux => "[" + lieux.map(e => {
  const b = [`name:"${e.lieu.replace(/"/g, "")}"`, `vid:${numeroLieu(regLieux, e.lieu)}`];
  if (e.info) b.push(`info:"${e.info.replace(/"/g, "")}"`);
  if (e.adr) b.push(`adr:"${e.adr.replace(/"/g, "")}"`);
  if (e.desc) b.push(`desc:"${e.desc.replace(/"/g, "")}"`);
  if (e.tel) b.push(`tel:"${e.tel.replace(/"/g, "")}"`);
  return "{" + b.join(",") + "}";
}).join(",") + "]";

function carte(id, date, annee, lieux, debut) {
  const noms = lieux.map(e => e.info ? `${e.lieu} (${e.info})` : e.lieu);
  const desc = `Où bouger et prendre soin de soi à Monaco ce jour-là : ${noms.join(" · ")}.`
    + ` Touchez la fiche pour les voir un par un et appeler d'un geste.`
    + ` Les rendez-vous qui ont un nom — yoga et bain sonore, sound healing, journées bien-être — gardent leur propre fiche.`;
  const descEn = `Where to move and look after yourself in Monaco that day: ${noms.join(" · ")}.`
    + ` Tap the card to see them one by one and call in a single move.`
    + ` Named sessions — yoga and sound baths, sound healing, wellness days — keep their own cards.`;
  return `  {id:${id},${annee ? `year:${annee},` : ""}cat:"BIEN-ÊTRE",date:"${date}",time:"${debut}",`
    + `title:"BIEN-ÊTRE${NL}${lieux.length} ADRESSE${lieux.length > 1 ? "S" : ""}${NL}AUJOURD'HUI",subtitle:"Bien-être · Principauté",`
    + `desc:"${desc}",descEn:"${descEn}",free:false,hot:false,recap:true,bdj:1,directory:${annuaireJSON(lieux)},`
    + `fallback:"linear-gradient(150deg,#14322A,#2A6A52,#08201A)",accent:"#A8E0C8",emoji:"🧘",`
    + `link:"https://www.mairie.mc",source:"Monac'Out",quarter:"Monaco"},`;
}

// Les thèmes de l'Espace Lamartine qui ne relèvent PAS du bien-être : couture,
// club photo, informatique, bibliothèque. Ils vont dans le filtre Ateliers, avec
// l'adresse du lieu sur chaque sous-fiche — on cherche « informatique », pas
// « Lamartine ».
function carteAteliers(id, date, annee, themes, h) {
  const noms = themes.map(t => t.lieu);
  const desc = `Les ateliers gratuits de la Mairie, à l'Espace Lamartine ce jour-là (${h}) : ${noms.join(" · ")}.`
    + ` Touchez la fiche pour les voir un par un et appeler d'un geste.`
    + ` Le sport, la marche, la danse et le chant sont dans la fiche Bien-être.`;
  const descEn = `The Town Hall's free workshops at Espace Lamartine that day (${h}): ${noms.join(" · ")}.`
    + ` Tap the card to see them one by one and call in a single move.`
    + ` Sport, walking, dance and singing are on the Wellness card.`;
  const debut = (h.match(/^(\d{1,2})h/) || [])[1] || "9";
  return `  {id:${id},${annee ? `year:${annee},` : ""}cat:"ATELIER",date:"${date}",time:"${String(debut).padStart(2, "0")}h00",`
    + `title:"ATELIERS${NL}${themes.length} THÈMES${NL}ESPACE LAMARTINE",subtitle:"Ateliers de la Mairie · Monte-Carlo",`
    + `desc:"${desc}",descEn:"${descEn}",free:true,hot:false,recap:true,bdj:1,directory:${annuaireJSON(themes)},`
    + `fallback:"linear-gradient(150deg,#2A1A3A,#5A3A6A,#140C20)",accent:"#D8B8E8",emoji:"🎨",`
    + `link:"https://www.mairie.mc/salles-de-lespace-lamartine",source:"Mairie de Monaco",quarter:"Monte-Carlo"},`;
}

// La fenêtre : toutes les journées couvertes par les fiches de cours absorbées.
// L'Espace Lamartine s'ajoute aux jours où il est ouvert, dans cette même fenêtre —
// on ne fabrique pas de journée que rien d'autre ne justifie.
const nouvelles = [];
let nbCartes = 0, nbAteliers = 0;
for (const cle of [...parJour.keys()].sort((a, b) => {
  const da = enDate(...a.split("|")), db = enDate(...b.split("|"));
  return (da || 0) - (db || 0);
})) {
  const [date, an] = cle.split("|");
  const d = enDate(date, an);
  if (!d) continue;
  const annee = Number(an) === ANNEE_COURANTE ? "" : an;
  const v = parJour.get(cle);

  const lieux = v.piscine.map(p => ({
    lieu: p.lieu,
    info: p.cours || p.heure,
    adr: "Piscine Saint-Charles · Monte-Carlo",
    desc: "Cours collectifs de 45 minutes en bassin couvert 28-32 °C et en salle de sport."
      + " Réservation obligatoire sur sports.mairie.mc — toute séance non annulée 4 h avant est débitée.",
    tel: p.tel,
  }));

  const h = LAMARTINE_HEURES[d.getDay()];
  const themes = h ? LAMARTINE_THEMES.map(t => ({
    lieu: t.nom, info: h, adr: LAMARTINE_ADR, desc: t.desc + LAMARTINE_RAPPEL, tel: LAMARTINE_TEL, filtre: t.filtre,
  })) : [];
  lieux.push(...themes.filter(t => t.filtre === "bienetre"));
  const ateliers = themes.filter(t => t.filtre === "atelier");

  if (!lieux.length) continue;
  // L'heure de la fiche = le premier cours de la journée, jamais une heure inventée.
  const premiers = v.piscine.map(p => (p.heure.match(/^(\d{1,2})h(\d{2})?/) || []).slice(1))
    .filter(m => m.length).map(m => Number(m[0]) * 60 + Number(m[1] || 0));
  const minutes = premiers.length ? Math.min(...premiers) : 9 * 60;
  const debut = `${String(Math.floor(minutes / 60)).padStart(2, "0")}h${String(minutes % 60).padStart(2, "0")}`;

  nouvelles.push(carte(idFiche(BASE_BIENETRE, d), date, annee, lieux, debut));
  nbCartes++;
  if (ateliers.length) { nouvelles.push(carteAteliers(idFiche(BASE_ATELIERS, d), date, annee, ateliers, h)); nbAteliers++; }
}

// ── Écriture ──────────────────────────────────────────────────────────────────
const retirees = aSupprimer.size - dejaGenerees;
console.log("BIEN-ÊTRE DU JOUR");
console.log(`  ${retirees} fiche(s) de cours absorbée(s), ${dejaGenerees} fiche(s) du passage précédent remplacée(s)`);
console.log(`  ${nbCartes} fiche(s) « bien-être du jour » + ${nbAteliers} fiche(s) « ateliers » écrite(s)`);

// 🚨 GARDE-FOU — la leçon du 11 août 2026 (2 707 → 1 754 → 1 513 fiches, en
// silence). Ce script retire puis écrit : s'il ne peut rien écrire, il ne doit
// RIEN retirer. Mieux vaut un fil inchangé qu'un fil amputé.
if (aSupprimer.size > 0 && nouvelles.length === 0) {
  console.error("✗ Des fiches sont à retirer mais aucune n'a pu être écrite — rien n'a été modifié.");
  process.exit(1);
}
if (DRY) { console.log("\n--dry : rien n'a été écrit."); process.exit(0); }

const gardees = lignes.filter((_, i) => !aSupprimer.has(i));
const idx = gardees.map((l, i) => (l.trim() === "];" ? i : -1)).filter(i => i >= 0)[0];
if (idx === undefined) { console.error("✗ Marqueur `];` introuvable — rien n'a été écrit."); process.exit(1); }

gardees.splice(idx, 0, ...nouvelles);
writeFileSync(EVENTS, gardees.join("\n"));
ecrireRegistreLieux(regLieux);

// Le registre ne garde pas les journées passées : le CI les purge d'events.js,
// les y reconstruire reviendrait à republier du passé à chaque nuit.
const hier = new Date(); hier.setDate(hier.getDate() - 1); hier.setHours(0, 0, 0, 0);
for (const cle of Object.keys(registre)) {
  const d = enDate(...cle.split("|"));
  if (!d || d < hier) delete registre[cle];
}
writeFileSync(REGISTRE, JSON.stringify(registre, null, 1) + "\n");
console.log(`✓ bien-etre-du-jour.json — ${Object.keys(registre).length} journée(s) mémorisée(s)`);
console.log("✓ src/data/events.js mis à jour");
