// Réinstalle la rotation FOODY hebdomadaire (apéros, brunchs) sur ~10 semaines,
// d'après les fiches vérifiées (sources/téléphones/liens). Remplit Food & Night
// et « Aujourd'hui ». Jours calculés → jamais de jour de semaine erroné.
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const NL = "\\n";
const WEEKS = 10;

// Rotation par jour de la semaine (getDay : 0=Dim … 6=Sam)
const ROT = {
  0: { cat:"BRUNCH", title:`BRUNCH${NL}NOBU${NL}MONTE-CARLO`, subtitle:"Nobu Monte-Carlo · Fairmont", time:"12h00 — 15h30", link:"https://www.fairmont.com/en/hotels/monte-carlo/fairmont-monte-carlo/dining/nobu.restaurant.html", phone:"+377 9999 3939", source:"Nobu Monte-Carlo", quarter:"Monte-Carlo", emoji:"🍱", fb:"linear-gradient(150deg,#1A0A0A,#3A1818,#100000)", ac:"#E8C070", desc:"Le brunch du dimanche au Nobu Monte-Carlo : cuisine japonaise-péruvienne au Fairmont, terrasse avec vue mer.", descEn:"Sunday brunch at Nobu Monte-Carlo: Japanese-Peruvian cuisine at the Fairmont, terrace with sea view." },
  1: { cat:"BRUNCH", title:`HEALTHY${NL}BRUNCH${NL}WOO MONACO`, subtitle:"Woo Monaco · Rue Princesse Caroline", time:"11h00 — 15h00", link:"https://woo.mc/", phone:"+377 9797 8093", source:"Woo Monaco", quarter:"La Condamine", emoji:"🥑", fb:"linear-gradient(150deg,#1A3A10,#3A6A28,#0A2000)", ac:"#B8E8A0", desc:"Le brunch healthy du lundi chez Woo Monaco : bowls, jus pressés et cuisine fraîche rue Princesse Caroline.", descEn:"Monday healthy brunch at Woo Monaco: bowls, fresh-pressed juices and fresh cuisine on Rue Princesse Caroline." },
  2: { cat:"APÉRO", title:`SASS CAFÉ${NL}APÉRO${NL}DU MARDI`, subtitle:"Sass Café · Monte-Carlo", time:"19h00 — 01h00", link:"https://www.sasscafe.com/", phone:"+377 9325 5252", source:"Sass Café Monaco", quarter:"Monte-Carlo", emoji:"🥂", fb:"linear-gradient(150deg,#5A1030,#8A3050,#380010)", ac:"#F0A0C0", desc:"L'apéro du mardi au Sass Café, institution monégasque : cocktails, ambiance live et nuit qui s'étire.", descEn:"Tuesday apéro at Sass Café, a Monegasque institution: cocktails, live atmosphere and a night that lingers." },
  3: { cat:"APÉRO", title:`APÉRO${NL}BAR AMÉRICAIN${NL}HÔTEL DE PARIS`, subtitle:"Bar Américain · Hôtel de Paris", time:"18h30 — 21h30", link:"https://www.montecarlosbm.com/en/nightlife/le-bar-americain", phone:"+377 9806 3000", source:"Bar Américain · Hôtel de Paris", quarter:"Monte-Carlo", emoji:"🍸", fb:"linear-gradient(150deg,#5A2A10,#7A4A30,#3A0A00)", ac:"#E8A878", desc:"L'apéro du mercredi au Bar Américain de l'Hôtel de Paris : piano live, cocktails classiques, élégance Belle Époque.", descEn:"Wednesday apéro at the Bar Américain of the Hôtel de Paris: live piano, classic cocktails, Belle Époque elegance." },
  4: { cat:"APÉRO", title:`AFTERWORK${NL}AMU${NL}MONTE-CARLO`, subtitle:"AMU Monte-Carlo · Monte-Carlo", time:"18h00 — 22h00", link:"https://amu-montecarlo.com/", phone:"+377 9315 4848", source:"AMU Monte-Carlo", quarter:"Monte-Carlo", emoji:"🍹", fb:"linear-gradient(150deg,#3A2A5A,#5A4A7A,#1A0A3A)", ac:"#C0B0E8", desc:"L'afterwork du jeudi à l'AMU Monte-Carlo : tapas, cocktails et DJ pour lancer la soirée.", descEn:"Thursday afterwork at AMU Monte-Carlo: tapas, cocktails and a DJ to kick off the evening." },
  5: { cat:"APÉRO", title:`SUNSET${NL}APÉRO${NL}NOTE BLEUE`, subtitle:"La Note Bleue · Plage du Larvotto", time:"19h00 — 22h00", link:"https://lanotebleue.mc/en/", phone:"+377 9315 2265", source:"La Note Bleue", quarter:"Larvotto", emoji:"🌅", fb:"linear-gradient(150deg,#6A3050,#8A5070,#4A1030)", ac:"#F0C0D8", desc:"L'apéro coucher de soleil du vendredi à La Note Bleue, les pieds dans le sable au Larvotto. Jazz live et cocktails.", descEn:"Friday sunset apéro at La Note Bleue, feet in the sand at Larvotto. Live jazz and cocktails." },
  6: { cat:"BRUNCH", title:`BRUNCH${NL}LA NOTE BLEUE${NL}LARVOTTO`, subtitle:"La Note Bleue · Plage du Larvotto", time:"12h00 — 15h30", link:"https://lanotebleue.mc/en/", phone:"+377 9315 2265", source:"La Note Bleue", quarter:"Larvotto", emoji:"🍳", fb:"linear-gradient(150deg,#1A4A6A,#2A6A8A,#0A3050)", ac:"#90D8F8", desc:"Le brunch du samedi à La Note Bleue sur la plage du Larvotto : buffet, vue mer et ambiance musicale.", descEn:"Saturday brunch at La Note Bleue on Larvotto beach: buffet, sea view and a musical atmosphere." },
};
// En plus, chaque samedi : Stars'N'Bars (apéro au Port)
const STARS = { cat:"APÉRO", title:`STARS'N'BARS${NL}APÉRO${NL}AU PORT`, subtitle:"Stars'N'Bars · Quai Antoine 1er", time:"18h00 — 00h00", link:"https://www.starsnbars.com/", phone:"+377 9797 9595", source:"Stars'N'Bars", quarter:"La Condamine", emoji:"🍔", fb:"linear-gradient(150deg,#1A3A6A,#2A5A8A,#0A1A3A)", ac:"#90B8E8", desc:"L'apéro convivial au Stars'N'Bars sur le Port de Monaco : burgers, sport en direct et terrasse face aux yachts.", descEn:"A laid-back apéro at Stars'N'Bars on the Port of Monaco: burgers, live sport and a terrace facing the yachts." };

