/**
 * LES ATELIERS PUBLICS DE L'ESAP — PAVILLON BOSIO ET FOYER SAINTE-DÉVOTE.
 *
 * Stéphanie, 1er nov 2026 : « mets que ce que tu peux vérifier ».
 * Ceux-là, on peut : la Mairie publie le programme complet 2026/2027, cours
 * par cours, avec le jour, l'horaire, le lieu, l'enseignant et le nombre de
 * places. Relevé sur mairie.mc/ateliers-publics-a-lesap le 1er nov 2026.
 *
 * ⚠️ IL FAUT UN NAVIGATEUR. Un `fetch` sur cette page ne rend que le menu de
 * navigation — 225 Ko sans un seul horaire. C'est le même piège que l'agenda
 * de la Mairie : la page « répond », donc on la croit lue.
 *
 * 🚨 CE NE SONT PAS DES SORTIES OÙ L'ON ARRIVE LE SOIR MÊME. Ce sont des cours
 * à l'année, 14 à 20 places, dont les inscriptions se sont tenues du 7 au
 * 11 septembre. Chaque fiche le dit en toutes lettres : annoncer « céramique
 * ce lundi 18h » sans préciser qu'il faut être inscrit enverrait quelqu'un
 * devant une porte. L'information reste utile — on découvre ce qui existe, et
 * on s'inscrit l'année suivante — mais elle doit être honnête.
 *
 * ⚠️ UNE FICHE PAR JOUR, PAS UNE PAR COURS. Huit cours hebdomadaires sur
 * 34 semaines feraient des centaines de fiches. Même forme que l'Espace
 * Lamartine : une carte « ATELIERS ESAP · n cours », qui se déplie en ses
 * cours du jour.
 *
 *   node scripts/esap-du-jour.mjs            → rapport seul
 *   node scripts/esap-du-jour.mjs --ecrire   → met à jour src/data/events.js
 */
import { readFileSync, writeFileSync } from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");
const FICHIER = new URL("../src/data/events.js", import.meta.url);
const MARQUE = "esap:1";
const SITE = "https://www.mairie.mc/ateliers-publics-a-lesap";
const TEL = "+377 9315 2890";

// La saison, telle que l'écrit la Mairie : « Les cours débuteront le lundi
// 5 octobre 2026 et se termineront le samedi 29 mai 2027 au soir. »
const SAISON_DEBUT = new Date(2026, 9, 5);
const SAISON_FIN = new Date(2027, 4, 29);
const HORIZON_JOURS = 70;   // on ne pose pas la saison entière d'un coup

const BOSIO = "Pavillon Bosio · ESAP";
const FOYER = "Foyer Sainte-Dévote · Annexe";
const LAMARTINE = "Espace Lamartine";

/** Jour de la semaine (1 = lundi) → les cours ADULTES de ce jour-là. */
const COURS = {
  1: [
    { nom: "Reliure", h: "17h00 — 20h00", lieu: FOYER, prof: "Sophie Sediri", places: 14,
      desc: "Fabrication d'un livre et reliure traditionnelle : reliures anciennes en cuir et papier marbré, bradels en toile, créations contemporaines. Tous niveaux." },
    { nom: "Céramique — groupe débutant", h: "18h00 — 20h30", lieu: BOSIO, prof: "Jeffrey Haines", places: 14,
      desc: "Bases techniques et principes fondamentaux de la céramique : argiles, émaux, traitements de surface, modelage et assemblage." },
  ],
  2: [
    { nom: "Dessin", h: "16h00 — 18h30", lieu: LAMARTINE, prof: "Yannick Cosso", places: 20,
      desc: "Perspective, proportions, portrait, ombrages, dessin d'après modèle. Étudiants et adultes, tous niveaux." },
    { nom: "Céramique — groupe avancé", h: "18h00 — 20h30", lieu: BOSIO, prof: "Jeffrey Haines", places: 14,
      desc: "Approfondissement technique et expression personnelle en céramique." },
    { nom: "Peinture — tous niveaux", h: "18h00 — 20h30", lieu: FOYER, prof: "Sandrine Flury", places: 20,
      desc: "Nouveau cours 2026/2027. Représentation, composition, couleur, lumière, contraste et matière. Lycéens, étudiants et adultes." },
  ],
  3: [
    { nom: "Céramique — groupe avancé", h: "10h00 — 12h30", lieu: BOSIO, prof: "Jeffrey Haines", places: 14,
      desc: "Seconde séance hebdomadaire du groupe avancé." },
    { nom: "Gravure", h: "10h00 — 12h30", lieu: FOYER, prof: "Laure Fissore", places: 15,
      desc: "Gravure sur bois ou sur lino, pointe sèche, impression d'estampes. Débutant et intermédiaire." },
    { nom: "Dessin — débutant et intermédiaire", h: "18h30 — 21h00", lieu: FOYER, prof: "Yannick Cosso", places: 20,
      desc: "Fondamentaux du dessin et exercices de créativité." },
  ],
  4: [
    { nom: "Peinture — débutant et intermédiaire", h: "18h00 — 20h30", lieu: FOYER, prof: "Laure Fissore", places: 20,
      desc: "Fondamentaux de la peinture. ⚠️ Le cours a lieu le jeudi OU le vendredi selon le groupe : vérifier auprès de l'école." },
  ],
  5: [
    { nom: "Peinture — débutant et intermédiaire", h: "18h00 — 20h30", lieu: FOYER, prof: "Laure Fissore", places: 20,
      desc: "Fondamentaux de la peinture. ⚠️ Le cours a lieu le jeudi OU le vendredi selon le groupe : vérifier auprès de l'école." },
  ],
  6: [
    { nom: "Dessin", h: "10h00 — 13h00", lieu: FOYER, prof: "Laure Fissore", places: 20,
      desc: "Lycéens, étudiants et adultes, tous niveaux." },
    { nom: "Peinture — niveau avancé", h: "14h00 — 17h00", lieu: FOYER, prof: "Sandrine Flury", places: 20,
      desc: "Approfondissement de la technique et de l'expression picturale." },
  ],
};

