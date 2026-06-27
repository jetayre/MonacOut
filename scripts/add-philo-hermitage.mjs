// Ajoute la conférence Philomonaco « Écrire le désir » — sam 27 juin 15h, Hôtel Hermitage.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
let s = readFileSync(FILE, "utf8");
const id = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1])) + 1;
const NL = "\\n";
const card = `  {id:${id},cat:"CONFÉRENCE",date:"Sam 27 juin",time:"15h00 — 16h30",title:"ÉCRIRE${NL}LE DÉSIR${NL}PHILOMONACO",subtitle:"Hôtel Hermitage · Monte-Carlo",desc:"Rencontres Philosophiques de Monaco — « Écrire le désir » à l'Hôtel Hermitage. Avec Alice Ferney, Laurent Gaudé, Cécile Ladjali et Sylvie Hazebroucq. Une réflexion sur le désir et l'écriture.",descEn:"Monaco Philosophical Encounters — Writing desire, at the Hôtel Hermitage. With Alice Ferney, Laurent Gaudé, Cécile Ladjali and Sylvie Hazebroucq. A reflection on desire and writing.",free:false,hot:true,fallback:"linear-gradient(150deg,#3A2A5A,#5A4A7A,#1A0A3A)",accent:"#C8B8E8",emoji:"💭",link:"https://philomonaco.com",phone:"+377 9806 4000",source:"Philomonaco",quarter:"Monte-Carlo"},`;
const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n" + card + s.slice(idx);
writeFileSync(FILE, s);
console.log("✓ Conférence Philomonaco « Écrire le désir » ajoutée (id " + id + ").");
