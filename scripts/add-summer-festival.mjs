// Ajoute les concerts confirmés du Monte-Carlo Summer Festival 2026
// (source officielle : montecarlosbm.com). Dates vérifiées, jours recalculés.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const LINK = "https://www.montecarlosbm.com/fr/spectacles/monte-carlo-summer-festival";
const GRAD = "linear-gradient(150deg,#1A1240,#2D1F6E,#1A1240)";

const ETOILES = { sub: "Salle des Étoiles · Sporting Monte-Carlo", q: "Larvotto" };
const GARNIER = { sub: "Opéra Garnier · Monte-Carlo", q: "Monte-Carlo" };

function dstr(m, d) { return `${JOURS[new Date(2026, m, d).getDay()]} ${d} ${MOIS[m]}`; }

const artists = [
  { m: 6, d: 3,  t: "SÉBASTIEN\nTELLIER", v: GARNIER, en: "Sébastien Tellier live" },
  { m: 6, d: 31, t: "VANESSA\nPARADIS", v: GARNIER, en: "Vanessa Paradis live" },
  { m: 7, d: 1,  t: "LP\nEN CONCERT", v: ETOILES, en: "LP live" },
  { m: 7, d: 11, t: "LISA\nSTANSFIELD", v: ETOILES, en: "Lisa Stansfield live" },
  { m: 7, d: 15, t: "LAURA\nPAUSINI\nCLÔTURE", v: ETOILES, en: "Laura Pausini — closing night" },
];
const soul = [[6, 29], [6, 30], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9]];

const blocks = [];
const existing = readFileSync(FILE, "utf8");
let id = Math.max(...[...existing.matchAll(/\{id:(\d+),/g)].map((m) => +m[1])) + 1;
const esc = (str) => str.replace(/\n/g, "\\n").replace(/"/g, '\\"');
function ev(o) {
  const base = `linear-gradient(150deg,#1A1240,#2D1F6E,#1A1240)`;
  blocks.push(`  {id:${id},cat:"CONCERT",date:"${dstr(o.m, o.d)}",time:"20h30",title:"${esc(o.title)}",subtitle:"${esc(o.sub)}",desc:"${esc(o.desc)}",descEn:"${esc(o.descEn)}",free:false,hot:${o.hot ? "true" : "false"},fallback:"${base}",accent:"#C4A8F8",emoji:"🎵",link:"${LINK}",phone:"+377 9806 7071",source:"Monte-Carlo Summer Festival",quarter:"${o.q}"},`);
  id++;
}

for (const a of artists) {
  ev({
    m: a.m, d: a.d, title: a.t, sub: a.v.sub, q: a.v.q, hot: true,
    desc: `Concert au Monte-Carlo Summer Festival, ${a.v.sub}. La saison estivale la plus glamour de la Principauté.`,
    descEn: `${a.en} at the Monte-Carlo Summer Festival, ${a.v.sub.replace("Opéra Garnier", "Opéra Garnier opera house")}. The Principality's most glamorous summer season.`,
  });
}
for (const [m, d] of soul) {
  ev({
    m, d, title: "SOUL!\nWHERE LEGENDS\nCOME BACK", sub: ETOILES.sub, q: ETOILES.q, hot: false,
    desc: "SOUL! (where legends come back) — création exclusive du Sporting Monte-Carlo, hommage explosif aux pionniers du rock'n'roll (Chuck Berry, Little Richard…). Dîner-spectacle à la Salle des Étoiles.",
    descEn: "SOUL! (where legends come back) — an exclusive Sporting Monte-Carlo creation, an explosive tribute to rock'n'roll pioneers (Chuck Berry, Little Richard…). Dinner-show at the Salle des Étoiles.",
  });
}

let s = readFileSync(FILE, "utf8");
s = s.replace(/\n\];/, "\n" + blocks.join("\n") + "\n];");

// Corriger le Gala de la Croix-Rouge : 3 oct → 18 juil (création de SOUL!, source SBM)
s = s.replace(/(title:"GALA\\nDE LA CROIX-\\nROUGE"[\s\S]{0,3}?)/, (x) => x); // (no-op guard)
s = s.replace(/(\{id:\d+,cat:"GALA",date:")[^"]*(",[^}]*CROIX)/, `$1Sam 18 juil$2`);

writeFileSync(FILE, s);
console.log("Concerts Summer Festival ajoutés :", blocks.length, "(ids 2051–" + (id - 1) + ")");
