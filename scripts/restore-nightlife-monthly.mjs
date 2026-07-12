// Rétablit les récurrences NIGHTLIFE mensuelles manquantes (apéros / soirées / rooftop).
// Jours calculés (nᵉ jeudi/vendredi/samedi du mois) → jamais d'erreur de jour.
// Saisons respectées (Nikki mai→sep, Équivoque mai→oct). Fenêtre : aujourd'hui → mai 2027.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE  = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS  = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";

// nᵉ jour de semaine du mois (n=1..5, ou -1 = dernier). wd: 0=dim..6=sam
function nth(y, m, wd, n) {
  if (n === -1) {
    const last = new Date(y, m + 1, 0).getDate();
    for (let d = last; d >= 1; d--) if (new Date(y, m, d).getDay() === wd) return new Date(y, m, d);
    return null;
  }
  let c = 0;
  for (let d = 1; d <= 31; d++) {
    const dt = new Date(y, m, d);
    if (dt.getMonth() !== m) break;
    if (dt.getDay() === wd) { c++; if (c === n) return dt; }
  }
  return null;
}

// wd: 4=jeu 5=ven 6=sam · occ: liste des occurrences (3 = 3e, -1 = dernier) · months: mois autorisés (0=jan) ou null=tous
const V = [
  { cat:"APÉRO",  wd:5, occ:[3],    months:null,          title:`APÉRO${NL}PANINO${NL}CLUB`,       subtitle:"Panino Club · Bd des Moulins · Monte-Carlo", time:"19h00 — 23h00", link:"https://panino-club.com/",                                                    phone:"",              quarter:"Monte-Carlo", emoji:"🍸", fb:"linear-gradient(150deg,#3A2A10,#6A4A20,#2A1A00)", ac:"#F0C878", desc:"L'apéro du 3e vendredi au Panino Club, boulevard des Moulins : cocktails, tapas et ambiance conviviale.", descEn:"Third-Friday aperitivo at Panino Club on Boulevard des Moulins: cocktails, tapas and a friendly vibe." },
  { cat:"APÉRO",  wd:5, occ:[-1],   months:null,          title:`APÉRO${NL}TRINITY${NL}MONACO`,     subtitle:"Trinity Monaco · Monte-Carlo",               time:"En soirée",     link:"https://www.instagram.com/trinitymonaco/",                                    phone:"",              quarter:"Monte-Carlo", emoji:"🍸", fb:"linear-gradient(150deg,#2A1030,#4A2A5A,#180020)", ac:"#D0A8E8", desc:"L'apéro du dernier vendredi du mois chez Trinity Monaco : cocktails et ambiance.", descEn:"Last-Friday aperitivo at Trinity Monaco: cocktails and a lively vibe." },
  { cat:"APÉRO",  wd:4, occ:[2],    months:null,          title:`SLAMMERS${NL}SPORTS BAR${NL}MONACO`, subtitle:"Slammers · Monaco",                        time:"En soirée",     link:"https://www.instagram.com/slammers_monaco/",                                  phone:"",              quarter:"Monaco",      emoji:"🍻", fb:"linear-gradient(150deg,#1A2A3A,#2A4A5A,#0A1A2A)", ac:"#90C0D8", desc:"Soirée sports bar du 2e jeudi chez Slammers : bières, écrans et ambiance conviviale.", descEn:"Second-Thursday sports-bar night at Slammers: craft beers, screens and a great vibe." },
  { cat:"APÉRO",  wd:4, occ:[1],    months:null,          title:`SHIP & CASTLE${NL}PUB NIGHT${NL}MONACO`, subtitle:"Ship & Castle · Monaco",               time:"En soirée",     link:"https://www.instagram.com/shipandcastlemonaco/",                              phone:"",              quarter:"Monaco",      emoji:"🍺", fb:"linear-gradient(150deg,#2A1A0A,#4A3A1A,#1A0A00)", ac:"#E0C088", desc:"Pub night / quiz du 1er jeudi au Ship & Castle, le pub britannique de Monaco.", descEn:"First-Thursday pub night / quiz at Ship & Castle, Monaco's British pub." },
  { cat:"SOIRÉE", wd:6, occ:[3],    months:null,          title:`LILLY'S${NL}CLUB${NL}NIGHT`,        subtitle:"Lilly's Club · Monte-Carlo",                 time:"23h00 — 05h00", link:"https://lillysclub.com/",                                                     phone:"",              quarter:"Monte-Carlo", emoji:"🪩", fb:"linear-gradient(150deg,#1A0A3A,#3A1A6A,#0A0020)", ac:"#A890F0", desc:"La soirée club du 3e samedi chez Lilly's : DJ et dancefloor jusqu'au petit matin.", descEn:"Third-Saturday club night at Lilly's: DJs and dancefloor until dawn." },
  { cat:"BRUNCH", wd:6, occ:[1],    months:[4,5,6,7,8],   title:`NIKKI BEACH${NL}BRUNCH${NL}LARVOTTO`, subtitle:"Nikki Beach · Larvotto",                  time:"12h00 — 18h00", link:"https://nikkibeach.com/monte-carlo/",                                         phone:"+377 9330 0700", quarter:"Larvotto",   emoji:"🏖️", fb:"linear-gradient(150deg,#1A6A8A,#2A8AAA,#0A4A6A)", ac:"#90E0F0", desc:"Le brunch-fête du samedi au Nikki Beach : DJ, piscine et ambiance beach club face à la mer.", descEn:"Saturday party-brunch at Nikki Beach: DJ, pool and beach-club vibes by the sea." },
  { cat:"APÉRO",  wd:5, occ:[1],    months:null,          title:`APÉRO${NL}JACK${NL}MONACO`,        subtitle:"Jack Monaco · Monaco",                       time:"En soirée",     link:"https://jackmonaco.playfun.tv/",                                              phone:"",              quarter:"Monaco",      emoji:"🍸", fb:"linear-gradient(150deg,#2A1A2A,#4A2A4A,#1A0A1A)", ac:"#E0A0D0", desc:"L'apéro du 1er vendredi chez Jack Monaco : cocktails et ambiance festive.", descEn:"First-Friday aperitivo at Jack Monaco: cocktails and a festive vibe." },
  { cat:"SOIRÉE", wd:6, occ:[1],    months:null,          title:`SOIRÉE${NL}JACK${NL}MONACO`,       subtitle:"Jack Monaco · Monaco",                       time:"En soirée",     link:"https://jackmonaco.playfun.tv/",                                              phone:"",              quarter:"Monaco",      emoji:"🪩", fb:"linear-gradient(150deg,#1A0A2A,#3A1A4A,#0A0018)", ac:"#B090E0", desc:"La soirée du 1er samedi chez Jack Monaco : DJ et dancefloor.", descEn:"First-Saturday night at Jack Monaco: DJ and dancefloor." },
  { cat:"APÉRO",  wd:5, occ:[1,3],  months:[4,5,6,7,8,9], title:`ÉQUIVOQUE${NL}ROOFTOP${NL}SUNSET`, subtitle:"Équivoque Rooftop · Monte-Carlo",            time:"En soirée",     link:"https://www.equivoquemc.com/",                                                 phone:"+33 6 07 93 47 45", quarter:"Monte-Carlo", emoji:"🌇", fb:"linear-gradient(150deg,#7A2808,#B05828,#4A1800)", ac:"#F8A860", desc:"Apéro & DJ set sur le rooftop de l'Équivoque : coucher de soleil, cocktails et musique.", descEn:"Rooftop aperitivo & DJ set at Équivoque: sunset, cocktails and music." },
  { cat:"APÉRO",  wd:4, occ:[1],    months:null,          title:`APÉRO${NL}BLUE GIN${NL}MC BAY`,    subtitle:"Blue Gin · Monte-Carlo Bay · Larvotto",      time:"En soirée",     link:"https://www.montecarlosbm.com/en/bar-nightclub-monaco/the-blue-gin",           phone:"",              quarter:"Larvotto",    emoji:"🍸", fb:"linear-gradient(150deg,#0A2A4A,#1A4A6A,#04162A)", ac:"#8AC0E8", desc:"L'apéro du 1er jeudi au Blue Gin du Monte-Carlo Bay : cocktails face à la lagune.", descEn:"First-Thursday aperitivo at the Blue Gin, Monte-Carlo Bay: cocktails by the lagoon." },
  { cat:"SOIRÉE", wd:6, occ:[2,4],  months:null,          title:`AMAZÓNICO${NL}MONTE-CARLO`,        subtitle:"Amazónico · Place du Casino · Monte-Carlo",  time:"18h00 — 02h00", link:"https://www.montecarlosbm.com/en/restaurant-monaco/amazonico-monte-carlo",     phone:"",              quarter:"Monte-Carlo", emoji:"🌴", fb:"linear-gradient(150deg,#0A3A1A,#1A6A3A,#04220A)", ac:"#8AE0A0", desc:"Dîner festif et musique live à l'Amazónico, place du Casino : cuisine latino-tropicale, ambiance jungle et DJ jusqu'à 2h.", descEn:"Festive dinner and live music at Amazónico, Place du Casino: Latin-tropical cuisine, jungle vibes and DJ until 2am." },
  { cat:"SOIRÉE", wd:5, occ:"all",  months:null,          title:`SOIRÉE${NL}TWIGA${NL}MONTE-CARLO`, subtitle:"Twiga Monte Carlo · Av. Princesse Grace",    time:"20h00 — 04h00", link:"https://twigaworld.com/twiga-montecarlo/",                                     phone:"+377 9999 2550", quarter:"Larvotto",   emoji:"🍾", fb:"linear-gradient(150deg,#3A0A50,#6A2A80,#200030)", ac:"#D0A0F0", desc:"La soirée du vendredi au Twiga Monte-Carlo : dîner-spectacle, performances live et dancefloor jusqu'à l'aube.", descEn:"Friday night at Twiga Monte-Carlo: dinner-show, live performances and dancefloor until dawn." },
  { cat:"DJ SET", wd:6, occ:"all",  months:null,          title:`SUNSET${NL}DJ SET${NL}LARVOTTO`,   subtitle:"Sunset Monaco · Le Méridien · Larvotto",     time:"18h00 — 00h00", link:"https://www.sunsetmonaco.com/",                                                phone:"+377 9330 9880", quarter:"Larvotto",   emoji:"🎧", fb:"linear-gradient(150deg,#7A2808,#B05828,#4A1800)", ac:"#F8A860", desc:"Le samedi sunset à la plage du Méridien : DJ set, cocktails et coucher de soleil sur la Méditerranée.", descEn:"Saturday sunset at the Méridien beach: DJ set, cocktails and sunset over the Mediterranean." },
  { cat:"SOIRÉE", wd:5, occ:"all",  months:null,          title:`LA RASCASSE${NL}LIVE & DJ${NL}PORT HERCULE`, subtitle:"La Rascasse · Port Hercule · La Condamine", time:"En soirée",   link:"https://www.montecarlosbm.com/en/bar-nightclub-monaco/la-rascasse",             phone:"",              quarter:"La Condamine", emoji:"🏁", fb:"linear-gradient(150deg,#2A0A0A,#5A1A1A,#1A0000)", ac:"#F09090", desc:"Soirée live music & DJ à La Rascasse, sur le virage mythique du Grand Prix : concept sports bar, cocktails et ambiance jusqu'au petit matin.", descEn:"Live music & DJ night at La Rascasse, on the legendary Grand Prix hairpin: sports-bar concept, cocktails and vibes until dawn." },
];

