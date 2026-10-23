#!/usr/bin/env node
/**
 * MonacOut — LE CONTRÔLE QUOTIDIEN DES FICHES IMPORTÉES
 *
 * Stéphanie, 23 oct 2026 : « je veux que tout soit parfait tous les jours sans
 * que je te demande ».
 *
 * ── Pourquoi ce script existe ────────────────────────────────────────────────
 * Les 21, 22 et 23 octobre, en voulant simplement écrire des descriptions, on a
 * découvert plus de SOIXANTE horaires faux et une cinquantaine de fiches
 * fantômes. Toujours le même défaut : une ancienne version de l'importeur lisait
 * l'heure locale comme du temps universel. Résultat, une heure trop tôt, et un
 * jour trop tôt dès que l'événement commençait tôt dans la soirée.
 *   Grigory Sokolov   affiché mer 16 déc 18h30   réel JEU 17 déc 19h30
 *   AS Monaco–PSG     affiché ven 29 jan 20h00   réel SAM 30 jan 21h00
 * Personne ne s'en serait aperçu : une fiche fausse ne lève aucune alerte, elle
 * fait simplement venir quelqu'un la veille.
 *
 * ── Ce qu'il fait, chaque jour ───────────────────────────────────────────────
 * Pour chaque fiche importée (bande 800000-899999), il rouvre LA PAGE SOURCE de
 * cet événement et compare. Si la page donne une date et une heure sans
 * ambiguïté et qu'elles diffèrent, il CORRIGE. Sinon il SIGNALE.
 *
 * ── Les garde-fous, tous nécessaires ─────────────────────────────────────────
 * 1. On ne corrige que si le titre de la fiche correspond à UNE SEULE page, et
 *    que cette page ne porte qu'UNE SEULE date. « Musical Happy Hour » revient
 *    sept fois dans la saison : on ne sait pas quelle page va à quelle fiche.
 * 2. On ne SUPPRIME jamais tout seul. Une correction de date se défait ; une
 *    suppression, non. Les doublons sont signalés, c'est un humain qui tranche.
 * 3. Si la source est injoignable, on ne touche à RIEN et on ne crie pas : un
 *    site en maintenance n'est pas une erreur de nos données (leçon du 21 oct).
 * 4. Au-delà de 40 corrections en un passage, on n'écrit pas : c'est que quelque
 *    chose ne va pas dans le script lui-même, pas dans les données.
 *
 * Usage : node scripts/verifie-importees.mjs [--ecris]
 *         sans --ecris, il se contente de dire ce qu'il ferait.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER = join(RACINE, "src/data/events.js");
const ECRIS = process.argv.includes("--ecris");
const PLAFOND = 40;

const MON = { january:0, february:1, march:2, april:3, may:4, june:5, july:6,
              august:7, september:8, october:9, november:10, december:11 };
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const norm = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toUpperCase().replace(/[^A-Z0-9]/g, "");

let registre;
try { registre = JSON.parse(readFileSync(join(RACINE, "principocket-registre.json"), "utf8")); }
catch { console.log("Registre PrinciPocket illisible — rien à faire."); process.exit(0); }
const pages = Object.keys(registre);

const src0 = readFileSync(FICHIER, "utf8");
const lignes = src0.split("\n");
const champ = (l, n) => { const m = l.match(new RegExp(`${n}:"((?:[^"\\\\]|\\\\.)*)"`)); return m ? m[1] : null; };

const toutes = [];          // ⚠️ TOUTES les fiches : il faut savoir si la place est déjà prise
lignes.forEach((l, i) => {
  const m = l.match(/^\s*\{id:(\d+),/);
  if (!m) return;
  toutes.push({ id: +m[1], titre: (champ(l, "title") || "").replace(/\\n/g, " ").trim(),
                date: champ(l, "date"), lieu: (champ(l, "subtitle") || "").split(" · ")[0],
                annee: +((l.match(/year:(\d{4})/) || [])[1] || 2026) });
});
const occupe = new Map();
for (const t of toutes) occupe.set(`${t.date}|${t.annee}|${t.lieu}`, t.id);

const fiches = [];
lignes.forEach((l, i) => {
  const m = l.match(/^\s*\{id:(\d+),/);
  if (!m || +m[1] < 800000 || +m[1] >= 900000) return;
  fiches.push({ i, id: +m[1], ligne: l, titre: (champ(l, "title") || "").replace(/\\n/g, " ").trim(),
                date: champ(l, "date"), time: champ(l, "time"), lieu: champ(l, "subtitle"),
                annee: +((l.match(/year:(\d{4})/) || [])[1] || 2026) });
});

// Combien de fiches portent ce titre ? Une série ne se recale pas à l'aveugle.
const parTitre = new Map();
for (const t of toutes) parTitre.set(norm(t.titre), (parTitre.get(norm(t.titre)) || 0) + 1);

const cache = new Map();
async function lirePage(slug) {
  if (cache.has(slug)) return cache.get(slug);
  let v = null;
  try {
    const r = await fetch("https://www.principocket.com" + slug,
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
    if (r.ok) {
      const t = (await r.text()).replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
      const ds = [...t.matchAll(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi)];
      const h = t.match(/from\s+(\d{2}:\d{2})(?:\s+to\s+(\d{2}:\d{2}))?/i) || t.match(/\bat\s+(\d{2}:\d{2})\b/i);
      if (ds.length === 1) {
        const d = new Date(+ds[0][3], MON[ds[0][2].toLowerCase()], +ds[0][1]);
        v = { date: `${JOURS[d.getDay()]} ${+ds[0][1]} ${MOIS[d.getMonth()]}`, annee: +ds[0][3],
              time: h ? (h[2] ? `${h[1].replace(":","h")} — ${h[2].replace(":","h")}` : h[1].replace(":","h")) : null };
      }
    }
  } catch { /* source injoignable : on ne touche à rien */ }
  cache.set(slug, v); return v;
}

