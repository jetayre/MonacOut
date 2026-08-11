#!/usr/bin/env node
/**
 * MonacOut — PLANNINGS DES PISCINES, LUS AUTOMATIQUEMENT DANS LES PDF DE LA MAIRIE
 *
 * Demandé par Stéphanie le 11 août 2026 : « comment faire pour que tu aies toujours
 * ça tous les jours exactement sans que j'intervienne ». Les 133 fiches aquagym /
 * aquabike / pilates avaient été créées à la main à partir de PDF qu'elle m'avait
 * envoyés. Ça ne tient pas : les plannings changent à chaque saison, et les fiches
 * s'arrêtaient au 7 octobre.
 *
 * CE SCRIPT FAIT TOUT SEUL, DEUX FOIS PAR JOUR :
 *   1. il ouvre les pages des deux piscines sur mairie.mc
 *   2. il y trouve les PDF de planning (leur adresse change à chaque mise à jour)
 *   3. il reconstitue les tableaux PAR POSITION des mots dans le document — les
 *      colonnes sont perdues par une simple extraction de texte
 *   4. il régénère les fiches, une par jour et par piscine
 *
 * ⚠️ RÈGLE DE SÛRETÉ LA PLUS IMPORTANTE : si la lecture d'un PDF échoue ou donne un
 * résultat suspect (moins de 3 jours reconnus), le script NE TOUCHE À RIEN et
 * signale. Mieux vaut un planning d'hier qu'un fil vide. Un script qui efface du bon
 * contenu parce qu'il n'a pas su lire est pire que pas de script du tout.
 *
 * IDEMPOTENT : les fiches qu'il écrit portent le marqueur `psc:1`. Il retire les
 * siennes puis les réécrit — jamais celles des autres (leçon du 7 août : le
 * générateur nightlife supprimait des fiches qu'il n'avait pas écrites).
 *
 * Usage : node scripts/piscines.mjs [--dry]
 */
import { readFileSync, writeFileSync } from "fs";
import { inflateSync } from "zlib";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER = join(racine, "src", "data", "events.js");
const RAPPORT = join(racine, "piscines.txt");
const DRY = process.argv.includes("--dry");
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 " +
           "(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS  = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const JOUR_NOM = { lundi:1, mardi:2, mercredi:3, jeudi:4, vendredi:5, samedi:6, dimanche:0 };

const alertes = [];
async function get(u, bin = false) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(40000) });
      if (r.ok) return bin ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch { /* réseau */ }
    await new Promise(s => setTimeout(s, 1200));
  }
  return null;
}

