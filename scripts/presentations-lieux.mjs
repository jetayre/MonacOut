#!/usr/bin/env node
/**
 * MonacOut — DEUX PHRASES DE PRÉSENTATION PAR LIEU, LUES SUR SON PROPRE SITE
 *
 * Stéphanie, 11 octobre 2026 : « met 2 phrases de présentation des lieux pris sur
 * le site de chaque lieu dans chaque sous-fiche ».
 *
 * Depuis que « Infos » déplie l'annuaire en sous-fiches, chaque terrasse, chaque
 * brunch, chaque adresse a sa propre fiche dans le fil. Elle n'y portait que son
 * nom et son horaire. Deux phrases disent ce qu'on va y trouver.
 *
 * ⚠️ LES PHRASES VIENNENT DU SITE DU LIEU, JAMAIS D'AILLEURS. Pas d'agrégateur,
 * pas d'invention : c'est la règle de la maison (« un événement manquant vaut
 * mieux qu'un faux »), et elle vaut pour une présentation comme pour une date.
 * Un lieu dont le site ne dit rien d'utilisable reste SANS présentation.
 *
 * ⚠️ UN 200 NE PROUVE RIEN (leçon du 18 août 2026) : c'est le CONTENU qui tranche.
 * Une page de moins de 800 octets de texte, une page de cookies ou une page qui
 * ne parle pas du lieu ne donnent rien.
 *
 * Produit `presentations-lieux.json` : { "Nom du lieu": { texte, source, le } }.
 * Le registre est RELU à chaque passage et seulement COMPLÉTÉ : un lieu déjà
 * décrit n'est pas réinterrogé (sauf --refaire), pour ne pas marteler les sites.
 *
 *   node scripts/presentations-lieux.mjs            # complète ce qui manque
 *   node scripts/presentations-lieux.mjs --refaire  # refait tout
 *   node scripts/presentations-lieux.mjs --un "Marlow"
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { lieuxDepuisSources } from "./venues-from-sources.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RACINE = join(__dirname, "..");
const REGISTRE = join(RACINE, "presentations-lieux.json");

const REFAIRE = process.argv.includes("--refaire");
const UN = (() => { const i = process.argv.indexOf("--un"); return i > 0 ? process.argv[i + 1] : null; })();

// ── Ce qui n'est jamais une phrase de présentation ───────────────────────────
const REJET = new RegExp([
  "cookie", "consentement", "mentions l[ée]gales", "politique de confidentialit",
  "newsletter", "tous droits r[ée]serv", "javascript", "navigateur", "copyright", "©",
  "\\bRGPD\\b", "conditions g[ée]n[ée]rales", "plan du site", "r[ée]servation en ligne",
  "veuillez", "cliquez ici",
  // ⚠️ Relevé au premier passage réel (11 oct 2026) — sans ces rejets, le fil
  // aurait affiché du débogage PHP et des avertissements techniques.
  "string\\(\\d+\\)",            // var_dump() laissé en production (Croix-Rouge)
  "adresse e-mail est prot[ée]g[ée]", // antispam (Comité Olympique)
  "robots spammeurs", "activer le javascript",
  "lire la suite", "en savoir plus", "voir le site",
  "\\uFFFD",                       // accents cassés : encodage mal lu
].join("|"), "i");

// ⚠️ UNE PHRASE PARTAGÉE N'EST LA PRÉSENTATION DE PERSONNE. Dix associations
// monégasques sont hébergées sur la même plate-forme et servent toutes le même
// texte (« La plate-forme OSI réunit sur un même support… »). Publié tel quel,
// chaque sous-fiche aurait décrit la plate-forme, jamais le lieu. On repère ces
// textes à la fin, par le fait qu'ils apparaissent PLUSIEURS FOIS.

// Une phrase utile : assez longue pour dire quelque chose, pas un titre.
const PHRASE_MIN = 45;
const PHRASE_MAX = 320;

function texteDe(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&#39;|&rsquo;|&apos;/gi, "'").replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
    .replace(/&eacute;/gi, "é").replace(/&egrave;/gi, "è").replace(/&agrave;/gi, "à")
    .replace(/&ccedil;/gi, "ç").replace(/&ocirc;/gi, "ô").replace(/&ecirc;/gi, "ê")
    .replace(/&icirc;/gi, "î").replace(/&ugrave;/gi, "ù").replace(/&acirc;/gi, "â")
    .replace(/&[a-z]+;/gi, " ");
}

// Découpe en phrases, en gardant la ponctuation finale.
function phrasesDe(bloc) {
  return bloc
    .split(/(?<=[.!?])\s+/)
    .map(p => p.replace(/\s+/g, " ").trim())
    .filter(p =>
      p.length >= PHRASE_MIN && p.length <= PHRASE_MAX &&
      /[.!?]$/.test(p) &&
      // Commence vraiment une phrase : sinon on ramassait des bouts coupés
      // (« , mon Trisaïeul, avait souhaité… » pour l'Institut océanographique).
      /^[A-ZÀÂÉÈÊÎÔÙÇ«"]/.test(p) &&
      !REJET.test(p) &&
      // une phrase, pas une énumération d'horaires ni un menu
      (p.match(/\d/g) || []).length < 12 &&
      /\s/.test(p) && p.split(" ").length >= 8);
}

// ⚠️ On préfère la phrase qui NOMME le lieu : sur une page d'accueil, les
// premières lignes de prose sont souvent celles d'un bandeau promotionnel.
// ⚠️ LA MEILLEURE PRÉSENTATION EST CELLE QUE LE LIEU A ÉCRITE LUI-MÊME.
// Premier passage réel (11 oct 2026) : en ramassant la prose de la page, on
// obtenait le bandeau « Join My Monte-Carlo for free » pour le Café de Paris, un
// AVIS CLIENT pour le Bistro Coe et le Bubble Bar, et du texte de cookies pour le
// 99 Sushi Bar. Six textes faux sur treize — exactement le défaut que la maison
// se refuse (« une date fausse mais cohérente est invisible »).
// La balise `description` / `og:description` est, elle, rédigée par le lieu pour
// se présenter. On la prend d'abord, et on ne descend dans la page qu'à défaut.
function metaDescription(html) {
  const balises = [...html.matchAll(/<meta\s+[^>]*>/gi)].map(m => m[0]);
  for (const cle of ["og:description", "twitter:description", "description"]) {
    for (const b of balises) {
      const nom = (b.match(/(?:name|property)\s*=\s*["']([^"']+)["']/i) || [])[1];
      if (!nom || nom.toLowerCase() !== cle) continue;
      const c = (b.match(/content\s*=\s*["']([^"']*)["']/i) || [])[1];
      if (!c) continue;
      const txt = texteDe(c).replace(/\s+/g, " ").trim();
      if (txt.length >= 60 && txt.length <= 400 && !REJET.test(txt)) return txt;
    }
  }
  return null;
}

function deuxPhrases(html, nom) {
  const meta = metaDescription(html);
  if (meta) return meta;
  const lignes = texteDe(html).split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const candidates = [];
  for (const l of lignes) for (const p of phrasesDe(l)) candidates.push(p);
  if (!candidates.length) return null;

  const mots = nom.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/).filter(m => m.length >= 4);
  const nomme = p => {
    const q = p.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return mots.some(m => q.includes(m));
  };

  const vues = new Set();
  const uniques = candidates.filter(p => !vues.has(p) && vues.add(p));
  const ordre = [...uniques.filter(nomme), ...uniques.filter(p => !nomme(p))];
  const deux = ordre.slice(0, 2);
  if (!deux.length) return null;
  const texte = deux.join(" ");
  return texte.length >= 60 ? texte : null;
}

async function lire(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        // Certains hôtes refusent les adresses de centres de données sans
        // en-têtes de navigateur (larosedesvents.com, odeonspa.com — 18 août 2026).
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
    });
    if (!r.ok) return { err: `HTTP ${r.status}` };
    // ⚠️ NE PAS SUPPOSER L'UTF-8. Plusieurs sites monégasques sont encore en
    // ISO-8859-1 : lus en UTF-8, « 58ème » devenait « 58\uFFFDme ».
    const brut = Buffer.from(await r.arrayBuffer());
    const entete = (r.headers.get("content-type") || "").toLowerCase();
    let jeu = (entete.match(/charset=([\w-]+)/) || [])[1];
    if (!jeu) {
      const debut = brut.subarray(0, 2048).toString("latin1").toLowerCase();
      jeu = (debut.match(/charset=["']?([\w-]+)/) || [])[1];
    }
    const norme = (jeu || "utf-8").replace(/^iso-?8859-?1$/, "latin1").replace(/^windows-1252$/, "latin1");
    let html;
    try { html = new TextDecoder(norme === "latin1" ? "windows-1252" : norme).decode(brut); }
    catch { html = brut.toString("utf8"); }
    if (html.length < 800) return { err: `page vide (${html.length} o)` };
    return { html };
  } catch (e) {
    return { err: e.name === "AbortError" ? "délai dépassé" : e.message };
  } finally { clearTimeout(t); }
}

// ── Passage ──────────────────────────────────────────────────────────────────
const { lieux } = lieuxDepuisSources(join(RACINE, "CLAUDE.md"));
let registre = {};
if (!REFAIRE && existsSync(REGISTRE)) {
  try { registre = JSON.parse(readFileSync(REGISTRE, "utf8")) || {}; } catch { registre = {}; }
}

const aFaire = lieux.filter(l => {
  if (!l.link) return false;
  if (UN) return l.name.toLowerCase().includes(UN.toLowerCase());
  return REFAIRE || !registre[l.name];
});

console.log(`PRÉSENTATIONS DES LIEUX — ${lieux.length} lieux au tableau des sources`);
console.log(`${Object.keys(registre).length} déjà décrits · ${aFaire.length} à interroger\n`);

let ok = 0, vide = 0, injoignable = 0;
for (const l of aFaire) {
  const { html, err } = await lire(l.link);
  if (err) {
    // ⚠️ « Injoignable » N'EST PAS « mort » : on le dit, on ne conclut rien.
    console.log(`  · ${l.name} — injoignable depuis ici (${err})`);
    injoignable++;
    continue;
  }
  const texte = deuxPhrases(html, l.name);
  if (!texte) {
    console.log(`  · ${l.name} — rien d'utilisable sur la page`);
    vide++;
    continue;
  }
  registre[l.name] = { texte, source: l.link, le: new Date().toISOString().slice(0, 10) };
  console.log(`  ✓ ${l.name} — ${texte.slice(0, 80)}…`);
  ok++;
}

// ── Le texte qui sert à plusieurs lieux ne décrit aucun d'eux ───────────────
const compte = new Map();
for (const v of Object.values(registre)) compte.set(v.texte, (compte.get(v.texte) || 0) + 1);
const partages = [...compte.entries()].filter(([, n]) => n > 1);
let retires = 0;
for (const [texte, n] of partages) {
  for (const [nom, v] of Object.entries(registre)) {
    if (v.texte === texte) { delete registre[nom]; retires++; }
  }
  console.log(`  ⚠️ texte partagé par ${n} lieux, retiré : « ${texte.slice(0, 70)}… »`);
}

writeFileSync(REGISTRE, JSON.stringify(registre, null, 2));
if (retires) console.log(`${retires} présentation(s) retirée(s) comme texte partagé`);
console.log(`\n${ok} présentation(s) ajoutée(s) · ${vide} page(s) sans prose · ${injoignable} injoignable(s)`);
console.log(`Registre : ${Object.keys(registre).length} lieux décrits → presentations-lieux.json`);
