#!/usr/bin/env node
/**
 * MonacOut — ADRESSE ET PRÉSENTATION DANS CHAQUE SOUS-FICHE
 *
 * Stéphanie, 11 octobre 2026 : « rajoute adresse et phrase dans chaque fiche
 * apéro et brunch etc. ». Depuis que « Infos » déplie l'annuaire, chaque
 * terrasse a sa propre fiche dans le fil : elle doit suffire à savoir où aller
 * et ce qu'on y trouve.
 *
 * Ce script ajoute `adr` et `desc` aux entrées `directory:[…]` de events.js.
 *  - l'ADRESSE vient du tableau des sources de CLAUDE.md (règle de la maison :
 *    une seule liste de référence, celle que le Policier surveille) ;
 *  - la PRÉSENTATION vient de presentations-lieux.json, produit par
 *    scripts/presentations-lieux.mjs qui lit le site de chaque lieu.
 *
 * 🚨 TOUT N'EST PAS PUBLIABLE, ET C'EST LE CŒUR DE CE SCRIPT.
 * Le premier passage automatique a rapporté, pour des lieux bien réels, le
 * bandeau « Join My Monte-Carlo for free » du Café de Paris, un AVIS CLIENT pour
 * le Bistro Coe (« Suite à mon passage sur Monaco, je me suis arrêté… ») et une
 * suite de mots-clés pour La Rose des Vents. Des textes vrais quelque part, faux
 * ici. On ne publie donc QUE ce qui franchit le filtre ci-dessous, et un lieu
 * sans présentation reste sans présentation — c'est la règle « un événement
 * manquant vaut mieux qu'un faux », appliquée aux mots.
 *
 *   node scripts/enrichir-annuaires.mjs           # écrit
 *   node scripts/enrichir-annuaires.mjs --essai   # montre, n'écrit rien
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { lieuxDepuisSources } from "./venues-from-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RACINE = join(__dirname, "..");
const EVENTS = join(RACINE, "src/data/events.js");
const PRESENTATIONS = join(RACINE, "presentations-lieux.json");
const ESSAI = process.argv.includes("--essai");

// ── Ce qui disqualifie une présentation ─────────────────────────────────────
const MAUVAIS = [
  // Un avis de client n'est pas une présentation : il parle à la 1ʳᵉ personne
  // du singulier et raconte une visite.
  { quoi: "avis de client", test: t => /\b(je me suis|mon passage|j'ai (mangé|pris|testé|adoré)|my favourite|nous avons (mangé|passé))\b/i.test(t) },
  // Un appel à l'action, un formulaire, un programme de fidélité.
  { quoi: "bandeau promotionnel", test: t => /\b(book online|réserve[rz]|inscrivez|join my|sign up|earn points|benefit from exclusive|delivery service|click & collect)\b/i.test(t) },
  // Une suite de mots-clés séparés par des tirets : du référencement, pas une phrase.
  { quoi: "mots-clés de référencement", test: t => (t.match(/-/g) || []).length >= 4 && !/[.!?]/.test(t.slice(0, 120)) },
  // Un texte qui ne parle pas d'un lieu mais de l'agenda d'un groupe.
  { quoi: "texte générique de groupe", test: t => /\b(discover the calendar|programme of events|agenda of|société des bains de mer offers)\b/i.test(t) },
  // Des restes techniques.
  { quoi: "texte technique", test: t => /\b(storage or technical access|browsing experience|personalized ads|string\(\d+\))/i.test(t) },
];

function presentationValable(nom, texte) {
  if (!texte) return null;
  const t = texte.replace(/\s+/g, " ").trim();
  if (t.length < 60 || t.length > 300) return { refus: `longueur ${t.length}` };
  for (const m of MAUVAIS) if (m.test(t)) return { refus: m.quoi };
  // Elle doit nommer le lieu, ou au moins dire de quoi il s'agit.
  const mots = nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/).filter(m => m.length >= 4);
  const q = t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const nomme = mots.some(m => q.includes(m));
  const decrit = /\b(restaurant|bar|caf[ée]|terrasse|brunch|cuisine|plage|spa|jus|matcha|bowls?|cantine|brasserie|salon|boutique|hôtel|club)\b/i.test(t);
  if (!nomme && !decrit) return { refus: "ne parle ni du lieu ni de ce qu'on y fait" };
  return { texte: t };
}

// ── L'adresse, extraite de la description du tableau des sources ────────────
// Les descriptions y écrivent l'adresse au format « 4 Quai Antoine Ier · La
// Condamine » ou « 2 av. de Monte-Carlo ».
function adresseDe(desc) {
  if (!desc) return null;
  const m = desc.match(/\b(\d{1,3}(?:\s?bis|\s?ter)?[,]?\s+(?:rue|av\.|avenue|bd|boulevard|quai|place|pl\.|allée|chemin|promenade|esplanade|impasse|route)\b[^·|.;]{3,60})/i);
  if (!m) return null;
  return m[1].replace(/\s+/g, " ").replace(/[,\s]+$/, "").trim();
}

const { lieux } = lieuxDepuisSources(join(RACINE, "CLAUDE.md"));
const presentations = existsSync(PRESENTATIONS)
  ? JSON.parse(readFileSync(PRESENTATIONS, "utf8")) : {};

// Table nom-aplati → { adr, desc }
const plat = t => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

const table = new Map();
for (const l of lieux) {
  const adr = adresseDe(l.desc || l.description || l.cat || "");
  const p = presentationValable(l.name, presentations[l.name]?.texte);
  if (adr || p?.texte) table.set(plat(l.name), { adr, desc: p?.texte || null, nom: l.name });
}

// Un nom d'annuaire (« Marlow ») ne correspond pas toujours au nom du tableau
// (« The Marlow Monaco ») : on accepte l'inclusion dans un sens ou dans l'autre.
function trouver(nom) {
  const q = plat(nom);
  if (!q) return null;
  if (table.has(q)) return table.get(q);
  for (const [k, v] of table) {
    if (k.length >= 5 && (k.includes(q) || q.includes(k))) return v;
  }
  return null;
}

// ── Réécriture des annuaires dans events.js ─────────────────────────────────
let src = readFileSync(EVENTS, "utf8");
const echapper = t => t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

let touches = 0, avecAdr = 0, avecDesc = 0;
const inconnus = new Set();

src = src.replace(/\{name:"((?:[^"\\]|\\.)*)"((?:,(?:vid|info|tel|link|map|adr|desc|duree|genre|rt):(?:"(?:[^"\\]|\\.)*"|\d+|true|false))*)\}/g,
  (tout, nom, reste) => {
    // On ne touche PAS aux films : ils ont déjà leur résumé, lu sur la page du film.
    if (/,(?:duree|genre|rt):/.test(reste) || /,desc:/.test(reste)) return tout;
    const t = trouver(nom.replace(/\\"/g, '"'));
    if (!t) { inconnus.add(nom); return tout; }
    let ajout = "";
    if (t.adr && !/,adr:/.test(reste)) { ajout += `,adr:"${echapper(t.adr)}"`; avecAdr++; }
    if (t.desc) { ajout += `,desc:"${echapper(t.desc)}"`; avecDesc++; }
    if (!ajout) return tout;
    touches++;
    return `{name:"${nom}"${reste}${ajout}}`;
  });

console.log(`ENRICHISSEMENT DES ANNUAIRES`);
console.log(`${table.size} lieux utilisables au tableau des sources`);
console.log(`  ${touches} entrée(s) d'annuaire enrichie(s) — ${avecAdr} adresse(s), ${avecDesc} présentation(s)`);
if (inconnus.size) {
  console.log(`\n  ${inconnus.size} nom(s) d'annuaire sans correspondance (ni adresse ni phrase) :`);
  console.log("   " + [...inconnus].slice(0, 25).join(" · "));
}

// Ce qui a été REFUSÉ, nommément : c'est la partie qu'un humain doit relire.
const refus = [];
for (const l of lieux) {
  const brut = presentations[l.name]?.texte;
  if (!brut) continue;
  const p = presentationValable(l.name, brut);
  if (p?.refus) refus.push(`${l.name} — ${p.refus}`);
}
if (refus.length) {
  console.log(`\n  ${refus.length} présentation(s) ÉCARTÉE(S), à réécrire à la main si besoin :`);
  for (const r of refus.slice(0, 20)) console.log(`   · ${r}`);
}

if (ESSAI) { console.log("\n--essai : rien n'a été écrit."); process.exit(0); }

// 🚨 VERROU POSÉ LE 11 OCTOBRE 2026, APRÈS LE PREMIER ESSAI RÉEL.
// Le rapprochement des noms est ENCORE TROP PERMISSIF : l'essai a enrichi 872
// entrées alors que les lieux qui comptent vraiment — Marlow, Pavyllon, Gustave,
// Le Vivaldi, Café de Paris — étaient justement « sans correspondance ». Autrement
// dit, 872 entrées ont reçu le texte d'un AUTRE lieu que le leur. Publier ça,
// c'était écrire sous chaque terrasse la présentation de la voisine : faux, et
// invisible, exactement ce que la maison s'interdit.
// Tant que `trouver()` n'exige pas une correspondance franche, ce script ne
// touche pas à la donnée.
if (!process.argv.includes("--vraiment")) {
  console.log("\n🚨 ÉCRITURE REFUSÉE — le rapprochement des noms n'est pas assez sûr.");
  console.log("   Voir le commentaire dans ce fichier. Relancer avec --vraiment seulement");
  console.log("   une fois `trouver()` resserré, et après avoir relu le résultat.");
  process.exit(0);
}
writeFileSync(EVENTS, src);
console.log("\n✓ src/data/events.js mis à jour");
