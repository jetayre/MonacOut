// Consolide les expositions/attractions EN COURS : une seule fiche chacune,
// marquée { ongoing:true, until:"YYYY-MM-DD" }, datée d'aujourd'hui.
// Les copies hebdomadaires en double sont supprimées. La fiche est ensuite
// re-datée sur le jour même chaque jour par refresh-cinema.mjs (daily-check).
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = { jan:0,"fév":1,mar:2,avr:3,mai:4,juin:5,juil:6,"août":7,sep:8,oct:9,nov:10,"déc":11 };
const MOIS_ARR = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

const today = new Date(); today.setHours(0,0,0,0);
const todayStr = `${JOURS[today.getDay()]} ${today.getDate()} ${MOIS_ARR[today.getMonth()]}`;

// Groupes d'attractions en cours (test sur le titre normalisé sans retours ligne)
const GROUPS = [
  { name: "Musée Océanographique",  test: t => /MÉDITERRANÉE 2050/.test(t) },
  { name: "Palais — Rainier & Grace", test: t => /RAINIER III & GRACE KELLY/.test(t) },
  { name: "NMNM Villa Sauber",      test: t => /LUMIÈRES DE MÉDITERRANÉE/.test(t) },
  { name: "Collection de Voitures", test: t => /COLLECTION VOITURES PRINCIÈRES/.test(t) || /MONACO & L'AUTOMOBILE 1893/.test(t) },
  { name: "Musée d'Anthropologie",  test: t => /DE TOUMAÏ À SAPIENS/.test(t) },
];

function lineInfo(l) {
  const idM = l.match(/^\s*\{id:(\d+),/); if (!idM) return null;
  const titleM = l.match(/title:"([^"]*)"/);
  const dateM = l.match(/date:"([^"]*)"/);
  const yearM = l.match(/year:(\d+)/);
  if (!titleM || !dateM) return null;
  const norm = titleM[1].replace(/\\n/g, " ");
  const parts = dateM[1].split(" ");
  const day = parseInt(parts[1]); const mo = MOIS[parts[2]];
  const year = yearM ? parseInt(yearM[1]) : 2026;
  const d = (mo !== undefined && !isNaN(day)) ? new Date(year, mo, day) : null;
  return { id: idM[1], norm, dateStr: dateM[1], d, line: l };
}

let lines = readFileSync(FILE, "utf8").split("\n");
const toRemove = new Set();
const edits = new Map(); // index -> new line

for (const g of GROUPS) {
  const matches = [];
  lines.forEach((l, i) => { const info = lineInfo(l); if (info && g.test(info.norm)) matches.push({ ...info, i }); });
  if (matches.length === 0) { console.log(`(${g.name}: aucune fiche)`); continue; }
  // date de fin = date max parmi les copies
  let maxD = matches[0].d || today;
  for (const m of matches) if (m.d && m.d > maxD) maxD = m.d;
  const until = `${maxD.getFullYear()}-${String(maxD.getMonth()+1).padStart(2,"0")}-${String(maxD.getDate()).padStart(2,"0")}`;
  // fiche canonique = la première copie ; on la redate aujourd'hui + ongoing/until
  const canon = matches[0];
  let newLine = canon.line
    .replace(/date:"[^"]*"/, `date:"${todayStr}"`)
    .replace(/,year:\d+/, "");                       // l'attraction est "en cours", pas datée 2027
  if (!/ongoing:true/.test(newLine)) newLine = newLine.replace(/\}(,?)\s*$/, `,ongoing:true,until:"${until}"}$1`);
  edits.set(canon.i, newLine);
  // supprimer les autres copies
  matches.slice(1).forEach(m => toRemove.add(m.i));
  console.log(`${g.name}: ${matches.length} fiche(s) → 1 (en cours jusqu'au ${until}), ${matches.length-1} doublon(s) retiré(s)`);
}

lines = lines.map((l, i) => edits.has(i) ? edits.get(i) : l).filter((_, i) => !toRemove.has(i));
writeFileSync(FILE, lines.join("\n"));
console.log("✓ terminé. Date du jour :", todayStr);
