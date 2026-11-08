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

// Combien de fiches cinéma hebdo dans le fichier ?
// update-cinema.mjs en génère UNE PAR JOUR (mer→mar) : elles ont déjà chacune
// leur vraie date, il ne faut SURTOUT PAS les redater, sinon les 7 s'écrasent
// sur le jour même, le dédoublonnage en supprime 6, et la seule survivante ne
// tient plus que par ce script — le jour où il ne tourne pas, elle passe dans
// le passé et le nettoyage la supprime (panne du 29-31 juil 2026).
// On ne redate que s'il n'y en a qu'une (ancien format à fiche unique).
const weeklyCount = (s.match(/weeklyFilms:true/g) || []).length;
const redateWeekly = weeklyCount <= 1;

s = s.split("\n").map((line) => {
  if (!/^\s*\{id:\d+,/.test(line)) return line;
  // 1) carte cinéma hebdo — cibler le marqueur STABLE weeklyFilms.
  //    (Ne JAMAIS coder l'id en dur : la carte est régénérée avec un nouvel id,
  //     l'ancien id:2050 devenait introuvable → la fiche expirait et disparaissait.)
  if (/weeklyFilms:true/.test(line) || /\{id:2050,/.test(line)) {
    return redateWeekly ? redate(line) : line;
  }
  // 2) expos en cours, tant qu'on est avant la date de fin
  if (/ongoing:true/.test(line)) {
    const u = line.match(/until:"([^"]+)"/);
    if (u) {
      const until = new Date(u[1] + "T00:00:00");
      // 🚨 UNE FICHE « EN COURS » QUI N'A PAS COMMENCÉ NE SE REDATE PAS.
      // Le Village de Noël ouvre le 4 décembre et ferme le 3 janvier. Écrit
      // ongoing + until, il remplissait la seule condition que ce script
      // connaissait — « la fin est à venir » — et se faisait donc redater sur
      // AUJOURD'HUI chaque nuit : il s'affichait le 8 novembre, près d'un mois
      // trop tôt (signalé par Stéphanie, 8 nov 2026). Corriger sa date à la
      // main n'aurait tenu qu'une nuit.
      // ➜ `depuis:"AAAA-MM-JJ"` dit quand la chose ouvre. Avant ce jour, on ne
      //   touche pas à la fiche : elle garde sa vraie date de début et reste
      //   visible comme un événement à venir, ce qu'elle est.
      // ⚠️ Champ FACULTATIF : sans lui, le comportement d'avant est conservé —
      //   une expo déjà ouverte n'a rien à déclarer.
      const dep = line.match(/depuis:"([^"]+)"/);
      const debut = dep ? new Date(dep[1] + "T00:00:00") : null;
      const pasEncoreOuvert = debut && !isNaN(debut) && now < debut;
      if (now <= until && !pasEncoreOuvert) return redate(line);
    }
  }
  return line;
}).join("\n");

writeFileSync(FILE, s);
console.log(`Fiches redatées sur ${todayStr} :`, count);
console.log(
  `Fiches cinéma hebdo : ${weeklyCount} — ` +
    (redateWeekly
      ? "fiche unique → redatée sur aujourd'hui"
      : "une par jour → laissées à leurs vraies dates (pas de redatage)")
);
