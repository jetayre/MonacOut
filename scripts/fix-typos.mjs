import { readFileSync, writeFileSync } from "fs";

const FILE = "src/data/events.js";
let s = readFileSync(FILE, "utf8");

// 1) Supprimer les fiches à retirer (doublon faute + parasites + hors Monaco)
const REMOVE = [1966, 1970, 1978];
let lines = s.split("\n");
const before = lines.length;
lines = lines.filter((l) => {
  const m = l.match(/^\s*\{id:(\d+),/);
  return !(m && REMOVE.includes(parseInt(m[1])));
});
console.log("Fiches supprimées :", before - lines.length, "→", REMOVE.join(", "));
s = lines.join("\n");

// 2) Réparer le double antislash (\\n) qui s'affiche en toutes lettres → vrai saut de ligne (\n)
const dbl = (s.match(/\\\\n/g) || []).length;
s = s.split("\\\\n").join("\\n");
console.log("Titres \\\\n réparés :", dbl, "occurrence(s)");

writeFileSync(FILE, s);
