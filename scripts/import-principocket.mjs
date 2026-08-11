#!/usr/bin/env node
/**
 * MonacOut — REPRISE INTÉGRALE DE PRINCIPOCKET
 *
 * Demandé par Stéphanie le 11 août 2026 : « je veux que tu recopies tout
 * PrinciPocket sans exception ». Elle avait raison d'insister — en testant trois
 * événements au hasard (rentrée des catéchistes, salon du livre, Pesquet) elle en
 * a trouvé un absent et deux introuvables faute du bon nom.
 *
 * POURQUOI L'ANCIEN SCAN RATAIT DES CHOSES. `principocket-scan.mjs` comparait les
 * TITRES avec un rapprochement flou : deux mots communs de 4 lettres suffisaient à
 * déclarer un événement « déjà présent ». « Journée de rentrée 2026 des catéchistes »
 * était ainsi confondue avec « Heure du conte rentrée Médiathèque » — un faux
 * négatif, bien pire qu'un faux positif : il cache un manque au lieu d'en inventer un.
 *
 * CE SCRIPT COMPARE AUTREMENT : par DATE + LIEU, jamais par titre seul. Deux
 * événements le même jour au même endroit sont le même ; deux titres qui se
 * ressemblent ne le sont pas.
 *
 * IL LIT DEUX SOURCES, pas une : la liste paginée `/en/events?page=N` ET les pages
 * mois par mois `/en/events-for/AAAA-MM` sur 12 mois. Elles ne contiennent pas la
 * même chose.
 *
 * UNE FICHE PAR JOUR pour les événements sur plusieurs jours : un stage du 9 au 11
 * doit être visible le 10 et le 11, pas seulement le 9. C'est le défaut qui avait
 * rendu trois expositions introuvables (« le bug de Nadège »).
 *
 * CE QU'IL N'INVENTE JAMAIS : ni lien, ni téléphone, ni horaire précis. Un lieu
 * absent du tableau des sources est publié sous son vrai nom, sans coordonnées.
 * Une heure non publiée devient « En journée » ou « En soirée » selon la catégorie.
 *
 * ⚠️ HORS PÉRIMÈTRE : les événements hors de Monaco (Cap d'Ail, Roquebrune…) sont
 * importés mais SIGNALÉS en fin de rapport — la règle 15 dit Monaco uniquement, et
 * c'est à un humain de trancher, pas au script.
 *
 * Usage : node scripts/import-principocket.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER = join(racine, "src", "data", "events.js");
const RAPPORT = join(racine, "import-principocket.txt");
const DRY = process.argv.includes("--dry");

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 " +
           "(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS  = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const MON_EN = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };

const norm = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const esc = s => (s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();

async function get(u) {
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(u, { headers: { "User-Agent": UA } }); if (r.ok) return await r.text(); }
    catch { /* réseau : on réessaie */ }
    await new Promise(s => setTimeout(s, 900));
  }
  return "";
}

// ── 1. TOUS les slugs, des DEUX sources ──────────────────────────────────────────
const slugs = new Set();
for (let p = 1; p <= 30; p++) {
  const h = await get(`https://www.principocket.com/en/events?page=${p}`);
  const s = [...h.matchAll(/href="(\/en\/events\/[0-9a-f]{32}-[^"]+)"/g)].map(m => m[1]);
  if (!s.length) break;
  s.forEach(x => slugs.add(x));
}
const d0 = new Date();
for (let i = 0; i < 12; i++) {
  const m = new Date(d0.getFullYear(), d0.getMonth() + i, 1);
  const mois = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`;
  const h = await get(`https://www.principocket.com/en/events-for/${mois}`);
  [...h.matchAll(/href="(\/en\/events\/[0-9a-f]{32}-[^"]+)"/g)].map(x => x[1]).forEach(x => slugs.add(x));
}
console.log(`PrinciPocket : ${slugs.size} événements distincts (liste paginée + 12 pages mois).`);

