// Ajoute Cantinetta Antinori (bar à vin + live music, Larvotto) — apéritivo live
// vendredi + samedi soir, sur 12 semaines. Jours calculés → jamais d'erreur de date.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";
const WEEKS = 12;

const CANTINETTA = {
  cat: "APÉRO",
  title: `CANTINETTA${NL}ANTINORI${NL}LIVE MUSIC`,
  subtitle: "Cantinetta Antinori · Larvotto",
  time: "18h00 — 23h30",
  link: "https://www.cantinettaantinori.mc",
  phone: "+377 9777 0880",
  source: "Cantinetta Antinori",
  quarter: "Larvotto",
  emoji: "🍷",
  fb: "linear-gradient(150deg,#4A1020,#7A3040,#300010)",
  ac: "#E0A0B0",
  desc: "Apéritivo à l'italienne chez Cantinetta Antinori, la maison de la dynastie viticole Antinori : grands vins toscans, cuisine italienne raffinée et musique live tous les soirs, face à la mer au Larvotto.",
  descEn: "Italian aperitivo at Cantinetta Antinori, home of the Antinori wine dynasty: great Tuscan wines, refined Italian cuisine and live music every evening, facing the sea at Larvotto.",
};

let s = readFileSync(FILE, "utf8");
const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = maxId + 1;
const card = (v, dateStr) =>
  `  {id:${id++},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",phone:"${v.phone}",source:"${v.source}",quarter:"${v.quarter}"},`;

const lines = [];
const start = new Date(); start.setHours(0,0,0,0);
for (let d = 0; d < WEEKS * 7; d++) {
  const day = new Date(start); day.setDate(start.getDate() + d);
  const dateStr = `${JOURS[day.getDay()]} ${day.getDate()} ${MOIS[day.getMonth()]}`;
  if (day.getDay() === 5 || day.getDay() === 6) lines.push(card(CANTINETTA, dateStr)); // ven + sam
}

const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── Cantinetta Antinori — apéritivo + live music (ven & sam, Larvotto) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} fiches Cantinetta Antinori ajoutées sur ${WEEKS} semaines.`);
