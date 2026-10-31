/**
 * LES TOURNOIS DU MONTE CARLO BRIDGE CLUB.
 *
 * Stéphanie, 1er nov 2026 : « y a-t-il des events au club boulistes ou club de
 * bridge ? ». Réponse : oui, DEUX PAR SEMAINE, et l'app n'en avait aucun.
 *
 * Source : l'agenda Google que le club publie sur montecarlobridgeclub.com.
 * Il donne tout ce qu'il faut — date, heure (14h45-18h00) et SALLE, qui change
 * d'un jour à l'autre : le Clubhouse de l'AS Monaco le lundi, A Casa d'i Soci
 * le samedi. Le club le dit lui-même sur sa page : « le lieu sera indiqué dans
 * le calendrier ». On lit donc la salle de CHAQUE séance, on ne la devine pas.
 *
 * ⚠️ TROIS PIÈGES RENCONTRÉS :
 *  1. L'agenda vit dans une IFRAME Google : le texte de la page ne le contient
 *     pas. Il faut parcourir les `frames()` du navigateur.
 *  2. Google y met des ESPACES INSÉCABLES (« De 14:45 à 18:00 ») :
 *     une regex avec une espace ordinaire ne trouve rien, et le script conclut
 *     « aucun tournoi » alors que la page en affiche six.
 *  3. La vue « agenda » ne rend que ce qui est chargé ; on déroule l'iframe.
 *
 * 🚨 IL N'INVENTE RIEN. Pas de séance sans date, heure ET salle lues sur
 * l'agenda. S'il ne lit rien, il ne touche pas aux fiches existantes — un
 * réseau en panne ne doit pas vider l'app.
 *
 *   node scripts/bridge-monaco.mjs            → rapport seul
 *   node scripts/bridge-monaco.mjs --ecrire   → met à jour src/data/events.js
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const ECRIRE = process.argv.includes("--ecrire");
const FICHIER = new URL("../src/data/events.js", import.meta.url);
const SITE = "https://www.montecarlobridgeclub.com";
const MARQUE = "bridge:1";          // pour retrouver nos fiches et les remplacer

const MOIS_CAL = { JANV: 1, "FÉVR": 2, FEVR: 2, MARS: 3, AVR: 4, MAI: 5, JUIN: 6, JUIL: 7, "AOÛT": 8, AOUT: 8, SEPT: 9, OCT: 10, NOV: 11, "DÉC": 12, DEC: 12 };
const MOIS_FR = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Les salles du club, et le quartier de chacune. Règle 15 : Monaco seulement. */
const SALLES = [
  { motif: /AS Monaco Clubhouse/i, nom: "AS Monaco Clubhouse", quartier: "Fontvieille" },
  { motif: /Casa d.i Soci|Maison des Associations/i, nom: "A Casa d'i Soci · Maison des Associations", quartier: "Monaco" },
  { motif: /Carabiniers/i, nom: "Caserne des Carabiniers", quartier: "Monaco-Ville" },
];

// 🚨 PAS DE toISOString POUR UNE DATE LOCALE. À Monaco (UTC+1),
// `new Date(2026, 10, 2)` vaut 2026-11-01T23:00:00Z : la conversion UTC rend
// donc « 2026-11-01 » pour un tournoi du 2. Les FICHES étaient justes — elles
// se construisent avec getDate()/getDay(), qui sont locaux. C'était le RAPPORT
// qui mentait, d'un jour, sur les 38 séances.
// Un rapport faux est la pire espèce de faux : c'est lui qu'on relit pour
// vérifier. Même famille que les 60 horaires faux d'octobre.
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const esc = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();

