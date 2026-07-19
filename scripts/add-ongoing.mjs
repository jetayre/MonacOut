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
  `  {id:2113,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"MUSÉE${NL}OCÉANOGRAPHIQUE${NL}DE MONACO",subtitle:"Musée Océanographique · Monaco-Ville",desc:"Le musée emblématique de la Principauté, sur le Rocher face à la Méditerranée : aquariums, expositions marines et histoire de l'océanographie fondée par le Prince Albert Ier. Ouvert tous les jours.",descEn:"The Principality's iconic museum, on the Rock facing the Mediterranean: aquariums, marine exhibitions and the history of oceanography founded by Prince Albert I. Open every day.",free:false,hot:true,fallback:"linear-gradient(150deg,#1A3A8A,#2A5AAA,#0A2060)",accent:"#90B8F8",emoji:"🐠",link:"https://musee.oceano.org/",phone:"+377 9315 3600",source:"Musée Océanographique",quarter:"Monaco-Ville",ongoing:true,until:"2027-06-30"},`,
  `  {id:2114,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"COLLECTION${NL}DE VOITURES${NL}DU PRINCE",subtitle:"Collection de Voitures · Fontvieille",desc:"La collection de voitures anciennes et de prestige du Prince de Monaco : bolides, voitures de course et carrosses princiers réunis par le Prince Rainier III. Ouvert tous les jours.",descEn:"The Prince of Monaco's collection of vintage and prestige cars: racing cars and princely carriages gathered by Prince Rainier III. Open every day.",free:false,hot:false,fallback:"linear-gradient(150deg,#6A3010,#8A5030,#4A1800)",accent:"#F0C0A0",emoji:"🚗",link:"https://www.palais.mc/",phone:"+377 9325 1831",source:"Collection de Voitures du Prince",quarter:"Fontvieille",ongoing:true,until:"2027-06-30"},`,
  `  {id:2115,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"NOUVEAU MUSÉE${NL}NATIONAL${NL}DE MONACO",subtitle:"Villa Paloma & Villa Sauber · Monaco",desc:"Les deux villas du NMNM consacrées à l'art contemporain, au design et aux expositions temporaires. Architecture Belle Époque et jardins. Ouvert tous les jours sauf lundi.",descEn:"The two NMNM villas dedicated to contemporary art, design and temporary exhibitions. Belle Époque architecture and gardens. Open daily except Monday.",free:false,hot:false,fallback:"linear-gradient(150deg,#5A2A6A,#7A4A8A,#3A1A4A)",accent:"#D8B0E8",emoji:"🎨",link:"https://www.nmnm.mc/",source:"Nouveau Musée National de Monaco",quarter:"Monte-Carlo",ongoing:true,until:"2027-06-30"},`,
  `  {id:2116,cat:"EXPOSITION",date:"${today}",time:"09h00 — 18h00",title:"MUSÉE${NL}D'ANTHROPOLOGIE${NL}PRÉHISTORIQUE",subtitle:"Musée d'Anthropologie Préhistorique · Jardin Exotique",desc:"Consacré à la préhistoire et aux découvertes archéologiques de la région : ossements, outils et collections du paléolithique. Au cœur du Jardin Exotique.",descEn:"Dedicated to prehistory and the region's archaeological discoveries: bones, tools and Palaeolithic collections. At the heart of the Exotic Garden.",free:false,hot:false,fallback:"linear-gradient(150deg,#6A4A28,#8A6A48,#4A2A08)",accent:"#D4B888",emoji:"🦴",link:"https://map.gouv.mc/",phone:"+377 9315 0640",source:"Musée d'Anthropologie Préhistorique",quarter:"Monaco",ongoing:true,until:"2027-06-30"},`,
  `  {id:2117,cat:"EXPOSITION",date:"${today}",time:"10h00 — 18h00",title:"GRANDS${NL}APPARTEMENTS${NL}DU PALAIS",subtitle:"Palais Princier · Monaco-Ville",desc:"Visite des Grands Appartements du Palais Princier de Monaco : salle du Trône, galerie d'Hercule et cour d'honneur. Ouvert au public d'avril à mi-octobre.",descEn:"Visit the State Apartments of Monaco's Princely Palace: the Throne Room, Hercules Gallery and Court of Honour. Open to the public from April to mid-October.",free:false,hot:true,fallback:"linear-gradient(150deg,#806828,#A08840,#605018)",accent:"#F4E0A0",emoji:"👑",link:"https://www.palais.mc/",phone:"+377 9325 1831",source:"Palais Princier",quarter:"Monaco-Ville",ongoing:true,until:"2026-10-15"},`,
  // ── 70 ANS DU MARIAGE GRACE KELLY / RAINIER III (expos temporaires 2026) ──
  `  {id:2118,cat:"EXPOSITION",date:"${today}",time:"10h00 — 19h00",title:"LE MARIAGE${NL}DU SIÈCLE${NL}AU PALAIS",subtitle:"Grands Appartements du Palais · Monaco-Ville",desc:"Pour les 70 ans du mariage de Grace Kelly et du Prince Rainier III : exposition exceptionnelle dans les Grands Appartements du Palais Princier — robe de mariée, souvenirs et coulisses du « mariage du siècle » (1956). Jusqu'au 25 septembre.",descEn:"For the 70th anniversary of Grace Kelly and Prince Rainier III's wedding: an exceptional exhibition in the Palace's State Apartments — wedding dress, memorabilia and behind-the-scenes of the 'wedding of the century' (1956). Until 25 September.",free:false,hot:true,fallback:"linear-gradient(150deg,#7A1030,#A83048,#5A0018)",accent:"#F4B8C8",emoji:"👰",link:"https://www.palais.mc/",phone:"+377 9325 1831",source:"Palais Princier",quarter:"Monaco-Ville",ongoing:true,until:"2026-09-25"},`,
  `  {id:2119,cat:"EXPOSITION",date:"${today}",time:"09h30 — 18h00",title:"LE MARIAGE${NL}DU SIÈCLE${NL}EN PHILATÉLIE",subtitle:"Musée des Timbres et Monnaies · Fontvieille",desc:"Le mariage princier de 1956 raconté à travers timbres, médailles, monnaies et documents historiques, au Musée des Timbres et des Monnaies de Monaco. Jusqu'au 15 octobre.",descEn:"The 1956 princely wedding told through stamps, medals, coins and historical documents, at Monaco's Museum of Stamps and Coins. Until 15 October.",free:false,hot:false,fallback:"linear-gradient(150deg,#6A5010,#8A7030,#4A3800)",accent:"#F0D890",emoji:"📮",link:"https://www.mtm-monaco.mc/",phone:"+377 9898 4144",source:"Musée des Timbres et Monnaies",quarter:"Fontvieille",ongoing:true,until:"2026-10-15"},`,
  `  {id:2120,cat:"EXPOSITION",date:"${today}",time:"En journée",title:"UN MARIAGE${NL}SOUS LES${NL}PROJECTEURS",subtitle:"Institut Audiovisuel de Monaco · Fontvieille",desc:"L'emballement médiatique, la ferveur populaire et « Le Mariage de Monaco » (seul film autorisé par le Palais) : l'expo de l'Institut Audiovisuel sur le mariage de Rainier III et Grace Kelly (12-19 avril 1956). Jusqu'au 26 février 2027.",descEn:"The media frenzy, popular fervour and 'Le Mariage de Monaco' (the only film authorised by the Palace): the Audiovisual Institute's exhibition on the wedding of Rainier III and Grace Kelly (12-19 April 1956). Until 26 February 2027.",free:true,hot:false,fallback:"linear-gradient(150deg,#1A2A4A,#3A4A6A,#0A1428)",accent:"#A0C0E8",emoji:"🎞️",link:"https://institut-audiovisuel.mc/",source:"Institut Audiovisuel de Monaco",quarter:"Fontvieille",ongoing:true,until:"2027-02-26"},`,
];

const idx = s.lastIndexOf("\n];");
if (idx === -1) { console.error("Marqueur _RAW `];` introuvable"); process.exit(1); }
s = s.slice(0, idx) + "\n\n  // ── EN COURS / TOUS LES JOURS (ongoing:true — redaté chaque jour) ──\n" + cards.join("\n") + s.slice(idx);

writeFileSync(FILE, s);
console.log(`✓ ${cards.length} fiches ongoing ajoutées + Timbres marqué ongoing. Date du jour : ${today}`);