const RAPPEL = "⚠️ Cours à l'année, places limitées : les inscriptions se sont tenues du 7 au 11 septembre 2026. "
  + "On ne s'y présente pas sans être inscrit — se renseigner auprès de l'école pour une place restante ou la saison prochaine.";

const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS_FR = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const esc = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();

const auj = new Date(); auj.setHours(0, 0, 0, 0);
const lignes = [];
let id = 920000;
let nbJours = 0;

for (let k = 0; k < HORIZON_JOURS; k++) {
  const d = new Date(auj); d.setDate(auj.getDate() + k);
  if (d < SAISON_DEBUT || d > SAISON_FIN) continue;
  const duJour = COURS[d.getDay()];
  if (!duJour || !duJour.length) continue;
  nbJours++;
  const sous = duJour.map(c =>
    `{name:"${esc(c.nom)}",info:"${esc(c.h)}",adr:"${esc(c.lieu)} · Monaco",`
    + `desc:"${esc(c.desc)} Enseignant·e : ${esc(c.prof)}. ${esc(String(c.places))} places. ${esc(RAPPEL)}",`
    + `tel:"${TEL}"}`).join(",");
  const date = `${JOURS_FR[d.getDay()]} ${d.getDate()} ${MOIS_FR[d.getMonth()]}`;
  const an = d.getFullYear() !== 2026 ? `year:${d.getFullYear()},` : "";
  const debut = duJour[0].h.split(" — ")[0];
  const resume = duJour.map(c => c.nom).join(" · ");
  lignes.push(
    `  {id:${id++},${an}cat:"ATELIER",date:"${date}",time:"${debut}",`
    + `title:"ATELIERS ESAP\\n${duJour.length} COURS\\nPAVILLON BOSIO",`
    + `subtitle:"Ateliers publics de l'ESAP · Monaco",`
    + `desc:"Les cours publics de l'École Supérieure d'Arts Plastiques ce jour-là : ${esc(resume)}. ${esc(RAPPEL)}",`
    + `descEn:"Public art classes run by Monaco's School of Fine Arts on that day: ${esc(resume)}. Year-long courses with limited places; enrolment took place in September.",`
    + `free:false,hot:false,recap:true,${MARQUE},`
    + `fallback:"linear-gradient(150deg,#14243A,#2E4A6E,#0A1424)",accent:"#9FC3DC",emoji:"🎨",`
    + `link:"${SITE}",phone:"${TEL}",source:"Mairie de Monaco",quarter:"Monaco",`
    + `directory:[${sous}]},`);
}

console.log(`🎨 ESAP : ${lignes.length} fiche(s) sur ${HORIZON_JOURS} jours (saison 5 oct 2026 → 29 mai 2027)`);
for (const j of [1, 2, 3, 4, 5, 6]) {
  const c = COURS[j];
  if (c) console.log(`   ${JOURS_FR[j]} : ${c.map(x => `${x.nom} (${x.h})`).join(" · ")}`);
}
if (!ECRIRE) { console.log("\n(lecture seule — relancer avec --ecrire)"); process.exit(0); }
if (!lignes.length) { console.log("Rien à écrire (hors saison) — fiches existantes retirées."); }

let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(new RegExp(MARQUE, "g")) || []).length;
src = src.split("\n").filter(l => !l.includes(MARQUE)).join("\n");
const ancre = src.indexOf("\n", src.indexOf("const _RAW = ["));
if (ancre < 0) { console.log("❌ Tableau _RAW introuvable — rien n'est écrit."); process.exit(1); }
src = src.slice(0, ancre + 1) + (lignes.length ? lignes.join("\n") + "\n" : "") + src.slice(ancre + 1);
writeFileSync(FICHIER, src);
console.log(`\n✓ events.js : ${avant} ancienne(s) fiche(s) remplacée(s) par ${lignes.length}.`);