async function lireAgenda() {
  const nav = await chromium.launch();
  try {
    const page = await (await nav.newContext({ userAgent: "Mozilla/5.0 (MonacOut)", locale: "fr-FR" })).newPage();
    await page.goto(SITE, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(4000);
    for (let i = 0; i < 5; i++) { await page.evaluate(() => window.scrollBy(0, 1200)); await page.waitForTimeout(700); }
    let texte = "";
    for (const f of page.frames()) {
      if (!/calendar\.google\.com/.test(f.url())) continue;
      // La vue agenda charge à la demande : on déroule DANS l'iframe.
      for (let i = 0; i < 8; i++) {
        await f.evaluate(() => window.scrollBy(0, 800)).catch(() => {});
        await page.waitForTimeout(600);
      }
      texte += (await f.evaluate(() => document.body.innerText).catch(() => "")) + "\n";
    }
    return texte;
  } finally {
    await nav.close();
  }
}

function seances(texte) {
  // ⚠️ Les espaces insécables de Google, sans quoi rien ne correspond.
  const t = texte.replace(/ /g, " ");
  // On CAPTURE le jour de semaine écrit par Google (« LUN. », « SAM. ») pour le
  // confronter à la date calculée. Sans ce garde-fou, une erreur d'année passe
  // inaperçue : le 25 décembre 2026 sortait « samedi » alors que c'est un
  // vendredi — une date fausse mais plausible est invisible à la relecture.
  const rx = /(\d{1,2})\n([A-ZÉÛ]{3,5})\.?,\s*([A-ZÉÛ]{3,4})\.?\nDe (\d{2}):(\d{2}) à (\d{2}):(\d{2})\n\d{2}:\d{2}\n([^\n]+)\n([^\n]+)\nAgenda/g;
  const auj = new Date(); auj.setHours(0, 0, 0, 0);
  const out = [];
  const vus = new Set();
  const incoherentes = [];
  for (const m of t.matchAll(rx)) {
    const mois = MOIS_CAL[m[2].replace(".", "")];
    if (!mois) continue;
    // L'agenda court de novembre à mars : les mois < celui d'aujourd'hui sont l'an prochain.
    const an = mois >= auj.getMonth() + 1 ? auj.getFullYear() : auj.getFullYear() + 1;
    const d = new Date(an, mois - 1, +m[1]);
    if (d < auj) continue;
    // 🚨 LE JOUR CALCULÉ DOIT ÊTRE CELUI QU'ÉCRIT L'AGENDA.
    const ecrit = m[3].replace(".", "").toUpperCase();
    const ABREV = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
    if (ABREV[d.getDay()] !== ecrit) { incoherentes.push(`${iso(d)} lu « ${ecrit} », calculé « ${ABREV[d.getDay()]} »`); continue; }
    const salle = SALLES.find(s => s.motif.test(m[9]));
    if (!salle) continue;                       // salle inconnue → on ne publie pas
    const cle = iso(d);
    if (vus.has(cle)) continue;
    vus.add(cle);
    out.push({ d, h1: `${m[4]}h${m[5]}`, h2: `${m[6]}h${m[7]}`, titre: m[8].trim(), salle });
  }
  if (incoherentes.length) {
    console.log(`⚠️  ${incoherentes.length} séance(s) écartée(s), jour de semaine incohérent :`);
    incoherentes.slice(0, 6).forEach(x => console.log("   " + x));
  }
  return out.sort((a, b) => a.d - b.d);
}

const texte = await lireAgenda().catch(e => {
  console.log(`⚠️  Agenda du bridge illisible (${e.message.split("\n")[0]}) — fiches existantes conservées.`);
  return null;
});
if (texte === null) process.exit(0);

const liste = seances(texte);
if (!liste.length) {
  console.log("⚠️  Aucun tournoi lu — iframe ou mise en page changée. Fiches existantes conservées.");
  process.exit(0);
}

let id = 970000;
const lignes = liste.map(s => {
  const jour = `${JOURS_FR[s.d.getDay()]} ${s.d.getDate()} ${MOIS_FR[s.d.getMonth()]}`;
  const an = s.d.getFullYear() !== 2026 ? `year:${s.d.getFullYear()},` : "";
  const nom = /lundi|Monday/i.test(s.titre) ? "TOURNOI DU LUNDI" : /samedi|Sat/i.test(s.titre) ? "TOURNOI DU SAMEDI" : "TOURNOI";
  const desc = `Tournoi du Monte Carlo Bridge Club, de ${s.h1} à ${s.h2} à ${s.salle.nom.split(" · ")[0]}. Inscription sur le site du club ; le club tient aussi une école de bridge.`;
  const descEn = `Monte Carlo Bridge Club tournament, ${s.h1.replace("h", ":")} to ${s.h2.replace("h", ":")} at ${s.salle.nom.split(" · ")[0]}. Sign up on the club's website; the club also runs a bridge school.`;
  return `  {id:${id++},${an}cat:"ATELIER",date:"${jour}",time:"${s.h1} — ${s.h2}",`
    + `title:"BRIDGE\\n${esc(nom)}\\nMONTE-CARLO",subtitle:"${esc(s.salle.nom)} · ${s.salle.quartier}",`
    + `desc:"${esc(desc)}",descEn:"${esc(descEn)}",free:false,hot:false,${MARQUE},`
    + `fallback:"linear-gradient(150deg,#14243A,#2E4A6E,#0A1424)",accent:"#9FC3DC",emoji:"♠️",`
    + `link:"${SITE}",source:"Monte Carlo Bridge Club",quarter:"${s.salle.quartier}"},`;
});

console.log(`♠️  ${liste.length} tournoi(s) de bridge lus sur l'agenda officiel :`);
liste.forEach(s => console.log(`   ${iso(s.d)}  ${s.h1}–${s.h2}  ${s.salle.nom}`));

if (!ECRIRE) { console.log("\n(lecture seule — relancer avec --ecrire pour mettre à jour events.js)"); process.exit(0); }

let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(new RegExp(MARQUE, "g")) || []).length;
src = src.split("\n").filter(l => !l.includes(MARQUE)).join("\n");
// 🚨 LE TABLEAU EST `_RAW`, PAS `ALL_EVENTS`. Première tentative : j'ai inséré
// après « export const ALL_EVENTS = [..._RAW », qui n'est pas une liste de
// fiches mais une expression de recomposition — 38 objets collés là ont rendu
// events.js invalide d'un coup, et tout le build est tombé.
// La ligne 1 du fichier est « const _RAW = [ » : c'est là que vivent les fiches.
const ancre = src.indexOf("\n", src.indexOf("const _RAW = ["));
if (ancre < 0) { console.log("❌ Tableau _RAW introuvable dans events.js — rien n'est écrit."); process.exit(1); }
src = src.slice(0, ancre + 1) + lignes.join("\n") + "\n" + src.slice(ancre + 1);
writeFileSync(FICHIER, src);
console.log(`\n✓ events.js : ${avant} ancienne(s) fiche(s) remplacée(s) par ${lignes.length}.`);
