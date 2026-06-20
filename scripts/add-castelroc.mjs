// Dîner au Castelroc — tous les jeudis, vendredis, samedis jusqu'au 31 août 2026.
// Confirmé directement par Stéphanie (donc légitime, pas une récurrence inventée).
import { readFileSync, writeFileSync } from "fs";
const FILE = "src/data/events.js";
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

let s = readFileSync(FILE, "utf8");
let id = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map((m) => +m[1])) + 1;

const start = new Date(2026, 5, 20);   // 20 juin
const end = new Date(2026, 7, 31);     // 31 août
const blocks = [];
for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
  const dow = d.getDay();
  if (dow !== 4 && dow !== 5 && dow !== 6) continue;  // jeudi, vendredi, samedi
  const date = `${JOURS[dow]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  blocks.push(`  {id:${id++},cat:"SOIRÉE",date:"${date}",time:"19h30",title:"DÎNER\\nCASTELROC",subtitle:"Castelroc · Monaco-Ville",desc:"Dîner au Castelroc, restaurant monégasque sur la Place du Palais, face au Palais Princier. Cuisine traditionnelle et terrasse avec vue.",descEn:"Dinner at Castelroc, a Monegasque restaurant on Place du Palais, facing the Prince's Palace. Traditional cuisine and a terrace with a view.",free:false,hot:false,fallback:"linear-gradient(150deg,#3A2000,#6A4010,#200A00)",accent:"#E0A840",emoji:"🍽️",link:"https://www.castelrocmonaco.com/",phone:"+377 93 30 36 68",source:"Castelroc Monaco",quarter:"Monaco-Ville"},`);
}
s = s.replace(/\n\];/, "\n" + blocks.join("\n") + "\n];");
writeFileSync(FILE, s);
console.log("Dîners Castelroc ajoutés :", blocks.length);
