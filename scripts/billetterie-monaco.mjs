#!/usr/bin/env node
/**
 * « Réserver une place » pour les salles de Monaco.
 *
 * Stéphanie, 26 oct 2026 : « les théâtres et opéra ..? » puis « fais tout ».
 *
 * montecarloticket.com est la billetterie COMMUNE de six institutions :
 * Ballets de Monte-Carlo, Opéra de Monte-Carlo, Grimaldi Forum, Orchestre
 * Philharmonique de Monte-Carlo, Printemps des Arts, Théâtre Princesse Grace.
 * Une seule intégration couvre donc toute la scène monégasque.
 *
 * ✅ CE QUI REND LA CHOSE POSSIBLE. La page d'un spectacle s'ouvre avec le seul
 * EventId : `fChoixSeanceWidget.aspx?idstructure=0526&EventId=N`. Le jeton
 * `request=...` qu'on voit dans leurs liens n'est PAS nécessaire (vérifié le
 * 26 oct : 84 Ko de page utile sans lui). Le lien ne périme donc pas. Et la
 * page accepte d'être affichée dans l'app — ni X-Frame-Options ni
 * frame-ancestors, contrairement à grimaldiforum.com qui refuse (SAMEORIGIN).
 *
 * 🚨 LE PIÈGE, ET LA RAISON DU GARDE-FOU. Rapprocher nos fiches de leurs
 * spectacles PAR LE TITRE SEUL fabrique de faux liens : « CONCERT FAMILLE HARRY
 * POTTER EN MUSIQUE » se collait sur « HARRY POTTER ET LA SORCELLERIE ». Un
 * lien qui vend le MAUVAIS billet est pire que pas de lien — la personne paie,
 * se déplace, et c'est l'app qu'elle accuse. LA DATE EST DONC OBLIGATOIRE :
 * sans concordance de date, aucun lien. Sur l'essai du 26 oct, cela donnait
 * 50 rattachements sûrs et 27 refus, et les refus étaient les cas douteux.
 *
 * ⚠️ ET ON NE REDATE JAMAIS RIEN. Plusieurs refus sont décalés d'un jour, ce qui
 * ressemble au défaut de fuseau horaire corrigé en octobre. Mais leur page de
 * liste n'annonce qu'UNE séance par spectacle, et le Théâtre Princesse Grace
 * joue lundi ET mardi : le décalage est probablement chez eux, pas chez nous.
 * Ce script ne touche à aucune date. Il signale, il n'écrit que des liens.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FICHIER = join(__dirname, "../src/data/events.js");
const LISTE = "https://montecarloticket.com/0526/fListeManifs.aspx?idstructure=0526";
const WIDGET = id => `https://montecarloticket.com/0526/fChoixSeanceWidget.aspx?idstructure=0526&EventId=${id}`;
const MARQUE = "montecarloticket.com";
const PLAFOND = 300;   // au-delà, quelque chose a mal tourné : on s'arrête

const UA = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" };

const deco = t => t
  .replace(/&eacute;/g, "é").replace(/&egrave;/g, "è").replace(/&agrave;/g, "à")
  .replace(/&ccedil;/g, "ç").replace(/&ocirc;/g, "ô").replace(/&ecirc;/g, "ê")
  .replace(/&icirc;/g, "î").replace(/&ugrave;/g, "ù").replace(/&ucirc;/g, "û")
  .replace(/&rsquo;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
  .replace(/&quot;/g, '"');

const plat = t => (t || "").replace(/\\n/g, " ").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

// ⚠️ Les mots CREUX doivent partir, sinon « CONCERT » suffit à marier deux
// spectacles sans rapport — même famille d'erreur que le détecteur de doublons
// qui mariait le Royal Charity Gala et l'Amazónico par « MONTE » et « CARLO ».
const CREUX = new Set(("le la les de du des et a au aux en un une pour par sur avec "
  + "monte carlo monaco grimaldi forum auditorium rainier iii salle garnier opera "
  + "theatre concert spectacle recital piano famille musique gala soiree").split(" "));
const mots = t => new Set(plat(t).split(" ").filter(w => w.length > 2 && !CREUX.has(w)));

// ⚠️ LES CLÉS SONT SANS ACCENT, ET LA LECTURE AUSSI. Premier essai raté :
// le motif `\w{3,5}` ne reconnaît PAS le « é » de « déc. » ni le « û » de
// « août » — en JavaScript `\w` c'est [A-Za-z0-9_]. 19 spectacles sur 80 étaient
// donc écartés en silence, alors que leur date était bien écrite sur la page.
// On déplie les accents avant de chercher le mois.
const MOIS_EUX = { jan:0, fev:1, mar:2, avr:3, mai:4, jui:5, juil:6, aou:7, sep:8, oct:9, nov:10, dec:11 };
const sansAccent = t => (t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const MOIS_NOUS = { jan:0, "fév":1, mar:2, avr:3, mai:4, juin:5, juil:6, "août":7, sep:8, oct:9, nov:10, "déc":11 };

const iso = (j, mo, an) => `${an}-${String(mo + 1).padStart(2, "0")}-${String(j).padStart(2, "0")}`;

// ── 1. Leur catalogue ────────────────────────────────────────────────────────
async function catalogue() {
  const html = await (await fetch(LISTE, { headers: UA, signal: AbortSignal.timeout(40000) })).text();
  const out = [];
  for (const b of html.split(/<tr type="eventtr"/).slice(1)) {
    const bloc = b.split("</tr>")[0];
    const id = (bloc.match(/eventid="(\d+)"/) || [])[1];
    if (!id || id === "0") continue;
    const lignes = deco(bloc).replace(/<[^>]+>/g, "\n").split("\n")
      .map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
    const titre = lignes.find(x => x.length > 4 && x.length < 90
      && !/eventid=/.test(x) && !/^(le|du|au)$/i.test(x) && !/^\w{3}\./.test(x));
    // « mer. 28 oct. 2026 - 19:30 » — on garde TOUTES les dates du bloc
    const dates = new Set();
    for (const x of lignes) {
      // « mar. 01 déc. 2026 - 18:30 » — le jour de semaine, le numéro, le mois.
      const m = sansAccent(x).match(/^[a-z]{3}\.\s+(\d{1,2})\s+([a-z]{3,5})\.?\s+(\d{4})/);
      if (!m) continue;
      // « juin » et « juil » commencent pareil : on essaie 4 lettres d'abord.
      const mo = MOIS_EUX[m[2].slice(0, 4)] ?? MOIS_EUX[m[2].slice(0, 3)];
      if (mo !== undefined) dates.add(iso(+m[1], mo, m[3]));
    }
    if (titre && dates.size) out.push({ id, titre, dates, m: mots(titre) });
  }
  return out;
}

// ── 2. Nos fiches ────────────────────────────────────────────────────────────
const CIBLES = /OPÉRA|CONCERT|DANSE|MUSICAL|THÉÂTRE|SPECTACLE|FESTIVAL/;

function isoDeLigne(ligne) {
  const d = (ligne.match(/date:"([^"]*)"/) || [])[1] || "";
  const m = d.match(/(\d{1,2})\s+(\S+)/);
  if (!m) return null;
  const mo = MOIS_NOUS[m[2]];
  if (mo === undefined) return null;
  const an = (ligne.match(/year:(\d{4})/) || [])[1] || String(new Date().getFullYear());
  return iso(+m[1], mo, an);
}

// ── 3. Le travail ────────────────────────────────────────────────────────────
const spectacles = await catalogue();
console.log(`🎟️  Billetterie : ${spectacles.length} spectacle(s) avec titre ET date.`);
if (!spectacles.length) {
  console.log("   Catalogue vide ou illisible — on ne touche à rien.");
  process.exit(0);
}

let s = readFileSync(FICHIER, "utf8");
const lignes = s.split("\n");

// Rejouable : on retire d'abord NOS liens, puis on les réécrit. Sans ça, un
// spectacle déplacé garderait l'ancien lien pour toujours.
let retires = 0;
for (let i = 0; i < lignes.length; i++) {
  if (lignes[i].includes(MARQUE)) {
    lignes[i] = lignes[i].replace(new RegExp(`,resa:"[^"]*${MARQUE}[^"]*"`, "g"), "");
    retires++;
  }
}

let poses = 0, refuses = 0;
const exemples = [], rejets = [];
for (let i = 0; i < lignes.length; i++) {
  const l = lignes[i];
  if (!/^\s*\{id:\d+,/.test(l)) continue;
  if (/,resa:"/.test(l)) continue;                 // déjà pourvue par ailleurs
  if (/directory:\[/.test(l)) continue;            // une fiche à annuaire passe par ses lieux
  const cat = (l.match(/cat:"([^"]*)"/) || [])[1] || "";
  if (!CIBLES.test(cat)) continue;
  const d = isoDeLigne(l);
  if (!d) continue;
  const titre = (l.match(/title:"([^"]*)"/) || [])[1] || "";
  const me = mots(titre);
  if (!me.size) continue;

  let best = null, bs = 0;
  for (const sp of spectacles) {
    const inter = [...me].filter(w => sp.m.has(w)).length;
    const score = inter / Math.max(1, Math.min(me.size, sp.m.size));
    if (inter >= 1 && score > bs) { bs = score; best = sp; }
  }
  if (!best || bs < 0.6) continue;

  // 🚨 LA DATE TRANCHE. Sans elle, pas de lien.
  if (!best.dates.has(d)) {
    refuses++;
    if (rejets.length < 8) rejets.push(`      ${d} « ${titre.replace(/\\n/g, " ").slice(0, 38)} » ≠ « ${best.titre.slice(0, 32)} » (${[...best.dates].join(", ")})`);
    continue;
  }
  lignes[i] = l.replace(/(\{id:\d+,)/, `$1`).replace(/\}(,?)$/, `,resa:"${WIDGET(best.id)}"}$1`);
  poses++;
  if (exemples.length < 8) exemples.push(`      ${d} « ${titre.replace(/\\n/g, " ").slice(0, 40)} » → ${best.id} « ${best.titre.slice(0, 30)} »`);
  if (poses >= PLAFOND) { console.log(`   ⚠️  Plafond de ${PLAFOND} atteint — on s'arrête là.`); break; }
}

// ⚠️ UN SCRIPT QUI RETIRE SANS POUVOIR RECONSTRUIRE NE DOIT PAS ÉCRIRE.
if (retires > 0 && poses === 0) {
  console.error(`   ❌ ${retires} lien(s) retiré(s) et AUCUN réécrit — on n'enregistre pas.`);
  process.exit(1);
}

writeFileSync(FICHIER, lignes.join("\n"));
console.log(`   ✓ ${poses} lien(s) de réservation posé(s)${retires ? ` (${retires} ligne(s) nettoyée(s) d'abord)` : ""}.`);
if (exemples.length) console.log(exemples.join("\n"));
if (refuses) {
  console.log(`   ⚠️  ${refuses} rattachement(s) REFUSÉ(S) faute de date concordante — autant de faux liens évités :`);
  console.log(rejets.join("\n"));
  console.log("      (on ne redate rien : leur page de liste n'annonce qu'une séance par spectacle)");
}
