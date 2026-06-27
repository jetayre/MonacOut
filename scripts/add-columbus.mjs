// Ajoute l'apéro de la terrasse du Tavolo (Columbus Monte-Carlo, Fontvieille)
// chaque vendredi soir sur ~10 semaines. Offre réelle : bar de terrasse / cocktails
// signature servis tous les soirs face à la Roseraie Princesse Grace.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";
const WEEKS = 10;

const V = { cat:"APÉRO", title:`APÉRO TERRASSE${NL}TAVOLO${NL}COLUMBUS`, subtitle:"Tavolo · Columbus Monte-Carlo · Fontvieille", time:"18h00 — 22h30", link:"https://www.columbushotels.com/", phone:"+377 9205 9000", source:"Columbus Monte-Carlo", quarter:"Fontvieille", emoji:"🍸", fb:"linear-gradient(150deg,#5A3A1A,#7A5A3A,#3A2008)", ac:"#E8C8A0", desc:"Apéro sur la terrasse du Tavolo, au Columbus Monte-Carlo à Fontvieille : cocktails signature et créations de saison face à la Roseraie Princesse Grace.", descEn:"Apéritif on the Tavolo terrace at the Columbus Monte-Carlo in Fontvieille: signature cocktails and seasonal creations facing the Princess Grace Rose Garden." };

let s = readFileSync(FILE, "utf8");
const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(3400, maxId + 1);
const card = (v, dateStr) =>
  `  {id:${id++},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",phone:"${v.phone}",source:"${v.source}",quarter:"${v.quarter}"},`;

const lines = [];
const start = new Date(); start.setHours(0,0,0,0);
for (let d = 0; d < WEEKS * 7; d++) {
  const day = new Date(start); day.setDate(start.getDate() + d);
  if (day.getDay() !== 5) continue; // vendredi
  const dateStr = `${JOURS[day.getDay()]} ${day.getDate()} ${MOIS[day.getMonth()]}`;
  lines.push(card(V, dateStr));
}
const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── APÉRO TERRASSE COLUMBUS (Tavolo, vendredi, Fontvieille) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} apéros Columbus (Tavolo) ajoutés (vendredis).`);
