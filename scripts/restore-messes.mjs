import { readFileSync, writeFileSync } from "fs";

const CUR = "src/data/events.js";
const BAK = "/tmp/events_before_cleanup.js";

const backupLines = readFileSync(BAK, "utf8").split("\n");
let cur = readFileSync(CUR, "utf8");

// IDs déjà présents dans le fichier actuel
const curIds = new Set([...cur.matchAll(/\{id:(\d+),/g)].map((m) => m[1]));

// Extraire les lignes de messes (MESSE DIMANCHE / MESSE SAMEDI) de la sauvegarde
const messeLines = backupLines.filter((l) => {
  if (!/^\s*\{id:\d+,/.test(l)) return false;
  if (!/title:"MESSE\\n(DIMANCHE|SAMEDI)"/.test(l)) return false;
  const id = l.match(/\{id:(\d+),/)[1];
  return !curIds.has(id); // éviter les doublons
});

console.log("Messes à réinsérer :", messeLines.length);

// S'assurer que chaque ligne finit par '},'
const block = messeLines.map((l) => (l.trim().endsWith(",") ? l : l + ",")).join("\n");

// Insérer juste avant la fermeture du tableau _RAW (premier '\n];')
cur = cur.replace(/\n\];/, "\n" + block + "\n];");
writeFileSync(CUR, cur);
console.log("✓ inséré");
