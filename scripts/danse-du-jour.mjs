/**
 * LES COURS DE DANSE DE LA PRINCIPAUTÉ — une fiche par jour.
 *
 * Stéphanie, 8 nov 2026, en envoyant le relevé des cours et des trois
 * associations qui les donnent.
 *
 * ⚠️ CE SONT DES COURS À L'ANNÉE, PAS DES SOIRÉES OÙ L'ON ARRIVE. On s'inscrit
 * auprès de l'association, on paie une cotisation ou une carte de dix cours.
 * Chaque fiche le dit en toutes lettres : annoncer « flamenco mercredi 14h »
 * sans préciser qu'il faut être inscrit enverrait quelqu'un devant une porte.
 * L'information reste utile — on découvre ce qui existe, on appelle, on
 * s'inscrit — mais elle doit être honnête. Même forme que l'ESAP.
 *
 * ⚠️ UNE FICHE PAR JOUR, PAS UNE PAR COURS. Six cours hebdomadaires sur des
 * mois feraient des centaines de fiches. Une carte « COURS DE DANSE · n cours »
 * qui se déplie en ses cours du jour.
 *
 * ⚠️ LES HORAIRES DE L'AS MONACO DANSE SPORTIVE SONT À RECONFIRMER POUR
 * 2026-2027 — c'est le relevé lui-même qui le dit. La mention figure sur leurs
 * cours, et sur eux seuls : le flamenco du Studio de Monaco n'est pas concerné.
 *
 * ⚠️ LES SALLES SONT NOMMÉES, PAS NUMÉROTÉES. La règle 13 demande le nom de la
 * salle et le quartier, pas une adresse postale : « Espace Saint-Antoine ·
 * Fontvieille » la respecte. Le quartier de Saint-Antoine est connu — le site
 * du Monte Carlo Bridge Club situe le Club House « au rez-de-chaussée de
 * l'Espace Saint Antoine, à Fontvieille ». Celui de L'Escorial ne l'est pas :
 * on écrit « L'Escorial · Monaco » plutôt que d'inventer un quartier.
 *
 * 🚨 LES CONTACTS SONT CEUX QUE LES ASSOCIATIONS PUBLIENT POUR QU'ON LES
 * APPELLE. Deux sont des portables français. Stéphanie a tranché le même jour,
 * à propos du chef de chœur de Saint-Charles : « si, mets le portable ». Même
 * raison ici — une association sans secrétariat n'a pas d'autre porte d'entrée.
 *
 *   node scripts/danse-du-jour.mjs            → rapport seul
 *   node scripts/danse-du-jour.mjs --ecrire   → met à jour events.js
 */
import { readFileSync, writeFileSync } from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");
const FICHIER = new URL("../src/data/events.js", import.meta.url);
const MARQUE = "dns:1";
const HORIZON = 120;
const ID0 = 964000;
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const STUDIO = { nom: "Studio de Monaco", tel: "+377 9330 1880",
  prix: "150 € par an, plus 30 € par cours supplémentaire." };
const ASMDS = { nom: "AS Monaco Danse Sportive", tel: "+33 6 12 21 23 84",
  prix: "130 € les 10 cours adultes.", reserve: true };
const COUNTRY = { nom: "Mùnegu Country Western Dance", tel: "+33 6 78 63 96 80",
  prix: "Tarif à demander à l'association." };

const RESERVE = " ⚠️ Horaire à reconfirmer pour la saison 2026-2027 auprès de l'association.";
const INSCRIT = " Cours à l'année : on s'inscrit auprès de l'association, on ne s'y présente pas sans l'avoir fait.";

