#!/usr/bin/env node
/**
 * Redate sur le JOUR MÊME, chaque jour, les fiches « toujours visibles » :
 *  - la carte CINÉMA — À L'AFFICHE (id:2050) → lien cinemas2monaco.com
 *  - les expositions / musées EN COURS (ongoing:true) tant qu'on est avant leur
 *    date de fin (until:"YYYY-MM-DD")
 * Ainsi elles apparaissent dans « Aujourd'hui » tous les jours où l'on peut y aller.
 * Exécuté chaque jour par daily-check.yml (avant le build & push).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const now = new Date(); now.setHours(0, 0, 0, 0);
const todayStr = `${JOURS[now.getDay()]} ${now.getDate()} ${MOIS[now.getMonth()]}`;

let s = readFileSync(FILE, "utf8");
let count = 0;

// Redate une ligne d'événement sur aujourd'hui
function redate(line) {
  if (!/date:"/.test(line)) return line;
  count++;
  return line.replace(/date:"[^"]*"/, `date:"${todayStr}"`);
}

s = s.split("\n").map((line) => {
  if (!/^\s*\{id:\d+,/.test(line)) return line;
  // 1) carte cinéma
  if (/\{id:2050,/.test(line)) return redate(line);
  // 2) expos en cours, tant qu'on est avant la date de fin
  if (/ongoing:true/.test(line)) {
    const u = line.match(/until:"([^"]+)"/);
    if (u) {
      const until = new Date(u[1] + "T00:00:00");
      if (now <= until) return redate(line);
    }
  }
  return line;
}).join("\n");

writeFileSync(FILE, s);
console.log(`Fiches redatées sur ${todayStr} :`, count);
