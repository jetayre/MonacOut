/**
 * LE CALENDRIER DE L'AS MONACO, LU À LA SOURCE.
 *
 * Stéphanie, 31 oct 2026 : « il manque le sport » puis « et basket et foot et
 * autre ? ». Les 15 fiches FOOTBALL n'avaient jamais été confrontées au
 * calendrier officiel du club. Ce script le fait, tous les jours.
 *
 * Source : https://www.asmonaco.com/fr/pros/calendrier
 * Elle est rendue CÔTÉ SERVEUR : un simple fetch suffit, pas besoin de
 * navigateur (contrairement au basket, dont la page de calendrier est vide
 * même ouverte dans Chromium — voir le rapport du 31 oct).
 *
 * 🚨 CE SCRIPT NE REDATE RIEN, IL SIGNALE. C'est la règle posée le 10 octobre
 * après que l'autofix eut envoyé « Pâques sanglantes » au mois d'avril : une
 * date réécrite en silence est invisible, et une correction manuelle se fait
 * écraser au passage suivant.
 *
 * 🚨 ET IL DISTINGUE LE CONFIRMÉ DU PROVISOIRE. Le club écrit lui-même « Date
 * et horaire non définitifs » sur la plupart des journées de Ligue 1 : les
 * heures affichées (22:00 pour un match de championnat…) sont des bouchons,
 * pas des horaires. Aligner nos fiches dessus remplacerait une valeur
 * plausible par un bouchon. Ces écarts-là sont donc signalés SANS faire
 * échouer le contrôle ; seuls les écarts sur une rencontre CONFIRMÉE sont
 * bloquants.
 *
 *   node scripts/asm-foot.mjs           → rapport
 *   node scripts/asm-foot.mjs --strict  → sort en erreur si écart confirmé
 */
import { readFileSync } from "node:fs";

const URL_CAL = "https://www.asmonaco.com/fr/pros/calendrier";
const STRICT = process.argv.includes("--strict");

const MOIS_LONGS = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split(" ");
const MOIS_COURTS = "jan fév mar avr mai juin juil août sep oct nov déc".split(" ");

// ⚠️ LES LIGATURES NE TOMBENT PAS AVEC LES ACCENTS. `normalize("NFD")` sépare
//    é en e + accent, mais æ et ø ne sont pas des lettres accentuées : ils
//    restent entiers puis disparaissent au filtre [^A-Z0-9]. « Nordsjælland »
//    devenait NORDSJLLAND et ne retrouvait plus notre « NORDSJAELLAND ». On les
//    translittère donc à la main, avant tout le reste.
const LIGATURES = { "æ": "ae", "Æ": "AE", "œ": "oe", "Œ": "OE", "ø": "o", "Ø": "O", "ß": "ss", "ł": "l", "Ł": "L" };
const plat = s => (s || "").replace(/[æÆœŒøØßłŁ]/g, c => LIGATURES[c])
  .normalize("NFD").replace(/\p{M}/gu, "")
  .toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Le texte visible de la page, espaces normalisés. */
function texteVisible(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"').replace(/&eacute;/g, "é").replace(/&egrave;/g, "è")
    .replace(/\s+/g, " ");
}

