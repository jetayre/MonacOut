#!/usr/bin/env node
/**
 * Les matchs de l'AS Monaco Basket, à la Salle Gaston Médecin.
 *
 * Stéphanie, 26 oct 2026 : « fais le basket avec playwright ».
 *
 * 🚨 CE QU'IL FAUT SAVOIR AVANT DE TOUCHER À CE SCRIPT. Le 26 octobre 2026,
 * AUCUNE source ne publiait le calendrier 2026-2027, et ce n'est pas un défaut
 * de lecture — il n'y avait rien à lire. Vérifié au navigateur, pas au curl :
 *   · asmonaco.basketball/calendar/monthcalendar.php → VIDE pour octobre,
 *     novembre, décembre 2026 et janvier 2027. La page affiche le nom du mois
 *     et rien d'autre.
 *   · billetterie.asmonaco.basketball → « Aucun évènement n'est disponible
 *     pour le moment ». Ses rares pages de match pointent sur juin 2026.
 *   · euroleaguebasketball.net → la page de l'équipe ne rend aucun calendrier,
 *     et /schedule/ renvoie une 404.
 *   · lnb.fr → un fil de matchs de toute la ligue, dont les logos sont des
 *     SPONSORS (Lotus, DAZN), pas des équipes.
 *   · principocket.com → deux matchs seulement, déjà dans l'app.
 * Conclusion : on ne fabrique pas de dates. Ce script SURVEILLE et ajoute dès
 * que le club publie. Tant qu'il n'y a rien, il ne fait rien, et il le dit.
 *
 * ✅ CE QUI EST ACQUIS. La billetterie du basket ACCEPTE d'être affichée dans
 * l'app (ni X-Frame-Options ni frame-ancestors), contrairement au site du club
 * et à celle du football. Les fiches auront donc leur bouton « Réserver une
 * place » dès qu'un match paraîtra.
 *
 * ⚠️ RÈGLE 15. Seuls les matchs à la Salle Gaston Médecin entrent : elle est à
 * Monaco. Un déplacement ne s'affiche pas — c'est la même raison qui tient le
 * volley hors de l'app, ses matchs « à domicile » se jouant à Beausoleil.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FICHIER = join(__dirname, "../src/data/events.js");
const ECRIS = process.argv.includes("--ecris");
const BASE = 820000;            // bande propre au basket, hors des 800000 importés
const MARQUE = "bskt:1";
const BILLETTERIE = "https://billetterie.asmonaco.basketball/fr";
const SALLE = "Salle Gaston Médecin · Fontvieille";

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_LUS = { janv:0, "févr":1, mars:2, avri:3, mai:4, juin:5, juil:6, "août":7, sept:8, octo:9, nove:10, "déce":11 };
const sansAccent = t => (t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

async function moissonne() {
  const nav = await chromium.launch();
  const page = await nav.newPage({ locale: "fr-FR" });
  const trouves = [];
  try {
    // On balaie douze mois du calendrier du club. La page accepte ?month=&year=.
    const d0 = new Date();
    for (let k = 0; k < 12; k++) {
      const d = new Date(d0.getFullYear(), d0.getMonth() + k, 1);
      const url = `https://asmonaco.basketball/calendar/monthcalendar.php`
        + `?month=${String(d.getMonth() + 1).padStart(2, "0")}&year=${d.getFullYear()}`;
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 40000 });
        await page.waitForTimeout(1200);
        const lignes = await page.evaluate(() => {
          const t = document.body.innerText;
          const i = t.indexOf("BILLETTERIE"), j = t.indexOf("les sponsors");
          return (i >= 0 && j > i ? t.slice(i + 12, j) : t)
            .split("\n").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
        });
        // Un match = une ligne qui porte une date ET deux équipes séparées.
        for (let n = 0; n < lignes.length; n++) {
          const m = sansAccent(lignes[n]).match(/(\d{1,2})\s+([a-z]{3,5})\.?\s+(\d{4})/);
          if (!m) continue;
          const mo = MOIS_LUS[sansAccent(m[2]).slice(0, 4)] ?? MOIS_LUS[sansAccent(m[2]).slice(0, 3)];
          if (mo === undefined) continue;
          const voisin = lignes.slice(n, n + 4).join(" ");
          if (!/monaco/i.test(voisin)) continue;
          // ⚠️ RÈGLE 15 : la salle doit être nommée, et ce doit être la nôtre.
          if (!/gaston m[ée]decin|salle omnisports/i.test(voisin)) continue;
          const heure = (voisin.match(/\b(\d{1,2})[h:](\d{2})\b/) || []);
          trouves.push({
            dt: new Date(+m[3], mo, +m[1]),
            heure: heure.length ? `${heure[1].padStart(2, "0")}h${heure[2]}` : "",
            texte: voisin.slice(0, 120),
          });
        }
      } catch { /* un mois illisible ne doit pas emporter les autres */ }
    }
  } finally { await nav.close(); }
  return trouves;
}

