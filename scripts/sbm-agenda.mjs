/**
 * L'AGENDA DE LA SOCIÉTÉ DES BAINS DE MER, RELU CHAQUE NUIT.
 *
 * Stéphanie, 31 oct 2026 : « base-toi sur PrinciPocket et vérifie aussi les
 * concerts du site SBM ».
 *
 * La SBM tient le Casino, l'Hôtel de Paris, l'Hermitage, le Monte-Carlo Bay,
 * le Jimmy'z, le Twiga, le Blue Gin, Em Sherif, le Coya, le Marlow… Une bonne
 * part des soirées de Monaco. Deux pages étaient déjà relues chaque nuit
 * (`bar-americain.mjs`, `em-sherif.mjs`) ; l'agenda général, lui, ne l'était
 * par personne.
 *
 * ⚠️ TROIS PIÈGES, TOUS RENCONTRÉS LE 31 OCT :
 *
 *  1. **Le bandeau de consentement masque la page entière.** Sans clic sur
 *     « Accepter », un navigateur ne lit QUE le bandeau : 45 lignes de cases
 *     à cocher et pas un événement. C'est le genre de panne qui se déguise en
 *     « il n'y a rien à l'agenda ».
 *  2. **La page s'ouvre sur les événements TERMINÉS.** Chaque entrée porte la
 *     mention « TERMINÉ » ; les reprendre remplirait l'app de soirées passées.
 *     On les écarte sur cette mention ET sur la date de fin.
 *  3. **Un fetch simple ne suffit pas** : le contenu arrive en JavaScript.
 *
 * 🚨 CE SCRIPT SIGNALE, IL N'AJOUTE PAS. L'agenda SBM donne une période et une
 * adresse, rarement un horaire exploitable (« Tous les mercredis à partir
 * du… »). Fabriquer des fiches là-dessus produirait de fausses heures — et une
 * heure fausse est invisible, seule la source la trahit. Le rapport part dans
 * `sbm-agenda.txt`.
 *
 *   node scripts/sbm-agenda.mjs
 */
import { writeFileSync, readFileSync } from "node:fs";
import { chromium } from "playwright";

const SORTIE = new URL("../sbm-agenda.txt", import.meta.url);
const PAGE = "https://www.montecarlosbm.com/fr/agenda";

const plat = s => (s || "").normalize("NFD").replace(/\p{M}/gu, "")
  .toUpperCase().replace(/[^A-Z0-9]/g, "");

const MOTS_VIDES = new Set(["LES", "LES", "DES", "DUS", "AUX", "UNE", "POUR", "AVEC", "DANS", "PAR", "SUR", "SON", "SES", "AU", "LA", "LE", "DU", "DE", "ET", "EN"]);
const motsPorteurs = t => (t || "").normalize("NFD").replace(/\p{M}/gu, "").toUpperCase()
  .split(/[^A-Z0-9]+/).filter(x => x.length > 2 && !MOTS_VIDES.has(x));

async function lire() {
  const nav = await chromium.launch();
  try {
    const page = await (await nav.newContext({ userAgent: "Mozilla/5.0 (MonacOut)", locale: "fr-FR" })).newPage();
    await page.goto(PAGE, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    // 🍪 Sans ce clic, on ne lit que le bandeau de consentement.
    for (const sel of ['button:has-text("Accepter tout")', 'button:has-text("Tout accepter")',
                       "#didomi-notice-agree-button", 'button:has-text("Accepter")']) {
      try { const b = await page.$(sel); if (b) { await b.click({ timeout: 3000 }); break; } } catch { /* bandeau absent */ }
    }
    await page.waitForTimeout(2500);
    // « VOIR PLUS » charge la suite ; on insiste tant qu'il répond.
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollBy(0, 2000));
      await page.waitForTimeout(700);
      const b = await page.$('button:has-text("VOIR PLUS"), a:has-text("VOIR PLUS")');
      if (!b) break;
      try { await b.click({ timeout: 3000 }); await page.waitForTimeout(1500); } catch { break; }
    }
    return await page.evaluate(() => document.body.innerText);
  } finally {
    await nav.close();
  }
}

