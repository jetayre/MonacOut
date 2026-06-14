import { readFileSync, writeFileSync } from "fs";

const FILE = "src/data/events.js";
let s = readFileSync(FILE, "utf8");

// 1) Retirer toute carte cinéma précédente (lien cinemas2monaco)
const before = s.split("\n").length;
s = s
  .split("\n")
  .filter((l) => !(/^\s*\{id:\d+,/.test(l) && l.includes("cinemas2monaco.com")))
  .join("\n");
console.log("Lignes cinéma retirées :", before - s.split("\n").length);

// 2) Insérer une carte propre (id 2050) — datée aujourd'hui, re-datée chaque jour par l'auto-update
const card =
  '  {id:2050,cat:"CINÉMA",date:"Dim 14 juin",title:"CINÉMA\\nÀ L\'AFFICHE\\nMONACO",' +
  'subtitle:"Cinéma des Beaux-Arts · Monte-Carlo",' +
  'desc:"Tous les films à l\'affiche au Cinéma des Beaux-Arts. Cliquez pour voir les séances et les horaires du jour sur le site officiel.",' +
  'descEn:"All the films currently showing at the Cinéma des Beaux-Arts. Tap to see today\'s screenings and showtimes on the official site.",' +
  'free:false,hot:false,fallback:"linear-gradient(150deg,#1A0830,#4A1870,#1A0830)",accent:"#D0B0F8",emoji:"🎬",' +
  'link:"https://www.cinemas2monaco.com/",phone:"+377 9325 3681",source:"Cinémas 2 Monaco",quarter:"Monte-Carlo"},';

s = s.replace(/\n\];/, "\n" + card + "\n];");
writeFileSync(FILE, s);
console.log("✓ carte cinéma 2050 insérée");