const matchs = await moissonne();
console.log(`🏀 Calendrier AS Monaco Basket : ${matchs.length} match(s) à la Salle Gaston Médecin.`);

if (!matchs.length) {
  console.log("   Le club n'a encore rien publié — on n'invente pas de dates.");
  console.log("   (contrôlé au navigateur sur 12 mois ; voir l'en-tête du script)");
  process.exit(0);
}

let s = readFileSync(FICHIER, "utf8");
const lignes = s.split("\n");
// Rejouable : on retire NOS fiches avant de les réécrire.
const avant = lignes.length;
const gardees = lignes.filter(l => !(l.includes(MARQUE) && /^\s*\{id:\d+,/.test(l)));
const retirees = avant - gardees.length;

let id = BASE;
const neuves = matchs
  .sort((a, b) => a.dt - b.dt)
  .map(m => {
    const d = m.dt;
    const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
    const titre = m.texte.replace(/"/g, "").slice(0, 70);
    return `  {id:${id++},year:${d.getFullYear()},cat:"BASKET",date:"${date}",`
      + `time:"${m.heure || "En soirée"}",title:"AS MONACO BASKET\\n${titre.toUpperCase().replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40)}",`
      + `subtitle:"${SALLE}",`
      + `desc:"L'AS Monaco Basket reçoit à la Salle Gaston Médecin.",`
      + `descEn:"AS Monaco Basket at home in Salle Gaston Medecin.",`
      + `free:false,hot:false,${MARQUE},fallback:"linear-gradient(150deg,#7A1020,#B03040,#4A0810)",`
      + `accent:"#F0A0B0",emoji:"🏀",link:"${BILLETTERIE}",resa:"${BILLETTERIE}",`
      + `source:"AS Monaco Basket",quarter:"Fontvieille"},`;
  });

// ⚠️ UN SCRIPT QUI RETIRE SANS POUVOIR RECONSTRUIRE NE DOIT PAS ÉCRIRE.
if (retirees > 0 && !neuves.length) {
  console.error(`   ❌ ${retirees} fiche(s) retirée(s) et aucune réécrite — on n'enregistre pas.`);
  process.exit(1);
}

const idx = gardees.findIndex(l => l.trim() === "];");
gardees.splice(idx, 0, "", "  // ── AS Monaco Basket, relevé sur asmonaco.basketball ──", ...neuves);
if (ECRIS) {
  writeFileSync(FICHIER, gardees.join("\n"));
  console.log(`   ✓ ${neuves.length} fiche(s) écrite(s)${retirees ? ` (${retirees} remplacée(s))` : ""}.`);
} else {
  console.log(`   (essai à blanc — ${neuves.length} fiche(s) prêtes, relancer avec --ecris)`);
  neuves.slice(0, 6).forEach(l => console.log("   " + l.trim().slice(0, 110)));
}