/** « DU 05/11/2026 AU 08/11/2026 \n Titre \n … \n ADRESSE \n [TERMINÉ] » */
function evenements(texte) {
  const rx = /DU (\d{2})\/(\d{2})\/(\d{4}) AU (\d{2})\/(\d{2})\/(\d{4})\n+([^\n]{3,110})\n([\s\S]{0,700}?)(?=\nDU \d{2}\/|$)/g;
  const out = [];
  const vus = new Set();
  for (const m of texte.matchAll(rx)) {
    const debut = new Date(+m[3], +m[2] - 1, +m[1]);
    const fin = new Date(+m[6], +m[5] - 1, +m[4]);
    const titre = m[7].trim();
    const corps = m[8] || "";
    const cle = plat(titre) + debut.getTime();
    if (vus.has(cle)) continue;
    vus.add(cle);
    out.push({ debut, fin, titre, termine: /\bTERMIN[ÉE]\b/i.test(corps) });
  }
  return out;
}

let texte;
try {
  texte = await lire();
} catch (e) {
  console.log(`⚠️  montecarlosbm.com illisible (${e.message.split("\n")[0]}) — contrôle non concluant.`);
  process.exit(0);
}

const tous = evenements(texte);
const aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
// Terminé selon le site OU selon la date : les deux, car la mention manque parfois.
const aVenir = tous.filter(o => !o.termine && o.fin >= aujourdhui);

if (!tous.length) {
  console.log("⚠️  Aucun événement lu sur l'agenda SBM — bandeau de cookies ou mise en page changée ?");
  writeFileSync(SORTIE, `AGENDA SBM — ${new Date().toISOString().slice(0, 10)}\nAucun événement lu.\n`);
  process.exit(0);
}

const evs = (j => j.events || j)(JSON.parse(readFileSync(new URL("../public/events.json", import.meta.url))));

// 🚨 IL FAUT CHERCHER DANS LES SOUS-FICHES, PAS SEULEMENT DANS LES MÈRES.
// Premier passage : le brunch du Marlow et celui du Pavyllon étaient donnés
// « manquants » alors qu'ils sont dans l'app depuis des mois — comme entrées
// de l'annuaire « BRUNCHS · n ADRESSES », cité par 53 et 26 fiches. Une
// recherche qui ne regarde que `title` et `subtitle` ne les voit jamais.
// C'est la règle du 24 octobre : compter sur `directory[]`, jamais sur la mère.
const titres = evs.flatMap(e => [
  plat(e.title) + plat(e.subtitle),
  ...(e.directory || []).map(d => plat(d.name) + plat(d.adr)),
]);

const manquants = [];
for (const o of aVenir) {
  const mots = motsPorteurs(o.titre);
  if (!mots.length) continue;
  const trouve = titres.some(t => {
    const n = mots.filter(x => t.includes(x)).length;
    return n >= Math.max(2, Math.ceil(mots.length * 0.6));
  });
  if (!trouve) manquants.push(o);
}

const jour = d => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const periode = o => o.debut.getTime() === o.fin.getTime() ? jour(o.debut) : `${jour(o.debut)} → ${jour(o.fin)}`;

const lignes = [
  `AGENDA SBM — ${new Date().toISOString().slice(0, 10)}`,
  `${tous.length} entrées lues · ${tous.length - aVenir.length} terminées · ${aVenir.length} à venir · ${manquants.length} à regarder`,
  "",
];
if (manquants.length) {
  lignes.push("■ À VENIR ET PAS TROUVÉ DANS L'APP");
  lignes.push("  (rapprochement sur les mots du titre : un libellé très différent");
  lignes.push("   peut sortir ici alors que la fiche existe)");
  lignes.push("  ⚠️ L'agenda SBM donne une PÉRIODE, rarement un horaire exploitable.");
  lignes.push("     Vérifier l'heure sur la page du lieu avant de créer une fiche.");
  manquants.forEach(o => lignes.push(`   ? ${periode(o)} · ${o.titre}`));
} else {
  lignes.push("■ Rien ne manque : tout l'agenda SBM à venir est déjà dans l'app.");
}
lignes.push("", "■ TOUT CE QUI EST À VENIR", ...aVenir.map(o => `   · ${periode(o)} · ${o.titre}`));

const rapport = lignes.join("\n") + "\n";
writeFileSync(SORTIE, rapport);
console.log(rapport);
