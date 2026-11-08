/**
 * LES ATELIERS DE LA MAISON DU NUMÉRIQUE, RELUS CHAQUE NUIT.
 *
 * Stéphanie, 8 nov 2026, en relevant trois ateliers à la main : l'un d'eux,
 * « ChatGPT », était chez nous à 11h alors que la Maison du Numérique l'annonce
 * à 15h. Vérification faite, ce n'était pas un cas isolé.
 *
 * 🚨 CE QUE LA COMPARAISON A DONNÉ, ET POURQUOI CE SCRIPT EXISTE.
 * L'agenda officiel annonçait 17 séances en novembre. L'app en avait SIX, dont
 * QUATRE à la mauvaise heure et DEUX justes. Onze manquaient.
 *
 *      officiel                              app
 *      jeu 12/11 15h00  ChatGPT              11h00   ❌ quatre heures trop tôt
 *      sam 14/11 11h00  Mac niveau 1         15h00   ❌
 *      mer 18/11 10h30  Appels indésirables  15h30   ❌
 *      sam 28/11 11h00  Mac niveau 2         15h00   ❌
 *      + 11 séances absentes
 *
 * Ces fiches venaient de PrinciPocket. Or la Maison du Numérique publie son
 * agenda en clair, lisible par un simple `fetch` — aucune raison de le lire
 * chez un tiers. **Quand un lieu publie son programme, c'est LUI la source.**
 *
 * ⚠️ UNE SÉANCE « COMPLET » N'EST PAS PUBLIÉE. La page de chaque atelier porte
 * le mot à côté des séances pleines (« ChatGPT », 12 nov, l'était déjà). Une
 * fiche qui invite à un atelier complet envoie quelqu'un devant une porte —
 * c'est la faute qu'on s'interdit depuis les ateliers de l'ESAP. Elles sont
 * comptées dans le rapport, jamais affichées.
 *
 * ⚠️ LA LANGUE EST UNE INFORMATION, PAS UN DÉTAIL. Le même atelier se donne en
 * français un jour et en anglais un autre (« Appels indésirables » : mercredi
 * en français, vendredi en anglais). Quelqu'un qui ne parle pas la langue du
 * jour s'est déplacé pour rien. Elle est écrite dans chaque fiche.
 *
 * ⚠️ « GRATUIT » NE VIENT PAS DE LA PAGE. Ni la liste ni les fiches d'atelier
 * n'affichent de tarif. La gratuité est au tableau des sources depuis le
 * 11 oct 2026, et le relevé de Stéphanie la redit. Les six fiches importées,
 * elles, étaient toutes en `free:false` — même erreur que les Thursday Live
 * Sessions et les concerts spirituels de l'OPMC.
 *
 * 🛡️ GARDE-FOU : si la lecture échoue ou ne rend aucune séance, le script
 * N'ÉCRIT RIEN et sort en erreur. Mieux vaut l'agenda d'hier qu'un fil amputé —
 * la règle des plannings de piscine.
 *
 *   node scripts/maison-du-numerique.mjs            → rapport seul
 *   node scripts/maison-du-numerique.mjs --ecrire   → met à jour src/data/events.js
 */
import { readFileSync, writeFileSync } from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");
const FICHIER = new URL("../src/data/events.js", import.meta.url);
const MARQUE = "mdn:1";
const BASE = "https://www.maisondunumerique.mc";
const AGENDA = `${BASE}/agenda`;
const TEL = "+377 9226 9226";
const LIEU = "Maison du Numérique · Les Jardins d'Apolline · Monaco";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";
const ID0 = 962000;

const JOURS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS_FR = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const texte = html => {
  const sansCode = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  return sansCode.replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&[a-z]+;/g, " ")
    .split("\n").map(l => l.trim()).filter(Boolean);
};

