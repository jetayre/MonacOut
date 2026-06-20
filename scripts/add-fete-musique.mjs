// Concerts de la Fête de la Musique 2026 (Dim 21 juin) — source officielle
// mairie.mc/la-fete-de-la-musique. Lieux et horaires vérifiés.
import { readFileSync, writeFileSync } from "fs";
const FILE = "src/data/events.js";
const LINK = "https://www.mairie.mc/la-fete-de-la-musique";
const esc = (s) => s.replace(/\n/g, "\\n").replace(/"/g, '\\"');

const acts = [
  { t: "PIANO BAR\nLUCI D'ALBA", sub: "Centre Commercial de Fontvieille", q: "Fontvieille", time: "10h00 — 12h00", style: "Piano bar" },
  { t: "ERIC\nLEROUGE", sub: "Marché de la Condamine", q: "La Condamine", time: "10h00 — 12h00", style: "Variété" },
  { t: "FABFAB\nVARIÉTÉ", sub: "Parc Princesse Antoinette · Monaco", q: "Monaco", time: "17h30 — 19h30", style: "Variété guitare/voix" },
  { t: "EXODITY\nROCK", sub: "Esplanade du Larvotto", q: "Larvotto", time: "17h30 — 19h30", style: "Rock" },
  { t: "ART MONY\nPOP-ROCK", sub: "Place des Moulins · Monte-Carlo", q: "Monte-Carlo", time: "17h30 — 19h30", style: "Pop-rock" },
  { t: "NANOU\nDEL ROCK", sub: "Centre Commercial de Fontvieille", q: "Fontvieille", time: "17h30 — 19h30", style: "Rock" },
  { t: "D TENSION\nPOP-ROCK", sub: "Bas de la rue Princesse Caroline", q: "La Condamine", time: "17h30 — 19h30", style: "Pop-rock" },
];

let s = readFileSync(FILE, "utf8");
let id = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map((m) => +m[1])) + 1;
const blocks = acts.map((a) => {
  const desc = `${a.style} en concert gratuit pour la Fête de la Musique, ${a.sub.split(" · ")[0]}.`;
  const descEn = `${a.style} — free concert for the Fête de la Musique at ${a.sub.split(" · ")[0]}.`;
  const line = `  {id:${id++},cat:"CONCERT",date:"Dim 21 juin",time:"${a.time}",title:"${esc(a.t)}",subtitle:"${esc(a.sub)}",desc:"${esc(desc)}",descEn:"${esc(descEn)}",free:true,hot:false,fallback:"linear-gradient(150deg,#1A1240,#2D1F6E,#1A1240)",accent:"#C4A8F8",emoji:"🎶",link:"${LINK}",source:"Mairie de Monaco",quarter:"${a.q}"},`;
  return line;
});
s = s.replace(/\n\];/, "\n" + blocks.join("\n") + "\n];");
writeFileSync(FILE, s);
console.log("Concerts Fête de la Musique ajoutés :", blocks.length);
