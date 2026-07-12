// Réinstalle la rotation NIGHTLIFE hebdomadaire (soirées club + DJ) sur ~10 semaines.
// Vendredi : Twiga · Samedi : Jimmy'z + Sunset (DJ). Jours calculés → jamais d'erreur.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";
const WEEKS = 10;

const TWIGA = { cat:"SOIRÉE", title:`SOIRÉE${NL}TWIGA${NL}MONTE-CARLO`, subtitle:"Twiga Monte Carlo · Av. Princesse Grace", time:"20h00 — 04h00", link:"https://twigaworld.com/twiga-montecarlo/", phone:"+377 9999 2550", source:"Twiga Monte Carlo", quarter:"Larvotto", emoji:"🍾", fb:"linear-gradient(150deg,#3A0A50,#6A2A80,#200030)", ac:"#D0A0F0", desc:"La soirée du vendredi au Twiga Monte-Carlo : dîner-spectacle, performances live et dancefloor jusqu'à l'aube sur l'Avenue Princesse Grace.", descEn:"Friday night at Twiga Monte-Carlo: dinner-show, live performances and dancefloor until dawn on Avenue Princesse Grace." };
const JIMMYZ = { cat:"SOIRÉE", title:`JIMMY'Z${NL}SATURDAY${NL}NIGHT`, subtitle:"Jimmy'z · Monte-Carlo (SBM)", time:"23h30 — 05h00", link:"https://www.montecarlosbm.com/en/nightlife/jimmyz-monte-carlo", phone:"+377 9806 7000", source:"Jimmy'z Monte-Carlo", quarter:"Monte-Carlo", emoji:"🪩", fb:"linear-gradient(150deg,#1A0A3A,#3A1A6A,#0A0020)", ac:"#A890F0", desc:"La nuit la plus mythique de Monaco : Jimmy'z, le club légendaire du SBM. DJ internationaux et clubbing jusqu'au petit matin.", descEn:"Monaco's most legendary night: Jimmy'z, the iconic SBM club. International DJs and clubbing until the early hours." };
const SUNSET = { cat:"DJ SET", title:`SUNSET${NL}DJ SET${NL}LARVOTTO`, subtitle:"Sunset Monaco · Le Méridien · Larvotto", time:"18h00 — 00h00", link:"https://www.sunsetmonaco.com/", phone:"+377 9330 9880", source:"Sunset Monaco", quarter:"Larvotto", emoji:"🎧", fb:"linear-gradient(150deg,#7A2808,#B05828,#4A1800)", ac:"#F8A860", desc:"Le samedi sunset à la plage du Méridien : DJ set, cocktails et coucher de soleil sur la Méditerranée au Larvotto.", descEn:"Saturday sunset at the Méridien beach: DJ set, cocktails and sunset over the Mediterranean at Larvotto." };

let s = readFileSync(FILE, "utf8");
const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(3200, maxId + 1);
const card = (v, dateStr) =>
  `  {id:${id++},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",phone:"${v.phone}",source:"${v.source}",quarter:"${v.quarter}"},`;

const lines = [];
const start = new Date(); start.setHours(0,0,0,0);
for (let d = 0; d < WEEKS * 7; d++) {
  const day = new Date(start); day.setDate(start.getDate() + d);
  const dateStr = `${JOURS[day.getDay()]} ${day.getDate()} ${MOIS[day.getMonth()]}`;
  if (day.getDay() === 5) lines.push(card(TWIGA, dateStr));            // vendredi
  if (day.getDay() === 6) { lines.push(card(SUNSET, dateStr)); } // Jimmy'z: programmation SBM réelle (voir events.js) // samedi
}

const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── ROTATION NIGHTLIFE HEBDOMADAIRE (soirées club & DJ) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} fiches nightlife ajoutées sur ${WEEKS} semaines.`);
