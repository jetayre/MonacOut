#!/usr/bin/env node
/**
 * MonacOut — SYNCHRO GOOGLE SHEET → événements
 * Stéphanie édite un Google Sheet (comme une liste de courses) ; ce script le
 * lit et insère/maj ses événements dans src/data/events.js, entre les marqueurs
 * MANUEL. Puis le policier vérifie et le build déploie → visible dans l'app
 * SANS repasser par Apple.
 *
 * Le Sheet doit être « Publié sur le web » au format CSV. L'URL est fournie
 * via la variable d'environnement SHEET_CSV_URL.
 *
 * Colonnes attendues (1re ligne = en-têtes, ordre libre) :
 *   Date | Heure | Titre | Lieu | Quartier | Categorie | Lien | Telephone | Description | DescriptionEN | Gratuit | Phare
 *   - Date : 2026-06-30  ou  30/06/2026  (le jour de la semaine est calculé tout seul)
 *   - Categorie : CONCERT, APÉRO, SOIRÉE, EXPOSITION… (voir CLAUDE.md)
 *   - Gratuit / Phare : oui / non
 *
 * Usage : SHEET_CSV_URL="https://docs.google.com/.../pub?output=csv" node scripts/sync-sheet.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS_FILE = join(__dirname, "../src/data/events.js");
const URL_CSV = process.env.SHEET_CSV_URL;

const BEGIN = "// ── MANUEL (Google Sheet) — DÉBUT — ne pas éditer à la main ──";
const END = "// ── MANUEL (Google Sheet) — FIN ──";

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const CAT_STYLE = {
  CONCERT: { f: "linear-gradient(150deg,#1A1240,#2D1F6E,#1A1240)", a: "#C4A8F8", e: "🎵" },
  "OPÉRA": { f: "linear-gradient(150deg,#2A0A1A,#7A1A40,#2A0A1A)", a: "#F4B0C8", e: "🎭" },
  THÉÂTRE: { f: "linear-gradient(150deg,#1A0830,#4A1870,#1A0830)", a: "#D0B0F8", e: "🎭" },
  DANSE: { f: "linear-gradient(150deg,#3A0840,#8A1890,#3A0840)", a: "#E8A0F8", e: "💃" },
  EXPOSITION: { f: "linear-gradient(150deg,#2A1808,#6A3818,#2A1808)", a: "#F8C8A0", e: "🎨" },
  SPECTACLE: { f: "linear-gradient(150deg,#0A1A2A,#2A4A6A,#0A1A2A)", a: "#A8C8E8", e: "✨" },
  FESTIVAL: { f: "linear-gradient(150deg,#0A2818,#1A6A3A,#0A2818)", a: "#A0F0B0", e: "🎪" },
  GALA: { f: "linear-gradient(150deg,#1A1000,#4A3000,#1A1000)", a: "#D4C840", e: "✨" },
  "CONFÉRENCE": { f: "linear-gradient(150deg,#0A1828,#1A3A50,#0A1828)", a: "#A0C8D8", e: "💬" },
  ATELIER: { f: "linear-gradient(150deg,#201808,#504018,#201808)", a: "#D8C880", e: "✏️" },
  "BIEN-ÊTRE": { f: "linear-gradient(150deg,#0A2818,#1A5030,#0A2818)", a: "#90E0B0", e: "🧘" },
  BRUNCH: { f: "linear-gradient(150deg,#3A2000,#6A4010,#200A00)", a: "#F0C080", e: "🥂" },
  "APÉRO": { f: "linear-gradient(150deg,#3A2000,#6A4010,#200A00)", a: "#E0A840", e: "🍸" },
  "SOIRÉE": { f: "linear-gradient(150deg,#1A1040,#4A2880,#0A0520)", a: "#D8B8F8", e: "✨" },
  "DJ SET": { f: "linear-gradient(150deg,#1A1040,#4A2880,#0A0520)", a: "#D8B8F8", e: "🎧" },
  SPORT: { f: "linear-gradient(150deg,#1A4A8A,#2A6AAA,#0A2A6A)", a: "#90C8F0", e: "🏆" },
  "ENCHÈRES": { f: "linear-gradient(150deg,#1A1000,#4A3000,#1A1000)", a: "#D4A840", e: "🔨" },
  "MARCHÉ": { f: "linear-gradient(150deg,#0A2A3A,#1A5A7A,#0A1020)", a: "#A8E8D8", e: "🛍️" },
  SALON: { f: "linear-gradient(150deg,#0A1020,#1A2840,#0A1020)", a: "#8AB8D8", e: "🚢" },
};
const DEFAULT_STYLE = CAT_STYLE.SPECTACLE;

// ── CSV (simple, gère les guillemets) ────────────────────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") { /* ignore */ }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim()));
}