let s = readFileSync(FILE, "utf8");
// id de départ : au-dessus du max actuel
const maxId = Math.max(...[...s.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
let id = Math.max(3000, maxId + 1);

const card = (v, dateStr) =>
  `  {id:${id++},cat:"${v.cat}",date:"${dateStr}",time:"${v.time}",title:"${v.title}",subtitle:"${v.subtitle}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:false,fallback:"${v.fb}",accent:"${v.ac}",emoji:"${v.emoji}",link:"${v.link}",phone:"${v.phone}",source:"${v.source}",quarter:"${v.quarter}"},`;

const lines = [];
const start = new Date(); start.setHours(0,0,0,0);
for (let d = 0; d < WEEKS * 7; d++) {
  const day = new Date(start); day.setDate(start.getDate() + d);
  const dateStr = `${JOURS[day.getDay()]} ${day.getDate()} ${MOIS[day.getMonth()]}`;
  lines.push(card(ROT[day.getDay()], dateStr));
  if (day.getDay() === 6) lines.push(card(STARS, dateStr));   // samedi : + Stars'N'Bars
}

const idx = s.lastIndexOf("\n];");
s = s.slice(0, idx) + "\n\n  // ── ROTATION FOODY HEBDOMADAIRE (apéros & brunchs récurrents) ──\n" + lines.join("\n") + s.slice(idx);
writeFileSync(FILE, s);
console.log(`✓ ${lines.length} fiches foody ajoutées sur ${WEEKS} semaines.`);