const corrections = [], signales = [];
let injoignables = 0;

for (const f of fiches) {
  const k = norm(f.titre);
  const ps = pages.filter(p => {
    const t = norm(decodeURIComponent(p.replace(/^\/en\/events\/[0-9a-f]{32}-/, "")).replace(/-/g, " "));
    return t === k || (k.length > 20 && t.startsWith(k.slice(0, 20))) || (t.length > 20 && k.startsWith(t.slice(0, 20)));
  });
  if (ps.length !== 1 || parTitre.get(k) !== 1) continue;      // garde-fou 1
  const v = await lirePage(ps[0]);
  if (!v) { injoignables++; continue; }                        // garde-fou 3
  const memeDate = v.date === f.date && v.annee === f.annee;
  const memeHeure = !v.time || v.time === f.time;
  if (memeDate && memeHeure) continue;
  // 🚨 LA PLACE VISÉE DOIT ÊTRE LIBRE. Le Théâtre des Muses et le Théâtre
  // Princesse Grace jouent LUNDI ET MARDI : déplacer la fiche du lundi sur le
  // mardi écraserait la représentation du mardi et ferait disparaître celle du
  // lundi. Une correction qui supprime une date n'est pas une correction.
  const place = `${v.date}|${v.annee}|${(f.lieu || "").split(" · ")[0]}`;
  const pris = occupe.get(place);
  if (pris !== undefined && pris !== f.id) {
    signales.push(`PLACE PRISE · ${f.titre.slice(0, 40)} resterait ${f.date} ${f.annee} : le ${v.date} ${v.annee} est déjà la fiche ${pris}`);
    continue;
  }
  corrections.push({ ...f, v });
}

// Doublons : deux fiches au même lieu, le même jour, à la même heure.
const vus = new Map();
for (const f of fiches) {
  const c = corrections.find(x => x.id === f.id);
  const d = c ? c.v.date : f.date, a = c ? c.v.annee : f.annee, h = c ? (c.v.time || f.time) : f.time;
  const cle = `${d}|${a}|${h}|${(f.lieu || "").split(" · ")[0]}`;
  if (vus.has(cle)) signales.push(`DOUBLON · ${d} ${a} ${h} — fiches ${vus.get(cle)} et ${f.id} (${f.titre.slice(0, 44)})`);
  else vus.set(cle, f.id);
}

console.log(`Fiches importées : ${fiches.length} · corrigeables : ${corrections.length} · doublons : ${signales.length}` +
            (injoignables ? ` · source injoignable pour ${injoignables}` : ""));

if (corrections.length > PLAFOND) {                            // garde-fou 4
  console.error(`🚨 ${corrections.length} corrections d'un coup, au-delà du plafond de ${PLAFOND}.`);
  console.error("   C'est anormal : le script est probablement en cause, pas les données. RIEN n'est écrit.");
  process.exit(1);
}

for (const c of corrections)
  console.log(`   ${ECRIS ? "✓" : "·"} ${c.titre.slice(0, 40).padEnd(42)} ${c.date} ${c.annee} ${c.time}  →  ${c.v.date} ${c.v.annee} ${c.v.time || c.time}`);
for (const s of signales) console.log("   ⚠️  " + s);

if (!ECRIS || !corrections.length) {
  if (!ECRIS && corrections.length) console.log("\n(simulation — relancer avec --ecris pour appliquer)");
  process.exit(0);
}

let src = src0;
for (const c of corrections) {
  let n = c.ligne.replace(/date:"[^"]*"/, `date:"${c.v.date}"`);
  if (c.v.time) n = n.replace(/time:"[^"]*"/, `time:"${c.v.time}"`);
  if (c.v.annee === 2026) n = n.replace(/year:\d{4},/, "");
  else if (/year:\d{4},/.test(n)) n = n.replace(/year:\d{4},/, `year:${c.v.annee},`);
  else n = n.replace(/^(\s*\{id:\d+,)/, `$1year:${c.v.annee},`);
  src = src.replace(c.ligne, n);
}
const ids = [...src.matchAll(/\{id:(\d+),/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) { console.error("🚨 ids en double — RIEN n'est écrit."); process.exit(1); }
writeFileSync(FICHIER, src);
console.log(`\n${corrections.length} fiche(s) corrigée(s).`);
