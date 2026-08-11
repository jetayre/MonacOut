#!/usr/bin/env node
/**
 * MonacOut — UNE FICHE MUSÉES PAR JOUR, dans le fil, avec le nombre ouverts ce jour-là.
 *
 * Demande de Stéphanie (11 août 2026) : « fais la fiche musée tous les jours comme les
 * apéros en mettant le nb de musée ouvert ce jour et que l'on voit en scrollant » —
 * puis « et mets-la dans le scroll, pas juste dans l'onglet musée ».
 *
 * Avant : UNE fiche annuaire « Musées de Monaco ouverts », marquée `pinLast`, donc
 * masquée du fil et visible seulement sous le filtre Musée. Et elle existait en 338
 * exemplaires datés dans les données, que l'app regroupait à l'affichage.
 * Maintenant : UNE fiche par jour, dans le fil, qui annonce le nombre réellement
 * ouvert — 6 en semaine, 4 le lundi (le NMNM et le Vieux Monaco ferment le lundi).
 *
 * ── JOURS D'OUVERTURE VÉRIFIÉS AUX SOURCES OFFICIELLES, le 11 août 2026 ──────────
 * Le nombre annoncé doit être JUSTE : c'est tout l'intérêt de la fiche. Aucun horaire
 * n'est deviné. Le Musée des Souvenirs Napoléoniens est VOLONTAIREMENT absent : sa
 * réouverture n'est annoncée nulle part sur le site du Palais, donc on ne le compte pas.
 * Ne JAMAIS ajouter un musée ici sans avoir lu ses horaires sur son site officiel.
 *
 * Ce script est rejouable par construction : il reconstruit tout depuis la config
 * ci-dessous, il ne dépend d'aucune fiche existante. Marqueur `mdj:1`.
 *
 * Usage : node scripts/musees-du-jour.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { BASE_MUSEES, idFiche, chargerRegistreLieux, ecrireRegistreLieux, numeroLieu } from "./lib-lieux.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FICHIER = join(__dirname, "..", "src", "data", "events.js");
const SORTIE = join(__dirname, "..", "musees-du-jour.txt");
const DRY = process.argv.includes("--dry");

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_NUM = { jan:0, "fév":1, mar:2, avr:3, mai:4, juin:5, juil:6, "août":7, sep:8, oct:9, nov:10, "déc":11 };
const HORIZON_JOURS = 365;

// `ferme` : jours de la semaine où le musée est FERMÉ (0=dimanche … 6=samedi).
// `heures(mois)` : horaires affichés, mois de 0 à 11.
const MUSEES = [
  {
    nom: "Musée Océanographique", tel: "+377 9315 3600", ferme: [],
    // musee.oceano.org/practical-info : ouvert tous les jours sauf le 25 décembre et
    // le week-end du Grand Prix. Horaires par saison.
    heures: m => (m === 6 || m === 7) ? "09h30 — 20h00" : (m >= 3 && m <= 8) ? "10h00 — 19h00" : "10h00 — 18h00",
    fermetures: ["12-25"],
  },
  {
    nom: "NMNM — Villa Paloma & Villa Sauber", tel: "+377 9898 1826", ferme: [1],
    // nmnm.mc : ouvert tous les jours SAUF LUNDI. 11h-19h en juillet-août.
    heures: m => (m === 6 || m === 7) ? "11h00 — 19h00" : "10h00 — 18h00",
  },
  {
    nom: "Musée d'Anthropologie Préhistorique", tel: "+377 9315 0640", ferme: [],
    // map.gouv.mc : tous les jours 9h-18h.
    heures: () => "09h00 — 18h00",
  },
  {
    nom: "Musée Naval", ferme: [],
    // Terrasses de Fontvieille : tous les jours 10h-18h, fermé le 25 déc et le 1er jan.
    heures: () => "10h00 — 18h00",
    fermetures: ["12-25", "01-01"],
  },
  {
    nom: "Musée des Timbres & Monnaies", tel: "+377 9898 4144", ferme: [],
    // mtm-monaco.mc : tous les jours. 10h-18h de juillet à septembre, 10h-17h sinon.
    heures: m => (m >= 6 && m <= 8) ? "10h00 — 18h00" : "10h00 — 17h00",
  },
  {
    nom: "Musée du Vieux Monaco", tel: "+377 9350 5728", ferme: [1],
    // traditions-monaco.com : « tous les jours sauf les lundis de 10h30 à 17h ».
    heures: () => "10h30 — 17h00",
  },
];

const ouvertsLe = d => {
  const jour = d.getDay();
  const mmjj = String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  return MUSEES.filter(m => !m.ferme.includes(jour) && !(m.fermetures || []).includes(mmjj));
};

// ── Lecture ───────────────────────────────────────────────────────────────────
const lignes = readFileSync(FICHIER, "utf8").split("\n");
const champ = (l, n) => (l.match(new RegExp(`${n}:"([^"]*)"`)) || [])[1] || "";
const platTitre = l => champ(l, "title").replace(/\\n/g, " ").normalize("NFD")
  .replace(/[̀-ͯ]/g, "").toUpperCase().trim();

// On retire : nos propres fiches (mdj:1) ET l'ancienne série annuaire « Musées de
// Monaco ouverts » (338 fiches datées, masquées du fil parce que pinLast).
const aSupprimer = new Set();
let ancienneSerie = 0, ancienne = 0;
lignes.forEach((l, i) => {
  if (!l.trim().startsWith("{id:")) return;
  if (/\bmdj:1\b/.test(l)) { aSupprimer.add(i); ancienne++; return; }
  if (platTitre(l).startsWith("MUSEES DE MONACO OUVERTS")) { aSupprimer.add(i); ancienneSerie++; }
});

// ── Génération ────────────────────────────────────────────────────────────────
const NL = "\\n";
const ANNEE_COURANTE = new Date().getFullYear();
const regLieux = chargerRegistreLieux();
const annuaireJSON = lst => "[" + lst.map(m => {
  const b = [`name:"${m.nom}"`, `vid:${numeroLieu(regLieux, m.nom)}`, `info:"${m.heures(m._mois)}"`];
  if (m.tel) b.push(`tel:"${m.tel}"`);
  return "{" + b.join(",") + "}";
}).join(",") + "]";

const nouvelles = [];
const debut = new Date(); debut.setHours(0, 0, 0, 0);
for (let k = 0; k < HORIZON_JOURS; k++) {
  const d = new Date(debut); d.setDate(debut.getDate() + k);
  const ouverts = ouvertsLe(d).map(m => ({ ...m, _mois: d.getMonth() }));
  if (!ouverts.length) continue;
  const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  const an = d.getFullYear() === ANNEE_COURANTE ? "" : `year:${d.getFullYear()},`;
  const noms = ouverts.map(m => `${m.nom} (${m.heures(d.getMonth())})`);
  const desc = `Les musées de la Principauté ouverts aujourd'hui : ${noms.join(" · ")}.`
    + ` Touchez la fiche pour les voir un par un et appeler d'un geste.`
    + (ouverts.length < MUSEES.length ? ` Le NMNM et le Musée du Vieux Monaco ferment le lundi.` : "");
  const descEn = `The Principality's museums open today: ${noms.join(" · ")}.`
    + ` Tap the card to see them one by one and call in a single move.`
    + (ouverts.length < MUSEES.length ? ` The NMNM and the Musée du Vieux Monaco close on Mondays.` : "");
  nouvelles.push(
    `  {id:${idFiche(BASE_MUSEES, d)},${an}cat:"EXPOSITION",date:"${date}",time:"10h00",`
    + `title:"MUSÉES${NL}${ouverts.length} OUVERTS${NL}AUJOURD'HUI",subtitle:"Musées de Monaco · Principauté",`
    + `desc:"${desc}",descEn:"${descEn}",free:false,hot:false,recap:true,mdj:1,directory:${annuaireJSON(ouverts)},`
    + `fallback:"linear-gradient(150deg,#1A3A5A,#2A5A8A,#0A1E38)",accent:"#A8CCF0",emoji:"🏛️",`
    + `source:"Monac'Out",quarter:"Monaco"},`
  );
}

// ── GARDE-FOU (leçon du 11 août 2026 : ne jamais retirer sans remplacer) ──────
if (aSupprimer.size > 0 && nouvelles.length === 0) {
  console.error("✗ Des fiches à retirer mais aucune à écrire — fichier INCHANGÉ.");
  process.exit(1);
}

const gardees = lignes.filter((_, i) => !aSupprimer.has(i));
const idx = gardees.findIndex(l => l.trim() === "];");
if (idx === -1) { console.error("✗ Marqueur `];` introuvable — rien n'a été écrit."); process.exit(1); }
const sortie = [...gardees.slice(0, idx), ...nouvelles, ...gardees.slice(idx)].join("\n");

const lundi = ouvertsLe(new Date(2026, 7, 17)).length;   // un lundi
const mardi = ouvertsLe(new Date(2026, 7, 18)).length;   // un mardi
const rapport = [
  `FICHES MUSÉES DU JOUR — ${new Date().toISOString().slice(0, 10)}`,
  ``,
  `Fiches créées : ${nouvelles.length} (une par jour sur ${HORIZON_JOURS} jours)`,
  `Anciennes fiches du jour remplacées : ${ancienne}`,
  `Ancienne série annuaire retirée : ${ancienneSerie} fiches`,
  ``,
  `Musées suivis : ${MUSEES.length} — ${mardi} ouverts un mardi, ${lundi} un lundi.`,
  MUSEES.map(m => `  · ${m.nom}${m.ferme.length ? " (fermé " + m.ferme.map(j => JOURS[j]).join(", ") + ")" : ""}`).join("\n"),
  ``,
  `Le Musée des Souvenirs Napoléoniens n'est PAS compté : sa réouverture n'est`,
  `annoncée nulle part sur le site du Palais.`,
].join("\n");

console.log(rapport);
if (DRY) { console.log("\n(--dry : rien n'a été écrit)"); process.exit(0); }
writeFileSync(FICHIER, sortie);
ecrireRegistreLieux(regLieux);
writeFileSync(SORTIE, rapport + "\n");
