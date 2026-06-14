#!/usr/bin/env node
/**
 * Redate la carte « CINÉMA — À L'AFFICHE » (id:2050) sur le jour même,
 * afin qu'elle reste toujours visible en tête de liste. Le lien pointe vers
 * cinemas2monaco.com, qui tient le programme du jour à jour.
 * Exécuté chaque jour par daily-check.yml (avant le build & push).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "../src/data/events.js");
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const d = new Date();
const today = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

let s = readFileSync(FILE, "utf8");
const re = /(\{id:2050,cat:"CINÉMA",date:")[^"]*(")/;
if (!re.test(s)) {
  console.log("Carte cinéma 2050 introuvable — rien à faire.");
  process.exit(0);
}
s = s.replace(re, `$1${today}$2`);
writeFileSync(FILE, s);
console.log("Carte cinéma datée sur :", today);