/** Les rencontres À DOMICILE du calendrier officiel. */
function rencontresDomicile(texte) {
  const debut = texte.search(/(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4}/);
  const s = debut > 0 ? texte.slice(debut) : texte;
  const coupe = new RegExp(`(?=(?:lun|mar|mer|jeu|ven|sam|dim)\\.? \\d{2} (?:${MOIS_LONGS.join("|")}) \\d{4})`);
  const out = [];
  for (const bloc of s.split(coupe)) {
    const d = bloc.match(new RegExp(`^(?:lun|mar|mer|jeu|ven|sam|dim)\\.? (\\d{2}) (${MOIS_LONGS.join("|")}) (\\d{4})`));
    if (!d) continue;
    const lieu = (bloc.match(/(Stade [A-Za-zÀ-ÿ'\- ]+?|Parc [A-Za-zÀ-ÿ'\- ]+?)\s*(?:Date|\d{2}:\d{2})/) || [])[1] || "";
    if (!/Louis-?II/i.test(lieu)) continue;   // on ne garde que Monaco
    const equipes = [...bloc.matchAll(/([A-ZÀ-Ÿ][A-Za-zÀ-ÿ0-9'.\- ]{2,34}?)\s*\.\.\./g)].map(m => m[1].trim());
    out.push({
      date: `${d[3]}-${String(MOIS_LONGS.indexOf(d[2]) + 1).padStart(2, "0")}-${d[1]}`,
      heure: (bloc.match(/(\d{2}:\d{2})/) || [])[1] || null,
      competition: (bloc.match(/(Ligue 1[^-]*- Journée \d+|UEFA Conference League - Journée \d+)/) || [])[1] || "",
      adversaire: equipes[1] || equipes[0] || "",
      provisoire: /Date et horaire non définitifs/.test(bloc),
    });
  }
  return out;
}

/** La date ISO d'une fiche Monac'Out (« Sam 21 nov » + `year`). */
function isoDeLaFiche(e) {
  const p = String(e.date || "").split(" ");
  const m = MOIS_COURTS.indexOf(p[2]);
  if (m < 0) return null;
  // Sans `year`, la saison court d'octobre à juillet : avant octobre, c'est l'an suivant.
  const an = e.year || (m >= 9 ? 2026 : 2027);
  return `${an}-${String(m + 1).padStart(2, "0")}-${String(p[1]).padStart(2, "0")}`;
}

const reponse = await fetch(URL_CAL, { headers: { "User-Agent": "Mozilla/5.0 (MonacOut)" } });
if (!reponse.ok) {
  console.log(`⚠️  asmonaco.com répond ${reponse.status} — contrôle non concluant, pas d'alerte.`);
  process.exit(0);
}
const officiel = rencontresDomicile(texteVisible(await reponse.text()));
if (!officiel.length) {
  console.log("⚠️  Aucune rencontre lue sur la page officielle — la mise en page a peut-être changé.");
  process.exit(STRICT ? 1 : 0);
}

const evs = (j => j.events || j)(JSON.parse(readFileSync(new URL("../public/events.json", import.meta.url))));
const nos = evs.filter(e => String(e.cat || "").toUpperCase() === "FOOTBALL");

console.log(`⚽  AS MONACO — ${officiel.length} rencontres à domicile au calendrier officiel\n`);
const dur = [], mou = [], absents = [];
const vus = new Set();

for (const o of officiel) {
  const cle = plat(o.adversaire);
  const fiche = nos.find(e => cle && (plat(e.title).includes(cle) || cle.includes(plat(e.title).replace(/^LIGUE1ASMONACO|^UEFACONFERENCELEAGUEASMONACO/, ""))));
  if (!fiche) { absents.push(o); continue; }
  vus.add(fiche.id);
  const notre = isoDeLaFiche(fiche);
  const h = String(fiche.time || "").split("—")[0].trim().replace("h", ":").slice(0, 5);
  if (notre === o.date && h === o.heure) continue;
  (o.provisoire ? mou : dur).push({ o, fiche, notre, h });
}

const ligne = x => `   ${x.o.adversaire.padEnd(24)} officiel ${x.o.date} ${x.o.heure}   ·   nous ${x.notre} ${x.h}   (id ${x.fiche.id})`;

if (dur.length) {
  console.log(`❌ ${dur.length} écart(s) sur une rencontre CONFIRMÉE :`);
  dur.forEach(x => console.log(ligne(x)));
  console.log();
}
if (mou.length) {
  console.log(`⚠️  ${mou.length} écart(s) sur une rencontre que le club annonce « date et horaire non définitifs ».`);
  console.log("   Son heure affichée est un bouchon : on NE s'aligne PAS dessus, on surveille.");
  mou.forEach(x => console.log(ligne(x)));
  console.log();
}
if (absents.length) {
  const durs = absents.filter(o => !o.provisoire);
  console.log(`${durs.length ? "❌" : "⚠️ "} ${absents.length} rencontre(s) à domicile sans fiche chez nous :`);
  absents.forEach(o => console.log(`   ${o.date} ${o.heure}  ${o.adversaire} — ${o.competition}${o.provisoire ? "  (provisoire)" : ""}`));
  console.log();
}
const orphelines = nos.filter(e => !vus.has(e.id));
if (orphelines.length) {
  console.log(`⚠️  ${orphelines.length} fiche(s) FOOTBALL sans correspondance au calendrier officiel :`);
  orphelines.forEach(e => console.log(`   ${e.id}  ${e.date}  ${(e.title || "").replace(/\n/g, " ")}`));
  console.log();
}
if (!dur.length && !absents.filter(o => !o.provisoire).length) {
  console.log("✅ Aucun écart sur une rencontre confirmée.");
}
if (STRICT && (dur.length || absents.filter(o => !o.provisoire).length)) process.exit(1);