let s = readFileSync(FILE, "utf8");

// ── IDEMPOTENT : retire les fiches déjà générées par ce script (marqueur nlg:1
//    ou nos sources exactes) + l'ancien commentaire de section, AVANT de régénérer.
//    → réexécutable chaque jour sans jamais créer de doublons.
const SOURCES = new Set(V.map(v => v.subtitle.split(" · ")[0]));
s = s.split("\n").filter(l => {
  if (l.includes("nlg:1")) return false;
  const m = l.match(/source:"([^"]+)"/);
  if (m && SOURCES.has(m[1])) return false;
  return true;
}).join("\n");
s = s.replace(/\n\s*\/\/ ── RÉCURRENCES NIGHTLIFE MENSUELLES[^\n]*/g, "");

const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(3600, maxId + 1);

// ── FENÊTRE GLISSANTE : aujourd'hui → +12 mois. Régénéré chaque jour (via daily-check)
//    → avance d'un jour chaque jour, ne s'arrête jamais.
const today = new Date(); today.setHours(0, 0, 0, 0);
const end   = new Date(today); end.setFullYear(end.getFullYear() + 1);
const lines = [];

for (const v of V) {
  const cur = new Date(today.getFullYear(), today.getMonth(), 1);
  while (cur <= end) {
    const y = cur.getFullYear(), m = cur.getMonth();
    if (!v.months || v.months.includes(m)) {
      for (const n of (v.occ === "all" ? [1,2,3,4,5] : v.occ)) {
        const dt = nth(y, m, v.wd, n);
        if (dt && dt >= today && dt <= end) {
          const dateStr = `${JOURS[dt.getDay()]} ${dt.getDate()} ${MOIS[dt.getMonth()]}`;
          lines.push(`  {id:${id++},year:${dt.getFullYear()},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,nlg:1,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",${v.phone ? `phone:"${v.phone}",` : ""}source:"${v.subtitle.split(" · ")[0]}",quarter:"${v.quarter}"},`);
        }
      }
    }
    cur.setMonth(cur.getMonth() + 1);
  }
}

const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── RÉCURRENCES NIGHTLIFE MENSUELLES (fenêtre glissante 12 mois, régénérée chaque jour) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} fiches nightlife régénérées (fenêtre glissante 12 mois, ${V.length} lieux).`);