function norm(s) { return (s || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
const COLS = {
  date: ["date"], time: ["heure", "time"], title: ["titre", "title"],
  subtitle: ["lieu", "venue", "subtitle"], quarter: ["quartier", "quarter"],
  cat: ["categorie", "category", "cat"], link: ["lien", "link"],
  phone: ["telephone", "phone", "tel"], desc: ["description", "desc"],
  descEn: ["descriptionen", "descen", "english"], free: ["gratuit", "free"], hot: ["phare", "hot"],
};
function mapHeaders(headers) {
  const idx = {};
  headers.forEach((h, i) => {
    const n = norm(h);
    for (const [key, names] of Object.entries(COLS)) if (names.includes(n)) idx[key] = i;
  });
  return idx;
}

function parseDate(s) {
  s = (s || "").trim();
  let y, m, d;
  let mt = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (mt) { [, y, m, d] = mt.map(Number); }
  else { mt = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if (mt) { d = +mt[1]; m = +mt[2]; y = +mt[3]; } }
  if (!y) return null;
  const dt = new Date(y, m - 1, d);
  if (isNaN(dt)) return null;
  return { year: y, frDate: `${JOURS[dt.getDay()]} ${d} ${MOIS[m - 1]}` };
}

function esc(s) { return (s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n"); }
const yes = v => /^(oui|yes|true|1|x)$/i.test((v || "").trim());

function toEvent(row, idx, id) {
  const get = k => (idx[k] !== undefined ? (row[idx[k]] || "").trim() : "");
  const dt = parseDate(get("date"));
  if (!dt || !get("title")) return null;
  const cat = (get("cat") || "SPECTACLE").toUpperCase();
  const st = CAT_STYLE[cat] || DEFAULT_STYLE;
  let o = `  {id:${id}`;
  if (dt.year !== 2026) o += `,year:${dt.year}`;
  o += `,cat:"${esc(cat)}",date:"${dt.frDate}"`;
  if (get("time")) o += `,time:"${esc(get("time"))}"`;
  o += `,title:"${esc(get("title"))}"`;
  o += `,subtitle:"${esc(get("subtitle") || "Monaco")}"`;
  o += `,desc:"${esc(get("desc") || get("title"))}"`;
  o += `,descEn:"${esc(get("descEn") || get("desc") || get("title"))}"`;
  o += `,free:${yes(get("free"))}`;
  o += `,hot:${yes(get("hot"))}`;
  o += `,fallback:"${st.f}",accent:"${st.a}",emoji:"${st.e}"`;
  if (get("link")) o += `,link:"${esc(get("link"))}"`;
  o += `,source:"Saisie manuelle"`;
  if (get("phone")) o += `,phone:"${esc(get("phone"))}"`;
  if (get("quarter")) o += `,quarter:"${esc(get("quarter"))}"`;
  o += `},`;
  return o;
}

async function main() {
  if (!URL_CSV) { console.error("SHEET_CSV_URL non défini. Abandon."); process.exit(0); }
  console.log("📋 Synchro Google Sheet…");
  const res = await fetch(URL_CSV);
  if (!res.ok) { console.error("Sheet inaccessible : HTTP", res.status); process.exit(1); }
  const rows = parseCSV(await res.text());
  if (rows.length < 2) { console.log("Sheet vide."); process.exit(0); }

  const idx = mapHeaders(rows[0]);
  let id = 5000;
  const objs = [];
  for (const row of rows.slice(1)) {
    const o = toEvent(row, idx, id);
    if (o) { objs.push(o); id++; }
  }
  console.log(`  → ${objs.length} événement(s) lus depuis le tableur.`);

  let src = readFileSync(EVENTS_FILE, "utf8");
  const block = `${BEGIN}\n${objs.join("\n")}\n  ${END}`;
  if (src.includes(BEGIN) && src.includes(END)) {
    src = src.replace(new RegExp(`${BEGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), block);
  } else {
    // Première fois : insérer juste avant la fermeture du tableau _RAW
    src = src.replace(/\n\];/, `\n\n  ${block}\n];`);
  }
  writeFileSync(EVENTS_FILE, src, "utf8");
  console.log(`  ✓ ${objs.length} événement(s) du tableur insérés dans events.js.`);
}

main().catch(e => { console.error(e); process.exit(1); });
