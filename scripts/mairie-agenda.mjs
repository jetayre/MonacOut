/**
 * L'AGENDA DE LA MAIRIE, RELU CHAQUE NUIT.
 *
 * Stéphanie, 31 oct 2026 : « vérifie tous les jours qu'il ne manque rien ».
 *
 * 🚨 POURQUOI LA MAIRIE ET PAS SEULEMENT PRINCIPOCKET. C'est la leçon du 1er
 * août : le feu d'artifice était bien dans l'app, mais les châteaux gonflables
 * de l'après-midi et la soirée pop-rock qui l'encadraient manquaient — ils
 * étaient au programme officiel de la Mairie, pas sur PrinciPocket. Depuis,
 * la règle dit de lire les DEUX. Elle n'était appliquée à la main que lorsque
 * quelqu'un y pensait ; elle tourne maintenant toutes les nuits.
 *
 * ⚠️ IL FAUT UN VRAI NAVIGATEUR. mairie.mc/agenda/ ne rend que ses filtres à
 * une requête simple : les événements arrivent en JavaScript, et seulement au
 * défilement. Vérifié le 31 oct — un `fetch` donne 113 Ko sans un seul
 * événement. On déroule donc la page, comme pour le cinéma.
 *
 * 🚨 CE SCRIPT N'AJOUTE RIEN TOUT SEUL, IL SIGNALE. Un titre d'agenda ne donne
 * ni horaire fiable ni lieu exploitable — les publier à l'aveugle fabriquerait
 * des fiches fausses. Il écrit `mairie-agenda.txt`, que Le Policier et
 * l'auto-complétion savent lire, et laisse la création aux scripts qui
 * vérifient lieu + date + heure.
 *
 *   node scripts/mairie-agenda.mjs
 */
import { writeFileSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const SORTIE = new URL("../mairie-agenda.txt", import.meta.url);
const MOIS = { JANV: 0, "FÉVR": 1, FEVR: 1, MARS: 2, AVR: 3, MAI: 4, JUIN: 5, JUIL: 6, AOÛT: 7, AOUT: 7, SEPT: 8, OCT: 9, NOV: 10, "DÉC": 11, DEC: 11 };

const plat = s => (s || "").normalize("NFD").replace(/\p{M}/gu, "")
  .toUpperCase().replace(/[^A-Z0-9]/g, "");

async function lireAgenda() {
  const nav = await chromium.launch();
  try {
    const page = await (await nav.newContext({ userAgent: "Mozilla/5.0 (MonacOut)", locale: "fr-FR" })).newPage();
    await page.goto("https://www.mairie.mc/agenda/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(3000);
    // La liste s'allonge au défilement : on descend jusqu'à ce qu'elle ne bouge plus.
    let precedent = 0;
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
      const n = await page.evaluate(() => document.body.innerText.length);
      if (n === precedent) break;
      precedent = n;
    }
    return await page.evaluate(() => document.body.innerText);
  } finally {
    await nav.close();
  }
}

/** « 31 \n OCT. \n 2026 \n TITRE », avec une date de fin facultative. */
function evenements(texte) {
  const rx = /(\d{1,2})\n([A-ZÉÛÀ]{3,5})\.? (\d{4})\n(?:(\d{1,2})\n([A-ZÉÛÀ]{3,5})\.? (\d{4})\n)?([^\n]{4,90})/g;
  const vus = new Map();
  for (const m of texte.matchAll(rx)) {
    const mois = MOIS[m[2].replace(".", "")];
    if (mois === undefined) continue;
    const debut = new Date(+m[3], mois, +m[1]);
    const moisFin = m[5] ? MOIS[m[5].replace(".", "")] : undefined;
    const fin = moisFin === undefined ? debut : new Date(+m[6], moisFin, +m[4]);
    const titre = m[7].trim();
    const cle = `${debut.toISOString().slice(0, 10)}|${plat(titre)}`;
    if (!vus.has(cle)) vus.set(cle, { debut, fin, titre });
  }
  return [...vus.values()].sort((a, b) => a.debut - b.debut);
}

let texte;
try {
  texte = await lireAgenda();
} catch (e) {
  // Le réseau ou la mise en page : on ne fait pas échouer la nuit pour ça.
  console.log(`⚠️  mairie.mc illisible (${e.message.split("\n")[0]}) — contrôle non concluant.`);
  process.exit(0);
}

const officiel = evenements(texte);
if (!officiel.length) {
  console.log("⚠️  Aucun événement lu sur mairie.mc — la mise en page a peut-être changé.");
  writeFileSync(SORTIE, `AGENDA MAIRIE — ${new Date().toISOString().slice(0, 10)}\nAucun événement lu (mise en page changée ?).\n`);
  process.exit(0);
}

const evs = (j => j.events || j)(JSON.parse(readFileSync(new URL("../public/events.json", import.meta.url))));
const titres = evs.map(e => plat(e.title));

// Un titre d'agenda est rarement écrit comme le nôtre : on rapproche sur les mots
// porteurs, pas sur la chaîne entière. « HALLOWEEN AU JARDIN EXOTIQUE » doit
// retrouver notre « HALLOWEEN À LA GROTTE DU JARDIN EXOTIQUE ».
const MOTS_VIDES = new Set(["LE", "LA", "LES", "DE", "DES", "DU", "AU", "AUX", "ET", "EN", "UN", "UNE", "A", "POUR", "SUR"]);
const motsPorteurs = t => (t || "").normalize("NFD").replace(/\p{M}/gu, "").toUpperCase()
  .split(/[^A-Z0-9]+/).filter(x => x.length > 2 && !MOTS_VIDES.has(x));

const manquants = [];
for (const o of officiel) {
  const mots = motsPorteurs(o.titre);
  if (!mots.length) continue;
  const trouve = titres.some(t => {
    const n = mots.filter(x => t.includes(x)).length;
    return n >= Math.max(2, Math.ceil(mots.length * 0.6));
  });
  if (!trouve) manquants.push(o);
}

const jour = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const lignes = [
  `AGENDA MAIRIE — ${new Date().toISOString().slice(0, 10)}`,
  `${officiel.length} entrées lues · ${officiel.length - manquants.length} déjà dans l'app · ${manquants.length} à regarder`,
  "",
];
if (manquants.length) {
  lignes.push("■ PAS TROUVÉ DANS L'APP — à vérifier puis ajouter à la main");
  lignes.push("  (le rapprochement se fait sur les mots du titre : un libellé très");
  lignes.push("   différent peut sortir ici alors que la fiche existe)");
  for (const o of manquants) {
    const periode = o.debut.getTime() === o.fin.getTime() ? jour(o.debut) : `${jour(o.debut)} → ${jour(o.fin)}`;
    lignes.push(`   ? ${periode} · ${o.titre}`);
  }
} else {
  lignes.push("■ Rien ne manque : tout l'agenda de la Mairie est déjà dans l'app.");
}
lignes.push("", "■ TOUT CE QUI EST LU", ...officiel.map(o => `   · ${jour(o.debut)} · ${o.titre}`));

const rapport = lignes.join("\n") + "\n";
writeFileSync(SORTIE, rapport);
console.log(rapport);
