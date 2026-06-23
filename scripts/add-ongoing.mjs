// Ajoute / marque les attractions EN COURS (ongoing:true) : musées incontournables
// ouverts tous les jours + cinéma (salle) + cinéma en plein air d'été.
// Elles sont redatées sur le jour même chaque jour par refresh-cinema.mjs,
// donc « Aujourd'hui » n'est jamais vide.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const t = new Date();
const today = `${JOURS[t.getDay()]} ${t.getDate()} ${MOIS[t.getMonth()]}`;

let s = readFileSync(FILE, "utf8");

// 1) Musée des Timbres & Monnaies (déjà présent id:363) → ongoing + redaté aujourd'hui
s = s.split("\n").map((l) => {
  if (!/^\s*\{id:363,/.test(l)) return l;
  let n = l.replace(/date:"[^"]*"/, `date:"${today}"`);
  if (!/ongoing:true/.test(n)) n = n.replace(/\}(,?)\s*$/, `,ongoing:true,until:"2027-06-30"}$1`);
  return n;
}).join("\n");

// 2) Nouvelles fiches ongoing
const NL = "\\n";
const cards = [
  `  {id:2050,cat:"CINÉMA",date:"${today}",time:"Séances tous les jours",title:"CINÉMA${NL}DES${NL}BEAUX-ARTS",subtitle:"Cinéma des Beaux-Arts · Monte-Carlo",desc:"À l'affiche tous les jours au Cinéma des Beaux-Arts de Monaco. Programmation et horaires en temps réel sur le site des Cinémas de Monaco.",descEn:"Now showing every day at Monaco's Cinéma des Beaux-Arts. Live programme and showtimes on the Cinémas de Monaco website.",free:false,hot:false,fallback:"linear-gradient(150deg,#2A1A3A,#4A2A5A,#1A0A2A)",accent:"#C8A8E0",emoji:"🎬",link:"https://www.cinemas2monaco.com/",phone:"+377 9325 3681",source:"Cinémas de Monaco",quarter:"Monte-Carlo",ongoing:true,until:"2026-12-31"},`,
  `  {id:2113,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"MUSÉE${NL}OCÉANOGRAPHIQUE${NL}DE MONACO",subtitle:"Musée Océanographique · Monaco-Ville",desc:"Le musée emblématique de la Principauté, sur le Rocher face à la Méditerranée : aquariums, expositions marines et histoire de l'océanographie fondée par le Prince Albert Ier. Ouvert tous les jours.",descEn:"The Principality's iconic museum, on the Rock facing the Mediterranean: aquariums, marine exhibitions and the history of oceanography founded by Prince Albert I. Open every day.",free:false,hot:true,fallback:"linear-gradient(150deg,#1A3A8A,#2A5AAA,#0A2060)",accent:"#90B8F8",emoji:"🐠",link:"https://musee.oceano.org/",phone:"+377 9315 3600",source:"Musée Océanographique",quarter:"Monaco-Ville",ongoing:true,until:"2027-06-30"},`,
  `  {id:2114,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"COLLECTION${NL}DE VOITURES${NL}DU PRINCE",subtitle:"Collection de Voitures · Fontvieille",desc:"La collection de voitures anciennes et de prestige du Prince de Monaco : bolides, voitures de course et carrosses princiers réunis par le Prince Rainier III. Ouvert tous les jours.",descEn:"The Prince of Monaco's collection of vintage and prestige cars: racing cars and princely carriages gathered by Prince Rainier III. Open every day.",free:false,hot:false,fallback:"linear-gradient(150deg,#6A3010,#8A5030,#4A1800)",accent:"#F0C0A0",emoji:"🚗",link:"https://www.palais.mc/",phone:"+377 9325 1831",source:"Collection de Voitures du Prince",quarter:"Fontvieille",ongoing:true,until:"2027-06-30"},`,
  `  {id:2115,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"NOUVEAU MUSÉE${NL}NATIONAL${NL}DE MONACO",subtitle:"Villa Paloma & Villa Sauber · Monaco",desc:"Les deux villas du NMNM consacrées à l'art contemporain, au design et aux expositions temporaires. Architecture Belle Époque et jardins. Ouvert tous les jours sauf lundi.",descEn:"The two NMNM villas dedicated to contemporary art, design and temporary exhibitions. Belle Époque architecture and gardens. Open daily except Monday.",free:false,hot:false,fallback:"linear-gradient(150deg,#5A2A6A,#7A4A8A,#3A1A4A)",accent:"#D8B0E8",emoji:"🎨",link:"https://www.nmnm.mc/",source:"Nouveau Musée National de Monaco",quarter:"Monte-Carlo",ongoing:true,until:"2027-06-30"},`,
  `  {id:2116,cat:"EXPOSITION",date:"${today}",time:"09h00 — 18h00",title:"MUSÉE${NL}D'ANTHROPOLOGIE${NL}PRÉHISTORIQUE",subtitle:"Musée d'Anthropologie Préhistorique · Jardin Exotique",desc:"Consacré à la préhistoire et aux découvertes archéologiques de la région : ossements, outils et collections du paléolithique. Au cœur du Jardin Exotique.",descEn:"Dedicated to prehistory and the region's archaeological discoveries: bones, tools and Palaeolithic collections. At the heart of the Exotic Garden.",free:false,hot:false,fallback:"linear-gradient(150deg,#6A4A28,#8A6A48,#4A2A08)",accent:"#D4B888",emoji:"🦴",link:"https://map.gouv.mc/",phone:"+377 9315 0640",source:"Musée d'Anthropologie Préhistorique",quarter:"Monaco",ongoing:true,until:"2027-06-30"},`,
  `  {id:2117,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"GRANDS${NL}APPARTEMENTS${NL}DU PALAIS",subtitle:"Palais Princier · Monaco-Ville",desc:"Visite des Grands Appartements du Palais Princier de Monaco : salle du Trône, galerie d'Hercule et cour d'honneur. Ouvert au public d'avril à mi-octobre.",descEn:"Visit the State Apartments of Monaco's Princely Palace: the Throne Room, Hercules Gallery and Court of Honour. Open to the public from April to mid-October.",free:false,hot:true,fallback:"linear-gradient(150deg,#806828,#A08840,#605018)",accent:"#F4E0A0",emoji:"👑",link:"https://www.palais.mc/",phone:"+377 9325 1831",source:"Palais Princier",quarter:"Monaco-Ville",ongoing:true,until:"2026-10-15"},`,
  `  {id:2118,cat:"CINÉMA",date:"${today}",time:"21h30",title:"CINÉMA${NL}EN PLEIN AIR${NL}D'ÉTÉ",subtitle:"Monaco Open Air Cinema · Monte-Carlo",desc:"Le cinéma en plein air de Monaco, sous les étoiles tout l'été. Projections en soirée par les Cinémas de Monaco. Programmation et horaires sur le site officiel.",descEn:"Monaco's open-air cinema, under the stars all summer long. Evening screenings by Cinémas de Monaco. Programme and showtimes on the official website.",free:false,hot:true,fallback:"linear-gradient(150deg,#0A2A4A,#1A4A6A,#04162A)",accent:"#8AC0E8",emoji:"🎬",link:"https://www.cinemas2monaco.com/",phone:"+377 9325 3681",source:"Cinémas de Monaco",quarter:"Monte-Carlo",ongoing:true,until:"2026-09-15"},`,
];

const idx = s.lastIndexOf("\n];");
if (idx === -1) { console.error("Marqueur _RAW `];` introuvable"); process.exit(1); }
s = s.slice(0, idx) + "\n\n  // ── EN COURS / TOUS LES JOURS (ongoing:true — redaté chaque jour) ──\n" + cards.join("\n") + s.slice(idx);

writeFileSync(FILE, s);
console.log(`✓ ${cards.length} fiches ongoing ajoutées + Timbres marqué ongoing. Date du jour : ${today}`);
