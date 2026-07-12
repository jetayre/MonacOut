// Remplace les fiches musées/cinémas individuelles par 2 fiches « annuaire » :
// une carte MUSÉES et une carte CINÉMA. Au clic, la pop-up liste tous les lieux
// avec leurs liens (champ directory:[...]). Ongoing → visibles tous les jours.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const t = new Date();
const today = `${JOURS[t.getDay()]} ${t.getDate()} ${MOIS[t.getMonth()]}`;
const NL = "\\n";

let s = readFileSync(FILE, "utf8");

// 1) Supprimer les 7 cartes individuelles ajoutées (musées + cinémas)
const removeIds = new Set([2050, 2113, 2114, 2115, 2116, 2117, 2118]);
s = s.split("\n").filter((l) => {
  const m = l.match(/^\s*\{id:(\d+),/);
  return !(m && removeIds.has(parseInt(m[1])));
}).join("\n");

// 2) Restaurer la fiche Timbres (id:363) : retirer ongoing/until + remettre sa date
s = s.split("\n").map((l) => {
  if (!/^\s*\{id:363,/.test(l)) return l;
  return l.replace(/,ongoing:true,until:"[^"]*"/, "").replace(/date:"[^"]*"/, 'date:"Ven 3 juil"');
}).join("\n");

// 3) Insérer les 2 cartes annuaire
const cards = [
  `  {id:2113,cat:"EXPOSITION",date:"${today}",time:"Tous les jours",title:"MUSÉES${NL}DE MONACO",subtitle:"Les incontournables · tous les jours",desc:"Les musées incontournables de Monaco, ouverts tous les jours. Touchez un lieu pour accéder à son site et ses infos.",descEn:"Monaco's must-see museums, open every day. Tap a venue for its website and details.",free:false,hot:true,fallback:"linear-gradient(150deg,#1A3A8A,#2A5AAA,#0A2060)",accent:"#90B8F8",emoji:"🏛️",source:"MonacOut",quarter:"Monaco",ongoing:true,until:"2027-06-30",directory:[{name:"Musée Océanographique",link:"https://musee.oceano.org/",info:"Monaco-Ville · 10h–18h"},{name:"Collection de Voitures du Prince",link:"https://www.palais.mc/",info:"Fontvieille · 10h–18h"},{name:"Nouveau Musée National — Villa Paloma & Sauber",link:"https://www.nmnm.mc/",info:"Monaco · sauf lundi"},{name:"Musée d'Anthropologie Préhistorique",link:"https://map.gouv.mc/",info:"Jardin Exotique · 9h–18h"},{name:"Musée des Timbres et des Monnaies",link:"https://www.mtm-monaco.mc/",info:"Fontvieille · 9h30–17h"},{name:"Grands Appartements du Palais",link:"https://www.palais.mc/",info:"Monaco-Ville · avr–oct"}]},`,
];

const idx = s.lastIndexOf("\n];");
if (idx === -1) { console.error("Marqueur `];` introuvable"); process.exit(1); }
s = s.slice(0, idx) + "\n\n  // ── ANNUAIRES EN COURS (1 carte = liste de lieux, tous les jours) ──\n" + cards.join("\n") + s.slice(idx);

writeFileSync(FILE, s);
console.log(`✓ 7 fiches retirées, Timbres restauré, 2 cartes annuaire ajoutées (Musées, Cinéma). Jour : ${today}`);