// ── Lecture d'un PDF : chaque mot avec sa position (x, y) ────────────────────────
function motsPositionnes(buf) {
  const mots = [];
  const s = buf.toString("latin1");
  const re = /stream\r?\n([\s\S]*?)endstream/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    let txt;
    try { txt = inflateSync(Buffer.from(m[1], "latin1")).toString("latin1"); } catch { continue; }
    let x = 0, y = 0;
    for (const ligne of txt.split("\n")) {
      let t = ligne.match(/^\s*([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+([\d.\-]+)\s+Tm/);
      if (t) { x = +t[5]; y = +t[6]; continue; }
      t = ligne.match(/^\s*([\d.\-]+)\s+([\d.\-]+)\s+Td/);
      if (t) { x += +t[1]; y += +t[2]; continue; }
      if (!/T[jJ]/.test(ligne)) continue;
      const contenu = [...ligne.matchAll(/\((.*?)\)/g)].map(a => a[1]).join("").trim();
      if (contenu) mots.push({ x: Math.round(x), y: Math.round(y), t: contenu });
    }
  }
  return mots;
}

// Regroupe les mots en lignes (même y) puis rend chaque ligne triée par x.
function enLignes(mots) {
  const tri = [...mots].sort((a, b) => b.y - a.y || a.x - b.x);
  const lignes = [];
  for (const w of tri) {
    const der = lignes[lignes.length - 1];
    if (der && Math.abs(der.y - w.y) <= 4) der.cells.push(w);
    else lignes.push({ y: w.y, cells: [w] });
  }
  return lignes;
}

// ── PISCINE 1 : Stade Nautique — colonnes = JOURS, cellules = horaires ───────────
function lireStadeNautique(mots) {
  const lignes = enLignes(mots);
  const entete = lignes.find(l => l.cells.some(c => /^LUNDI$/i.test(c.t)));
  if (!entete) return null;
  const colonnes = entete.cells
    .filter(c => JOUR_NOM[c.t.toLowerCase()] !== undefined)
    .map(c => ({ x: c.x, j: JOUR_NOM[c.t.toLowerCase()] }));
  if (colonnes.length < 5) return null;
  const jourDe = x => colonnes.reduce((best, c) => Math.abs(c.x - x) < Math.abs(best.x - x) ? c : best).j;

  const parJour = {};
  for (let i = 0; i < lignes.length; i++) {
    const heures = lignes[i].cells.filter(c => /^\d{1,2}h\d{2}$/.test(c.t));
    if (!heures.length) continue;
    const suivante = lignes[i + 1];
    if (!suivante) continue;
    for (const h of heures) {
      const lib = suivante.cells.reduce((best, c) =>
        (!best || Math.abs(c.x - h.x) < Math.abs(best.x - h.x)) ? c : best, null);
      if (!lib || !/aqua/i.test(lib.t)) continue;
      const j = jourDe(h.x);
      (parJour[j] ||= []).push(`${h.t} ${lib.t.toLowerCase()}`);
    }
  }
  return Object.keys(parJour).length >= 3 ? parJour : null;
}

// ── PISCINE 2 : Saint-Charles salle de sport — colonnes = JOURS, cellules = cours ─
function lireSalleSport(mots) {
  const lignes = enLignes(mots);
  const entete = lignes.find(l => l.cells.some(c => /^LUNDI$/i.test(c.t)));
  if (!entete) return null;
  const colonnes = entete.cells
    .filter(c => JOUR_NOM[c.t.toLowerCase()] !== undefined)
    .map(c => ({ x: c.x, j: JOUR_NOM[c.t.toLowerCase()] }));
  if (colonnes.length < 4) return null;
  const jourDe = x => colonnes.reduce((best, c) => Math.abs(c.x - x) < Math.abs(best.x - x) ? c : best).j;

  const parJour = {};
  for (let i = 0; i < lignes.length; i++) {
    const creneaux = lignes[i].cells.filter(c => /^\d{1,2}h\d{2}\s*-\s*\d{1,2}h\d{2}$/.test(c.t));
    if (!creneaux.length) continue;
    const suivante = lignes[i + 1];
    if (!suivante) continue;
    for (const h of creneaux) {
      const lib = suivante.cells.reduce((best, c) =>
        (!best || Math.abs(c.x - h.x) < Math.abs(best.x - h.x)) ? c : best, null);
      if (!lib || !/pilates|oxyg|stretch|sculpt|spinning|gym/i.test(lib.t)) continue;
      (parJour[jourDe(h.x)] ||= []).push(`${lib.t} ${h.t.split("-")[0].trim()}`);
    }
  }
  return Object.keys(parJour).length >= 3 ? parJour : null;
}

// ── Trouve le PDF de planning sur la page d'une piscine ──────────────────────────
async function pdfsDe(page) {
  const h = await get(page);
  if (!h) return [];
  return [...new Set([...h.matchAll(/href="(https:\/\/api\.mairie\.mc\/storage\/uploads\/[^"]+\.pdf)"/g)].map(m => m[1]))];
}

const MOIS_FR = { janvier:0, "février":1, fevrier:1, mars:2, avril:3, mai:4, juin:5, juillet:6,
  "août":7, aout:7, septembre:8, octobre:9, novembre:10, "décembre":11, decembre:11 };
function periodeDu(mots) {
  const txt = mots.map(w => w.t).join(" ").replace(/\s+/g, " ");
  const m = txt.match(/Du\s+(\d{1,2})(?:er)?\s*(?:([a-zéû]+)\s+)?au\s+(\d{1,2})(?:er)?\s+([a-zéû]+)\s+(\d{4})/i);
  if (!m) return null;
  const an = +m[5];
  const moisFin = MOIS_FR[m[4].toLowerCase()];
  const moisDeb = m[2] ? MOIS_FR[m[2].toLowerCase()] : moisFin;
  if (moisDeb === undefined || moisFin === undefined) return null;
  return { debut: new Date(an, moisDeb, +m[1]), fin: new Date(an, moisFin, +m[3], 23, 59) };
}
const rapport = [];
const blocs = [];

// ═══ STADE NAUTIQUE ══════════════════════════════════════════════════════════════
{
  const pdfs = await pdfsDe("https://www.mairie.mc/le-stade-nautique-rainier-iii");

  const maintenant = new Date();
  let planning = null, sourcePdf = null, periode = null, lisibles = 0;
  for (const u of pdfs) {
    const buf = await get(u, true);
    if (!buf) continue;
    const mots = motsPositionnes(buf);
    if (!mots.some(w => /aquagym|aquabike/i.test(w.t))) continue;
    const p = lireStadeNautique(mots);
    if (!p) continue;
    lisibles++;
    const per = periodeDu(mots);
    // on garde celui qui couvre aujourd'hui ; à défaut, le premier lisible
    if (per && maintenant >= per.debut && maintenant <= per.fin) { planning = p; sourcePdf = u; periode = per; break; }
    if (!planning) { planning = p; sourcePdf = u; periode = per; }
  }
  if (!planning) alertes.push("Stade Nautique : aucun PDF de planning lisible — fiches existantes CONSERVÉES");
  else blocs.push({ cle: "sn", planning, sourcePdf,
    titre: "STADE NAUTIQUE\\nPORT HERCULE", lieu: "Stade Nautique Rainier III · Port Hercule",
    lien: "https://www.mairie.mc/le-stade-nautique-rainier-iii", tel: "+377 9330 6483", quartier: "La Condamine",
    fin: periode ? periode.fin : new Date(2026, 9, 7), periode });
  rapport.push(`Stade Nautique : ${planning ? Object.keys(planning).length + " jours lus" : "ILLISIBLE"} · ${lisibles} planning(s) trouvé(s) · période retenue : ${periode ? periode.debut.toISOString().slice(0,10) + " → " + periode.fin.toISOString().slice(0,10) : "inconnue"}`);
  if (planning && periode && (maintenant < periode.debut || maintenant > periode.fin)) alertes.push("Stade Nautique : aucun PDF ne couvre aujourd'hui — planning peut-être périmé");
}

// ═══ SAINT-CHARLES (salle de sport) ══════════════════════════════════════════════
{
  const pdfs = await pdfsDe("https://www.mairie.mc/la-piscine-saint-charles-1");

  const maintenant = new Date();
  let planning = null, sourcePdf = null, periode = null, lisibles = 0;
  for (const u of pdfs) {
    const buf = await get(u, true);
    if (!buf) continue;
    const mots = motsPositionnes(buf);
    if (!mots.some(w => /pilates|spinning|body sculpt/i.test(w.t))) continue;
    const p = lireSalleSport(mots);
    if (!p) continue;
    lisibles++;
    const per = periodeDu(mots);
    // on garde celui qui couvre aujourd'hui ; à défaut, le premier lisible
    if (per && maintenant >= per.debut && maintenant <= per.fin) { planning = p; sourcePdf = u; periode = per; break; }
    if (!planning) { planning = p; sourcePdf = u; periode = per; }
  }
  if (!planning) alertes.push("Saint-Charles : aucun PDF de planning lisible — fiches existantes CONSERVÉES");
  else blocs.push({ cle: "sc", planning, sourcePdf,
    titre: "PISCINE\\nSAINT-CHARLES", lieu: "Piscine Saint-Charles · Monte-Carlo",
    lien: "https://www.mairie.mc/la-piscine-saint-charles-1", tel: "+377 9315 2295", quartier: "Monte-Carlo",
    fin: periode ? periode.fin : new Date(2026, 11, 18), debut: new Date(2026, 8, 1), periode });   // fermée en août
  rapport.push(`Saint-Charles : ${planning ? Object.keys(planning).length + " jours lus" : "ILLISIBLE"} · ${lisibles} planning(s) trouvé(s) · période retenue : ${periode ? periode.debut.toISOString().slice(0,10) + " → " + periode.fin.toISOString().slice(0,10) : "non datée"}`);
}

// ── Écriture, seulement pour les piscines effectivement lues ─────────────────────
let src = readFileSync(FICHIER, "utf8");
let total = 0;
for (const b of blocs) {
  // idempotent : on retire UNIQUEMENT nos propres fiches de cette piscine
  src = src.split("\n").filter(l => !l.includes(`psc:"${b.cle}"`)).join("\n");
  const pris = new Set([...src.matchAll(/\{id:(\d+),/g)].map(m => +m[1]));
  let id = b.cle === "sn" ? 900000 : 910000;
  const lignes = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (b.debut && d < b.debut) d.setTime(b.debut.getTime());
  else d.setDate(d.getDate() + 1);
  while (d <= b.fin) {
    const s = b.planning[d.getDay()];
    if (s && s.length) {
      while (pris.has(id)) id++;
      const liste = s.join(" · ");
      const heure = s.map(x => (x.match(/\d{1,2}h\d{2}/) || [""])[0]).filter(Boolean).sort()[0] || "En journée";
      lignes.push(`  {id:${id++},psc:"${b.cle}",cat:"BIEN-ÊTRE",date:"${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}",time:"${heure}",title:"${b.cle === "sn" ? "AQUAGYM & AQUABIKE" : "AQUAGYM & FITNESS"}\\n${b.titre}",subtitle:"${b.lieu}",desc:"Cours collectifs de 45 minutes. Aujourd'hui : ${liste}. Réservation obligatoire sur sports.mairie.mc — toute séance non annulée 4 h avant est débitée. Accès 15 minutes avant le cours.",descEn:"45-minute group classes. Today: ${liste}. Booking required at sports.mairie.mc — any session not cancelled 4 hours ahead is charged. Access 15 minutes before.",free:false,hot:false,fallback:"linear-gradient(150deg,#084A6A,#1A7A9A,#042838)",accent:"#90D8F0",emoji:"🏊",link:"${b.lien}",phone:"${b.tel}",source:"Mairie de Monaco",quarter:"${b.quartier}"},`);
    }
    d.setDate(d.getDate() + 1);
  }
  const i = src.lastIndexOf("\n];");
  src = src.slice(0, i) + "\n" + lignes.join("\n") + src.slice(i);
  total += lignes.length;
  rapport.push(`  → ${lignes.length} fiches régénérées (${b.sourcePdf.slice(-24)})`);
}

let txt = `PLANNINGS DES PISCINES — ${new Date().toISOString().slice(0, 10)}\n` + rapport.join("\n") + "\n";
if (alertes.length) txt += "\n■ 🚨 À REGARDER\n" + alertes.map(a => "   ! " + a).join("\n") + "\n";
writeFileSync(RAPPORT, txt);
console.log(rapport.join("\n"));
if (!DRY && total) writeFileSync(FICHIER, src);
console.log(DRY ? "\n(--dry : rien n'écrit)" : `\n✓ ${total} fiches piscines à jour`);
if (alertes.length) { alertes.forEach(a => console.log("🚨 " + a)); process.exit(1); }
