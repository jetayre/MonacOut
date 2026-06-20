import { readFileSync, writeFileSync } from "fs";
const FILE = "src/data/events.js";
let s = readFileSync(FILE, "utf8");

// 1) Supprimer Cyrano (id 203) — non confirmé pour aujourd'hui
s = s.split("\n").filter((l) => !/^\s*\{id:203,/.test(l)).join("\n");

// 2) Remplacer la fiche Mùnegu Repair Café (id 1962) par une version vérifiée
const munegu =
  '  {id:1962,cat:"ATELIER",date:"Sam 20 juin",time:"14h30 — 17h30",title:"MÙNEGU\\nREPAIR\\nCAFÉ",' +
  'subtitle:"Casa d\'I Soci · Monaco",' +
  'desc:"Rendez-vous gratuit où des bénévoles réparent vos objets et appareils du quotidien (électronique, petit électroménager, textile…) au lieu de les jeter. Sans réservation. Organisé par la Mairie de Monaco.",' +
  'descEn:"A free event where volunteers repair your everyday objects and appliances (electronics, small appliances, textiles…) instead of throwing them away. No booking required. Organised by the Mairie de Monaco.",' +
  'free:true,hot:false,fallback:"linear-gradient(150deg,#0A2818,#1A5030,#0A2818)",accent:"#90E0B0",emoji:"🔧",' +
  'link:"https://www.mairie.mc/munegu-repair-cafe",source:"Mairie de Monaco",quarter:"Monaco"},';
s = s.replace(/^\s*\{id:1962,[^\n]*$/m, munegu);

writeFileSync(FILE, s);
console.log("✓ Cyrano supprimé, Mùnegu Repair Café corrigé");
