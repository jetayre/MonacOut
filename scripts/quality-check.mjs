#!/usr/bin/env node
/**
 * MonacOut — CONTRÔLE DE QUALITÉ DES FICHES (ne modifie rien, il signale)
 *
 * Né d'un vrai incident : le 4 août 2026, Nadège a cherché l'exposition
 * « Mariage du siècle » et ne l'a pas trouvée. Le robot avait créé UNE fiche à la
 * DATE DE FIN (25 septembre) au lieu de couvrir toute la période. L'exposition était
 * donc invisible pendant les trois mois où l'on pouvait y aller.
 *
 * Le Policier (police-events.mjs) vérifie l'EXACTITUDE : dates, jours de semaine,
 * liens, géographie. Ce script-ci vérifie l'UTILITÉ pour l'utilisateur : une fiche
 * exacte mais introuvable, ou vide de sens, ne sert à rien.
 *
 * Il écrit `qualite-a-ameliorer.txt`, publié par le CI et lu par l'agent chercheur
 * qui enrichit ensuite les fiches. Il ne touche JAMAIS aux données.
 *
 * Usage : node scripts/quality-check.mjs   (sortie 0 : n'échoue jamais le CI)
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVENTS = join(__dirname, "..", "public", "events.json");
const SORTIE = join(__dirname, "..", "qualite-a-ameliorer.txt");

let ev = [];
try {
  const j = JSON.parse(readFileSync(EVENTS, "utf8"));
  ev = (Array.isArray(j) ? j : j.events || []).filter(e => e && e.date);
} catch { process.exit(0); }

const titre = e => (e.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim();
const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, " ").trim();

// Combien de fiches partagent le même titre ? (une expo bien traitée en a plusieurs)
const parTitre = new Map();
for (const e of ev) {
  const k = norm(titre(e));
  if (!parTitre.has(k)) parTitre.set(k, []);
  parTitre.get(k).push(e);
}

const pb = { invisible: [], vide: [], anglais: [], sansLien: [], doublon: [] };

for (const [cle, groupe] of parTitre) {
  const e = groupe[0];

  // ── 1. LE BUG DE NADÈGE : une période DATÉE est annoncée, mais une seule fiche,
  //    et elle n'est pas marquée « ongoing » (donc jamais redatée) → introuvable.
  //    On exige une vraie date de fin : « jusqu'au 6 septembre », pas « jusqu'au petit matin ».
  const periode = (e.desc || "").match(/jusqu'au\s+(\d{1,2}\s+\w+)/i);
  if (groupe.length === 1 && periode && !e.ongoing) {
    pb.invisible.push(`${e.date} · ${titre(e)} — annoncée « jusqu'au ${periode[1]} » mais UNE SEULE fiche, non ongoing → invisible les autres jours (id ${e.id})`);
  }

  // ── 2. Description qui ne fait que répéter le titre : la fiche n'apprend rien.
  const d = norm(e.desc), ti = norm(titre(e));
  if (d && ti && d.startsWith(ti) && d.length < ti.length + 60) {
    pb.vide.push(`${e.date} · ${titre(e)} — description = titre (id ${e.id})`);
  }

  // ── 3. Titre resté en anglais (brut de la source, jamais retraduit).
  if (/\b(exhibition|wedding|screening|workshop|the encounter)\b/i.test(titre(e))
      && !/\b(le|la|les|du|des|au|aux|un|une)\b/i.test(titre(e))) {
    pb.anglais.push(`${e.date} · ${titre(e)} (id ${e.id})`);
  }

  // ── 4. Pas de lien officiel : on ne peut ni réserver ni se renseigner.
  if (!e.link) pb.sansLien.push(`${e.date} · ${titre(e)} — ${(e.subtitle || "").split(" · ")[0]} (id ${e.id})`);

  // ── 5. Doublon d'une série : même LIEU + même période, mais un titre différent
  //    et une seule occurrence, alors qu'une série couvre déjà ces dates.
  if (groupe.length === 1) {
    const lieu = norm((e.subtitle || "").split(" · ")[0]);
    for (const [autreCle, autre] of parTitre) {
      if (autreCle === cle || autre.length < 5) continue;
      if (norm((autre[0].subtitle || "").split(" · ")[0]) !== lieu) continue;
      if (autre.some(x => x.date === e.date)) {
        pb.doublon.push(`${e.date} · ${titre(e)} — même lieu et même jour qu'une série de ${autre.length} fiches « ${titre(autre[0])} » (id ${e.id})`);
        break;
      }
    }
  }
}

const sections = [
  ["FICHES INTROUVABLES — une période est annoncée mais une seule fiche existe", pb.invisible],
  ["DOUBLONS PROBABLES — même lieu, même jour qu'une série existante", pb.doublon],
  ["FICHES SANS CONTENU — la description répète le titre", pb.vide],
  ["TITRES EN ANGLAIS — jamais retraduits depuis la source", pb.anglais],
  ["SANS LIEN OFFICIEL — impossible de réserver ou de se renseigner", pb.sansLien],
];

let txt = "CONTRÔLE DE QUALITÉ DES FICHES MonacOut\n";
txt += `${ev.length} fiches inspectées le ${new Date().toISOString().slice(0, 10)}.\n`;
txt += "Ce fichier SIGNALE, il ne corrige rien. L'agent chercheur l'utilise pour enrichir.\n";
let total = 0;
for (const [nom, liste] of sections) {
  if (!liste.length) continue;
  total += liste.length;
  txt += `\n■ ${nom} (${liste.length})\n` + liste.map(l => "   · " + l).join("\n") + "\n";
}
if (!total) txt += "\n✅ Rien à signaler.\n";

writeFileSync(SORTIE, txt);
console.log(`Contrôle qualité : ${ev.length} fiches inspectées, ${total} point(s) à améliorer.`);
for (const [nom, liste] of sections) if (liste.length) console.log(`   ${liste.length}  ${nom.split(" — ")[0]}`);
if (total) console.log(`→ détail dans qualite-a-ameliorer.txt`);
