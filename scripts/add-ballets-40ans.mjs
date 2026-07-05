// Ajoute les 2 soirées de gala des Ballets de Monte-Carlo (40 ans) — 3 & 4 juil, Grimaldi.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
let s = readFileSync(FILE, "utf8");
let id = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1])) + 1;
const NL = "\\n";
const mk = (date, hot) => `  {id:${id++},cat:"DANSE",date:"${date}",time:"19h30",title:"BALLETS DE${NL}MONTE-CARLO${NL}GALA 40 ANS",subtitle:"Salle des Princes · Grimaldi Forum",desc:"Soirée de gala des Ballets de Monte-Carlo pour les 40 ans de la compagnie. Programme surprise réunissant danseurs, chorégraphes, musiciens et artistes emblématiques. Tarifs 25/34/39€ (15€ pour les -25 ans).",descEn:"Gala evening of Les Ballets de Monte-Carlo celebrating the company's 40th anniversary. A surprise programme bringing together emblematic dancers, choreographers, musicians and artists. Tickets 25/34/39€ (15€ under 25).",free:false,hot:${hot},fallback:"linear-gradient(150deg,#4A1A50,#7A3A80,#2A0A38)",accent:"#E0A8F0",emoji:"🩰",link:"https://www.balletsdemontecarlo.com/",phone:"+377 9999 3000",source:"Les Ballets de Monte-Carlo",quarter:"Monte-Carlo"},`;
const cards = [mk("Ven 3 juil", "true"), mk("Sam 4 juil", "true")];
const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── Ballets de Monte-Carlo — Gala 40 ans (3 & 4 juil, Grimaldi) ──\n" + cards.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log("✓ 2 soirées de gala Ballets de Monte-Carlo ajoutées (3 & 4 juil).");
