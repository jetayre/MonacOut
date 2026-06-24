// Ajoute Stars of Monaco (restaurant & bar, 6 Quai Antoine 1er, Port) chaque
// samedi sur ~10 semaines. Successeur de Stars'N'Bars au même endroit.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";
const WEEKS = 10;

const STARS = { cat:"APÉRO", title:`STARS OF${NL}MONACO${NL}LE PORT`, subtitle:"Stars of Monaco · Quai Antoine 1er", time:"18h00 — 00h00", link:"https://starsofmonaco.com", phone:"+377 9797 9595", source:"Stars of Monaco", quarter:"La Condamine", emoji:"🍸", fb:"linear-gradient(150deg,#1A3A6A,#2A5A8A,#0A1A3A)", ac:"#90B8E8", desc:"Restaurant et bar sur le Port de Monaco, Quai Antoine 1er : cuisine conviviale, cocktails et terrasse face aux yachts. Le rendez-vous du samedi soir.", descEn:"Restaurant and bar on the Port of Monaco, Quai Antoine 1er: convivial cuisine, cocktails and a terrace facing the yachts. The Saturday evening spot." };

let s = readFileSync(FILE, "utf8");
const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(3300, maxId + 1);
const card = (v, dateStr) =>
  `  {id:${id++},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",phone:"${v.phone}",source:"${v.source}",quarter:"${v.quarter}"},`;

const lines = [];
const start = new Date(); start.setHours(0,0,0,0);
for (let d = 0; d < WEEKS * 7; d++) {
  const day = new Date(start); day.setDate(start.getDate() + d);
  if (day.getDay() !== 6) continue; // samedi
  const dateStr = `${JOURS[day.getDay()]} ${day.getDate()} ${MOIS[day.getMonth()]}`;
  lines.push(card(STARS, dateStr));
}

// Soirée de lancement — vendredi 26 juin 2026 (happy hour 18h30-19h30), mise en avant
lines.push(`  {id:${id++},cat:"SOIRÉE",date:"Ven 26 juin",time:"18h30 — 00h00",title:"SOIRÉE${NL}DE LANCEMENT${NL}STARS OF MONACO",subtitle:"Stars of Monaco · Quai Antoine 1er",desc:"Soirée de lancement de Stars of Monaco sur le Port (Quai Antoine 1er) ! Happy hour de 18h30 à 19h30, puis ambiance festive toute la soirée : cocktails et terrasse face aux yachts.",descEn:"Launch party for Stars of Monaco on the Port (Quai Antoine 1er)! Happy hour from 6:30 to 7:30 pm, then a festive evening: cocktails and a terrace facing the yachts.",free:false,hot:true,fallback:"linear-gradient(150deg,#5A1030,#8A3050,#380010)",accent:"#F0A0C0",emoji:"🎉",link:"https://starsofmonaco.com",phone:"+377 9797 9595",source:"Stars of Monaco",quarter:"La Condamine"},`);

const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── STARS OF MONACO (samedi, Port) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} fiches Stars of Monaco ajoutées (samedis).`);