/** jour de la semaine (0 = dimanche) → les cours de ce jour-là */
const COURS = {
  2: [
    { nom: "Kizomba et bachata", h: "12h30 — 13h30", salle: "Espace Saint-Antoine · Fontvieille", org: ASMDS,
      desc: "Danses afro-latines en couple, sur la pause de midi." },
    { nom: "Country — débutants", h: "14h30 — 16h30", salle: "L'Escorial · Monaco", org: COUNTRY,
      desc: "Danse en ligne sur musiques country et chansons actuelles, ambiance conviviale. Accessible aux débutants." },
  ],
  3: [
    { nom: "Flamenco", h: "14h00 — 16h00", salle: "Studio de Monaco", org: STUDIO,
      desc: "Cours de flamenco pour adultes. Le studio enseigne aussi la danse contemporaine et le chant au même endroit." },
    { nom: "Rock et danse de salon — débutants", h: "19h45 — 20h45", salle: "L'Escorial · Monaco", org: ASMDS,
      desc: "Rock et danses de salon pour débutants, en couple." },
  ],
  4: [
    { nom: "Country — débutants", h: "18h00 — 19h15", salle: "L'Escorial · Monaco", org: COUNTRY,
      desc: "Deuxième créneau hebdomadaire de danse en ligne country, pour débutants." },
    { nom: "Modern jazz adultes", h: "20h00 — 21h00", salle: "Espace Saint-Antoine · Fontvieille", org: ASMDS,
      desc: "Modern jazz pour adultes." },
  ],
};

const esc = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();
const auj = new Date(); auj.setHours(0, 0, 0, 0);
const lignes = [];
let id = ID0, nbJours = 0;

for (let k = 0; k < HORIZON; k++) {
  const d = new Date(auj); d.setDate(auj.getDate() + k);
  const duJour = COURS[d.getDay()];
  if (!duJour || !duJour.length) continue;
  nbJours++;
  const sous = duJour.map(c =>
    `{name:"${esc(c.nom)}",info:"${esc(c.h)}",adr:"${esc(c.salle)}",`
    + `desc:"${esc(c.desc + " " + c.org.nom + ". " + c.org.prix + INSCRIT + (c.org.reserve ? RESERVE : ""))}",`
    + `tel:"${c.org.tel}"}`).join(",");
  const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  const an = d.getFullYear() !== auj.getFullYear() ? `year:${d.getFullYear()},` : "";
  const debut = duJour[0].h.split(" — ")[0];
  const resume = duJour.map(c => c.nom).join(" · ");
  lignes.push(
    `  {id:${id++},${an}cat:"DANSE",date:"${date}",time:"${debut}",`
    + `title:"COURS DE DANSE\\n${duJour.length} COURS\\nÀ MONACO",`
    + `subtitle:"Associations de danse · Principauté",`
    + `desc:"Les cours de danse donnés ce jour-là en Principauté : ${esc(resume)}.${esc(INSCRIT)}",`
    + `descEn:"Dance classes held in Monaco that day: ${esc(resume)}. These are year-long courses: you enrol with the association beforehand.",`
    + `free:false,hot:false,recap:true,${MARQUE},`
    + `fallback:"linear-gradient(150deg,#3A1030,#6A2A58,#200818)",accent:"#F0A8D8",emoji:"💃",`
    + `phone:"${STUDIO.tel}",source:"Associations de danse de Monaco",quarter:"Monaco",`
    + `directory:[${sous}]},`);
}

console.log(`💃 Cours de danse : ${lignes.length} fiche(s) sur ${HORIZON} jours (${nbJours} jours avec cours)`);
for (const j of [2, 3, 4]) console.log(`   ${JOURS[j]} : ${COURS[j].map(c => `${c.nom} (${c.h})`).join(" · ")}`);
if (!ECRIRE) { console.log("\n(lecture seule — relancer avec --ecrire)"); process.exit(0); }

let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(new RegExp(MARQUE, "g")) || []).length;
if (!lignes.length) { console.log(`❌ Rien à écrire alors que ${avant} fiches existent — fichier NON modifié.`); process.exit(1); }
src = src.split("\n").filter(l => !l.includes(MARQUE)).join("\n");
const ancre = src.indexOf("\n", src.indexOf("const _RAW = ["));
if (ancre < 0) { console.log("❌ Tableau _RAW introuvable."); process.exit(1); }
src = src.slice(0, ancre + 1) + lignes.join("\n") + "\n" + src.slice(ancre + 1);
writeFileSync(FICHIER, src);
console.log(`\n✓ events.js : ${avant} ancienne(s) fiche(s) remplacée(s) par ${lignes.length}.`);