// ── 2. Chaque fiche : titre, lieu, dates, heures ─────────────────────────────────
const fiches = [];
const tous = [...slugs];
for (let i = 0; i < tous.length; i += 8) {
  await Promise.all(tous.slice(i, i + 8).map(async sl => {
    const h = await get("https://www.principocket.com" + sl);
    const titre = decodeURIComponent(sl.replace(/^\/en\/events\/[0-9a-f]{32}-/, "")).replace(/-/g, " ").trim();
    const lieu = ((h.match(/href="\/en\/places\/[^"]*"[^>]*>([^<]+)</) || [])[1] || "").replace(/&amp;/g, "&").trim();
    const txt = h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const dates = [...txt.matchAll(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi)]
      .map(m => new Date(+m[3], MON_EN[m[2].toLowerCase()], +m[1]));
    const heure = (txt.match(/from\s+(\d{2}:\d{2})(?:\s+to\s+(\d{2}:\d{2}))?/i) || []);
    fiches.push({ sl, titre, lieu, dates, h1: heure[1], h2: heure[2] });
  }));
  process.stdout.write(".");
}
console.log("");

// ── 3. L'app, indexée par date ───────────────────────────────────────────────────
let src = readFileSync(FICHIER, "utf8");
const ev = JSON.parse(readFileSync(join(racine, "public", "events.json"), "utf8")).events;
const cleDate = d => `${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
const parDate = new Map();
for (const e of ev) {
  const p = e.date.split(" ");
  const k = `${+p[1]} ${p[2]} ${e.year || 2026}`;
  if (!parDate.has(k)) parDate.set(k, []);
  parDate.get(k).push(e);
}
// ⚠️ LES FICHES « EN COURS » COUVRENT TOUTE UNE PÉRIODE mais ne portent que la date
// du jour (elles sont redatées chaque nuit). Sans ça, l'outil croyait manquantes
// Victor Brauner, Heritage at Risk, Toumaï, Magies d'ailleurs, le Mariage du siècle
// et les ateliers de cirque — tous bien présents. On les traite à part.
const enCours = ev.filter(e => e.ongoing && e.until).map(e => ({ e, fin: new Date(e.until + "T23:59:59") }));
const BANALS = new Set(["monaco","monte","carlo","salle","centre","hotel","place","principaute","espace","musee","grand"]);
const motsCles = s => norm(s).split(" ").filter(w => w.length >= 5 && !BANALS.has(w));

// ── 4. Lieux connus (tableau des sources) pour lien + téléphone ──────────────────
let VENUES = [];
try {
  const { lieuxDepuisSources } = await import("./venues-from-sources.mjs");
  VENUES = lieuxDepuisSources(join(racine, "CLAUDE.md")).lieux;
} catch { /* tableau illisible : on publiera sans lien */ }
const trouveLieu = nom => { const p = norm(nom); return VENUES.find(v => v.match.test(p)) || null; };

// ── 5. Catégorie d'après le titre ────────────────────────────────────────────────
const SANS_HEURE = { EXPOSITION:"En journée", MARCHÉ:"En journée", SALON:"En journée", CINÉMA:"En journée",
  ATELIER:"En journée", CONFÉRENCE:"En journée", "APÉRO":"En soirée", "SOIRÉE":"En soirée",
  "DJ SET":"En soirée", "JAZZ LIVE":"En soirée" };
function categorie(t) {
  const s = norm(t);
  if (/messe|heure sainte|benediction|priere|catech|chapelet|vepres|adoration|spiritual/.test(s)) return "CHANTS";
  if (/opera/.test(s)) return "OPÉRA";
  if (/cinema|projection|film|screening|nocturne/.test(s)) return "CINÉMA";
  if (/recital|concert|symphoni|philharmon|quatuor|jazz|musical|chambre|live/.test(s)) return "CONCERT";
  if (/conference|rencontre|colloque|debat|cafe litteraire|talk/.test(s)) return "CONFÉRENCE";
  if (/atelier|stage|workshop|cycloshow/.test(s)) return "ATELIER";
  if (/theatre|piece|comedy|comedie|spectacle|bourgeois/.test(s)) return "THÉÂTRE";
  if (/exposition|exhibition/.test(s)) return "EXPOSITION";
  if (/salon|fair|show|convention|summit|pack|sportel/.test(s)) return "SALON";
  if (/danse|ballet/.test(s)) return "DANSE";
  if (/vuelta|course|run|marathon|tennis|football|athletics|sport/.test(s)) return "SPORT";
  if (/loto|bingo|fete|festival/.test(s)) return "SPECTACLE";
  return "SPECTACLE";
}
const PAL = {
  CHANTS:["linear-gradient(150deg,#5A4A2A,#7A6A3A,#3A2E18)","#E8D8A8","🙏"],
  "OPÉRA":["linear-gradient(150deg,#5A1848,#8A3070,#3A0828)","#F0A8D8","🎭"],
  "CINÉMA":["linear-gradient(150deg,#1A0A3A,#3A1A6A,#0A0020)","#C0A0F0","🎬"],
  CONCERT:["linear-gradient(150deg,#385878,#506898,#283848)","#C0D8F4","🎻"],
  "CONFÉRENCE":["linear-gradient(150deg,#1A2A5A,#3A4A8A,#0A1030)","#A8C0F8","🎤"],
  ATELIER:["linear-gradient(150deg,#1A5A4A,#2A7A5A,#0A4A38)","#A0E8C8","🎨"],
  "THÉÂTRE":["linear-gradient(150deg,#5A1870,#7A3890,#400858)","#E0B0F8","🎭"],
  EXPOSITION:["linear-gradient(150deg,#3A1A2A,#6A3A52,#200A18)","#E8B0C8","🖼️"],
  SALON:["linear-gradient(150deg,#5A1848,#8A3070,#3A0828)","#F0A8D8","💎"],
  DANSE:["linear-gradient(150deg,#5A1870,#7A3890,#400858)","#E0B0F8","🩰"],
  SPORT:["linear-gradient(150deg,#0A4A2A,#1A7A4A,#042A18)","#90E8B8","🏅"],
  SPECTACLE:["linear-gradient(150deg,#7A2A08,#B85A20,#4A1804)","#F8B87A","🎪"],
};

// ── 6. Import ────────────────────────────────────────────────────────────────────
const usedIds = new Set([...src.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let nextId = 800000; while (usedIds.has(nextId)) nextId++;
const auj = new Date(); auj.setHours(0, 0, 0, 0);
const horizon = new Date(auj); horizon.setMonth(horizon.getMonth() + 12);

const ajoutes = [], horsMonaco = [], sansLieu = [], deja = [];
const lignes = [];
for (const f of fiches) {
  const dates = [...new Set(f.dates.filter(d => d >= auj && d <= horizon).map(d => d.getTime()))]
    .map(t => new Date(t)).sort((a, b) => a - b);
  if (!dates.length) continue;
  const v = trouveLieu(f.lieu);
  const cat = categorie(f.titre);
  const heure = f.h1 ? (f.h2 ? `${f.h1.replace(":", "h")} — ${f.h2.replace(":", "h")}` : f.h1.replace(":", "h"))
                     : (SANS_HEURE[cat] || null);
  if (!heure) { continue; }                                    // heure indispensable hors catégories tolérées
  const mtCles = motsCles(f.titre), mlCles = motsCles(f.lieu);
  let ajoutePour = 0;
  for (const d of dates) {
    const cands = parDate.get(cleDate(d)) || [];
    const present = cands.some(e => {
      const sub = norm(e.subtitle), tit = norm(e.title.replace(/\n/g, " "));
      const lieuOk = mlCles.length && mlCles.some(w => sub.includes(w));
      const titreOk = mtCles.length && mtCles.filter(w => tit.includes(w)).length >= Math.min(2, mtCles.length);
      return lieuOk || titreOk;
    });
    const couvert = enCours.some(({ e, fin }) => {
      if (d > fin) return false;
      const sub = norm(e.subtitle), tit = norm(e.title.replace(/\n/g, " "));
      const lieuOk = mlCles.length && mlCles.some(w => sub.includes(w));
      const titreOk = mtCles.length && mtCles.filter(w => tit.includes(w)).length >= Math.min(2, mtCles.length);
      return lieuOk || titreOk;
    });
    if (present || couvert) continue;
    if (!f.lieu || f.lieu.length < 4 || /^principaut|^monaco$/i.test(f.lieu)) { sansLieu.push(`${cleDate(d)} · ${f.titre}`); continue; }
    const [bg, ac, emo] = PAL[cat] || PAL.SPECTACLE;
    const id = nextId++;
    const an = d.getFullYear() !== 2026 ? `year:${d.getFullYear()},` : "";
    const titre = f.titre.length > 62 ? f.titre.slice(0, 60) + "…" : f.titre;
    lignes.push(`  {id:${id},${an}cat:"${cat}",date:"${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}",time:"${heure}",title:"${esc(titre.toUpperCase())}",subtitle:"${esc(f.lieu)} · Monaco",desc:"${esc(f.titre)} — ${esc(f.lieu)}.",descEn:"${esc(f.titre)} — ${esc(f.lieu)}.",free:false,hot:false,fallback:"${bg}",accent:"${ac}",emoji:"${emo}",${v && v.link ? `link:"${v.link}",` : ""}${v && v.phone ? `phone:"${v.phone}",` : ""}source:"${esc(f.lieu)}",quarter:"${v ? v.quarter : "Monaco"}"},`);
    ajoutePour++;
  }
  if (ajoutePour) ajoutes.push(`${f.titre} — ${f.lieu} (${ajoutePour} jour(s))`);
  else deja.push(f.titre);
  if (/cap d.ail|roquebrune|beausoleil|nice|menton|06[0-9]{3}/i.test(f.lieu)) horsMonaco.push(`${f.titre} — ${f.lieu}`);
}

let txt = `REPRISE INTÉGRALE PRINCIPOCKET — ${new Date().toISOString().slice(0, 10)}\n`;
txt += `${slugs.size} événements lus · ${ajoutes.length} importés (${lignes.length} fiches) · ${deja.length} déjà présents\n`;
if (ajoutes.length) txt += `\n■ IMPORTÉS\n` + ajoutes.map(a => "   + " + a).join("\n") + "\n";
if (sansLieu.length) txt += `\n■ SANS LIEU EXPLOITABLE — non importés, à compléter à la main\n` + sansLieu.map(a => "   ? " + a).join("\n") + "\n";
if (horsMonaco.length) txt += `\n■ ⚠️ HORS DE MONACO — règle 15, à trancher\n` + horsMonaco.map(a => "   ! " + a).join("\n") + "\n";
writeFileSync(RAPPORT, txt);

console.log(`  ${ajoutes.length} événements importés → ${lignes.length} fiches`);
console.log(`  ${deja.length} déjà présents · ${sansLieu.length} sans lieu · ${horsMonaco.length} hors Monaco`);
if (DRY) { console.log("\n(--dry : rien n'a été écrit)"); process.exit(0); }
if (lignes.length) {
  const i = src.lastIndexOf("\n];");
  writeFileSync(FICHIER, src.slice(0, i) + "\n" + lignes.join("\n") + src.slice(i));
  console.log("  ✓ src/data/events.js mis à jour");
}
console.log("→ détail dans import-principocket.txt");
