// Ajoute le Jumping International de Monaco 2026 (Longines Global Champions Tour),
// Port Hercule, 2-4 juillet 2026 (20e anniversaire). Jours vérifiés : jeu 2 / ven 3 / sam 4.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const NL = "\\n";

const cards = [
  `  {id:2119,cat:"SPORT",date:"Jeu 2 juil",time:"14h00 — 23h00",title:"JUMPING${NL}INTERNATIONAL${NL}DE MONACO",subtitle:"Port Hercule · La Condamine",desc:"Coup d'envoi du Jumping International de Monaco — 20e anniversaire. Étape du Longines Global Champions Tour : les meilleurs cavaliers du monde s'affrontent au cœur du Port Hercule, sous les remparts du Palais.",descEn:"Opening of the Jumping International de Monaco — 20th anniversary. A Longines Global Champions Tour stage: the world's best riders compete in the heart of Port Hercule, beneath the Palace ramparts.",free:false,hot:true,fallback:"linear-gradient(150deg,#1A4A3A,#2A6A5A,#0A2A20)",accent:"#90E0C0",emoji:"🐴",link:"https://www.jumping-monaco.com/",source:"Jumping International de Monaco",quarter:"La Condamine"},`,
  `  {id:2120,cat:"SPORT",date:"Ven 3 juil",time:"14h00 — 23h00",title:"JUMPING${NL}MONACO${NL}2E JOURNÉE",subtitle:"Port Hercule · La Condamine",desc:"Deuxième journée du Jumping International de Monaco. Épreuves du Longines Global Champions Tour et de la Global Champions League dans un cadre unique au bord du port.",descEn:"Day two of the Jumping International de Monaco. Longines Global Champions Tour and Global Champions League classes in a unique setting by the port.",free:false,hot:false,fallback:"linear-gradient(150deg,#1A4A3A,#2A6A5A,#0A2A20)",accent:"#90E0C0",emoji:"🐴",link:"https://www.jumping-monaco.com/",source:"Jumping International de Monaco",quarter:"La Condamine"},`,
  `  {id:2121,cat:"SPORT",date:"Sam 4 juil",time:"15h00 — 23h00",title:"JUMPING MONACO${NL}GRAND PRIX${NL}LONGINES GCT",subtitle:"Port Hercule · La Condamine",desc:"Grand Prix de Monaco du Longines Global Champions Tour — le sommet du Jumping International. Les cavaliers d'élite mondiaux pour la grande épreuve du samedi soir au Port Hercule.",descEn:"Monaco Grand Prix of the Longines Global Champions Tour — the highlight of the Jumping International. The world's elite riders for the major Saturday evening class at Port Hercule.",free:false,hot:true,fallback:"linear-gradient(150deg,#1A4A3A,#2A6A5A,#0A2A20)",accent:"#90E0C0",emoji:"🐴",link:"https://www.jumping-monaco.com/",source:"Jumping International de Monaco",quarter:"La Condamine"},`,
];

let s = readFileSync(FILE, "utf8");
const idx = s.lastIndexOf("\n];");
if (idx === -1) { console.error("Marqueur _RAW `];` introuvable"); process.exit(1); }
s = s.slice(0, idx) + "\n" + cards.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log("✓ Jumping International de Monaco ajouté (3 jours : 2-4 juil 2026).");