async function lire(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} sur ${url}`);
  return r.text();
}

/** Les adresses des ateliers, lues sur la page d'agenda. */
function slugs(html) {
  const vus = new Set();
  for (const m of html.matchAll(/href="((?:https:\/\/www\.maisondunumerique\.mc)?\/agenda\/[a-z0-9\-']+)"/gi)) {
    vus.add(m[1].replace(BASE, ""));
  }
  return [...vus];
}

/**
 * Une page d'atelier : son titre, sa présentation, et ses séances.
 * Les séances se lisent « <jour> / JJ/MM / HHhMM / [Complet] / <langue> ».
 * ⚠️ L'ordre des deux dernières varie : on regarde dans une petite fenêtre
 *    plutôt que d'exiger une position fixe.
 */
function atelier(html) {
  const L = texte(html);
  const iDates = L.findIndex(x => /^Dates des sessions$/i.test(x));
  if (iDates < 0) return null;
  // ⚠️ LE TITRE SE LIT DANS LE <h1>, PAS DANS LE FIL D'ARIANE. Premier jet :
  //    « la ligne qui suit "Agenda" ». Or le MENU du site dit « Présentation
  //    Agenda Médiathèque Contactez-nous » — l'atelier ChatGPT s'est donc appelé
  //    « Médiathèque » dans le rapport. Un repère pris sur un mot qui se répète
  //    n'est pas un repère.
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titre = h1 ? texte(h1[1])[0] : L[0];
  if (!titre) return null;
  // La présentation : les lignes longues entre le titre et les séances.
  const presentation = L.slice(0, iDates).filter(x => x.length > 60 && x !== titre);

  const seances = [];
  for (let i = iDates + 1; i < L.length; i++) {
    const d = L[i].match(/^(\d{2})\/(\d{2})$/);
    const h = L[i + 1] && L[i + 1].match(/^(\d{1,2})h(\d{2})$/);
    if (!d || !h) continue;
    const fenetre = L.slice(i + 2, i + 5);
    seances.push({
      jour: +d[1], mois: +d[2],
      heure: `${h[1]}h${h[2]}`,
      complet: fenetre.some(x => /^complet$/i.test(x)),
      langue: fenetre.find(x => /^(Français|Anglais)$/i.test(x)) || "",
    });
  }
  return { titre, presentation, seances };
}

/** « 12 » + « 11 » → la bonne année : le mois passé appartient à l'an prochain. */
function dateDe(jour, mois) {
  const auj = new Date(); auj.setHours(0, 0, 0, 0);
  for (const an of [auj.getFullYear(), auj.getFullYear() + 1]) {
    const d = new Date(an, mois - 1, jour);
    if (d >= auj) return d;
  }
  return null;
}

const esc = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();
const majTitre = s => s.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase()
  .replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/** Le titre sur trois lignes, comme partout ailleurs dans l'app. */
function troisLignes(t) {
  const mots = majTitre(t).split(" ");
  const lignes = [[], [], []];
  const parLigne = Math.ceil(mots.length / 3);
  mots.forEach((m, i) => lignes[Math.min(2, Math.floor(i / parLigne))].push(m));
  return lignes.filter(l => l.length).map(l => l.join(" ")).join("\\n");
}

let pageAgenda;
try {
  pageAgenda = await lire(AGENDA);
} catch (e) {
  console.log(`⚠️  maisondunumerique.mc illisible (${e.message}) — rien n'est écrit.`);
  process.exit(1);
}

const adresses = slugs(pageAgenda);
if (!adresses.length) {
  console.log("⚠️  Aucun atelier trouvé sur l'agenda — la mise en page a changé ? Rien n'est écrit.");
  process.exit(1);
}

const lignes = [];
const complets = [];
let id = ID0, nbSeances = 0;

for (const slug of adresses.sort()) {
  let a;
  try { a = atelier(await lire(BASE + slug)); }
  catch (e) { console.log(`   ⚠️  ${slug} illisible (${e.message}) — atelier ignoré.`); continue; }
  if (!a || !a.seances.length) continue;

  const intro = a.presentation.join(" ").replace(/\s+/g, " ").slice(0, 420);
  for (const s of a.seances) {
    const d = dateDe(s.jour, s.mois);
    if (!d) continue;
    nbSeances++;
    if (s.complet) { complets.push(`${s.jour}/${s.mois} ${s.heure} · ${a.titre}`); continue; }

    const enAnglais = /anglais/i.test(s.langue);
    const langueFr = s.langue ? `Atelier en ${s.langue.toLowerCase()}.` : "";
    const date = `${JOURS_FR[d.getDay()]} ${d.getDate()} ${MOIS_FR[d.getMonth()]}`;
    const an = d.getFullYear() !== new Date().getFullYear() ? `year:${d.getFullYear()},` : "";
    const desc = `${intro} ${langueFr} Gratuit, sur réservation : les places sont limitées.`.replace(/\s+/g, " ");
    const descEn = `Free hands-on digital workshop at Monaco's Maison du Numérique, in the Jardins d'Apolline. `
      + `${enAnglais ? "This session is run in English." : "This session is run in French."} `
      + `Booking required, places are limited.`;

    lignes.push(
      `  {id:${id++},${an}cat:"ATELIER",date:"${date}",time:"${s.heure}",`
      + `title:"${troisLignes(a.titre)}",`
      + `subtitle:"${esc(LIEU)}",`
      + `desc:"${esc(desc)}",descEn:"${esc(descEn)}",`
      + `free:true,hot:false,${MARQUE},`
      + `fallback:"linear-gradient(150deg,#14243A,#2E4A6E,#0A1424)",accent:"#9FC3DC",emoji:"💻",`
      + `link:"${BASE}${slug}",phone:"${TEL}",source:"Maison du Numérique",quarter:"Monaco"},`);
  }
}

console.log(`💻 Maison du Numérique : ${adresses.length} ateliers lus · ${nbSeances} séances à venir`);
console.log(`   ${lignes.length} fiche(s) publiables · ${complets.length} séance(s) COMPLÈTES, non publiées`);
for (const c of complets) console.log(`      ✖ complet : ${c}`);

if (!ECRIRE) { console.log("\n(lecture seule — relancer avec --ecrire)"); process.exit(0); }

// 🛡️ Ne jamais retirer sans pouvoir remplacer (leçon du 11 août 2026).
let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(new RegExp(MARQUE, "g")) || []).length;
if (!lignes.length) {
  console.log(`❌ Aucune fiche à écrire alors que ${avant} existent — le fichier n'est PAS touché.`);
  process.exit(1);
}
src = src.split("\n").filter(l => !l.includes(MARQUE)).join("\n");
const ancre = src.indexOf("\n", src.indexOf("const _RAW = ["));
if (ancre < 0) { console.log("❌ Tableau _RAW introuvable — rien n'est écrit."); process.exit(1); }
src = src.slice(0, ancre + 1) + lignes.join("\n") + "\n" + src.slice(ancre + 1);
writeFileSync(FICHIER, src);
console.log(`\n✓ events.js : ${avant} ancienne(s) fiche(s) remplacée(s) par ${lignes.length}.`);
